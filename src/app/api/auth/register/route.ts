import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, userType } = body

    // Validate required fields
    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate userType
    if (userType !== 'pt' && userType !== 'client') {
      return NextResponse.json(
        { error: 'Invalid user type. Must be "pt" or "client"' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user based on type
    let user = null

    if (userType === 'pt') {
      // Check if PT email already exists
      const existingPT = await prisma.personalTrainer.findUnique({
        where: { email }
      })
      
      if (existingPT) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }

      // Set up 7-day free trial period
      const trialExpiresAt = new Date()
      trialExpiresAt.setDate(trialExpiresAt.getDate() + 7) // 7 days from now

      // Create Personal Trainer with trial period
      user = await prisma.personalTrainer.create({
        data: {
          name,
          email,
          passwordHash,
          subscriptionTier: 'Solo',        // Default tier
          subscriptionStatus: 'trial',     // Set to trial status
          subscriptionExpiresAt: trialExpiresAt // Set trial expiration
        }
      })
    } else {
      // For clients, we need a trainerId - this will be handled later
      // For now, we'll return an error for client registration
      return NextResponse.json(
        { error: 'Client registration requires trainer assignment. Use PT invitation process.' },
        { status: 400 }
      )
    }

    // Return success (without password hash)
    const { passwordHash: _passwordHash, ...userWithoutPassword } = user
    
    return NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
