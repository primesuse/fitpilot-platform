import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.userType !== 'pt') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const trainer = await prisma.personalTrainer.findUnique({
    where: { email: session.user.email! }
  })

  if (!trainer) {
    return NextResponse.json({ error: 'Trainer not found' }, { status: 404 })
  }

  try {
    const program = await prisma.workoutProgram.findFirst({
      where: {
        id: params.id,
        client: {
          trainerId: trainer.id
        }
      },
      include: {
        client: {
          select: { id: true, name: true }
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
              orderBy: { seqOrder: 'asc' }
            }
          },
          orderBy: { dayOfWeek: 'asc' }
        }
      }
    })

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    return NextResponse.json({ program })

  } catch (error) {
    console.error('Program fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.userType !== 'pt') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const trainer = await prisma.personalTrainer.findUnique({
    where: { email: session.user.email! }
  })

  if (!trainer) {
    return NextResponse.json({ error: 'Trainer not found' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { programName, days } = body

    if (!programName || !Array.isArray(days) || days.length !== 7) {
      return NextResponse.json(
        { error: 'Invalid payload. Program name and 7 days required.' },
        { status: 400 }
      )
    }

    // Verify program belongs to this trainer's client
    const existingProgram = await prisma.workoutProgram.findFirst({
      where: {
        id: params.id,
        client: {
          trainerId: trainer.id
        }
      }
    })

    if (!existingProgram) {
      return NextResponse.json({ error: 'Program not found or access denied' }, { status: 404 })
    }

    // Update program with transaction and enhanced parameters
    const updatedProgram = await prisma.$transaction(async (tx) => {
      // Update program name
      const program = await tx.workoutProgram.update({
        where: { id: params.id },
        data: {
          name: programName,
          updatedAt: new Date()
        }
      })

      // Delete existing workout days and exercises
      await tx.workoutExercise.deleteMany({
        where: {
          day: {
            programId: params.id
          }
        }
      })

      await tx.workoutDay.deleteMany({
        where: { programId: params.id }
      })

      // Recreate workout days and exercises with enhanced parameters
      for (const [dayOfWeek, exerciseList] of days.entries()) {
        if (!exerciseList || exerciseList.length === 0) {
          continue
        }

        const workoutDay = await tx.workoutDay.create({
          data: {
            programId: program.id,
            dayOfWeek: dayOfWeek
          }
        })

        const workoutExercises = exerciseList.map((exercise: ExerciseData, index: number) => ({
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
      message: 'Program updated successfully',
      programId: updatedProgram.id,
      programName: updatedProgram.name
    })

  } catch (error) {
    console.error('Program update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
