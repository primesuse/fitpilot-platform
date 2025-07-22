import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { sendClientInvitationEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'pt') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const trainer = await prisma.personalTrainer.findUnique({
      where: { email: session.user.email! }
    })

    console.log('🚀 API route called')
  
    try {
        console.log('📝 Getting session...')
        const session = await getServerSession(authOptions)
        console.log('✅ Session:', session?.user?.email)
        
        // Continue with more logging at each step...
    } catch (error) {
        console.error('💥 Error details:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }

    if (!trainer) {
      return NextResponse.json(
        { error: 'Trainer not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { clientName, clientEmail } = body

    if (!clientName || !clientEmail) {
      return NextResponse.json(
        { error: 'Client name and email are required' },
        { status: 400 }
      )
    }

    const existingClient = await prisma.client.findUnique({
      where: { email: clientEmail }
    })

    if (existingClient) {
      return NextResponse.json(
        { error: 'A client with this email already exists' },
        { status: 400 }
      )
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-12)
    const passwordHash = await bcrypt.hash(tempPassword, 12)

    // Create the new client
    const newClient = await prisma.client.create({
      data: {
        name: clientName,
        email: clientEmail,
        passwordHash,
        trainerId: trainer.id
      }
    })

    // Send the invitation email
    try {
      const emailResult = await sendClientInvitationEmail({
        clientName,
        clientEmail,
        trainerName: trainer.name,
        tempPassword,
        loginUrl: `${process.env.NEXTAUTH_URL}/login`
      })

      console.log(`Email sent via ${emailResult.method}:`, emailResult.success)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the API call if email fails - client still created successfully
    }

    const { passwordHash: _, ...clientWithoutPassword } = newClient

    return NextResponse.json({
    message: 'Client invited successfully and invitation email sent!',
    client: clientWithoutPassword,
    tempPassword, // Make sure this line is present
    emailSent: true,
    loginUrl: `${process.env.NEXTAUTH_URL}/login`
    }, { status: 201 })

  } catch (error) {
    console.error('Client invitation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
