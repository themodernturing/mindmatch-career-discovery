import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? 'careerlens'
const REQUIRE_PAYMENT = process.env.NEXT_PUBLIC_REQUIRE_PAYMENT !== 'false'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Always allow static assets and API routes
  if (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.')) {
    return supabaseResponse
  }

  // Always allow auth pages and payment-pending regardless of payment status
  if (path.startsWith('/auth') || path === '/payment-pending') {
    return supabaseResponse
  }

  // Not logged in — allow public landing page, block everything else
  if (!user) {
    if (path === '/') return supabaseResponse
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Logged in — get role, payment status, and app_id in one query
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, payment_status, app_id')
    .eq('id', user.id)
    .single()

  // Cross-app session guard — sign out users who belong to a different app
  if (profile?.app_id && profile.app_id !== APP_ID) {
    await supabase.auth.signOut()
    const res = NextResponse.redirect(new URL('/auth', request.url))
    supabaseResponse.cookies.getAll().forEach(c => res.cookies.set(c.name, c.value))
    return res
  }

  // Institution routes — require institution role
  if (path.startsWith('/institution')) {
    if (!profile || profile.role !== 'institution') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return supabaseResponse
  }

  // Institution admins bypass payment check everywhere else
  if (profile?.role === 'institution') {
    return supabaseResponse
  }

  // Regular users must have approved payment for all routes (including '/')
  if (REQUIRE_PAYMENT && (!profile || profile.payment_status !== 'approved')) {
    return NextResponse.redirect(new URL('/payment-pending', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
