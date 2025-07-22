'use client'

import { useDroppable } from '@dnd-kit/core'
import { useState, useEffect } from 'react'

interface WorkoutExercise {
  id: string
  exerciseId: string
  exerciseName: string
  sets: number
  reps: number
  restSeconds: number
  seqOrder: number
  // Enhanced fields for advanced training
  dropSets?: number
  superSetGroup?: string
  tutSeconds?: number
  rir?: number
}

interface DroppableWorkoutDayProps {
  day: string
  dayIndex: number
  exercises: WorkoutExercise[]
  onExerciseAdd: (dayIndex: number, exercise: any) => void
  onExerciseRemove: (dayIndex: number, instId: string) => void
  onExerciseChange: (
    dayIndex: number,
    instId: string,
    field: 'sets' | 'reps' | 'restSeconds' | 'dropSets' | 'tutSeconds' | 'rir',
    value: number
  ) => void
  onSuperSetChange?: (dayIndex: number, instId: string, superSetGroup: string) => void
}

export default function DroppableWorkoutDay({
  day,
  dayIndex,
  exercises,
  onExerciseAdd,
  onExerciseRemove,
  onExerciseChange,
  onSuperSetChange
}: DroppableWorkoutDayProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-${dayIndex}`,
    data: { dayIndex }
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)

  const superSetColors = [
    'bg-red-100 border-red-300',
    'bg-blue-100 border-blue-300', 
    'bg-green-100 border-green-300',
    'bg-yellow-100 border-yellow-300',
    'bg-purple-100 border-purple-300'
  ]

  const getSuperSetColor = (group: string) => {
    const index = group.charCodeAt(0) - 65 // A=0, B=1, etc.
    return superSetColors[index % superSetColors.length]
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
      }`}
    >
      {/* Day Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">{day}</h3>
            <p className="text-sm text-gray-500">
              {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Exercise
          </button>
        </div>
      </div>

      {/* Exercise List */}
      <div className="p-4 space-y-3 min-h-[200px]">
        {exercises.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="font-medium">Rest Day</p>
            <p className="text-sm">Drag exercises here or click "Add Exercise"</p>
          </div>
        ) : (
          exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className={`border rounded-lg p-3 transition-all ${
                exercise.superSetGroup && exercise.superSetGroup !== ''
                  ? getSuperSetColor(exercise.superSetGroup)
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Exercise Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="bg-gray-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    <h4 className="font-medium text-gray-900">{exercise.exerciseName}</h4>
                    {exercise.superSetGroup && exercise.superSetGroup !== '' && (
                      <span className="ml-2 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                        Super Set {exercise.superSetGroup}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setExpandedExercise(
                      expandedExercise === exercise.id ? null : exercise.id
                    )}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Advanced options"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onExerciseRemove(dayIndex, exercise.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove exercise"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Basic Parameters */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sets</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={exercise.sets}
                    onChange={(e) => onExerciseChange(dayIndex, exercise.id, 'sets', parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Reps</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={exercise.reps}
                    onChange={(e) => onExerciseChange(dayIndex, exercise.id, 'reps', parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rest</label>
                  <input
                    type="number"
                    min="15"
                    max="600"
                    step="15"
                    value={exercise.restSeconds}
                    onChange={(e) => onExerciseChange(dayIndex, exercise.id, 'restSeconds', parseInt(e.target.value) || 60)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  />
                  <p className="text-xs text-gray-500 text-center">{formatTime(exercise.restSeconds)}</p>
                </div>
              </div>

              {/* Advanced Parameters (Expanded) */}
              {expandedExercise === exercise.id && (
                <div className="border-t border-gray-200 pt-3 space-y-3">
                  {/* Drop Sets & RIR */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Drop Sets</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={exercise.dropSets || 0}
                        onChange={(e) => onExerciseChange(dayIndex, exercise.id, 'dropSets', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">RIR</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={exercise.rir || 2}
                        onChange={(e) => onExerciseChange(dayIndex, exercise.id, 'rir', parseInt(e.target.value) || 2)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      />
                      <p className="text-xs text-gray-500 text-center">Reps in Reserve</p>
                    </div>
                  </div>

                  {/* Time Under Tension */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Time Under Tension (seconds)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={exercise.tutSeconds || 0}
                      onChange={(e) => onExerciseChange(dayIndex, exercise.id, 'tutSeconds', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      placeholder="e.g., 3 for 3-second negative"
                    />
                  </div>

                  {/* Super Set Group */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Super Set Group</label>
                    <select
                      value={exercise.superSetGroup || ''}
                      onChange={(e) => onSuperSetChange?.(dayIndex, exercise.id, e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    >
                      <option value="">No Super Set</option>
                      <option value="A">Super Set A</option>
                      <option value="B">Super Set B</option>
                      <option value="C">Super Set C</option>
                      <option value="D">Super Set D</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Exercise Modal */}
      {showAddModal && (
        <AddExerciseModal
          onClose={() => setShowAddModal(false)}
          onAddExercise={(exercise) => {
            onExerciseAdd(dayIndex, exercise)
            setShowAddModal(false)
          }}
          dayName={day}
        />
      )}
    </div>
  )
}

// Add Exercise Modal Component
interface AddExerciseModalProps {
  onClose: () => void
  onAddExercise: (exercise: any) => void
  dayName: string
}

function AddExerciseModal({ onClose, onAddExercise, dayName }: AddExerciseModalProps) {
  const [exercises, setExercises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch exercises when modal opens
  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/exercises')
      if (response.ok) {
        const data = await response.json()
        setExercises(data.exercises || [])
      }
    } catch (error) {
      console.error('Error fetching exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Add Exercise to {dayName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          <div className="max-h-64 overflow-y-auto space-y-2">
            {loading ? (
              <p className="text-center text-gray-500">Loading exercises...</p>
            ) : filteredExercises.length === 0 ? (
              <p className="text-center text-gray-500">
                {searchTerm ? 'No exercises found' : 'No exercises in your library'}
              </p>
            ) : (
              filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => onAddExercise(exercise)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                  {exercise.description && (
                    <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
