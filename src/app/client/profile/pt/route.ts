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

    const body = await request.json()
    const {
      name,
      bio,
      specializations,
      certifications,
      phoneNumber,
      businessName,
      location,
      yearsExperience
    } = body

    // Update PT profile
    const updatedTrainer = await prisma.personalTrainer.update({
      where: { email: session.user.email! },
      data: {
        name: name || undefined,
        bio: bio || undefined,
        specializations: specializations || undefined,
        certifications: certifications || undefined,
        phoneNumber: phoneNumber || undefined,
        businessName: businessName || undefined,
        location: location || undefined,
        yearsExperience: yearsExperience ? parseInt(yearsExperience) : undefined,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      trainer: updatedTrainer
    })

  } catch (error) {
    console.error('PT profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
