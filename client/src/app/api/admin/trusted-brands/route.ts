import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAuth, requireAdmin } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authorized) return auth.response;

    const r = await query('SELECT * FROM trusted_brands ORDER BY display_order ASC');
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
    const { name, logo_url, website_url, display_order, active } = body;
    const r = await query(
      `INSERT INTO trusted_brands (name, logo_url, website_url, display_order, active)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, logo_url, website_url, display_order || 0, active !== false]
    );
    return NextResponse.json(r.rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
