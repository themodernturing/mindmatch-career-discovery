-- Fix handle_new_user trigger to work with Google OAuth metadata
-- Google OAuth provides 'full_name' not 'first_name', and first_name must not be null

-- Make first_name nullable (we collect it properly in onboarding)
ALTER TABLE public.profiles ALTER COLUMN first_name DROP NOT NULL;

-- Fix the trigger to handle Google OAuth metadata correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
