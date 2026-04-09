CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE scorecard_sessions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz DEFAULT now(),
  completed_at      timestamptz,
  vertical          text NOT NULL CHECK (vertical IN
                    ('dental','mortgage','healthcare_saas','fintech','b2c')),
  dim1_score        numeric(5,2),
  dim2_score        numeric(5,2),
  dim3_score        numeric(5,2),
  dim4_score        numeric(5,2),
  dim5_score        numeric(5,2),
  dim6_score        numeric(5,2),
  overall_score     numeric(5,2),
  score_band        text CHECK (score_band IN
                    ('not_ready','developing','ready','advanced')),
  responses         jsonb,
  claude_report     text,
  report_generated  boolean DEFAULT false
);
