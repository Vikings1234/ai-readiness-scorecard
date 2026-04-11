-- Run this in the Supabase SQL Editor
-- Adds dim7_score column and updates score_band check for v2.0 tiers

ALTER TABLE scorecard_sessions
ADD COLUMN IF NOT EXISTS dim7_score numeric(5,2);

-- Update score_band check to include new tier names
ALTER TABLE scorecard_sessions
DROP CONSTRAINT IF EXISTS scorecard_sessions_score_band_check;

ALTER TABLE scorecard_sessions
ADD CONSTRAINT scorecard_sessions_score_band_check
CHECK (score_band IN (
  'foundation', 'pilot', 'full_build',
  'not_ready', 'developing', 'ready', 'advanced'
));
