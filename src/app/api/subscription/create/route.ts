import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, SERVER_SUBSCRIPTION_TIERS, SubscriptionTier } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated as PT
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'pt') {
      return NextResponse.json(
        { error: 'Unauthorized - PT access required' }, 
        { status: 401 }
      )
    }

    // Parse request body
    const { tier } = await request.json()

    // Validate subscription tier
    if (!tier || !SERVER_SUBSCRIPTION_TIERS[tier as SubscriptionTier]) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' }, 
        { status: 400 }
      )
    }

    const selectedTier = SERVER_SUBSCRIPTION_TIERS[tier as SubscriptionTier]


    
    // Ensure email is defined and a string
    const userEmail = session.user.email
    if (typeof userEmail !== 'string' || !userEmail) {
      return NextResponse.json(
        { error: 'User email not found or invalid' }, 
        { status: 400 }
      )
    }

    // Get PT from database
    const trainer = await prisma.personalTrainer.findUnique({
      where: { email: userEmail },
      select: { id: true, email: true, name: true, stripeCustomerId: true }
    })

    if (!trainer) {
      return NextResponse.json(
        { error: 'Personal trainer not found' }, 
        { status: 404 }
      )
    }

    let customerId = trainer.stripeCustomerId

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: trainer.email,
        name: trainer.name,
        metadata: {
          trainerId: trainer.id,
          userType: 'personal_trainer'
        }
      })

      customerId = customer.id

      // Update trainer with Stripe customer ID
      await prisma.personalTrainer.update({
        where: { id: trainer.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Create Stripe Checkout session for subscription
    const session_stripe = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: String(selectedTier.price),
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get('origin')}/pt/dashboard?subscription=success`,
      cancel_url: `${request.headers.get('origin')}/pt/dashboard?subscription=cancelled`,
      metadata: {
        trainerId: trainer.id,
        tier: tier
      }
    })

    return NextResponse.json({
      sessionId: session_stripe.id,
      url: session_stripe.url
    })

  } catch (error) {
    console.error('Subscription creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
