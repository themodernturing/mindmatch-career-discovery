-- Add profile fields used by the app but missing from the checked-in schema.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
  ADD COLUMN IF NOT EXISTS school_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS goals TEXT;
