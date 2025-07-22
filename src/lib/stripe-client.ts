// Client-safe Stripe configuration (no server environment variables)
export const SUBSCRIPTION_TIERS = {
  SOLO: {
    name: 'Solo Plan',
    price: 2900, // $29.00 in cents
    features: ['Up to 10 clients', 'Basic analytics', 'Email support']
  },
  STUDIO: {
    name: 'Studio Plan', 
    price: 7900, // $79.00 in cents
    features: ['Up to 50 clients', 'Advanced analytics', 'Priority support', 'Team management']
  },
  ENTERPRISE: {
    name: 'Enterprise Plan',
    price: 19900, // $199.00 in cents
    features: ['Unlimited clients', 'White-label options', 'Custom integrations', 'Dedicated support']
  }
} as const

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS
