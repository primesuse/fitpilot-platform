import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that require subscription enforcement for PTs
const PT_PROTECTED_ROUTES = [
  '/pt/dashboard',
  '/pt/library',
  '/pt/clients',
  '/pt/calendar',
  '/pt/business/analytics',
  '/pt/business/payments',
  '/pt/settings'
]

// Routes that should be accessible without subscription (login, registration, subscription management)
const PT_EXEMPT_ROUTES = [
  '/pt/business/subscription',
  '/login',
  '/register',
  '/api/auth'
]

// Client routes that require authentication
const CLIENT_PROTECTED_ROUTES = [
  '/client/dashboard',
  '/client/profile',
  '/client/workout',
  '/client/progress',
  '/client/nutrition',
  '/client/booking',
  '/client/my-pt',
  '/client/settings'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('🔍 MIDDLEWARE EXECUTING for:', pathname)

  // Skip middleware for static files, images, and API routes (except subscription-related)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/_vercel')
  ) {
    return NextResponse.next()
  }

  try {
    // Get the user's session token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    // === PERSONAL TRAINER ROUTE PROTECTION ===
    const isPTRoute = PT_PROTECTED_ROUTES.some(route => pathname.startsWith(route))
    const isExemptPTRoute = PT_EXEMPT_ROUTES.some(route => pathname.startsWith(route))

    if (isPTRoute && !isExemptPTRoute) {
      console.log('🎯 PT PROTECTED ROUTE detected:', pathname)

      // Check if user is authenticated as PT
      if (!token || token.userType !== 'pt') {
        console.log('🚫 NO PT TOKEN - redirecting to login')
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Check subscription status via API call
      console.log('📞 Checking PT subscription status...')
      try {
        const subscriptionCheckUrl = new URL('/api/subscription/status', request.url)
        
        const subscriptionResponse = await fetch(subscriptionCheckUrl.toString(), {
          headers: {
            'Cookie': request.headers.get('cookie') || '',
            'User-Agent': request.headers.get('user-agent') || 'FitPilot-Middleware',
          },
        })

        if (!subscriptionResponse.ok) {
          console.log('❌ SUBSCRIPTION API ERROR - redirecting to subscription page')
          const subscriptionUrl = new URL('/pt/business/subscription', request.url)
          subscriptionUrl.searchParams.set('reason', 'api_error')
          return NextResponse.redirect(subscriptionUrl)
        }

        const subscriptionData = await subscriptionResponse.json()
        console.log('💳 Subscription status:', subscriptionData)

        // If subscription is not active (including trial), redirect to subscription page
        if (!subscriptionData.isActive) {
          console.log('🔒 SUBSCRIPTION NOT ACTIVE - redirecting to subscription page')
          const subscriptionUrl = new URL('/pt/business/subscription', request.url)
          subscriptionUrl.searchParams.set('reason', subscriptionData.status || 'inactive')
          
          // Add additional context for expired trials
          if (subscriptionData.status === 'trial' && subscriptionData.daysRemaining <= 0) {
            subscriptionUrl.searchParams.set('reason', 'trial_expired')
          }
          
          return NextResponse.redirect(subscriptionUrl)
        }

        console.log('✅ PT SUBSCRIPTION ACTIVE - allowing access')

      } catch (subscriptionError) {
        console.error('💥 SUBSCRIPTION CHECK ERROR:', subscriptionError)
        
        // On error, redirect to subscription page to be safe
        const subscriptionUrl = new URL('/pt/business/subscription', request.url)
        subscriptionUrl.searchParams.set('reason', 'check_error')
        return NextResponse.redirect(subscriptionUrl)
      }
    }

    // === CLIENT ROUTE PROTECTION ===
    const isClientRoute = CLIENT_PROTECTED_ROUTES.some(route => pathname.startsWith(route))

    if (isClientRoute) {
      console.log('🎯 CLIENT PROTECTED ROUTE detected:', pathname)

      // Check if user is authenticated as Client
      if (!token || token.userType !== 'client') {
        console.log('🚫 NO CLIENT TOKEN - redirecting to login')
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      console.log('✅ CLIENT AUTHENTICATED - allowing access')
    }

    // === AUTHENTICATION-ONLY ROUTES ===
    // Routes that require authentication but don't need subscription checks
    const authOnlyRoutes = ['/pt/business/subscription']
    const isAuthOnlyRoute = authOnlyRoutes.some(route => pathname.startsWith(route))

    if (isAuthOnlyRoute) {
      if (!token) {
        console.log('🚫 AUTH REQUIRED - redirecting to login')
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    // === ROLE-BASED ACCESS CONTROL ===
    // Prevent clients from accessing PT routes and vice versa
    if (token) {
      const isPTAccessingClientRoute = token.userType === 'pt' && pathname.startsWith('/client/')
      const isClientAccessingPTRoute = token.userType === 'client' && pathname.startsWith('/pt/')

      if (isPTAccessingClientRoute) {
        console.log('🔄 PT accessing client route - redirecting to PT dashboard')
        return NextResponse.redirect(new URL('/pt/dashboard', request.url))
      }

      if (isClientAccessingPTRoute) {
        console.log('🔄 Client accessing PT route - redirecting to client dashboard')
        return NextResponse.redirect(new URL('/client/dashboard', request.url))
      }
    }

    // All checks passed, allow the request to continue
    console.log('✅ MIDDLEWARE ALLOWING REQUEST to continue')
    return NextResponse.next()

  } catch (error) {
    console.error('💥 MIDDLEWARE CRITICAL ERROR:', error)
    
    // On critical error, redirect to home page
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _vercel (Vercel internal routes)
     * - favicon.ico (favicon file)
     * - Any file with an extension (images, CSS, JS, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|_vercel|favicon.ico|.*\\..*).*)',
  ],
}
