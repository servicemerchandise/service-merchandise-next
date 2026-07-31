import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

type Params = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { name, logo_url, website_url, display_order, active } = body;
    const r = await query(
      `UPDATE trusted_brands SET
         name = COALESCE($1, name), logo_url = COALESCE($2, logo_url),
         website_url = COALESCE($3, website_url),
         display_order = COALESCE($4, display_order),
         active = COALESCE($5, active)
       WHERE id = $6 RETURNING *`,
      [name, logo_url, website_url, display_order, active, params.id]
    );
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(r.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const r = await query('DELETE FROM trusted_brands WHERE id = $1 RETURNING id', [params.id]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}