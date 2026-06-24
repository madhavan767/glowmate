
-- PROFILES
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT DEFAULT 'Delhi',
  wedding_date DATE,
  skin_tone TEXT,
  preferences TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- BOOKINGS
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  artist_id TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  artist_image TEXT,
  service TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  notes TEXT,
  price INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookings" ON public.bookings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- WISHLIST
CREATE TABLE public.wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  artist_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, artist_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlist TO authenticated;
GRANT ALL ON public.wishlist TO service_role;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SAVED PACKAGES
CREATE TABLE public.saved_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  members JSONB NOT NULL DEFAULT '[]'::jsonb,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  price INTEGER NOT NULL DEFAULT 0,
  savings INTEGER NOT NULL DEFAULT 0,
  timeline TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_packages TO authenticated;
GRANT ALL ON public.saved_packages TO service_role;
ALTER TABLE public.saved_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own packages" ON public.saved_packages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TIMELINES
CREATE TABLE public.timelines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Wedding Prep Plan',
  wedding_date DATE NOT NULL,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.timelines TO authenticated;
GRANT ALL ON public.timelines TO service_role;
ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own timelines" ON public.timelines FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ADVISOR CHAT
CREATE TABLE public.advisor_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.advisor_messages TO authenticated;
GRANT ALL ON public.advisor_messages TO service_role;
ALTER TABLE public.advisor_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own messages" ON public.advisor_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_timelines_updated BEFORE UPDATE ON public.timelines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
