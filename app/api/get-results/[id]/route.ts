import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Fetch session results from Supabase
  return NextResponse.json({ session: null });
}
