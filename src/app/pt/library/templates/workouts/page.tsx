import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import ProgramBuilderInterface from '@/components/ProgramBuilderInterface'

export default async function ProgramBuilder() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.userType !== 'pt') {
    redirect('/login')
  }

  const trainer = await prisma.personalTrainer.findUnique({
    where: { email: session.user.email! },
    include: {
      exercises: {
        orderBy: { name: 'asc' }
      },
      clients: {
        select: {
          id: true,
          name: true
        },
        orderBy: { name: 'asc' }
      }
    }
  })

  if (!trainer) {
    redirect('/login')
  }

  return (
    <div className="bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Workout Program Builder
              </h1>
              <p className="text-gray-600">
                Drag exercises from your library to create comprehensive workout programs
              </p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-700">Save Program</h3>
                <p className="text-xs text-gray-500">Complete the program details below to save</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  id="header-save-btn"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled
                >
                  Save Program (0 exercises)
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                  AI Suggest Program
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <ProgramBuilderInterface 
          exercises={trainer.exercises}
          clients={trainer.clients}
        />
      </main>
    </div>
  )
}
