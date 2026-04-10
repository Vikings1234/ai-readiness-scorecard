import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServiceSupabase } from '@/lib/supabase';
import { getDimensions } from '@/lib/questions';
import { getScoreBandLabel } from '@/lib/scoring';
import type { Vertical, ScorecardSession } from '@/types/scorecard';

const DATA_PROFILE_LABELS: Record<Vertical, string> = {
  dental: 'dental practice',
  mortgage: 'mortgage lending',
  healthcare_saas: 'healthcare SaaS',
  fintech: 'fintech',
  crm: 'CRM-focused sales organization',
  erp: 'ERP-driven operations',
};

const SYSTEM_PROMPT = `You are a senior AI strategy advisor specializing in AI readiness for businesses across dental, mortgage, healthcare SaaS, fintech, CRM, and ERP. You speak directly and concretely. You never give generic advice. Every recommendation you make cites the specific data assets and operational context the business has shared. You write in plain business English — no jargon, no buzzwords, no filler phrases like 'leverage cutting-edge AI' or 'unlock the power of your data.' Format your response in clean sections using the exact structure specified.`;

interface SavedResponse {
  question_id: string;
  question_text: string;
  selected_option: string;
  score: number;
}

function formatDim1Responses(
  session: ScorecardSession,
  vertical: Vertical,
): string {
  const dimensions = getDimensions(vertical);
  const dim1Questions = dimensions[0].questions;

  // responses is stored as { dim1: [...], dim2: [...], ... }
  const rawResponses = session.responses as unknown as Record<string, SavedResponse[]> | null;
  const dim1Responses: SavedResponse[] = rawResponses?.dim1 ?? [];

  return dim1Questions
    .map((q) => {
      const response = dim1Responses.find((r) => r.question_id === q.id);
      if (!response) return `Q: ${q.text} → A: (no answer)`;
      return `Q: ${q.text} → A: ${response.selected_option ?? '(no answer)'}`;
    })
    .join('\n');
}

function buildUserPrompt(session: ScorecardSession): string {
  const vertical = session.vertical as Vertical;
  const profileLabel = DATA_PROFILE_LABELS[vertical];
  const bandLabel = getScoreBandLabel(session.score_band ?? 'not_ready');
  const dim1Responses = formatDim1Responses(session, vertical);

  return `A ${profileLabel} business just completed the AI Readiness Scorecard.

Overall score: ${session.overall_score}/100 (${bandLabel})

Dimension scores:
- Data Asset Inventory: ${session.dim1_score}/100
- Technical Infrastructure: ${session.dim2_score}/100
- Team AI Literacy: ${session.dim3_score}/100
- Process Automation Maturity: ${session.dim4_score}/100
- Budget & ROI Readiness: ${session.dim5_score}/100
- Compliance & Security Posture: ${session.dim6_score}/100

Their Data Asset Inventory responses:
${dim1Responses}

Write a report with exactly three sections. Use these exact bold labels as headers:

**What Your Score Means**
2-3 sentences: interpret their overall score and the pattern across their dimension scores. Be specific — call out their strongest and weakest dimensions by name.

**Your Data Assets**
3-4 sentences specific to what they answered in the Data Asset Inventory. What proprietary data do they hold? What is it worth for AI? What specific AI use cases does it unlock for a ${profileLabel} business? Cite their actual answers — do not write generic copy.

**Your 3 Priority Actions**
Exactly 3 numbered actions, ordered by impact. Each action:
- One bold action title (5 words max)
- One sentence explaining what to do and why
- Effort level in brackets: [Quick win], [1 month], or [3 months]

Keep the full report under 800 words. Do not use any other headers or sections beyond the three specified.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionId = body.session_id;

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }

    console.log('Fetching session:', sessionId);
    console.log('SUPABASE_URL defined:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SERVICE_ROLE_KEY defined:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    const supabase = getServiceSupabase();

    // Fetch session
    const { data: session, error: fetchError } = await supabase
      .from('scorecard_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      console.error('Session fetch error:', fetchError?.message, fetchError?.code, fetchError?.details);
      return NextResponse.json(
        { error: 'Session not found', details: fetchError?.message },
        { status: 404 },
      );
    }

    console.log('Session found:', session.vertical, 'score:', session.overall_score);

    // If report already generated, return cached version
    if (session.report_generated && session.claude_report) {
      console.log('Returning cached report');
      return NextResponse.json({ report: session.claude_report });
    }

    // Call Claude API
    console.log('Calling Claude API...');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    const userPrompt = buildUserPrompt(session as ScorecardSession);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.4,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    console.log('Claude response received');

    const reportText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Save report to Supabase
    console.log('Saving report to Supabase...');
    const { error: updateError } = await supabase
      .from('scorecard_sessions')
      .update({ claude_report: reportText, report_generated: true })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
    }

    console.log('Report saved successfully');
    return NextResponse.json({ report: reportText });
  } catch (error) {
    console.error('generate-report error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 },
    );
  }
}
