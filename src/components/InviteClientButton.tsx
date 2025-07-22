'use client'

import { useState } from 'react'
import InviteClientModal from './InviteClientModal'

export default function InviteClientButton() {
  const [showModal, setShowModal] = useState(false)

  const handleSuccess = () => {
    // Refresh the page to show the new client
    window.location.reload()
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        Invite New Client
      </button>
      
      <InviteClientModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}
