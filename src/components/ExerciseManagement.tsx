'use client'

import { useState } from 'react'
import EditExerciseModal from './EditExerciseModal'

interface Exercise {
  id: string
  name: string
  description: string | null
  videoUrl: string | null
  createdAt: string
}

interface ExerciseManagementProps {
  exercise: Exercise
  onUpdate: () => void
}

export default function ExerciseManagement({ exercise, onUpdate }: ExerciseManagementProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${exercise.name}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(`/api/exercises?id=${exercise.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to delete exercise')
        return
      }

      onUpdate() // Refresh the exercise list

    } catch (error) {
      alert('An error occurred while deleting the exercise')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{exercise.name}</h3>
          {exercise.description && (
            <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
          )}
          {exercise.videoUrl && (
            <p className="text-xs text-green-600 mt-2">📹 Video Available</p>
          )}
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              deleting
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-100 hover:bg-red-200 text-red-700'
            }`}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-400">
        Added {new Date(exercise.createdAt).toLocaleDateString()}
      </div>

      <EditExerciseModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={onUpdate}
        exercise={exercise}
      />
    </div>
  )
}
