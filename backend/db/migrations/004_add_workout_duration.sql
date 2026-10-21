-- The API writes workouts.duration_seconds, but no earlier file created it.
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;
