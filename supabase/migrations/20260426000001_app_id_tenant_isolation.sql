-- Multi-tenant isolation: add app_id to profiles and vouchers
-- Run this in Supabase SQL Editor

-- 1. Add app_id columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS app_id VARCHAR(20) NOT NULL DEFAULT 'careerlens';

ALTER TABLE public.vouchers
  ADD COLUMN IF NOT EXISTS app_id VARCHAR(20) NOT NULL DEFAULT 'careerlens';

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_app_id ON public.profiles(app_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_app_id ON public.vouchers(app_id);

-- 3. Update handle_new_user trigger to carry app_id from user metadata
--    (email registrations pass app_id via user_metadata; OAuth fallback is 'careerlens',
--     corrected at runtime by the OAuth callback route)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, role, payment_status, app_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    'pending',
    COALESCE(NEW.raw_user_meta_data->>'app_id', 'careerlens')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Replace profile RLS policies — institution admins scoped to their own app
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users or admins can update profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (
    auth.uid() = id
    OR (
      public.is_institution_admin()
      AND app_id = (SELECT app_id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users or admins can update profile" ON profiles
  FOR UPDATE USING (
    auth.uid() = id
    OR (
      public.is_institution_admin()
      AND app_id = (SELECT app_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- 5. Replace voucher RLS policies — institution admins scoped to their own app
DROP POLICY IF EXISTS "Institution admins manage vouchers" ON vouchers;
DROP POLICY IF EXISTS "Public can read vouchers for validation" ON vouchers;

CREATE POLICY "Institution admins manage vouchers" ON vouchers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'institution'
        AND profiles.app_id = vouchers.app_id
    )
  );

-- Voucher reads for validation go through the admin client in API routes (bypasses RLS).
-- This policy covers any direct anon-key reads, scoped to the user's own app.
CREATE POLICY "Users can read their app vouchers" ON vouchers
  FOR SELECT USING (
    vouchers.app_id = (SELECT app_id FROM public.profiles WHERE id = auth.uid())
  );
