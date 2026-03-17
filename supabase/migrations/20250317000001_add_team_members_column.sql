-- Add team_members column to teams table
-- Tracks which users are on each team (synced from applications via trigger)

ALTER TABLE teams
  ADD COLUMN team_members JSONB DEFAULT '[]';

COMMENT ON COLUMN teams.team_members IS 'Array of members: [{user_id, email, name}, ...]. Kept in sync with applications via trigger.';

-- Function to refresh team_members for a given team from applications
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
$$ LANGUAGE plpgsql;

-- Trigger function: refresh team_members when applications change
CREATE OR REPLACE FUNCTION applications_team_members_trigger_fn()
RETURNS TRIGGER AS $$
BEGIN
  -- On UPDATE or DELETE: refresh the old team if it had one
  IF TG_OP IN ('UPDATE', 'DELETE') AND OLD.team_id IS NOT NULL THEN
    PERFORM refresh_team_members_for_team(OLD.team_id);
  END IF;

  -- On INSERT or UPDATE: refresh the new team if it has one
  IF TG_OP IN ('INSERT', 'UPDATE') AND NEW.team_id IS NOT NULL THEN
    PERFORM refresh_team_members_for_team(NEW.team_id);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_team_members_trigger
  AFTER INSERT OR UPDATE OF team_id OR DELETE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION applications_team_members_trigger_fn();

-- Backfill team_members for all existing teams
DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN SELECT id FROM teams LOOP
    PERFORM refresh_team_members_for_team(t.id);
  END LOOP;
END;
$$;
