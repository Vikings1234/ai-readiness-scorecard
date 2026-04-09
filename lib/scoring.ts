import type { ScoreBand } from '@/types/scorecard';

const DIMENSION_WEIGHTS = [0.25, 0.20, 0.15, 0.20, 0.10, 0.10] as const;

export function calculateOverallScore(dimScores: {
  dim1: number;
  dim2: number;
  dim3: number;
  dim4: number;
  dim5: number;
  dim6: number;
}): number {
  const scores = [
    dimScores.dim1,
    dimScores.dim2,
    dimScores.dim3,
    dimScores.dim4,
    dimScores.dim5,
    dimScores.dim6,
  ];
  const weighted = scores.reduce(
    (sum, score, i) => sum + score * DIMENSION_WEIGHTS[i],
    0,
  );
  return Math.round(weighted * 10) / 10;
}

export function getScoreBand(overall: number): ScoreBand {
  if (overall <= 30) return 'not_ready';
  if (overall <= 60) return 'developing';
  if (overall <= 80) return 'ready';
  return 'advanced';
}

export function getScoreBandLabel(band: ScoreBand): string {
  const labels: Record<ScoreBand, string> = {
    not_ready: 'Significant groundwork needed',
    developing: 'Building the foundation',
    ready: 'AI-ready with clear priorities',
    advanced: 'Ahead of the market',
  };
  return labels[band];
}

export function getScoreBandColor(band: ScoreBand): string {
  const colors: Record<ScoreBand, string> = {
    not_ready: '#C00000',
    developing: '#E8A000',
    ready: '#2E75B6',
    advanced: '#1E6B3C',
  };
  return colors[band];
}

export function getScoreBandSummary(band: ScoreBand): string {
  const summaries: Record<ScoreBand, string> = {
    not_ready:
      'Your business has foundational work to do before AI can deliver real value.',
    developing:
      'You\u2019re building the right foundation \u2014 a few key investments will unlock significant AI potential.',
    ready:
      'Your organization is well-positioned to deploy AI with clear, high-impact priorities.',
    advanced:
      'You\u2019re ahead of most businesses in your vertical \u2014 AI can amplify what you\u2019ve already built.',
  };
  return summaries[band];
}

export function getDimensionName(dim: number): string {
  const names: Record<number, string> = {
    1: 'Data Asset Inventory',
    2: 'Technical Infrastructure',
    3: 'Team AI Literacy',
    4: 'Process Automation Maturity',
    5: 'Budget & ROI Readiness',
    6: 'Compliance & Security Posture',
  };
  return names[dim] ?? `Dimension ${dim}`;
}

export function getDimensionWeight(dim: number): number {
  return DIMENSION_WEIGHTS[dim - 1] ?? 0;
}
