import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? 'careerlens'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'institution' ? user : null
}

export async function GET() {
  const admin_user = await verifyAdmin()
  if (!admin_user) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const admin = createAdminClient()
  const { data: vouchers } = await admin
    .from('vouchers')
    .select('*')
    .eq('app_id', APP_ID)
    .order('created_at', { ascending: false })

  return Response.json({ vouchers: vouchers || [] })
}

export async function POST(request: Request) {
  const admin_user = await verifyAdmin()
  if (!admin_user) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { name, code, expiry_date, quantity, discount_amount } = await request.json()

  if (!name || !code || !expiry_date || !quantity || discount_amount === undefined)
    return Response.json({ error: 'All fields are required' }, { status: 400 })

  if (discount_amount < 0 || discount_amount >= 5000)
    return Response.json({ error: 'Discount must be between 0 and 4999 PKR' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('vouchers')
    .insert({ name, code: code.toUpperCase(), expiry_date, quantity: Number(quantity), discount_amount: Number(discount_amount), app_id: APP_ID })
    .select()
    .single()

  if (error) {
    const msg = error.message.includes('unique') ? 'A voucher with this code already exists' : error.message
    return Response.json({ error: msg }, { status: 400 })
  }

  return Response.json({ voucher: data }, { status: 201 })
}

export async function DELETE(request: Request) {
  const admin_user = await verifyAdmin()
  if (!admin_user) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('vouchers').delete().eq('id', id).eq('app_id', APP_ID)
  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ success: true })
}
