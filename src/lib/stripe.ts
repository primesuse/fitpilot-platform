import Stripe from 'stripe'
import { SUBSCRIPTION_TIERS } from './stripe-client'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
})

// Add the Price IDs to the server-side configuration
const STRIPE_PRICE_IDS = {
  SOLO: process.env.STRIPE_SOLO_PRICE_ID!,
  STUDIO: process.env.STRIPE_STUDIO_PRICE_ID!,
  ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
}

// Create enhanced tiers with Price IDs for server use only
export const SERVER_SUBSCRIPTION_TIERS = {
  SOLO: {
    ...SUBSCRIPTION_TIERS.SOLO,
    priceId: STRIPE_PRICE_IDS.SOLO,
  },
  STUDIO: {
    ...SUBSCRIPTION_TIERS.STUDIO,
    priceId: STRIPE_PRICE_IDS.STUDIO,
  },
  ENTERPRISE: {
    ...SUBSCRIPTION_TIERS.ENTERPRISE,
    priceId: STRIPE_PRICE_IDS.ENTERPRISE,
  }
} as const

// Re-export client-safe types and data
export { SUBSCRIPTION_TIERS, type SubscriptionTier } from './stripe-client'
