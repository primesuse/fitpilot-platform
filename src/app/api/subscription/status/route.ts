import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated as PT
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'pt') {
      return NextResponse.json(
        { error: 'Unauthorized - PT access required' }, 
        { status: 401 }
      )
    }

    // Get PT subscription status from database
    const trainer = await prisma.personalTrainer.findUnique({
      where: { email: session.user.email! },
      select: {
        id: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
        subscriptionTier: true,
        stripeCustomerId: true
      }
    })

    if (!trainer) {
      return NextResponse.json(
        { error: 'Personal trainer not found' }, 
        { status: 404 }
      )
    }

    // Check if subscription is active OR in valid trial period
    const now = new Date()
    const isValidTrial = trainer.subscriptionStatus === 'trial' && 
                        (!trainer.subscriptionExpiresAt || trainer.subscriptionExpiresAt > now)
    const isActiveSubscription = trainer.subscriptionStatus === 'active' && 
                                (!trainer.subscriptionExpiresAt || trainer.subscriptionExpiresAt > now)

    const isActive = isValidTrial || isActiveSubscription

    return NextResponse.json({
    isActive,
    status: trainer.subscriptionStatus,
    tier: trainer.subscriptionTier,
    expiresAt: trainer.subscriptionExpiresAt,
    stripeCustomerId: trainer.stripeCustomerId,
    isTrialUser: trainer.subscriptionStatus === 'trial',
    daysRemaining: trainer.subscriptionExpiresAt ? 
        Math.ceil((trainer.subscriptionExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
    })


  } catch (error) {
    console.error('Subscription status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
