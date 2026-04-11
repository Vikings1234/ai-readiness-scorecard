'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { ScorecardSession } from '@/types/scorecard';
import {
  getScoreBandLabel,
  getScoreBandColor,
  getScoreBandSummary,
  getDimensionName,
  getDimensionWeight,
} from '@/lib/scoring';

const DATA_PROFILE_LABELS: Record<string, string> = {
  dental: 'Dental',
  mortgage: 'Mortgage & Lending',
  healthcare_saas: 'Healthcare SaaS',
  fintech: 'Fintech',
  crm: 'CRM',
  erp: 'ERP',
};

const TOTAL_DIMENSIONS = 7;

// ── Score ring component ──

function ScoreRing({ score, color, size = 160 }: { score: number; color: string; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold" style={{ color }}>{Math.round(score)}</span>
        <span className="text-xs text-gray-400 font-medium mt-0.5">out of 100</span>
      </div>
    </div>
  );
}

// ── Dimension bar ──

function DimensionBar({ dim, score, color }: { dim: number; score: number; color: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-48 sm:w-56 flex-shrink-0">
        <p className="text-sm font-medium text-navy truncate">{getDimensionName(dim)}</p>
        <p className="text-xs text-gray-400">{Math.round(getDimensionWeight(dim) * 100)}% weight</p>
      </div>
      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.max(score, 2)}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-12 text-right">{score.toFixed(0)}</span>
    </div>
  );
}

function getBarColor(score: number): string {
  if (score <= 30) return '#C00000';
  if (score <= 60) return '#E8A000';
  if (score <= 80) return '#2E75B6';
  return '#1E6B3C';
}

// ── v2.0 JSON report types ──

interface ReportV2 {
  score: number;
  tier: string;
  tier_label: string;
  tier_rationale: string;
  score_summary: string;
  data_assets: string;
  use_case_opportunity: string | null;
  priority_actions: Array<{ title: string; description: string; timeline: string; effort: string; roi_signal: string }>;
  change_management_note: string | null;
  engagement: {
    recommended_tier: string;
    recommended_tier_label: string;
    score_range: string;
    description: string;
    advancement_blockers: Array<{ label: string; severity: string }>;
  };
  agent_strategy: {
    agent_name: string;
    rationale: string;
    chain: Array<{ step: number; name: string; description: string }>;
    prerequisites: string[];
  } | null;
  roadmap: Array<{ phase: number; label: string; timeline: string; title: string; description: string; milestones: string[] }>;
  summary_stats: { recommended_start: string; timeline_to_pilot: string; first_agent_target: string; primary_blocker: string };
  key_insights: {
    strongest_area: { dimension: string; score: number; insight: string };
    biggest_gap: { dimension: string; score: number; insight: string };
    adoption_risk: { level: string; label: string; insight: string };
    use_case_signal: { status: string; label: string; insight: string };
  };
  vertical_data_insight: string;
}

// ── Effort badge colors ──

function effortBadgeColor(effort: string): { bg: string; text: string } {
  const e = effort.toLowerCase();
  if (e.includes('quick') || e.includes('low')) return { bg: '#DEF7EC', text: '#03543F' };
  if (e.includes('1 month') || e.includes('medium')) return { bg: '#FEF3C7', text: '#92400E' };
  return { bg: '#E0E7FF', text: '#1E3A5F' };
}

function riskColor(level: string): string {
  if (level === 'high') return '#C00000';
  if (level === 'medium') return '#E8A000';
  return '#1E6B3C';
}

// ── v2.0 Report Section ──

