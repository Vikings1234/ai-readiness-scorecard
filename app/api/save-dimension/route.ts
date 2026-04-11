import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { calculateOverallScore, getScoreBand } from '@/lib/scoring';

const TOTAL_DIMENSIONS = 7;

export async function POST(request: NextRequest) {
  try {
    const { session_id, dimension, responses, score } = await request.json();

    if (!session_id || !dimension || dimension < 1 || dimension > TOTAL_DIMENSIONS) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Fetch existing session to merge responses and check dim scores
    const { data: existing } = await supabase
      .from('scorecard_sessions')
      .select('responses, dim1_score, dim2_score, dim3_score, dim4_score, dim5_score, dim6_score, dim7_score')
      .eq('id', session_id)
      .single();

    const mergedResponses = {
      ...(existing?.responses as Record<string, unknown> ?? {}),
      [`dim${dimension}`]: responses,
    };

    // Build the update payload
    const update: Record<string, unknown> = {
      [`dim${dimension}_score`]: score,
      responses: mergedResponses,
    };

    // If this is the last dimension, mark completed
    if (dimension === TOTAL_DIMENSIONS) {
      update.completed_at = new Date().toISOString();
    }

    // Check if all dim scores are now populated
    const dimScores = {
      dim1: existing?.dim1_score,
      dim2: existing?.dim2_score,
      dim3: existing?.dim3_score,
      dim4: existing?.dim4_score,
      dim5: existing?.dim5_score,
      dim6: existing?.dim6_score,
      dim7: existing?.dim7_score,
    };
    (dimScores as Record<string, number | null>)[`dim${dimension}`] = score;

    const allPopulated = Object.values(dimScores).every(
      (s) => s !== null && s !== undefined,
    );

    if (allPopulated) {
      const overall = calculateOverallScore({
        dim1: dimScores.dim1!,
        dim2: dimScores.dim2!,
        dim3: dimScores.dim3!,
        dim4: dimScores.dim4!,
        dim5: dimScores.dim5!,
        dim6: dimScores.dim6!,
        dim7: dimScores.dim7!,
      });
      update.overall_score = overall;
      update.score_band = getScoreBand(overall);

      // Budget hard-cap: if budget is under_10k, force Tier 1 Foundation
      const dim5Responses = mergedResponses.dim5 as Array<{ question_id: string; selected_option: string }> | undefined;
      if (dim5Responses) {
        const budgetAnswer = dim5Responses.find(r => r.question_id === 'd5q1');
        if (budgetAnswer?.selected_option === 'Under $10K') {
          update.score_band = 'foundation';
        }
      }
    }

    const { error } = await supabase
      .from('scorecard_sessions')
      .update(update)
      .eq('id', session_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
