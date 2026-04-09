-- Run this manually in the Supabase SQL Editor
-- Replaces b2c with crm and erp in the vertical check constraint

ALTER TABLE scorecard_sessions
DROP CONSTRAINT IF EXISTS scorecard_sessions_vertical_check;

ALTER TABLE scorecard_sessions
ADD CONSTRAINT scorecard_sessions_vertical_check
CHECK (vertical IN (
  'dental','mortgage','healthcare_saas','fintech','crm','erp'
));
