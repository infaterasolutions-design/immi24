-- 1. Enable RLS on subscribers if not already enabled
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing potentially overly-permissive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.subscribers;
DROP POLICY IF EXISTS "Public insert subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admin manage subscribers" ON public.subscribers;

-- 3. Create strict Public INSERT ONLY policy
CREATE POLICY "Public insert subscribers" ON public.subscribers
FOR INSERT 
WITH CHECK (true); 
-- Note: 'FOR INSERT' only allows adding rows. Public cannot SELECT, UPDATE, or DELETE.

-- 4. Create Admin FULL ACCESS policy
CREATE POLICY "Admin manage subscribers" ON public.subscribers
FOR ALL 
USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');
