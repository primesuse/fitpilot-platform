import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export default async function ClientDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.userType !== 'client') {
    redirect('/login')
  }

  // Get client data with trainer info
  const client = await prisma.client.findUnique({
    where: { email: session.user.email! },
    include: {
      trainer: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  if (!client) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {client.name}!
              </h1>
              <p className="text-gray-600">
                Your trainer: {client.trainer.name}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <h2 className="text-lg font-semibold">🎉 Client Dashboard Active!</h2>
          <p>Your client authentication system is working perfectly.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <p><strong>Name:</strong> {client.name}</p>
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>Trainer:</strong> {client.trainer.name}</p>
          <p><strong>Joined:</strong> {new Date(client.createdAt).toLocaleDateString()}</p>
        </div>
      </main>
    </div>
  )
}
