import { createAdminClient } from '@/lib/supabase/admin'

const BASE_PRICE = 5000
const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? 'careerlens'

export async function POST(request: Request) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const firstName = (formData.get('firstName') as string)?.trim()
  const lastName = (formData.get('lastName') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const phone = (formData.get('phone') as string)?.trim()
  const password = formData.get('password') as string
  const voucherCode = (formData.get('voucherCode') as string)?.trim().toUpperCase() || null
  const slipFile = formData.get('slip') as File | null

  if (!firstName || !email || !password || !slipFile) {
    return Response.json({ error: 'Please fill in all required fields and upload your bank slip' }, { status: 400 })
  }

  if (password.length < 8) {
    return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Validate voucher if provided
  let discountAmount = 0
  let voucherData: { id: string; quantity_used: number } | null = null

  if (voucherCode) {
    const { data: voucher } = await admin
      .from('vouchers')
      .select('id, discount_amount, expiry_date, quantity, quantity_used')
      .eq('code', voucherCode)
      .eq('app_id', APP_ID)
      .single()

    if (!voucher) return Response.json({ error: 'Invalid voucher code' }, { status: 400 })
    if (new Date(voucher.expiry_date) < new Date()) return Response.json({ error: 'Voucher has expired' }, { status: 400 })
    if (voucher.quantity_used >= voucher.quantity) return Response.json({ error: 'Voucher is fully used' }, { status: 400 })

    discountAmount = voucher.discount_amount
    voucherData = { id: voucher.id, quantity_used: voucher.quantity_used }
  }

  // Create user (email is auto-confirmed via admin API)
  const { data: userData, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, app_id: APP_ID },
  })

  if (createError || !userData.user) {
    const msg = createError?.message?.includes('already registered')
      ? 'An account with this email already exists'
      : (createError?.message || 'Failed to create account')
    return Response.json({ error: msg }, { status: 400 })
  }

  const userId = userData.user.id

  // Upload bank slip
  let slipPath: string | null = null
  try {
    const buffer = await slipFile.arrayBuffer()
    const ext = slipFile.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${userId}/slip.${ext}`
    const { data: uploadData, error: uploadError } = await admin.storage
      .from('payment-slips')
      .upload(path, buffer, { contentType: slipFile.type, upsert: true })
    if (!uploadError && uploadData) slipPath = uploadData.path
  } catch {
    // Slip upload failed — user is still created, admin can follow up manually
  }

  // Update profile with all payment info
  await admin
    .from('profiles')
    .update({
      last_name: lastName || null,
      phone: phone || null,
      payment_status: 'pending',
      payment_slip_url: slipPath,
      voucher_code_used: voucherCode,
      amount_paid: BASE_PRICE - discountAmount,
      app_id: APP_ID,
    })
    .eq('id', userId)

  // Increment voucher usage
  if (voucherData) {
    await admin
      .from('vouchers')
      .update({ quantity_used: voucherData.quantity_used + 1 })
      .eq('id', voucherData.id)
  }

  return Response.json({ success: true }, { status: 201 })
}
