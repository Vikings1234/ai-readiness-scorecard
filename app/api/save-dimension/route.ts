import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { session_id, dimension, responses, score } = await request.json();

    if (!session_id || !dimension || dimension < 1 || dimension > 6) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Fetch existing responses to merge
    const { data: existing } = await supabase
      .from('scorecard_sessions')
      .select('responses')
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
