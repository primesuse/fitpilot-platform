/*  src/app/api/exercises/route.ts
    CRUD – Exercise Library  |  WBS 3.3  (PT Dashboard → Exercise Library)
*/

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { PersonalTrainer } from '@prisma/client'   // ← Prisma model type

/* -------------------------------------------------------------------------
   Discriminated-union helpers
------------------------------------------------------------------------- */
type TrainerOK    = { ok: true;  trainer: PersonalTrainer }
type TrainerError = { ok: false; res: NextResponse }

/* -------------------------------------------------------------------------
   Helper → returns a PersonalTrainer record **or** an error response
------------------------------------------------------------------------- */
async function requireTrainer(request: NextRequest): Promise<TrainerOK | TrainerError> {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.userType !== 'pt') {
    return { ok: false, res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const trainer = await prisma.personalTrainer.findUnique({
    where: { email: session.user.email! },
  })

  if (!trainer) {
    return { ok: false, res: NextResponse.json({ error: 'Trainer not found' }, { status: 404 }) }
  }

  return { ok: true, trainer }
}

/* -------------------------------------------------------------------------
   GET – return ALL exercises for logged-in trainer
------------------------------------------------------------------------- */
export async function GET(request: NextRequest) {
  const result = await requireTrainer(request)
  if (!result.ok) return result.res            // ← TypeScript now narrows correctly
  const { trainer } = result                   // `trainer` is safely typed 🎉

  try {
    const exercises = await prisma.exercise.findMany({
      where:  { trainerId: trainer.id },
      orderBy:{ createdAt: 'desc' },
    })

    return NextResponse.json({ exercises })
  } catch (err) {
    console.error('GET /api/exercises error:', err)
    return NextResponse.json(
      { error: 'Internal server error', exercises: [] },
      { status: 500 },
    )
  }
}

/* -------------------------------------------------------------------------
   POST – create exercise
------------------------------------------------------------------------- */
export async function POST(request: NextRequest) {
  const result = await requireTrainer(request)
  if (!result.ok) return result.res
  const { trainer } = result

  try {
    const { name, description, videoUrl } = await request.json()
    if (!name) {
      return NextResponse.json({ error: 'Exercise name is required' }, { status: 400 })
    }

    const exercise = await prisma.exercise.create({
      data: { name, description: description || null, videoUrl: videoUrl || null, trainerId: trainer.id },
    })

    return NextResponse.json({ message: 'Exercise created', exercise }, { status: 201 })
  } catch (err) {
    console.error('POST /api/exercises error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/* -------------------------------------------------------------------------
   PUT – update exercise
------------------------------------------------------------------------- */
export async function PUT(request: NextRequest) {
  const result = await requireTrainer(request)
  if (!result.ok) return result.res
  const { trainer } = result

  try {
    const { id, name, description, videoUrl } = await request.json()
    if (!id || !name) {
      return NextResponse.json({ error: 'Exercise ID and name are required' }, { status: 400 })
    }

    const owned = await prisma.exercise.findFirst({
      where: { id, trainerId: trainer.id },
    })
    if (!owned) {
      return NextResponse.json({ error: 'Exercise not found or access denied' }, { status: 404 })
    }

    const exercise = await prisma.exercise.update({
      where: { id },
      data: { name, description: description || null, videoUrl: videoUrl || null },
    })

    return NextResponse.json({ message: 'Exercise updated', exercise })
  } catch (err) {
    console.error('PUT /api/exercises error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/* -------------------------------------------------------------------------
   DELETE – remove exercise if not used in any program
------------------------------------------------------------------------- */
export async function DELETE(request: NextRequest) {
  const result = await requireTrainer(request)
  if (!result.ok) return result.res
  const { trainer } = result

  try {
    const exerciseId = request.nextUrl.searchParams.get('id')
    if (!exerciseId) {
      return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 })
    }

    const owned = await prisma.exercise.findFirst({
      where: { id: exerciseId, trainerId: trainer.id },
    })
    if (!owned) {
      return NextResponse.json({ error: 'Exercise not found or access denied' }, { status: 404 })
    }

    const used = await prisma.workoutExercise.findFirst({
      where: { exerciseId },
    })
    if (used) {
      return NextResponse.json(
        { error: 'Cannot delete: exercise is used in workout programs' },
        { status: 400 },
      )
    }

    await prisma.exercise.delete({ where: { id: exerciseId } })
    return NextResponse.json({ message: 'Exercise deleted' })
  } catch (err) {
    console.error('DELETE /api/exercises error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
