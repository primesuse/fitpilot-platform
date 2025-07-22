import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'
import InviteClientButton from '@/components/InviteClientButton'

export default async function PTDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.userType !== 'pt') {
    redirect('/login')
  }

  // Get PT's data with updated client count
  const trainer = await prisma.personalTrainer.findUnique({
    where: { email: session.user.email! },
    include: {
      clients: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              workoutPrograms: true,
              checkIns: true,
              exerciseLogs: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!trainer) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {trainer.name}!
              </h1>
              <p className="text-gray-600">
                {trainer.subscriptionTier} Plan • {trainer.clients.length} Active Clients
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {session.user.email}
              </span>
              <InviteClientButton />
            </div>
          </div>
        </div>
      </header>

      {/* Rest of your dashboard content remains the same */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <h2 className="text-lg font-semibold">🎉 Success! Your FitPilot PT Dashboard is Live!</h2>
          <p>You can now invite clients and start building your fitness business on the platform.</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Active Clients</h3>
            <p className="text-3xl font-bold text-blue-600">{trainer.clients.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Programs</h3>
            <p className="text-3xl font-bold text-green-600">
              {trainer.clients.reduce((total, client) => total + client._count.workoutPrograms, 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">This Month</h3>
            <p className="text-3xl font-bold text-purple-600">
              {trainer.clients.reduce((total, client) => total + client._count.exerciseLogs, 0)} Sessions
            </p>
          </div>
        </div>

        {/* Client List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Clients</h2>
          </div>
          <div className="p-6">
            {trainer.clients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No clients yet!</p>
                <p className="text-sm text-gray-400 mb-4">
                  Click the &quot;Invite New Client&quot; button above to get started.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {trainer.clients.map((client) => (
                  <div key={client.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-500">{client.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined {new Date(client.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm">
                          View Profile
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-4 text-xs text-gray-500">
                      <span>{client._count.workoutPrograms} Programs</span>
                      <span>{client._count.exerciseLogs} Logged Sessions</span>
                      <span>{client._count.checkIns} Check-ins</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
