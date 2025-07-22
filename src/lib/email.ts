import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'

// Configure SendGrid (production)
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// Configure Nodemailer (development/testing) - CORRECTED METHOD NAME
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface ClientInvitationEmailProps {
  clientName: string
  clientEmail: string
  trainerName: string
  tempPassword: string
  loginUrl: string
}

export async function sendClientInvitationEmail({
  clientName,
  clientEmail,
  trainerName,
  tempPassword,
  loginUrl
}: ClientInvitationEmailProps) {
  const subject = `Welcome to FitPilot - ${trainerName} has invited you!`
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to FitPilot</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .credentials { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏋️ Welcome to FitPilot!</h1>
        </div>
        
        <div class="content">
          <h2>Hi ${clientName}!</h2>
          
          <p>Great news! <strong>${trainerName}</strong> has invited you to join FitPilot, the AI-assisted fitness platform that will help you achieve your fitness goals.</p>
          
          <h3>What you'll get:</h3>
          <ul>
            <li>🎯 Personalized workout programs</li>
            <li>📊 Progress tracking and analytics</li>
            <li>💬 Direct messaging with ${trainerName}</li>
            <li>🤖 AI-powered fitness assistant</li>
            <li>📅 Session booking and calendar management</li>
            <li>🏆 Achievement system and gamification</li>
          </ul>
          
          <div class="credentials">
            <h3>⚠️ Your Login Credentials</h3>
            <p><strong>Email:</strong> ${clientEmail}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p><em>Please change this password after your first login for security.</em></p>
          </div>
          
          <p>Ready to start your fitness journey?</p>
          
          <a href="${loginUrl}" class="button">Login to FitPilot</a>
          
          <p>If you have any questions, just reply to this email or message ${trainerName} directly through the platform.</p>
          
          <p>Welcome to the team!</p>
          <p><strong>The FitPilot Team</strong></p>
        </div>
        
        <div class="footer">
          <p>This invitation was sent by ${trainerName} through FitPilot.</p>
          <p>If you didn't expect this invitation, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
    Welcome to FitPilot!
    
    Hi ${clientName}!
    
    ${trainerName} has invited you to join FitPilot, the AI-assisted fitness platform.
    
    Your login credentials:
    Email: ${clientEmail}
    Temporary Password: ${tempPassword}
    
    Login at: ${loginUrl}
    
    Please change your password after first login.
    
    Welcome to the team!
    The FitPilot Team
  `

  try {
    if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
      // Use SendGrid in production
      await sgMail.send({
        to: clientEmail,
        from: process.env.FROM_EMAIL!,
        subject,
        html: htmlContent,
        text: textContent,
      })
    } else if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      // Use SMTP in development
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: clientEmail,
        subject,
        html: htmlContent,
        text: textContent,
      })
    } else {
      // Fallback: Log to console (development without SMTP)
      console.log('📧 EMAIL WOULD BE SENT:')
      console.log(`To: ${clientEmail}`)
      console.log(`Subject: ${subject}`)
      console.log(`Content: ${textContent}`)
      return { success: true, method: 'console' }
    }

    return { success: true, method: process.env.NODE_ENV === 'production' ? 'sendgrid' : 'smtp' }
  } catch (error) {
    console.error('Email sending error:', error)
    throw new Error('Failed to send invitation email')
  }
}
