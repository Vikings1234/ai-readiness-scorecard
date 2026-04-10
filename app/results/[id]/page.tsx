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

function getDataAssetCallout(vertical: string, dim1Score: number): string | null {
  const callouts: Record<string, { high: string; low: string }> = {
    dental: {
      high: 'Your patient records, imaging archives, and claim histories are a proprietary intelligence layer. Every year of digital records makes AI-powered treatment planning and practice optimization more powerful.',
      low: 'Your dental practice has strong AI potential — the priority is digitizing and organizing patient records so the intelligence layer has complete context.',
    },
    mortgage: {
      high: 'Your loan origination data, underwriting logs, and pipeline history represent years of proprietary lending intelligence. This data is among the richest sources for AI-powered risk assessment and process optimization.',
      low: 'Your lending data has significant AI potential once loan documents are digitized and underwriting logs are systematically captured.',
    },
    healthcare_saas: {
      high: 'Your EHR data, prior authorization histories, and outcome records form a proprietary clinical intelligence layer that competitors can\'t replicate.',
      low: 'Your healthcare data has strong AI potential — the priority is structuring prior auth histories and outcome data for machine-readable access.',
    },
    fintech: {
      high: 'Your transaction histories, KYC records, and behavioral data represent a proprietary intelligence layer for AI-powered fraud detection, personalization, and risk modeling.',
      low: 'Your fintech data has significant AI potential once KYC records are structured and behavioral signals are systematically captured.',
    },
    crm: {
      high: 'Your pipeline data, deal histories, activity logs, and contact records are a proprietary intelligence layer your competitors can\'t replicate. Every interaction logged is a data point that makes AI reasoning more accurate.',
      low: 'Your CRM has strong AI potential — the priority is ensuring activity data is consistently logged so the intelligence layer has complete context.',
    },
    erp: {
      high: 'Your financial records, operational data, and supply chain histories represent years of proprietary business intelligence. ERP data is among the richest sources for AI-powered forecasting and anomaly detection.',
      low: 'Your ERP data has significant AI potential once it\'s accessible via API and integrated with your analytics layer.',
    },
  };
  const entry = callouts[vertical];
  if (!entry) return null;
  return dim1Score >= 60 ? entry.high : entry.low;
}

function ScoreRing({
  score,
  color,
  size = 160,
}: {
  score: number;
  color: string;
  size?: number;
}) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold" style={{ color }}>
          {Math.round(score)}
        </span>
        <span className="text-xs text-gray-400 font-medium mt-0.5">out of 100</span>
      </div>
    </div>
  );
}

function DimensionBar({
  dim,
  score,
  color,
}: {
  dim: number;
  score: number;
  color: string;
}) {
  const name = getDimensionName(dim);
  const weight = getDimensionWeight(dim);

  return (
    <div className="flex items-center gap-4">
      <div className="w-48 sm:w-56 flex-shrink-0">
        <p className="text-sm font-medium text-navy truncate">{name}</p>
        <p className="text-xs text-gray-400">{Math.round(weight * 100)}% weight</p>
      </div>
      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.max(score, 2)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-12 text-right">
        {score.toFixed(0)}
      </span>
    </div>
  );
}

function getBarColor(score: number): string {
  if (score <= 30) return '#C00000';
  if (score <= 60) return '#E8A000';
  if (score <= 80) return '#2E75B6';
  return '#1E6B3C';
}

// ---------- Report parsing & rendering ----------

interface ParsedAction {
  title: string;
  description: string;
  effort: string;
}

function parseReport(report: string): {
  scoreMeaning: string;
  dataAssets: string;
  actions: ParsedAction[];
} {
  const sections = report.split(/\*\*(?:What Your Score Means|Your Data Assets|Your 3 Priority Actions)\*\*/);

  const scoreMeaning = (sections[1] ?? '').trim();
  const dataAssets = (sections[2] ?? '').trim();
  const actionsRaw = (sections[3] ?? '').trim();

  const actions: ParsedAction[] = [];
  const actionRegex = /\d+\.\s*\*\*(.+?)\*\*\s*\n([\s\S]+?)(\[Quick win\]|\[1 month\]|\[3 months\])/g;
  let match: RegExpExecArray | null;
  while ((match = actionRegex.exec(actionsRaw)) !== null) {
    actions.push({
      title: match[1].trim(),
      description: match[2].trim().replace(/\n/g, ' '),
      effort: match[3].trim(),
    });
  }

  return { scoreMeaning, dataAssets, actions };
}

function effortBadgeColor(effort: string): { bg: string; text: string } {
  if (effort === '[Quick win]') return { bg: '#DEF7EC', text: '#03543F' };
  if (effort === '[1 month]') return { bg: '#FEF3C7', text: '#92400E' };
  return { bg: '#E0E7FF', text: '#1E3A5F' }; // [3 months] — navy
}

