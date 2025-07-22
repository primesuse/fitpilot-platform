/*  src/app/api/programs/route.ts
    Save a full 7-day workout program (PT only)
*/
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v4 as uuid } from 'uuid'
import type { PersonalTrainer } from '@prisma/client'

// Enhanced interface for exercise data with advanced parameters
interface ExerciseData {
  exerciseId: string
  sets: number
  reps: number
  restSeconds: number
  dropSets?: number
  superSetGroup?: string | null
  tutSeconds?: number | null
  rir?: number | null
}

type TrainerOK = { ok: true; trainer: PersonalTrainer }
type TrainerError = { ok: false; res: NextResponse }

async function requireTrainer(request: NextRequest): Promise<TrainerOK | TrainerError> {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.userType !== 'pt') {
    return { ok: false, res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const trainer = await prisma.personalTrainer.findUnique({
    where: { email: session.user.email! }
  })

  if (!trainer) {
    return { ok: false, res: NextResponse.json({ error: 'Trainer not found' }, { status: 404 }) }
  }

  return { ok: true, trainer }
}

export async function POST(request: NextRequest) {
  const result = await requireTrainer(request)
  if (!result.ok) return result.res
  const { trainer } = result

  try {
    const body = await request.json()
    const { programName, clientId, days } = body

    // Validate required fields
    if (!programName || !clientId || !Array.isArray(days) || days.length !== 7) {
      return NextResponse.json(
        { error: 'Invalid payload. Program name, client ID, and 7 days required.' },
        { status: 400 }
      )
    }

    // Verify client belongs to this trainer
    const client = await prisma.client.findFirst({
      where: { id: clientId, trainerId: trainer.id }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      )
    }

    // Create program with all days and exercises in a transaction
    const createdProgram = await prisma.$transaction(async (tx) => {
      // 1. Create the main workout program
      const program = await tx.workoutProgram.create({
        data: {
          id: uuid(),
          name: programName,
          clientId: clientId
        }
      })

      // 2. Create workout days and exercises
      for (const [dayOfWeek, exerciseList] of days.entries()) {
        if (!exerciseList || exerciseList.length === 0) {
          continue // Skip rest days
        }

        // Create workout day
        const workoutDay = await tx.workoutDay.create({
          data: {
            id: uuid(),
            programId: program.id,
            dayOfWeek: dayOfWeek // 0 = Monday, 1 = Tuesday, etc.
          }
        })

        // Create workout exercises for this day with enhanced parameters
        const workoutExercises = exerciseList.map((exercise: ExerciseData, index: number) => ({
          id: uuid(),
          dayId: workoutDay.id,
          exerciseId: exercise.exerciseId,
          seqOrder: index + 1,
          sets: exercise.sets || 3,
          reps: exercise.reps || 10,
          restSeconds: exercise.restSeconds || 60,
          dropSets: exercise.dropSets || 0,
          superSetGroup: exercise.superSetGroup || null,
          tutSeconds: exercise.tutSeconds || null,
          rir: exercise.rir || null
        }))

        await tx.workoutExercise.createMany({
          data: workoutExercises
        })
      }

      return program
    })

    return NextResponse.json({
      message: 'Program saved successfully',
      programId: createdProgram.id,
      programName: createdProgram.name
    }, { status: 201 })

  } catch (error) {
    console.error('Program save error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve saved programs with enhanced data
export async function GET(request: NextRequest) {
  const result = await requireTrainer(request)
  if (!result.ok) return result.res
  const { trainer } = result

  try {
    const programs = await prisma.workoutProgram.findMany({
      where: {
        client: {
          trainerId: trainer.id
        }
      },
      include: {
        client: {
          select: {
            name: true,
            email: true
          }
        },
        workoutDays: {
          include: {
            workoutExercises: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    videoUrl: true
                  }
                }
              },
              orderBy: {
                seqOrder: 'asc'
              }
            }
          },
          orderBy: {
            dayOfWeek: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ programs })

  } catch (error) {
    console.error('Programs fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
