'use client'

import { useState } from 'react'

interface AddExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddExerciseModal({ isOpen, onClose, onSuccess }: AddExerciseModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    videoUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create exercise')
        return
      }

      setFormData({ name: '', description: '', videoUrl: '' })
      onSuccess()
      onClose()

    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', videoUrl: '' })
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Exercise</h2>
          <button
            onClick={() => {
              onClose()
              resetForm()
            }}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-700">
              Exercise Name *
            </label>
            <input
              type="text"
              id="exerciseName"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              placeholder="e.g., Barbell Squat"
            />
          </div>
          
          <div>
            <label htmlFor="exerciseDescription" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="exerciseDescription"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              placeholder="Exercise instructions or notes..."
            />
          </div>
          
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
              Video URL
            </label>
            <input
              type="url"
              id="videoUrl"
              value={formData.videoUrl}
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-500 mt-1">
              YouTube, Vimeo, or direct video link
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose()
                resetForm()
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Creating...' : 'Create Exercise'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
