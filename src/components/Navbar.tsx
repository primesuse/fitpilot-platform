'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface SubscriptionStatus {
  isActive: boolean
  status: string
  tier: string
  expiresAt?: string | null
  stripeCustomerId?: string | null
  daysRemaining: number | null
  isTrialUser: boolean
}

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  // Fetch subscription status for PTs
  useEffect(() => {
    if (session?.user?.userType === 'pt') {
      fetchSubscriptionStatus()
    }
  }, [session])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription/status')
      if (response.ok) {
        const data = await response.json()
        setSubscriptionStatus(data)
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error)
    }
  }

  const isActivePage = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

 const getTrialWarning = () => {
  if (subscriptionStatus?.isTrialUser && subscriptionStatus?.daysRemaining !== null) {
    if (subscriptionStatus.daysRemaining <= 3) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 mx-4 my-2">
          <div className="flex items-center p-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                <strong>Trial expires in {subscriptionStatus.daysRemaining} days!</strong>
                <Link href="/pt/business/subscription" className="underline ml-1 hover:text-red-900 transition-colors font-medium">
                  Upgrade now
                </Link>
              </p>
            </div>
          </div>
        </div>
      )
    } else if (subscriptionStatus.daysRemaining <= 7) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 mx-4 my-2">
          <div className="flex items-center p-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                Trial expires in {subscriptionStatus.daysRemaining} days.
                <Link href="/pt/business/subscription" className="underline ml-1 hover:text-yellow-900 transition-colors font-medium">
                  View plans
                </Link>
              </p>
            </div>
          </div>
        </div>
      )
    }
  }
  return null
}

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">FitPilot</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {/* PT Navigation */}
              {session?.user.userType === 'pt' && (
                <>
                  {/* Dashboard */}
                  <Link
                    href="/pt/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePage('/pt/dashboard')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                      Dashboard
                    </div>
                  </Link>

                  {/* Content Library Dropdown */}
                  <div className="relative group">
                    <button className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                      isActivePage('/pt/library')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Library
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        <Link
                          href="/pt/library/exercises"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Exercise Library
                        </Link>
                        <Link
                          href="/pt/library/templates/workouts"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Program Builder
                        </Link>
                        <Link
                          href="/pt/library/meal-plans"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                          </svg>
                          Meal Plans
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Calendar (Future Feature) */}
                  <Link
                    href="/pt/calendar"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePage('/pt/calendar')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Calendar feature coming soon!')
                    }}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                      </svg>
                      Calendar
                      <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Soon</span>
                    </div>
                  </Link>

                  {/* Business Dropdown */}
                  <div className="relative group">
                    <button className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                      isActivePage('/pt/business')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Business
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        <Link
                          href="/pt/business/subscription"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Subscription
                          {subscriptionStatus?.isTrialUser && (
                            <span className="ml-auto text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                              Trial
                            </span>
                          )}
                        </Link>
                        <div className="flex items-center px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2z" />
                          </svg>
                          Analytics
                          <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Soon
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Client Navigation */}
              {session?.user.userType === 'client' && (
                <>
                  <Link
                    href="/client/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePage('/client/dashboard')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                      Dashboard
                    </div>
                  </Link>

                  <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Workouts
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Soon</span>
                  </div>

                  <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2z" />
                    </svg>
                    Progress
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Soon</span>
                  </div>
                </>
              )}
            </div>

            {/* User Profile and Actions */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {session ? (
                <>
                  {/* Subscription Status Indicator for PTs */}
                  {session.user.userType === 'pt' && subscriptionStatus && (
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscriptionStatus.isActive
                          ? subscriptionStatus.isTrialUser
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriptionStatus.isTrialUser ? `Trial (${subscriptionStatus.tier})` : subscriptionStatus.tier}
                      </span>
                    </div>
                  )}

                  {/* Enhanced User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center space-x-3 text-left hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    >
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-36">
                          {session.user.name || session.user.email}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {session.user.userType === 'pt' ? 'Personal Trainer' : 'Client'}
                        </div>
                      </div>
                      
                      <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {(session.user.name || session.user.email)?.[0]?.toUpperCase()}
                        </span>
                      </div>

                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white border border-gray-200 z-50">
                        <div className="py-1">
                          {/* Profile Link */}
                          <Link
                            href={session.user.userType === 'pt' ? '/pt/profile' : '/client/profile'}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            My Profile
                          </Link>

                          {/* Account Settings */}
                          <Link
                            href={session.user.userType === 'pt' ? '/pt/settings' : '/client/settings'}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                          </Link>

                          {/* PT-specific links */}
                          {session.user.userType === 'pt' && (
                            <Link
                              href="/pt/business/subscription"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowUserDropdown(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              Manage Subscription
                              {subscriptionStatus?.isTrialUser && (
                                <span className="ml-auto text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                                  Trial
                                </span>
                              )}
                            </Link>
                          )}

                          <div className="border-t border-gray-100 my-1"></div>

                          {/* Sign Out */}
                          <button
                            onClick={() => {
                              setShowUserDropdown(false)
                              signOut({ callbackUrl: '/login' })
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
              {session?.user.userType === 'pt' && (
                <>
                  <Link
                    href="/pt/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/pt/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/pt/library/exercises"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Exercise Library
                  </Link>
                  <Link
                    href="/pt/library/templates/workouts"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Program Builder
                  </Link>
                  <Link
                    href="/pt/library/meal-plans"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meal Plans
                  </Link>
                  <Link
                    href="/pt/business/subscription"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Subscription
                  </Link>
                </>
              )}
              
              {session?.user.userType === 'client' && (
                <>
                  <Link
                    href="/client/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    href="/client/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                </>
              )}

              {session && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    signOut({ callbackUrl: '/login' })
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Trial Warning Banner */}
      {session?.user.userType === 'pt' && getTrialWarning()}
    </>
  )
}
