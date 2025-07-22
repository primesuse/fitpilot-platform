import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const trainers = await prisma.personalTrainer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({ trainers })
  } catch (_error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
