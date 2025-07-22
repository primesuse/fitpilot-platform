import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import ClientProfileInterface from '@/components/ClientProfileInterface'

export default async function ClientProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.userType !== 'client') {
    redirect('/login')
  }

  // Get client profile data
  const client = await prisma.client.findUnique({
    where: { email: session.user.email! },
    include: {
      trainer: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      }
    }
  })

  if (!client) {
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
            Manage your personal information and fitness goals
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <ClientProfileInterface client={client} />
      </main>
    </div>
  )
}
