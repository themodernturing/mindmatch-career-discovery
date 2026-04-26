import { createAdminClient } from '@/lib/supabase/admin'

const BASE_PRICE = 5000
const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? 'careerlens'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')?.toUpperCase()

  if (!code) return Response.json({ valid: false, error: 'No code provided' })

  const admin = createAdminClient()
  const { data: voucher } = await admin
    .from('vouchers')
    .select('*')
    .eq('code', code)
    .eq('app_id', APP_ID)
    .single()

  if (!voucher) return Response.json({ valid: false, error: 'Invalid voucher code' })

  if (new Date(voucher.expiry_date) < new Date())
    return Response.json({ valid: false, error: 'This voucher has expired' })

  if (voucher.quantity_used >= voucher.quantity)
    return Response.json({ valid: false, error: 'This voucher has been fully used' })

  return Response.json({
    valid: true,
    name: voucher.name,
    discount: voucher.discount_amount,
    finalPrice: BASE_PRICE - voucher.discount_amount,
  })
}
