export type Vertical = 'dental' | 'mortgage' | 'healthcare_saas' | 'fintech' | 'crm' | 'erp';

export type ScoreBand = 'not_ready' | 'developing' | 'ready' | 'advanced';

export interface ScorecardSession {
  id: string;
  created_at: string;
  completed_at: string | null;
  vertical: Vertical;
  dim1_score: number | null;
  dim2_score: number | null;
  dim3_score: number | null;
  dim4_score: number | null;
  dim5_score: number | null;
  dim6_score: number | null;
  overall_score: number | null;
  score_band: ScoreBand | null;
  responses: DimensionResponse[] | null;
  claude_report: string | null;
  report_generated: boolean;
}

export interface DimensionResponse {
  question_id: string;
  answer_value: number;
}
