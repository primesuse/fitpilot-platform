import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test database connection by counting Personal Trainers
    const trainerCount = await prisma.personalTrainer.count()
    
    return NextResponse.json({ 
      message: 'Database connection successful!',
      trainerCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Database connection failed', details: error },
      { status: 500 }
    )
  }
}
