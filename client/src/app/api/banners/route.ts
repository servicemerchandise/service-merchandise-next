import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';

export async function GET() {
  try {
    const r = await query(
      `SELECT * FROM banners
       WHERE active = TRUE
         AND (starts_at IS NULL OR starts_at <= NOW())
         AND (ends_at IS NULL OR ends_at >= NOW())
       ORDER BY position ASC, display_order ASC`
    );
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
    const { title, subtitle, image_url, link_url, cta_text, position, display_order, starts_at, ends_at, active } = body;
    const r = await query(
      `INSERT INTO banners (title, subtitle, image_url, link_url, cta_text, position, display_order, starts_at, ends_at, active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title, subtitle, image_url, link_url, cta_text, position || 'hero', display_order || 0, starts_at, ends_at, active !== false]
    );
    return NextResponse.json(r.rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Error al crear banner' }, { status: 500 });
  }
}
