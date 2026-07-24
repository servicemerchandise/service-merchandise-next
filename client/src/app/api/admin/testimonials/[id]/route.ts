import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';

type Params = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { client_name, company, position, message, rating, avatar_url, active, display_order } = body;
    const r = await query(
      `UPDATE testimonials SET
         client_name = COALESCE($1, client_name), company = COALESCE($2, company),
         position = COALESCE($3, position), message = COALESCE($4, message),
         rating = COALESCE($5, rating), avatar_url = COALESCE($6, avatar_url),
         active = COALESCE($7, active), display_order = COALESCE($8, display_order)
       WHERE id = $9 RETURNING *`,
      [client_name, company, position, message, rating, avatar_url, active, display_order, params.id]
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

    const r = await query('DELETE FROM testimonials WHERE id = $1 RETURNING id', [params.id]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
