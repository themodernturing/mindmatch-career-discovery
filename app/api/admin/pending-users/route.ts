import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? 'careerlens'

export async function GET() {
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

  const admin = createAdminClient()
  const { data: pendingUsers } = await admin
    .from('profiles')
    .select('id, first_name, last_name, email, phone, payment_slip_url, voucher_code_used, amount_paid, created_at')
    .eq('payment_status', 'pending')
    .eq('role', 'student')
    .eq('app_id', APP_ID)
    .order('created_at', { ascending: false })

  if (!pendingUsers) return Response.json({ users: [] })

  const usersWithSlips = await Promise.all(
    pendingUsers.map(async (u) => {
      let slipSignedUrl: string | null = null
      if (u.payment_slip_url) {
        const { data } = await admin.storage
          .from('payment-slips')
          .createSignedUrl(u.payment_slip_url, 3600)
        slipSignedUrl = data?.signedUrl || null
      }
      return { ...u, slipSignedUrl }
    })
  )

  return Response.json({ users: usersWithSlips })
}
