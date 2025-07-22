import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import ProgramBuilderInterface from '@/components/ProgramBuilderInterface'

interface EditProgramPageProps {
  params: { id: string }
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
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
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
      }
    }
  })

  if (!trainer) {
    redirect('/login')
  }

  // Fetch the existing program data
  const existingProgram = await prisma.workoutProgram.findFirst({
    where: {
      id: params.id,
      client: {
        trainerId: trainer.id
      }
    },
    include: {
      client: { select: { id: true, name: true } },
      workoutDays: {
        include: {
          workoutExercises: {
            include: { exercise: true },
            orderBy: { seqOrder: 'asc' }
          }
        },
        orderBy: { dayOfWeek: 'asc' }
      }
    }
  })

  if (!existingProgram) {
    redirect('/pt/library/templates/workouts')
  }

  return (
    <div className="bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Program: {existingProgram.name}
              </h1>
              <p className="text-gray-600">
                Modify the workout program for {existingProgram.client.name}
              </p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-700">Update Program</h3>
                <p className="text-xs text-gray-500">Make changes and save updates</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  id="header-save-btn"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Update Program
                </button>
                <button 
                  onClick={() => window.history.back()}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Cancel
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
          initialProgram={existingProgram}
          isEditing={true}
          programId={params.id}
        />
      </main>
    </div>
  )
}
