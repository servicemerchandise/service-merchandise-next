import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const r = await query('SELECT * FROM brands WHERE active = TRUE ORDER BY name ASC');
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
    const { name, logo_url, description, active } = body;
    const slug = slugify(name, { lower: true, strict: true });
    const r = await query(
      `INSERT INTO brands (name, slug, logo_url, description, active)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, slug, logo_url, description, active !== false]
    );
    return NextResponse.json(r.rows[0], { status: 201 });
  } catch (e: any) {
    if (e.code === '23505') return NextResponse.json({ error: 'Slug duplicado' }, { status: 400 });
    return NextResponse.json({ error: 'Error al crear marca' }, { status: 500 });
  }
}