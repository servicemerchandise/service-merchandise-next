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
    const { title, subtitle, image_url, link_url, cta_text, position, display_order, starts_at, ends_at, active } = body;
    const r = await query(
      `UPDATE banners SET
        title = COALESCE($1, title), subtitle = COALESCE($2, subtitle),
        image_url = COALESCE($3, image_url), link_url = COALESCE($4, link_url),
        cta_text = COALESCE($5, cta_text), position = COALESCE($6, position),
        display_order = COALESCE($7, display_order),
        starts_at = COALESCE($8, starts_at), ends_at = COALESCE($9, ends_at),
        active = COALESCE($10, active), updated_at = NOW()
       WHERE id = $11 RETURNING *`,
      [title, subtitle, image_url, link_url, cta_text, position, display_order, starts_at, ends_at, active, params.id]
    );
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(r.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const r = await query('DELETE FROM banners WHERE id = $1 RETURNING id', [params.id]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}