// force rebuild
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? 'careerlens'
console.log('APP_ID:', process.env.NEXT_PUBLIC_APP_ID)

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const admin = createAdminClient()

        // Upsert profile with correct app_id using service role (bypasses RLS)
        const fullName = user.user_metadata?.full_name || ''
        const firstName = fullName.split(' ')[0] || user.email?.split('@')[0] || 'Student'
        const lastName = fullName.split(' ').slice(1).join(' ') || ''
        await admin.from('profiles').upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: user.email || '',
          role: 'student',
          app_id: APP_ID,
        }, { onConflict: 'id', ignoreDuplicates: false })

        const { data: profile } = await admin
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role === 'institution') {
          return NextResponse.redirect(`${origin}/institution`)
        }

        // Check if student has a completed assessment
        const { data: assessment } = await supabase
          .from('assessments')
          .select('id, completed_at')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(1)
          .single()

        if (assessment) {
          // Already completed — load their results
          return NextResponse.redirect(`${origin}/?results=1`)
        }

        // No completed assessment — go straight to assessment
        return NextResponse.redirect(`${origin}/?start=1`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_failed`)
}
