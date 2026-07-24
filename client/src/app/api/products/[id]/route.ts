import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { query } from '@/lib/server/db';
import { requireAuth, requireAdmin } from '@/lib/server/auth';

const mapRow = (row: any) => ({
  ...row,
  gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery) : row.gallery || [],
  specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : row.specifications || {},
});

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    if (!auth.authorized) return auth.response;

    const r = await query('SELECT * FROM products WHERE id = $1', [params.id]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(mapRow(r.rows[0]));
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const {
      internal_code, name, short_description, full_description,
      category_id, brand_id, main_image, gallery, specifications,
      applications, min_quantity, availability, featured, active,
    } = body;

    const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;
    const galleryLiteral = Array.isArray(gallery)
      ? '{' + gallery.map((s) => '"' + String(s).replace(/"/g, '\\"') + '"').join(',') + '}'
      : gallery;
    const specsJson = typeof specifications === 'string' ? specifications : JSON.stringify(specifications || {});

    const r = await query(
      `UPDATE products SET
        internal_code = COALESCE($1, internal_code),
        name = COALESCE($2, name),
        slug = COALESCE($3, slug),
        short_description = COALESCE($4, short_description),
        full_description = COALESCE($5, full_description),
        category_id = COALESCE($6, category_id),
        brand_id = COALESCE($7, brand_id),
        main_image = COALESCE($8, main_image),
        gallery = COALESCE($9::text[], gallery),
        specifications = COALESCE($10::jsonb, specifications),
        applications = COALESCE($11, applications),
        min_quantity = COALESCE($12, min_quantity),
        availability = COALESCE($13, availability),
        featured = COALESCE($14, featured),
        active = COALESCE($15, active),
        updated_at = NOW()
       WHERE id = $16 RETURNING *`,
      [
        internal_code, name, slug, short_description, full_description,
        category_id, brand_id, main_image, galleryLiteral, specsJson,
        applications, min_quantity, availability, featured, active, params.id,
      ]
    );
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(mapRow(r.rows[0]));
  } catch (e: any) {
    if (e.code === '23505') return NextResponse.json({ error: 'Codigo interno duplicado.' }, { status: 409 });
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const r = await query('DELETE FROM products WHERE id = $1 RETURNING id', [params.id]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
