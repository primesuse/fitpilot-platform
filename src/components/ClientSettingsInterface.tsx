'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ClientSettingsInterface() {
  const { data: session } = useSession()
  const [saving, setSaving] = useState(false)
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    workoutReminders: true,
    progressUpdates: true,
    trainerMessages: true,
    appointmentReminders: true
  })

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      alert('New password must be at least 8 characters long')
      return
    }

    setSaving(true)
    
    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      if (response.ok) {
        alert('Password updated successfully!')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update password')
      }
    } catch (error) {
      console.error('Password update error:', error)
      alert('Error updating password. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <Link href="/client/dashboard" className="text-gray-400 hover:text-gray-500">
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-500">Settings</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Account Security Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
            <p className="text-sm text-gray-600">Manage your password and security preferences</p>
          </div>
          <div className="flex items-center text-green-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium">Secure</span>
          </div>
        </div>

        {/* Current Account Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Account Email</h4>
              <p className="text-sm text-gray-600">{session?.user?.email}</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Verified
            </span>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Change Password</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your new password"
            />
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Updating Password...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
          <p className="text-sm text-gray-600">Choose what notifications you'd like to receive</p>
        </div>

        <div className="space-y-4">
          {Object.entries({
            emailNotifications: 'Email Notifications',
            workoutReminders: 'Workout Reminders',
            progressUpdates: 'Progress Updates',
            trainerMessages: 'Trainer Messages',
            appointmentReminders: 'Appointment Reminders'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{label}</h4>
                <p className="text-sm text-gray-600">
                  {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                  {key === 'workoutReminders' && 'Get reminders for your scheduled workouts'}
                  {key === 'progressUpdates' && 'Updates on your fitness progress and achievements'}
                  {key === 'trainerMessages' && 'Messages and updates from your personal trainer'}
                  {key === 'appointmentReminders' && 'Reminders about upcoming training sessions'}
                </p>
              </div>
              <button
                onClick={() => setNotificationSettings(prev => ({
                  ...prev,
                  [key]: !prev[key as keyof typeof prev]
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings[key as keyof typeof notificationSettings]
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings[key as keyof typeof notificationSettings]
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/client/profile"
            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <h4 className="font-medium text-gray-900">My Profile</h4>
              <p className="text-xs text-gray-600">Edit personal information and fitness goals</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
