import { NextResponse } from 'next/server';

export async function POST() {
  // TODO: Call Claude API to generate AI readiness report
  return NextResponse.json({ report: 'placeholder' });
}
