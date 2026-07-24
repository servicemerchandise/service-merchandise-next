import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const r = await query('SELECT * FROM categories WHERE id = $1', [params.id]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    return NextResponse.json(r.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { name, description, icon, image_url, display_order, active } = body;
    const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;
    const r = await query(
      `UPDATE categories SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        icon = COALESCE($4, icon),
        image_url = COALESCE($5, image_url),
        display_order = COALESCE($6, display_order),
        active = COALESCE($7, active),
        updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [name, slug, description, icon, image_url, display_order, active, params.id]
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

    const r = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [params.id]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
