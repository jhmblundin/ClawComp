-- ClawComp MVP Schema

-- Teams: shareable invite codes, max 3 members
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  creator_email TEXT NOT NULL,
  max_size INTEGER NOT NULL CHECK (max_size IN (2, 3)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate unique 8-char invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  university_email TEXT NOT NULL,
  phone TEXT,
  major TEXT,
  linkedin_url TEXT,
  links JSONB DEFAULT '[]',
  current_project TEXT,
  same_project_as_team BOOLEAN,
  openclaw_ideas JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Viral content (admin-curated)
CREATE TABLE viral_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  embed_url TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News items
CREATE TABLE news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  source TEXT,
  excerpt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Teams: anyone can read (for invite code lookup)
CREATE POLICY "Teams are readable by anyone" ON teams FOR SELECT USING (true);
-- Only authenticated users can insert teams
CREATE POLICY "Authenticated users can create teams" ON teams FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Creators can update their team (e.g. member count)
CREATE POLICY "Creators can update teams" ON teams FOR UPDATE USING (creator_email = auth.jwt() ->> 'email');

-- Applications: users can only read/insert/update their own
CREATE POLICY "Users can read own application" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own application" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own application" ON applications FOR UPDATE USING (auth.uid() = user_id);

-- Viral content and news: public read
CREATE POLICY "Viral content is public" ON viral_content FOR SELECT USING (true);
CREATE POLICY "News items are public" ON news_items FOR SELECT USING (true);

-- Function to get team member count
CREATE OR REPLACE FUNCTION get_team_member_count(team_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM applications WHERE team_id = team_uuid;
$$ LANGUAGE sql STABLE;
