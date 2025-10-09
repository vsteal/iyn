import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();
    // Minimal server-side insert using service key is not available here.
    // We'll do a client-side insert tied to the user to respect RLS.
    // This route just returns 200 to simulate a trigger.
    return NextResponse.json({ ok: true, action });
  } catch (e: any) {
    return new NextResponse(String(e?.message || 'Bad request'), { status: 400 });
  }
}