function ReportSection({ report }: { report: string }) {
  const { scoreMeaning, dataAssets, actions } = parseReport(report);

  return (
    <div className="space-y-6">
      {/* What Your Score Means */}
      <div>
        <h3 className="text-base font-bold text-navy mb-2">What Your Score Means</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{scoreMeaning}</p>
      </div>

      {/* Your Data Assets */}
      <div>
        <h3 className="text-base font-bold text-navy mb-2">Your Data Assets</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{dataAssets}</p>
      </div>

      {/* Priority Actions */}
      <div>
        <h3 className="text-base font-bold text-navy mb-3">Your 3 Priority Actions</h3>
        <div className="space-y-3">
          {actions.map((action, i) => {
            const badge = effortBadgeColor(action.effort);
            return (
              <div
                key={i}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-navy text-sm">
                      {i + 1}. {action.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                  <span
                    className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                    style={{ backgroundColor: badge.bg, color: badge.text }}
                  >
                    {action.effort.replace(/[[\]]/g, '')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attribution */}
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
      <p className="text-sm text-gray-500 text-center pt-2">
        Analyzing your data assets and generating your personalized report...
      </p>
    </div>
  );
}

export default function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const [session, setSession] = useState<ScorecardSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [report, setReport] = useState<string | null>(null);
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
      setReport(data.report);
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

        // If report already exists, use it; otherwise trigger generation
        if (s.report_generated && s.claude_report) {
          setReport(s.claude_report);
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
          <p className="mt-2 text-gray-600">
            This assessment may not be complete or the link is invalid.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-3 bg-navy text-white rounded-lg hover:bg-blue transition-colors"
          >
            Start New Assessment
          </Link>
        </div>
      </div>
    );
  }

  const overall = session.overall_score ?? 0;
  const band = session.score_band ?? 'not_ready';
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
  ];

  // Find strongest and weakest dimensions
  const maxDim = dimScores.indexOf(Math.max(...dimScores)) + 1;
  const minDim = dimScores.indexOf(Math.min(...dimScores)) + 1;
  const dataAssetCallout = getDataAssetCallout(session.vertical, dimScores[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold text-navy">AI Readiness Scorecard</span>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: '#1F4E79' }}
          >
            {profileLabel}
          </span>
        </div>
      </header>

      {/* Score Hero */}
      <section className="bg-white border-b border-gray-100 px-6 py-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <ScoreRing score={overall} color={bandColor} />
          <h1
            className="mt-6 text-2xl sm:text-3xl font-bold"
            style={{ color: bandColor }}
          >
            {bandLabel}
          </h1>
          <p className="mt-3 text-gray-600 max-w-lg leading-relaxed">
            {bandSummary}
          </p>
        </div>
      </section>

      {/* Dimension Breakdown */}
      <section className="px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-navy mb-6">
            Dimension Breakdown
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            {dimScores.map((score, i) => (
              <DimensionBar
                key={i}
                dim={i + 1}
                score={score}
                color={getBarColor(score)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Key Insights */}
      <section className="px-6 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-navy mb-6">Key Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">&#9650;</span>
                <h3 className="font-semibold text-navy">Strongest Area</h3>
              </div>
              <p className="text-sm text-gray-700 font-medium">
                {getDimensionName(maxDim)}
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: getBarColor(dimScores[maxDim - 1]) }}>
                {dimScores[maxDim - 1].toFixed(0)} / 100
              </p>
              <p className="text-xs text-gray-500 mt-2">
                This is where your organization is most prepared for AI adoption.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">&#9660;</span>
                <h3 className="font-semibold text-navy">Biggest Opportunity</h3>
              </div>
              <p className="text-sm text-gray-700 font-medium">
                {getDimensionName(minDim)}
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: getBarColor(dimScores[minDim - 1]) }}>
                {dimScores[minDim - 1].toFixed(0)} / 100
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Improving this dimension will have the highest impact on your AI readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Asset Callout */}
      {dataAssetCallout && (
        <section className="px-6 pb-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-navy/5 border border-navy/10 rounded-xl p-6">
              <h3 className="font-semibold text-navy mb-2">
                Your {profileLabel} Data Assets
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {dataAssetCallout}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* AI Report */}
      <section className="px-6 pb-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy mb-1">
              Your Personalized AI Readiness Report
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Generated by Claude based on your responses
            </p>

            {reportLoading && <ReportLoading />}

            {reportError && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 mb-4">
                  Report generation failed. Please refresh to try again.
                </p>
                <button
                  onClick={() => generateReport(session.id)}
                  className="px-5 py-2.5 bg-navy text-white text-sm font-medium rounded-lg hover:bg-blue transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {report && !reportLoading && <ReportSection report={report} />}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center">
        <Link
          href="/"
          className="text-sm text-blue hover:text-navy transition-colors font-medium"
        >
          &larr; Start a new assessment
        </Link>
        <p className="mt-2 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ProdAgentCo. AI Readiness Scorecard &mdash; SMB &amp; Mid&#8209;Market Edition.
        </p>
      </footer>
    </div>
  );
}
