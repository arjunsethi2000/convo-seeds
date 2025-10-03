-- Create enum for user status
CREATE TYPE public.user_status AS ENUM ('active', 'inactive');

-- Add new columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN status public.user_status DEFAULT 'inactive',
ADD COLUMN invite_count INTEGER DEFAULT 3,
ADD COLUMN first_login_at TIMESTAMP WITH TIME ZONE;

-- Add unique constraint on prompts.date (only one prompt per day)
ALTER TABLE public.prompts
ADD CONSTRAINT prompts_date_unique UNIQUE (date);

-- Add unique constraint on prompt_responses (one response per user per prompt)
ALTER TABLE public.prompt_responses
ADD CONSTRAINT prompt_responses_user_prompt_unique UNIQUE (user_id, prompt_id);

-- Update handle_new_user() trigger to initialize new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, school, photo_url, status, invite_count, first_login_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'school', ''),
    NEW.raw_user_meta_data->>'photo_url',
    'inactive',
    3,
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create function to update user status based on last_prompt_answer_at
CREATE OR REPLACE FUNCTION public.update_user_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- If last_prompt_answer_at is within 7 days, set active, otherwise inactive
  IF NEW.last_prompt_answer_at IS NOT NULL AND 
     NEW.last_prompt_answer_at > NOW() - INTERVAL '7 days' THEN
    NEW.status = 'active';
  ELSE
    NEW.status = 'inactive';
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-update status when last_prompt_answer_at changes
CREATE TRIGGER update_user_status_trigger
  BEFORE UPDATE OF last_prompt_answer_at ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_status();

-- Update RLS policy for profiles to only show active users in feed
-- First drop the existing policy
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

-- Create new policies for different access patterns
-- Policy 1: Users can view their own profile (any status)
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy 2: Active users are viewable by others (for feed)
CREATE POLICY "Active profiles viewable by authenticated users"
ON public.profiles
FOR SELECT
USING (status = 'active' AND auth.uid() != id);

-- Policy 3: Users can view profiles of their matches (any status)
-- This allows viewing inactive users you've already matched with
CREATE POLICY "Matched profiles viewable by match partners"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user1_id FROM public.matches WHERE user2_id = profiles.id
    UNION
    SELECT user2_id FROM public.matches WHERE user1_id = profiles.id
  )
);

-- Add comment to mark fields for future screenshot protection
COMMENT ON COLUMN public.profiles.photo_url IS 'SCREENSHOT_PROTECTED: This field will be protected from screenshots in future implementation';
COMMENT ON COLUMN public.prompt_responses.response_text IS 'SCREENSHOT_PROTECTED: This field will be protected from screenshots in future implementation';