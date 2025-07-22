'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SUBSCRIPTION_TIERS } from '@/lib/stripe-client'

interface SubscriptionStatus {
  isActive: boolean
  status: string
  tier: string
  expiresAt: string | null
  stripeCustomerId: string | null
  isTrialUser: boolean
  daysRemaining: number | null
}

export default function SubscriptionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')
  
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState<string | null>(null)

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
    } finally {
      setLoading(false)
    }
  }

  const createSubscription = async (tier: string) => {
    setCreating(tier)
    
    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url // Redirect to Stripe Checkout
      } else {
        alert('Error creating subscription. Please try again.')
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
      alert('Error creating subscription. Please try again.')
    } finally {
      setCreating(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription status...</p>
        </div>
      </div>
    )
  }

  // Show subscription required message
  const getReasonMessage = () => {
    switch (reason) {
      case 'trial':
        return 'Your trial period has ended. Please subscribe to continue using FitPilot.'
      case 'canceled':
        return 'Your subscription has been canceled. Reactivate to continue using FitPilot.'
      case 'past_due':
        return 'Your subscription payment is past due. Please update your payment method.'
      case 'inactive':
        return 'Your subscription is inactive. Please subscribe to access FitPilot features.'
      case 'error':
        return 'We encountered an error checking your subscription. Please try again.'
      default:
        return 'A valid subscription is required to access FitPilot features.'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your FitPilot Plan
          </h1>
          {reason && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">{getReasonMessage()}</p>
            </div>
          )}
          <p className="text-xl text-gray-600">
            Select the perfect plan for your fitness business
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscriptionStatus && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Current Subscription</h2>
            <div className="flex justify-between items-center">
            <div>
                <p className="text-lg text-gray-900">
                <span className="font-medium text-gray-900">Plan:</span> 
                <span className="text-gray-700">{subscriptionStatus.tier}</span>
                </p>
                <p className="text-lg text-gray-900">
                <span className="font-medium text-gray-900">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    subscriptionStatus.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                    {subscriptionStatus.status === 'trial' ? 'Free Trial' : subscriptionStatus.status}
                </span>
                </p>
                {subscriptionStatus.expiresAt && (
                <p className="text-lg text-gray-900">
                    <span className="font-medium text-gray-900">
                    {subscriptionStatus.status === 'trial' ? 'Trial Expires:' : 'Expires:'}
                    </span> 
                    <span className="text-gray-700">
                    {new Date(subscriptionStatus.expiresAt).toLocaleDateString()}
                    </span>
                </p>
                )}
                {subscriptionStatus.isTrialUser && subscriptionStatus.daysRemaining !== null && (
                <div className={`mt-2 p-2 rounded ${
                    subscriptionStatus.daysRemaining <= 3 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                    <p className={`text-sm font-medium ${
                    subscriptionStatus.daysRemaining <= 3 ? 'text-red-800' : 'text-blue-800'
                    }`}>
                    {subscriptionStatus.daysRemaining} days remaining in your free trial
                    </p>
                </div>
                )}
            </div>
            {subscriptionStatus.isActive && (
                <button
                onClick={() => router.push('/pt/dashboard')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                Go to Dashboard
                </button>
            )}
            </div>
        </div>
        )}

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(SUBSCRIPTION_TIERS).map(([tierKey, tier]) => (
            <div
              key={tierKey}
              className="bg-white rounded-lg shadow-lg p-8 relative"
            >
              {tierKey === 'STUDIO' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {tier.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${(tier.price / 100).toFixed(0)}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => createSubscription(tierKey)}
                  disabled={creating === tierKey}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    tierKey === 'STUDIO'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } ${
                    creating === tierKey ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {creating === tierKey ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Choose Plan'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Can I change my plan later?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                All new accounts start with a 7-day free trial of the Solo plan.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
