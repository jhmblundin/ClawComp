-- Preserve applications when auth user is deleted
-- Previously: ON DELETE CASCADE would delete the application if the user was removed from auth.users
-- Now: ON DELETE SET NULL keeps the application; user_id becomes NULL but all applicant data remains

-- Drop the existing foreign key (default name from initial schema)
ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_user_id_fkey;

-- Allow user_id to be NULL (required for ON DELETE SET NULL)
ALTER TABLE applications
  ALTER COLUMN user_id DROP NOT NULL;

-- Re-add foreign key with SET NULL so applications survive user deletion
ALTER TABLE applications
  ADD CONSTRAINT applications_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
