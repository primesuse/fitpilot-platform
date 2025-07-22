'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Trainer {
  id: string
  name: string
  email: string
  bio?: string | null
  specializations?: string | null
  certifications?: string | null
  phoneNumber?: string | null
  profilePictureUrl?: string | null
  businessName?: string | null
  location?: string | null
  yearsExperience?: number | null
  subscriptionTier: string
  subscriptionStatus: string
  createdAt: Date
}

interface PTProfileInterfaceProps {
  trainer: Trainer
}

export default function PTProfileInterface({ trainer }: PTProfileInterfaceProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: trainer.name || '',
    bio: trainer.bio || '',
    specializations: trainer.specializations || '',
    certifications: trainer.certifications || '',
    phoneNumber: trainer.phoneNumber || '',
    businessName: trainer.businessName || '',
    location: trainer.location || '',
    yearsExperience: trainer.yearsExperience || ''
  })

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const response = await fetch('/api/profile/pt', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Profile updated successfully!')
        setIsEditing(false)
        router.refresh()
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      alert('Error updating profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {trainer.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{trainer.name}</h2>
              <p className="text-gray-600">{trainer.email}</p>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  trainer.subscriptionStatus === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : trainer.subscriptionStatus === 'trial'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {trainer.subscriptionStatus === 'trial' ? 'Free Trial' : trainer.subscriptionStatus} - {trainer.subscriptionTier}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {new Date().getFullYear() - new Date(trainer.createdAt).getFullYear() || '0'}
            </div>
            <div className="text-sm text-gray-600">Years on FitPilot</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {trainer.yearsExperience || '0'}
            </div>
            <div className="text-sm text-gray-600">Years Experience</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">Professional</div>
            <div className="text-sm text-gray-600">Account Type</div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Professional Information
        </h3>
        
        <div className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="e.g., Elite Fitness Studio"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{trainer.businessName || 'Not specified'}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Bio
            </label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell clients about your training philosophy and experience..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{trainer.bio || 'No bio provided'}</p>
            )}
          </div>

          {/* Specializations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specializations
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.specializations}
                onChange={(e) => setFormData(prev => ({ ...prev, specializations: e.target.value }))}
                placeholder="e.g., Strength Training, Weight Loss, Bodybuilding"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{trainer.specializations || 'Not specified'}</p>
            )}
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certifications
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.certifications}
                onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
                placeholder="e.g., ACSM-CPT, NASM-CPT, Precision Nutrition"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{trainer.certifications || 'Not specified'}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+61 4XX XXX XXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{trainer.phoneNumber || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Sydney, NSW"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{trainer.location || 'Not specified'}</p>
              )}
            </div>
          </div>

          {/* Years Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            {isEditing ? (
              <input
                type="number"
                min="0"
                max="50"
                value={formData.yearsExperience}
                onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: e.target.value }))}
                placeholder="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{trainer.yearsExperience || 'Not specified'} years</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Account Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Subscription Management</h4>
              <p className="text-sm text-gray-600">Manage your FitPilot subscription</p>
            </div>
            <button
              onClick={() => router.push('/pt/business/subscription')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Subscription
            </button>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <h4 className="font-medium text-gray-900">Account Security</h4>
              <p className="text-sm text-gray-600">Update your password and security settings</p>
            </div>
            <button 
              onClick={() => router.push('/pt/settings')} 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Security Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
