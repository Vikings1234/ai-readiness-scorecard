import type { ScoreBand } from '@/types/scorecard';

// v2.0 weights — 7 dimensions
const DIMENSION_WEIGHTS = [0.20, 0.18, 0.15, 0.18, 0.14, 0.10, 0.05] as const;

export function calculateOverallScore(dimScores: {
  dim1: number;
  dim2: number;
  dim3: number;
  dim4: number;
  dim5: number;
  dim6: number;
  dim7: number;
}): number {
  const scores = [
    dimScores.dim1,
    dimScores.dim2,
    dimScores.dim3,
    dimScores.dim4,
    dimScores.dim5,
    dimScores.dim6,
    dimScores.dim7,
  ];
  const weighted = scores.reduce(
    (sum, score, i) => sum + score * DIMENSION_WEIGHTS[i],
    0,
  );
  return Math.round(weighted * 10) / 10;
}

// v2.0 tiers: Foundation / Pilot / Full Build
export function getScoreBand(overall: number): ScoreBand {
  if (overall < 40) return 'foundation';
  if (overall < 65) return 'pilot';
  return 'full_build';
}

export function getScoreBandLabel(band: ScoreBand): string {
  const labels: Record<ScoreBand, string> = {
    foundation: 'Tier 1 — Foundation',
    pilot: 'Tier 2 — Pilot',
    full_build: 'Tier 3 — Full Build',
    // Legacy bands (keep for backwards compat with old sessions)
    not_ready: 'Tier 1 — Foundation',
    developing: 'Tier 2 — Pilot',
    ready: 'Tier 3 — Full Build',
    advanced: 'Tier 3 — Full Build',
  };
  return labels[band] ?? band;
}

export function getScoreBandColor(band: ScoreBand): string {
  const colors: Record<ScoreBand, string> = {
    foundation: '#C00000',
    pilot: '#E8A000',
    full_build: '#1E6B3C',
    not_ready: '#C00000',
    developing: '#E8A000',
    ready: '#2E75B6',
    advanced: '#1E6B3C',
  };
  return colors[band] ?? '#999';
}

export function getScoreBandSummary(band: ScoreBand): string {
  const summaries: Record<ScoreBand, string> = {
    foundation:
      'Your business has foundational work to do before AI can deliver real value. A focused data and infrastructure sprint will unlock your first pilot.',
    pilot:
      'You have the foundation in place. A targeted pilot on your highest-impact use case will prove ROI and build internal momentum.',
    full_build:
      'Your organization is well-positioned for a full AI build. You can move directly to scoping and deploying production agents.',
    not_ready: 'Your business has foundational work to do before AI can deliver real value.',
    developing: 'You\u2019re building the right foundation \u2014 a few key investments will unlock significant AI potential.',
    ready: 'Your organization is well-positioned to deploy AI with clear, high-impact priorities.',
    advanced: 'You\u2019re ahead of most businesses in your vertical \u2014 AI can amplify what you\u2019ve already built.',
  };
  return summaries[band] ?? '';
}

export function getDimensionName(dim: number): string {
  const names: Record<number, string> = {
    1: 'Data Asset Inventory',
    2: 'Technical Infrastructure',
    3: 'Team AI Literacy',
    4: 'Process Automation Maturity',
    5: 'Budget & ROI Readiness',
    6: 'Compliance & Security Posture',
    7: 'Use Case Clarity',
  };
  return names[dim] ?? `Dimension ${dim}`;
}

export function getDimensionWeight(dim: number): number {
  return DIMENSION_WEIGHTS[dim - 1] ?? 0;
}
