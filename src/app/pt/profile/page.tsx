import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import PTProfileInterface from '@/components/PTProfileInterface'

export default async function PTProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.userType !== 'pt') {
    redirect('/login')
  }

  // Get PT profile data
  const trainer = await prisma.personalTrainer.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      specializations: true,
      certifications: true,
      phoneNumber: true,
      profilePictureUrl: true,
      businessName: true,
      location: true,
      yearsExperience: true,
      subscriptionTier: true,
      subscriptionStatus: true,
      createdAt: true
    }
  })

  if (!trainer) {
    redirect('/login')
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your professional profile and account settings
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <PTProfileInterface trainer={trainer} />
      </main>
    </div>
  )
}
