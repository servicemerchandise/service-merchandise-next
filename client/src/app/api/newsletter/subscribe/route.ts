import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    await query(
      `INSERT INTO newsletter_subscribers (email) VALUES ($1)
       ON CONFLICT (email) DO UPDATE SET active = TRUE, unsubscribed_at = NULL`,
      [email]
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error al suscribirse' }, { status: 500 });
  }
}
