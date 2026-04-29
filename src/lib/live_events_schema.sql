-- Supabase SQL Schema setup for Live Events and Updates

-- 1. Ensure tables exist
CREATE TABLE IF NOT EXISTS public.live_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.live_event_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.live_events(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Add missing columns to live_events (This fixes the 'slug does not exist' error)
ALTER TABLE public.live_events 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS hero_image TEXT,
ADD COLUMN IF NOT EXISTS image_caption TEXT,
ADD COLUMN IF NOT EXISTS header_context TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;

-- 3. Add missing columns to live_event_updates
ALTER TABLE public.live_event_updates 
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS is_first BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;

-- 2. Add 'is_pinned' column to live_event_updates (Bonus functionality)
ALTER TABLE public.live_event_updates 
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 3. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_live_events_slug ON public.live_events(slug);
CREATE INDEX IF NOT EXISTS idx_live_events_status ON public.live_events(status);

CREATE INDEX IF NOT EXISTS idx_live_event_updates_event_id ON public.live_event_updates(event_id);
CREATE INDEX IF NOT EXISTS idx_live_event_updates_created_at ON public.live_event_updates(created_at DESC);

-- 4. Enable Realtime for live_event_updates (CRITICAL FOR REAL-TIME FUNCTIONALITY)
-- This allows the Supabase client to subscribe to changes on this table
alter publication supabase_realtime add table public.live_event_updates;

-- 5. Row Level Security (RLS) Policies
-- 6. Row Level Security (RLS) Policies (Matching your existing setup)
ALTER TABLE public.live_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_event_updates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read live events and updates
CREATE POLICY "Allow public read live_events" 
ON public.live_events FOR SELECT USING (true);

CREATE POLICY "Allow public read live_event_updates" 
ON public.live_event_updates FOR SELECT USING (true);

-- Allow admins (authenticated users) to perform all actions
CREATE POLICY "Allow all actions for authenticated users on live_events" 
ON public.live_events FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all actions for authenticated users on live_event_updates" 
ON public.live_event_updates FOR ALL USING (auth.role() = 'authenticated');

-- Trigger to auto-update 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_live_events_updated_at ON public.live_events;
CREATE TRIGGER update_live_events_updated_at
    BEFORE UPDATE ON public.live_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_live_event_updates_updated_at ON public.live_event_updates;
CREATE TRIGGER update_live_event_updates_updated_at
    BEFORE UPDATE ON public.live_event_updates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
