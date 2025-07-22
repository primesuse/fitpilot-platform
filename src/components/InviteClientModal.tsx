'use client'

import { useState } from 'react'

interface InviteClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// Add this new interface for the success response
interface InviteSuccessResponse {
  message: string
  client: {
    id: string
    name: string
    email: string
    createdAt: string
  }
  tempPassword: string
  emailSent: boolean
  loginUrl: string
}

export default function InviteClientModal({ isOpen, onClose, onSuccess }: InviteClientModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // FIXED: Replace 'any' with proper type
  const [success, setSuccess] = useState<InviteSuccessResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/clients/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to invite client')
        return
      }

      setSuccess(data)
      setFormData({ clientName: '', clientEmail: '' })
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onSuccess()
        onClose()
        setSuccess(null)
      }, 3000)

    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

    return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Invite New Client</h2>
            <button
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            >
            ×
            </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <h3 className="font-semibold">Client Invited Successfully! 🎉</h3>
              <p className="text-sm mt-2">
                {success.client.name} has been added to your client list.
              </p>
            </div>
            
            {/* Display the temporary password clearly */}
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded text-sm mb-4">
              <h4 className="font-semibold mb-2">🔑 Client Login Credentials</h4>
              <div className="space-y-1">
                <p><strong>Email:</strong> {success.client.email}</p>
                <p><strong>Temporary Password:</strong> 
                  <span className="font-mono bg-yellow-200 px-2 py-1 rounded ml-2">
                    {success.tempPassword || 'Not available'}
                  </span>
                </p>
              </div>
              <p className="mt-2 text-xs">
                Share these credentials with your client for their first login.
              </p>
            </div>
            
            {/* Copy to clipboard button */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded text-sm">
              <p className="mb-2">
                <strong>Next Step:</strong> Test the client login flow
              </p>
                <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    e.preventDefault(); // Prevent default behavior
                    const credentials = `Email: ${success.client.email}\nPassword: ${success.tempPassword}`;
                    navigator.clipboard.writeText(credentials);
                    alert('Credentials copied to clipboard!');
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                >
                Copy Credentials
                </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder="Enter client's full name"
              />
            </div>
            
            <div>
              <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
                Client Email
              </label>
              <input
                type="email"
                id="clientEmail"
                required
                value={formData.clientEmail}
                onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder="Enter client's email address"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
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
                {loading ? 'Inviting...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
