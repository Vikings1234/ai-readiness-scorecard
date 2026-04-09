import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { calculateOverallScore, getScoreBand } from '@/lib/scoring';

export async function POST(request: NextRequest) {
  try {
    const { session_id, dimension, responses, score } = await request.json();

    if (!session_id || !dimension || dimension < 1 || dimension > 6) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Fetch existing session to merge responses and check dim scores
    const { data: existing } = await supabase
      .from('scorecard_sessions')
      .select('responses, dim1_score, dim2_score, dim3_score, dim4_score, dim5_score, dim6_score')
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

    // If this is dimension 6, mark completed
    if (dimension === 6) {
      update.completed_at = new Date().toISOString();
    }

    // Check if all 6 dim scores are now populated (including the one we're saving)
    const dimScores = {
      dim1: existing?.dim1_score,
      dim2: existing?.dim2_score,
      dim3: existing?.dim3_score,
      dim4: existing?.dim4_score,
      dim5: existing?.dim5_score,
      dim6: existing?.dim6_score,
    };
    // Override the current dimension with the score we're saving
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
      });
      update.overall_score = overall;
      update.score_band = getScoreBand(overall);
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