function ReportSectionV2({ report }: { report: ReportV2 }) {
  const tiers = [
    { id: 'foundation', label: 'Tier 1 — Foundation', range: '0–40' },
    { id: 'pilot', label: 'Tier 2 — Pilot', range: '40–65' },
    { id: 'full_build', label: 'Tier 3 — Full Build', range: '65–100' },
  ];

  return (
    <div className="space-y-8">
      {/* Key Insights Grid */}
      <div>
        <h3 className="text-base font-bold text-navy mb-3">Key Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Strongest Area</p>
            <p className="text-sm font-bold text-navy">{report.key_insights.strongest_area.dimension}</p>
            <p className="text-xl font-bold mt-1" style={{ color: getBarColor(report.key_insights.strongest_area.score) }}>{report.key_insights.strongest_area.score}/100</p>
            <p className="text-xs text-gray-600 mt-1">{report.key_insights.strongest_area.insight}</p>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Biggest Gap</p>
            <p className="text-sm font-bold text-navy">{report.key_insights.biggest_gap.dimension}</p>
            <p className="text-xl font-bold mt-1" style={{ color: getBarColor(report.key_insights.biggest_gap.score) }}>{report.key_insights.biggest_gap.score}/100</p>
            <p className="text-xs text-gray-600 mt-1">{report.key_insights.biggest_gap.insight}</p>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Adoption Risk</p>
            <p className="text-sm font-bold" style={{ color: riskColor(report.key_insights.adoption_risk.level) }}>{report.key_insights.adoption_risk.label}</p>
            <p className="text-xs text-gray-600 mt-1">{report.key_insights.adoption_risk.insight}</p>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Use Case Signal</p>
            <p className="text-sm font-bold text-navy">{report.key_insights.use_case_signal.label}</p>
            <p className="text-xs text-gray-600 mt-1">{report.key_insights.use_case_signal.insight}</p>
          </div>
        </div>
      </div>

      {/* Vertical Data Insight */}
      {report.vertical_data_insight && (
        <div className="bg-navy/5 border border-navy/10 rounded-xl p-5">
          <h3 className="font-semibold text-navy mb-2">Your Data Assets</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{report.vertical_data_insight}</p>
        </div>
      )}

      {/* Score Summary */}
      <div>
        <h3 className="text-base font-bold text-navy mb-2">What Your Score Means</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{report.score_summary}</p>
      </div>

      {/* Data Assets */}
      <div>
        <h3 className="text-base font-bold text-navy mb-2">Your Data Assets</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{report.data_assets}</p>
      </div>

      {/* Use Case Opportunity */}
      {report.use_case_opportunity && (
        <div>
          <h3 className="text-base font-bold text-navy mb-2">Your AI Use Case Opportunity</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{report.use_case_opportunity}</p>
        </div>
      )}

      {/* Priority Actions */}
      <div>
        <h3 className="text-base font-bold text-navy mb-3">Your 3 Priority Actions</h3>
        <div className="space-y-3">
          {report.priority_actions.map((action, i) => {
            const badge = effortBadgeColor(action.effort);
            return (
              <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-navy text-sm">{i + 1}. {action.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    <p className="text-xs text-gray-500 mt-2 italic">{action.roi_signal}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: badge.bg, color: badge.text }}>
                      {action.timeline}
                    </span>
                    <span className="text-xs text-gray-400">{action.effort}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Change Management Note */}
      {report.change_management_note && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-800 mb-2">Change Management Advisory</h3>
          <p className="text-sm text-red-700 leading-relaxed">{report.change_management_note}</p>
        </div>
      )}

      {/* Engagement Tier Cards */}
      <div>
        <h3 className="text-base font-bold text-navy mb-3">Recommended Engagement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {tiers.map((t) => {
            const isActive = report.engagement.recommended_tier === t.id;
            return (
              <div key={t.id} className={`rounded-xl border-2 p-4 transition-all ${isActive ? 'border-blue bg-blue/5' : 'border-gray-200 opacity-40'}`}>
                <p className="text-sm font-bold text-navy">{t.label}</p>
                <p className="text-xs text-gray-500">{t.range} score</p>
                {isActive && report.engagement.advancement_blockers.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {report.engagement.advancement_blockers.map((b, i) => (
                      <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {b.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{report.engagement.description}</p>
      </div>

      {/* Agent Strategy */}
      {report.agent_strategy && (
        <div>
          <h3 className="text-base font-bold text-navy mb-2">Preliminary Agent Strategy</h3>
          <p className="text-sm text-gray-700 mb-4">{report.agent_strategy.rationale}</p>
          <div className="space-y-3">
            {report.agent_strategy.chain.map((step) => (
              <div key={step.step} className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue">{step.step}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{step.name}</p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Prerequisites</p>
            <div className="flex flex-wrap gap-2">
              {report.agent_strategy.prerequisites.map((p, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{p}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Roadmap */}
      <div>
        <h3 className="text-base font-bold text-navy mb-3">High-Level Project Roadmap</h3>
        <div className="space-y-4">
          {report.roadmap.map((phase) => (
            <div key={phase.phase} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-navy">{phase.title}</p>
                <span className="text-xs text-gray-500 font-medium">{phase.timeline}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
              <div className="flex flex-wrap gap-2">
                {phase.milestones.map((m, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-blue/10 text-blue font-medium">{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Recommended Start', value: report.summary_stats.recommended_start },
          { label: 'Timeline to Pilot', value: report.summary_stats.timeline_to_pilot },
          { label: 'First Agent Target', value: report.summary_stats.first_agent_target },
          { label: 'Primary Blocker', value: report.summary_stats.primary_blocker },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-lg border border-gray-200 p-3 text-center">
            <p className="text-xs text-gray-400 font-semibold uppercase">{stat.label}</p>
            <p className="text-sm font-bold text-navy mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-right">Powered by Claude</p>
    </div>
  );
}

// ── Legacy v1.0 report fallback ──

function ReportSectionV1({ report }: { report: string }) {
  const sections = report.split(/\*\*(?:What Your Score Means|Your Data Assets|Your 3 Priority Actions)\*\*/);
  const scoreMeaning = (sections[1] ?? '').trim();
  const dataAssets = (sections[2] ?? '').trim();
  const actionsRaw = (sections[3] ?? '').trim();

  const actions: Array<{ title: string; description: string; effort: string }> = [];
  const actionRegex = /\d+\.\s*\*\*(.+?)\*\*\s*\n([\s\S]+?)(\[Quick win\]|\[1 month\]|\[3 months\])/g;
  let match: RegExpExecArray | null;
  while ((match = actionRegex.exec(actionsRaw)) !== null) {
    actions.push({ title: match[1].trim(), description: match[2].trim().replace(/\n/g, ' '), effort: match[3].trim() });
  }

  return (
    <div className="space-y-6">
      <div><h3 className="text-base font-bold text-navy mb-2">What Your Score Means</h3><p className="text-sm text-gray-700 leading-relaxed">{scoreMeaning}</p></div>
      <div><h3 className="text-base font-bold text-navy mb-2">Your Data Assets</h3><p className="text-sm text-gray-700 leading-relaxed">{dataAssets}</p></div>
      <div>
        <h3 className="text-base font-bold text-navy mb-3">Your 3 Priority Actions</h3>
        <div className="space-y-3">
          {actions.map((action, i) => (
            <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <p className="font-semibold text-navy text-sm">{i + 1}. {action.title}</p>
              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-400 text-right">Powered by Claude</p>
    </div>
  );
}

function ReportLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-8 bg-gray-100 rounded mt-6" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-8 bg-gray-100 rounded mt-6" />
      <div className="h-20 bg-gray-100 rounded" />
      <div className="h-20 bg-gray-100 rounded" />
      <div className="h-20 bg-gray-100 rounded" />
      <p className="text-sm text-gray-500 text-center pt-2">Analyzing your data assets and generating your personalized report...</p>
    </div>
  );
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<ScorecardSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reportRaw, setReportRaw] = useState<string | null>(null);
  const [reportParsed, setReportParsed] = useState<ReportV2 | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(false);

  const generateReport = useCallback(async (sessionId: string) => {
    setReportLoading(true);
    setReportError(false);
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setReportRaw(data.report);
      if (data.parsed) {
        setReportParsed(data.parsed);
      } else {
        // Try parsing the raw text as JSON
        try {
          const clean = data.report.replace(/```json|```/g, '').trim();
          setReportParsed(JSON.parse(clean));
        } catch {
          // v1.0 report — raw text
        }
      }
    } catch {
      setReportError(true);
    } finally {
      setReportLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch(`/api/get-results/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        const s = data.session as ScorecardSession;
        setSession(s);
        setLoading(false);

        if (s.report_generated && s.claude_report) {
          setReportRaw(s.claude_report);
          try {
            const clean = s.claude_report.replace(/```json|```/g, '').trim();
            setReportParsed(JSON.parse(clean));
          } catch {
            // v1.0 report
          }
        } else {
          generateReport(s.id);
        }
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [params.id, generateReport]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy mx-auto" />
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy">Results Not Found</h1>
          <p className="mt-2 text-gray-600">This assessment may not be complete or the link is invalid.</p>
          <Link href="/" className="mt-6 inline-block px-6 py-3 bg-navy text-white rounded-lg hover:bg-blue transition-colors">Start New Assessment</Link>
        </div>
      </div>
    );
  }

  const overall = session.overall_score ?? 0;
  const band = session.score_band ?? 'foundation';
  const bandColor = getScoreBandColor(band);
  const bandLabel = getScoreBandLabel(band);
  const bandSummary = getScoreBandSummary(band);
  const profileLabel = DATA_PROFILE_LABELS[session.vertical] ?? session.vertical;

  const dimScores = [
    session.dim1_score ?? 0,
    session.dim2_score ?? 0,
    session.dim3_score ?? 0,
    session.dim4_score ?? 0,
    session.dim5_score ?? 0,
    session.dim6_score ?? 0,
    session.dim7_score ?? 0,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold text-navy">AI Readiness Scorecard</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#1F4E79' }}>{profileLabel}</span>
        </div>
      </header>

      {/* Score Hero */}
      <section className="bg-white border-b border-gray-100 px-6 py-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <ScoreRing score={overall} color={bandColor} />
          <h1 className="mt-6 text-2xl sm:text-3xl font-bold" style={{ color: bandColor }}>{bandLabel}</h1>
          <p className="mt-3 text-gray-600 max-w-lg leading-relaxed">{bandSummary}</p>
        </div>
      </section>

      {/* Dimension Breakdown */}
      <section className="px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-navy mb-6">Dimension Breakdown</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            {dimScores.map((score, i) => (
              <DimensionBar key={i} dim={i + 1} score={score} color={getBarColor(score)} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Report */}
      <section className="px-6 pb-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy mb-1">Your Personalized AI Readiness Report</h2>
            <p className="text-sm text-gray-500 mb-6">Generated by Claude based on your responses</p>

            {reportLoading && <ReportLoading />}

            {reportError && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 mb-4">Report generation failed. Please refresh to try again.</p>
                <button onClick={() => generateReport(session.id)} className="px-5 py-2.5 bg-navy text-white text-sm font-medium rounded-lg hover:bg-blue transition-colors">Retry</button>
              </div>
            )}

            {!reportLoading && !reportError && reportParsed && <ReportSectionV2 report={reportParsed} />}
            {!reportLoading && !reportError && !reportParsed && reportRaw && <ReportSectionV1 report={reportRaw} />}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center">
        <Link href="/" className="text-sm text-blue hover:text-navy transition-colors font-medium">&larr; Start a new assessment</Link>
        <p className="mt-2 text-xs text-gray-400">&copy; {new Date().getFullYear()} ProdAgentCo. AI Readiness Scorecard &mdash; SMB &amp; Mid&#8209;Market Edition.</p>
      </footer>
    </div>
  );
}
