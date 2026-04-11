import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServiceSupabase } from '@/lib/supabase';
import { getDimensions } from '@/lib/questions';
import { getScoreBandLabel } from '@/lib/scoring';
import type { Vertical, ScorecardSession } from '@/types/scorecard';

const SYSTEM_PROMPT = `You are an expert AI implementation consultant generating a personalized AI Readiness Report for an executive who has just completed a structured diagnostic assessment. Your job is to synthesize their answers into a report that is specific, honest, commercially credible, and immediately actionable.

This report will be reviewed with the prospect in a live session. It is the basis for a scoped engagement recommendation. Write with authority — you are the expert in the room.

**Tone:** Direct, consultative, specific. No hedging. No generic filler. Every sentence should feel like it could only have been written for this specific organization. If a section would be generic without the data, do not write it.

**Format:** Return a valid JSON object matching the schema defined at the end of this prompt. Every field is required unless marked optional. Do not return markdown. Do not include commentary outside the JSON.

## SCORING RULES

**Dimension weights:**
- data_asset_inventory: 20%
- technical_infrastructure: 18%
- team_ai_literacy: 15%
- process_automation_maturity: 18%
- budget_roi_readiness: 14%
- compliance_security_posture: 10%
- use_case_clarity: 5%

**Tier thresholds:**
- 0–40: Tier 1 — Foundation
- 40–65: Tier 2 — Pilot
- 65–100: Tier 3 — Full Build

**Hard cap rule:** If ai_budget is under_10k, override the recommended tier to Tier 1 — Foundation regardless of total score. Note this override explicitly in the tier_rationale field.

**Adoption risk rule:** If rep_adoption_response is significant_resistance, set adoption_risk to high. If mixed, set to medium. If embrace_quickly, set to low.

## GENERATION RULES

### What your score means
- State the score, tier name, and what the tier means in one sentence.
- Name the strongest dimension and its score.
- Name the weakest dimension and its score.
- Add one sentence on what the weakest dimension is blocking.
- Keep to 3–5 sentences total.

### Your data assets
- Specific to their answers. Reference actual CRM system, data history, activity logging, pipeline tracking.
- If using spreadsheets: lead with data trap framing.
- If using Salesforce/HubSpot: acknowledge strong foundation, focus on data quality gaps.

### Your AI use case opportunity
- Only if use_case_specificity is specific or exploring.
- If specific: map highest_impact_area to an agent name.
- If exploring: recommend a use case prioritization session.

### Your 3 priority actions
- Exactly 3 actions with title, description, timeline, effort, roi_signal.
- If CRM is spreadsheets: Action 1 must be CRM migration.

### Change management note
- Only include if adoption risk is high (significant_resistance).

### Recommended engagement tier
- State tier, score range, description, and advancement blockers.

### Preliminary agent strategy
- Only if use_case_specificity is specific.
- Name the recommended first agent and describe a 3-step agent chain.

### High-level project roadmap
- Exactly 4 phases with title, timeline, description, and 3 milestone chips each.

### Engagement summary stats
- Exactly 4 stats: recommended_start, timeline_to_pilot, first_agent_target, primary_blocker.

## OUTPUT SCHEMA

Return this exact JSON structure. All string fields are plain text — no markdown, no HTML.

{
  "score": number,
  "tier": "foundation" | "pilot" | "full_build",
  "tier_label": "Tier 1 — Foundation" | "Tier 2 — Pilot" | "Tier 3 — Full Build",
  "tier_rationale": "string",
  "score_summary": "string — 3–5 sentences",
  "data_assets": "string — 3–6 sentences",
  "use_case_opportunity": "string or null",
  "priority_actions": [
    { "title": "string", "description": "string", "timeline": "string", "effort": "string", "roi_signal": "string" }
  ],
  "change_management_note": "string or null",
  "engagement": {
    "recommended_tier": "string",
    "recommended_tier_label": "string",
    "score_range": "string",
    "description": "string",
    "advancement_blockers": [{ "label": "string", "severity": "high" | "medium" }]
  },
  "agent_strategy": { "agent_name": "string", "rationale": "string", "chain": [{ "step": number, "name": "string", "description": "string" }], "prerequisites": ["string"] } | null,
  "roadmap": [{ "phase": number, "label": "string", "timeline": "string", "title": "string", "description": "string", "milestones": ["string"] }],
  "summary_stats": { "recommended_start": "string", "timeline_to_pilot": "string", "first_agent_target": "string", "primary_blocker": "string" },
  "key_insights": {
    "strongest_area": { "dimension": "string", "score": number, "insight": "string" },
    "biggest_gap": { "dimension": "string", "score": number, "insight": "string" },
    "adoption_risk": { "level": "string", "label": "string", "insight": "string" },
    "use_case_signal": { "status": "string", "label": "string", "insight": "string" }
  },
  "vertical_data_insight": "string"
}

## QUALITY CHECKS
Before returning the JSON, verify:
- Every string references at least one specific answer from the scorecard input
- priority_actions array has exactly 3 items
- roadmap array has exactly 4 phases
- No markdown formatting, no HTML, no commentary outside the JSON object`;

