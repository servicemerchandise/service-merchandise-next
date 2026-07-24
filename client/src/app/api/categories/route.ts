import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  try {
    const active = req.nextUrl.searchParams.get('active');
    let where = '';
    if (active === 'true') where = 'WHERE active = TRUE';
    const r = await query(`SELECT * FROM categories ${where} ORDER BY display_order ASC, name ASC`);
    return NextResponse.json(r.rows);
  } catch (e) {
    return NextResponse.json({ error: 'Error al listar categorías' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { name, description, icon, image_url, display_order, active } = body;
    const slug = slugify(name, { lower: true, strict: true });
    const r = await query(
      `INSERT INTO categories (name, slug, description, icon, image_url, display_order, active)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, slug, description, icon, image_url, display_order || 0, active !== false]
    );
    return NextResponse.json(r.rows[0], { status: 201 });
  } catch (e: any) {
    if (e.code === '23505') return NextResponse.json({ error: 'Slug duplicado' }, { status: 400 });
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}
