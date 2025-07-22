'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import AddExerciseButton from '@/components/AddExerciseButton'
import ExerciseManagement from '@/components/ExerciseManagement'

interface Exercise {
  id: string
  name: string
  description: string | null
  videoUrl: string | null
  createdAt: string
}

export default function ExerciseLibrary() {
  const { data: session, status } = useSession()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExercises = async () => {
  try {
    console.log('🔍 Fetching exercises...')
    const response = await fetch('/api/exercises')
    console.log('📡 Response status:', response.status)
    console.log('📡 Response headers:', response.headers.get('content-type'))
    
    if (!response.ok) {
      console.error(`❌ HTTP error! status: ${response.status}`)
      return
    }

    // Check if response has content
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Response is not JSON')
      const text = await response.text()
      console.log('📄 Response text:', text)
      return
    }

    // Check if response body is empty
    const text = await response.text()
    if (!text.trim()) {
      console.log('⚠️ Empty response body')
      setExercises([])
      return
    }

    // Parse JSON safely
    try {
      const data = JSON.parse(text)
      console.log('✅ Exercises loaded:', data)
      
      if (data.exercises) {
        setExercises(data.exercises)
      } else {
        setExercises([])
      }
    } catch (jsonError) {
      console.error('💥 JSON parse error:', jsonError)
      console.log('📄 Raw response:', text)
    }
  } catch (error) {
    console.error('💥 Fetch error:', error)
  } finally {
    setLoading(false)
  }
}
  useEffect(() => {
    if (status === 'authenticated') {
      fetchExercises()
    }
  }, [status])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated' || session?.user?.userType !== 'pt') {
    redirect('/login')
  }

  const exercisesWithVideos = exercises.filter(ex => ex.videoUrl)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exercise Library</h1>
              <p className="text-gray-600">
                Manage your custom exercises and video library
              </p>
            </div>
            <div className="flex space-x-4">
              <AddExerciseButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Exercises</h3>
            <p className="text-3xl font-bold text-blue-600">{exercises.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">With Videos</h3>
            <p className="text-3xl font-bold text-green-600">{exercisesWithVideos.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Categories</h3>
            <p className="text-3xl font-bold text-purple-600">5</p>
          </div>
        </div>

        {/* Exercise List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Exercises</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading exercises...</p>
              </div>
            ) : exercises.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No exercises in your library yet!</p>
                <p className="text-sm text-gray-400 mb-4">
                  Start building your exercise database to create workout programs.
                </p>
                <AddExerciseButton />
              </div>
            ) : (
              <div className="grid gap-4">
                {exercises.map((exercise) => (
                  <ExerciseManagement
                    key={exercise.id}
                    exercise={exercise}
                    onUpdate={fetchExercises}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
