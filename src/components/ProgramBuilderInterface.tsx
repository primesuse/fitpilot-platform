'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core'
import DraggableExercise from './DraggableExercise'
import DroppableWorkoutDay from './DroppableWorkoutDay'

interface Exercise {
  id: string
  name: string
  description: string | null
  videoUrl: string | null
}

interface Client {
  id: string
  name: string
}

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

interface ProgramBuilderInterfaceProps {
  exercises: Exercise[]
  clients: Client[]
  initialProgram?: any
  isEditing?: boolean
  programId?: string
}

export default function ProgramBuilderInterface({ 
  exercises, 
  clients,
  initialProgram,
  isEditing = false,
  programId
}: ProgramBuilderInterfaceProps) {
  const [selectedClient, setSelectedClient] = useState<string>(
    initialProgram?.client?.id || ''
  )
  const [programName, setProgramName] = useState(
    initialProgram?.name || ''
  )
  const [activeId, setActiveId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [saving, setSaving] = useState(false)

  // Initialize workout program with existing data if editing
  const [workoutProgram, setWorkoutProgram] = useState<WorkoutExercise[][]>(() => {
    if (initialProgram && isEditing) {
      // Convert existing program data to grid format
      const grid = Array.from({ length: 7 }, () => [])
      
      initialProgram.workoutDays?.forEach((day: any) => {
        grid[day.dayOfWeek] = day.workoutExercises.map((we: any) => ({
          id: `${we.exercise.id}-${Date.now()}-${Math.random()}`,
          exerciseId: we.exercise.id,
          exerciseName: we.exercise.name,
          sets: we.sets,
          reps: we.reps,
          restSeconds: we.restSeconds,
          seqOrder: we.seqOrder,
          dropSets: we.dropSets || 0,
          superSetGroup: we.superSetGroup || '',
          tutSeconds: we.tutSeconds || 0,
          rir: we.rir || 2
        }))
      })
      
      return grid
    }
    return Array.from({ length: 7 }, () => [])
  })

  // Filter sidebar exercises
  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate totals
  const totalExercises = workoutProgram.flat().length
  const activeDays = workoutProgram.filter(day => day.length > 0).length

  useEffect(() => {
    const headerBtn = document.getElementById('header-save-btn') as HTMLButtonElement
    
    if (headerBtn) {
      headerBtn.textContent = isEditing 
        ? `Update Program (${totalExercises} exercises)`
        : `Save Program (${totalExercises} exercises)`
      
      const isDisabled = !programName || totalExercises === 0 || !selectedClient || saving
      headerBtn.disabled = isDisabled
      
      if (isDisabled) {
        headerBtn.className = 'bg-gray-300 text-gray-500 cursor-not-allowed px-4 py-2 rounded-md text-sm'
      } else {
        headerBtn.className = 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm'
      }
      
      // Add click handler
      headerBtn.onclick = handleSave
    }

    // Update description text
    const headerDesc = document.querySelector('#header-description')
    if (headerDesc) {
      if (totalExercises > 0 && selectedClient && programName) {
        headerDesc.textContent = isEditing
          ? `Ready to update "${programName}" with ${totalExercises} exercises`
          : `Ready to save "${programName}" with ${totalExercises} exercises`
      } else {
        headerDesc.textContent = isEditing
          ? 'Make changes and update the program'
          : 'Complete the program details below to save'
      }
    }
  }, [workoutProgram, programName, selectedClient, saving, isEditing, totalExercises])
    
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    if (
      event.over &&
      event.active.data.current?.type === 'exercise'
    ) {
      const ex: Exercise = event.active.data.current.exercise
      const dayIndex = event.over.data.current?.dayIndex
      if (typeof dayIndex === 'number') {
        addExerciseToDay(dayIndex, ex)
      }
    }
  }

  // add new exercise instance
  const addExerciseToDay = (dayIndex: number, ex: Exercise) => {
    const inst: WorkoutExercise = {
      id: `${ex.id}-${Date.now()}-${Math.random()}`,
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: 3,
      reps: 10,
      restSeconds: 60,
      seqOrder: workoutProgram[dayIndex].length + 1,
      dropSets: 0,
      superSetGroup: '',
      tutSeconds: 0,
      rir: 2
    }
    setWorkoutProgram((prev) => {
      const next = [...prev]
      next[dayIndex] = [...next[dayIndex], inst]
      return next
    })
  }

  // remove a dropped exercise
  const removeExerciseFromDay = (
    dayIndex: number,
    instId: string
  ) => {
    setWorkoutProgram((prev) => {
      const next = [...prev]
      next[dayIndex] = next[dayIndex].filter((i) => i.id !== instId)
      return next
    })
  }

  // Enhanced update function to handle new fields
  const updateExerciseInDay = (
    dayIndex: number,
    instId: string,
    field: 'sets' | 'reps' | 'restSeconds' | 'dropSets' | 'tutSeconds' | 'rir',
    value: number
  ) => {
    setWorkoutProgram((prev) => {
      const next = prev.map((day, i) =>
        i !== dayIndex
          ? day
          : day.map((inst) =>
              inst.id !== instId
                ? inst
                : { ...inst, [field]: value }
            )
      )
      return next
    })
  }

  // Super set change handler
  const updateSuperSetInDay = (
    dayIndex: number,
    instId: string,
    superSetGroup: string
  ) => {
    setWorkoutProgram((prev) => {
      const next = prev.map((day, i) =>
        i !== dayIndex
          ? day
          : day.map((inst) =>
              inst.id !== instId
                ? inst
                : { ...inst, superSetGroup: superSetGroup || '' }
            )
      )
      return next
    })
  }

  // Enhanced save function to handle both create and update
  const handleSave = async () => {
    setSaving(true)

    try {
      const programData = {
        programName,
        clientId: selectedClient,
        days: workoutProgram.map(dayExercises => 
          dayExercises.map(exercise => ({
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            restSeconds: exercise.restSeconds,
            dropSets: exercise.dropSets || 0,
            superSetGroup: exercise.superSetGroup || null,
            tutSeconds: exercise.tutSeconds || null,
            rir: exercise.rir || null
          }))
        )
      }

      const url = isEditing && programId 
        ? `/api/programs/${programId}` 
        : '/api/programs'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(programData)
      })

      const data = await response.json()
      
      if (response.ok) {
        alert(isEditing ? 'Program updated successfully! 🎉' : 'Program saved successfully! 🎉')
        
        if (!isEditing) {
          // Reset form for new programs
          setProgramName('')
          setSelectedClient('')
          setWorkoutProgram(Array.from({ length: 7 }, () => []))
        }
      } else {
        alert(data.error || `Failed to ${isEditing ? 'update' : 'save'} program`)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert(`An error occurred while ${isEditing ? 'updating' : 'saving'} the program`)
    } finally {
      setSaving(false)
    }
  }

  const activeEx = activeId
    ? exercises.find((e) => e.id === activeId)
    : null

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Exercise Library
          </h2>
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 mb-4 focus:ring-2 focus:ring-blue-500"
          />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'No exercises found' : 'Add exercises to your library first'}
              </p>
            ) : (
              filtered.map((ex) => (
                <DraggableExercise key={ex.id} exercise={ex} />
              ))
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button 
              onClick={() => window.open('/pt/library/exercises', '_blank')}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-md text-sm transition-colors"
            >
              + Add New Exercise
            </button>
          </div>
        </div>

        {/* Main builder area */}
        <div className="col-span-9 space-y-6">
          {/* Program details */}
          <div className="bg-white p-6 rounded-lg shadow">
            {/* Editing indicator */}
            {isEditing && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="text-blue-800 font-medium">
                    Editing Mode: Modifying existing program for {initialProgram?.client?.name}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name
                </label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="e.g., Upper Body Strength Program"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Client
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  disabled={isEditing} // Disable client selection when editing
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${
                    isEditing 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'text-gray-900'
                  }`}
                >
                  <option value="">Select a client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Client assignment cannot be changed when editing
                  </p>
                )}
              </div>
            </div>

            {/* Program Stats */}
            <div className="mt-4 flex space-x-6 text-sm text-gray-600">
              <span>Total Exercises: {totalExercises}</span>
              <span>Active Days: {activeDays}/7</span>
              <span>Estimated Duration: {Math.round(totalExercises * 2.5)} min/day avg</span>
              {isEditing && (
                <span className="text-blue-600 font-medium">
                  📝 Editing Mode
                </span>
              )}
            </div>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
            {[
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday'
            ].map((day, idx) => (
              <DroppableWorkoutDay
                key={day}
                day={day}
                dayIndex={idx}
                exercises={workoutProgram[idx]}
                onExerciseAdd={addExerciseToDay}
                onExerciseRemove={removeExerciseFromDay}
                onExerciseChange={updateExerciseInDay}
                onSuperSetChange={updateSuperSetInDay}
              />
            ))}
          </div>

          {/* Action buttons for editing mode */}
          {isEditing && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Program Actions</h3>
                  <p className="text-sm text-gray-600">
                    Make your changes above and update the program, or cancel to discard changes
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel Changes
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !programName || totalExercises === 0}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? 'Updating...' : 'Update Program'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeEx && (
          <div className="p-3 bg-white rounded-md border-2 border-blue-400 shadow-lg">
            <h4 className="font-medium text-gray-900 text-sm">{activeEx.name}</h4>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
