import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? 'careerlens'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (adminProfile?.role !== 'institution')
    return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { userId } = await request.json()
  if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 })

  const admin = createAdminClient()

  const { data: targetProfile } = await admin
    .from('profiles')
    .select('app_id')
    .eq('id', userId)
    .single()

  if (!targetProfile || targetProfile.app_id !== APP_ID)
    return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { error } = await admin
    .from('profiles')
    .update({ payment_status: 'approved' })
    .eq('id', userId)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ success: true })
}
