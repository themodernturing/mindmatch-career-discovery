/**
 * One-time admin setup script.
 * Creates both admin accounts and sets their profiles to institution role.
 *
 * Prerequisites:
 *   1. Run supabase/schema-paywall.sql in Supabase dashboard first
 *   2. Add SUPABASE_SERVICE_ROLE_KEY to your .env.local
 *
 * Run with: npx tsx scripts/setup-admins.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mswzohypjoqimmtiqniy.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zd3pvaHlwam9xaW1tdGlxbml5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk0ODAxOCwiZXhwIjoyMDkwNTI0MDE4fQ.nezhBCB7RU71Bwh-4jJ1QoCUBYJjCPHgLL9-aJ5WG6c'

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const ADMINS = [
  {
    email: 'ammarforuck@gmail.com',
    password: 'Ammar@MindMatch25',
    firstName: 'Ammar',
  },
  {
    email: 'thinkfaculty@thinkfaculty.com',
    password: 'Faculty@MindMatch25',
    firstName: 'Think Faculty',
  },
]

async function setupAdmin(email: string, password: string, firstName: string) {
  console.log(`\nSetting up admin: ${email}`)

  // Check if user already exists
  const { data: existingUsers } = await admin.auth.admin.listUsers()
  const existing = existingUsers?.users?.find(u => u.email === email)

  let userId: string

  if (existing) {
    console.log(`  ✓ User already exists (${existing.id}) — updating password`)
    await admin.auth.admin.updateUserById(existing.id, { password })
    userId = existing.id
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName },
    })

    if (error || !data.user) {
      console.error(`  ✗ Failed to create user: ${error?.message}`)
      return false
    }

    userId = data.user.id
    console.log(`  ✓ User created (${userId})`)
  }

  // Upsert profile with institution role
  const { error: profileError } = await admin
    .from('profiles')
    .upsert({
      id: userId,
      email,
      first_name: firstName,
      role: 'institution',
      payment_status: 'approved',
    }, { onConflict: 'id' })

  if (profileError) {
    console.error(`  ✗ Failed to set profile: ${profileError.message}`)
    return false
  }

  console.log(`  ✓ Profile set to institution role`)
  return true
}

async function main() {
  console.log('=== MindMatch Admin Setup ===')

  // Create payment-slips storage bucket
  const { error: bucketError } = await admin.storage.createBucket('payment-slips', {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
  })
  if (bucketError && !bucketError.message.includes('already exists')) {
    console.error('Failed to create storage bucket:', bucketError.message)
  } else {
    console.log('\n✓ Storage bucket "payment-slips" ready')
  }

  let allOk = true
  for (const admin_user of ADMINS) {
    const ok = await setupAdmin(admin_user.email, admin_user.password, admin_user.firstName)
    if (!ok) allOk = false
  }

  console.log('\n=== Setup Complete ===')
  console.log('\nAdmin credentials:')
  console.log('┌─────────────────────────────────────────────────────┐')
  ADMINS.forEach(a => {
    console.log(`│  Email:    ${a.email.padEnd(40)} │`)
    console.log(`│  Password: ${a.password.padEnd(40)} │`)
    console.log('│                                                     │')
  })
  console.log('└─────────────────────────────────────────────────────┘')
  console.log('\nShare these credentials securely (e.g. WhatsApp).')
  console.log('Admins can change their password after first login.')

  if (!allOk) process.exit(1)
}

main()
