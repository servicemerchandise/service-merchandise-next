import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAuth, requireAdmin } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authorized) return auth.response;

    const r = await query('SELECT * FROM testimonials ORDER BY display_order ASC');
    return NextResponse.json(r.rows);
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { client_name, company, position, message, rating, avatar_url, active, display_order } = body;
    const r = await query(
      `INSERT INTO testimonials (client_name, company, position, message, rating, avatar_url, active, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [client_name, company, position, message, rating || 5, avatar_url, active !== false, display_order || 0]
    );
    return NextResponse.json(r.rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
