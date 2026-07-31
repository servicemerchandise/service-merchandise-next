import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

type Params = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { name, logo_url, description, active } = body;
    const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;
    const r = await query(
      `UPDATE brands SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        logo_url = COALESCE($3, logo_url),
        description = COALESCE($4, description),
        active = COALESCE($5, active),
        updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [name, slug, logo_url, description, active, params.id]
    );
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    return NextResponse.json(r.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const r = await query('DELETE FROM brands WHERE id = $1 RETURNING id', [params.id]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}