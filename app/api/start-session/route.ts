import { NextResponse } from 'next/server';

export async function POST() {
  // TODO: Create a new scorecard_session in Supabase
  return NextResponse.json({ session_id: 'placeholder' });
}