interface SavedResponse {
  question_id: string;
  question_text: string;
  selected_option: string;
  score: number;
}

function buildAllResponses(session: ScorecardSession, vertical: Vertical): string {
  const dimensions = getDimensions(vertical);
  const rawResponses = session.responses as unknown as Record<string, SavedResponse[]> | null;

  return dimensions
    .map((dim, idx) => {
      const dimKey = `dim${idx + 1}`;
      const dimResponses: SavedResponse[] = rawResponses?.[dimKey] ?? [];
      const qas = dim.questions
        .map((q) => {
          const response = dimResponses.find((r) => r.question_id === q.id);
          return `  Q: ${q.text} → A: ${response?.selected_option ?? '(no answer)'}`;
        })
        .join('\n');
      const dimScore = (session as unknown as Record<string, unknown>)[`dim${idx + 1}_score`] ?? 'N/A';
      return `${dim.name} (score: ${dimScore}/100):\n${qas}`;
    })
    .join('\n\n');
}

function buildUserPrompt(session: ScorecardSession): string {
  const vertical = session.vertical as Vertical;
  const bandLabel = getScoreBandLabel(session.score_band ?? 'foundation');
  const allResponses = buildAllResponses(session, vertical);

  return `Generate the AI Readiness Report for this scorecard:

Vertical: ${vertical}
Overall score: ${session.overall_score}/100 (${bandLabel})

Dimension scores:
- Data Asset Inventory: ${session.dim1_score}/100
- Technical Infrastructure: ${session.dim2_score}/100
- Team AI Literacy: ${session.dim3_score}/100
- Process Automation Maturity: ${session.dim4_score}/100
- Budget & ROI Readiness: ${session.dim5_score}/100
- Compliance & Security Posture: ${session.dim6_score}/100
- Use Case Clarity: ${session.dim7_score ?? 'N/A'}/100

All responses:
${allResponses}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionId = body.session_id;

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    const { data: session, error: fetchError } = await supabase
      .from('scorecard_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        { error: 'Session not found', details: fetchError?.message },
        { status: 404 },
      );
    }

    // If report already generated, return cached version
    if (session.report_generated && session.claude_report) {
      // Try parsing as JSON first (v2.0), fall back to raw text (v1.0)
      try {
        const parsed = JSON.parse(session.claude_report);
        return NextResponse.json({ report: session.claude_report, parsed });
      } catch {
        return NextResponse.json({ report: session.claude_report });
      }
    }

    // Call Claude API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    const userPrompt = buildUserPrompt(session as ScorecardSession);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.4,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const reportText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Clean any accidental markdown fences
    const clean = reportText.replace(/```json|```/g, '').trim();

    // Save report to Supabase
    const { error: updateError } = await supabase
      .from('scorecard_sessions')
      .update({ claude_report: clean, report_generated: true })
      .eq('id', sessionId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
    }

    // Try to parse as JSON for the response
    try {
      const parsed = JSON.parse(clean);
      return NextResponse.json({ report: clean, parsed });
    } catch {
      // If parsing fails, return raw text (backwards compat)
      return NextResponse.json({ report: clean });
    }
  } catch (error) {
    console.error('generate-report error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 },
    );
  }
}
