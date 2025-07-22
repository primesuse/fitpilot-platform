'use client'

import { useState } from 'react'
import AddExerciseModal from './AddExerciseModal'

interface AddExerciseButtonProps {
  onSuccess?: () => void
}

export default function AddExerciseButton({ onSuccess }: AddExerciseButtonProps) {
  const [showModal, setShowModal] = useState(false)

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    }
    setShowModal(false)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        Add New Exercise
      </button>
      
      <AddExerciseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}
