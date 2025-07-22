'use client'

import { useDraggable } from '@dnd-kit/core'

interface Exercise {
  id: string
  name: string
  description: string | null
  videoUrl: string | null
}

interface DraggableExerciseProps {
  exercise: Exercise
}

export default function DraggableExercise({ exercise }: DraggableExerciseProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: exercise.id,
    data: {
      type: 'exercise',
      exercise: exercise
    }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 bg-gray-50 rounded-md border border-gray-200 cursor-grab hover:bg-gray-100 transition-colors ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <h4 className="font-medium text-gray-900 text-sm">{exercise.name}</h4>
      {exercise.description && (
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{exercise.description}</p>
      )}
      {exercise.videoUrl && (
        <span className="text-xs text-green-600 mt-1 block">📹 Video</span>
      )}
    </div>
  )
}
