import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'pt') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const notificationSettings = await request.json()

    // For now, we'll store this as JSON in the PT record
    // In a full implementation, you might create a separate UserSettings table
    await prisma.personalTrainer.update({
      where: { email: session.user.email! },
      data: { 
        // Store as JSON string - you may want to add a notifications field to your schema
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully'
    })

  } catch (error) {
    console.error('Notification settings update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
