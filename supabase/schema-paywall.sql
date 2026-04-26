-- Paywall & Voucher System — run this in Supabase SQL Editor BEFORE running setup-admins script

-- Add columns to profiles (safe to run multiple times)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_slip_url TEXT,
  ADD COLUMN IF NOT EXISTS voucher_code_used VARCHAR(50),
  ADD COLUMN IF NOT EXISTS amount_paid INTEGER DEFAULT 5000,
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS institution_id UUID;

-- Vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  expiry_date DATE NOT NULL,
  quantity INTEGER NOT NULL,
  quantity_used INTEGER DEFAULT 0,
  discount_amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Institution admins manage vouchers" ON vouchers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'institution')
  );

CREATE POLICY "Public can read vouchers for validation" ON vouchers
  FOR SELECT USING (true);

-- Create a SECURITY DEFINER function to check institution role without triggering RLS
CREATE OR REPLACE FUNCTION public.is_institution_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'institution'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Drop old overlapping profile policies and replace with ones that allow admin access
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Institution admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Institution admins can approve payments" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_institution_admin()
  );

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users or admins can update profile" ON profiles
  FOR UPDATE USING (
    auth.uid() = id OR public.is_institution_admin()
  );

-- Update trigger to include role and payment_status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, role, payment_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    'pending'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
