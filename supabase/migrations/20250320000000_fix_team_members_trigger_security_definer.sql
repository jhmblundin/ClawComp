-- Fix: refresh_team_members_for_team must bypass RLS so the trigger
-- can update teams.team_members regardless of which user submitted
-- the application. Without SECURITY DEFINER, the UPDATE is silently
-- blocked by the "Creators can update teams" RLS policy when a
-- non-creator joins via invite code.

CREATE OR REPLACE FUNCTION refresh_team_members_for_team(team_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE teams
  SET team_members = COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'user_id', user_id,
          'email', university_email,
          'name', name
        ) ORDER BY created_at
      )
      FROM applications
      WHERE team_id = team_uuid
    ),
    '[]'
  )
  WHERE id = team_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill: re-sync team_members for all teams that have applications
DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN SELECT id FROM teams LOOP
    PERFORM refresh_team_members_for_team(t.id);
  END LOOP;
END;
$$;
