import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import MealPlanBuilderInterface from '@/components/MealPlanBuilderInterface'

export default async function MealPlanBuilder() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.userType !== 'pt') {
    redirect('/login')
  }

  // Get PT's clients for assignment
  const trainer = await prisma.personalTrainer.findUnique({
    where: { email: session.user.email! },
    include: {
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
                Meal Plan Builder
              </h1>
              <p className="text-gray-600">
                Create comprehensive nutrition plans with USDA food database integration
              </p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-700">Save Meal Plan</h3>
                <p id="meal-plan-description" className="text-xs text-gray-500">Complete the meal plan details below to save</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  id="header-meal-save-btn"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled
                >
                  Save Meal Plan (0 calories)
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm">
                  AI Generate Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <MealPlanBuilderInterface 
          clients={trainer.clients}
        />
      </main>
    </div>
  )
}
