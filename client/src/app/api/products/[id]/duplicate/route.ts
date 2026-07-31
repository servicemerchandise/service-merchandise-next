import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

const mapRow = (row: any) => ({
  ...row,
  gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery) : row.gallery || [],
  specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : row.specifications || {},
});

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const original = await query('SELECT * FROM products WHERE id = $1', [params.id]);
    if (original.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    
    const p = original.rows[0];
    const newCode = `${p.internal_code}-COPY-${Date.now().toString().slice(-5)}`;
    const newSlug = `${p.slug}-copia-${Date.now().toString().slice(-5)}`;
    
    const galleryLiteral = Array.isArray(p.gallery) 
      ? '{' + p.gallery.map((s: string) => '"' + s.replace(/"/g, '\\"') + '"').join(',') + '}'
      : typeof p.gallery === 'string' && p.gallery.startsWith('{') ? p.gallery : '{}';
      
    const specsJson = typeof p.specifications === 'string' ? p.specifications : JSON.stringify(p.specifications || {});

    const r = await query(
      `INSERT INTO products (internal_code, name, slug, short_description, full_description,
         category_id, brand_id, main_image, gallery, specifications, applications,
         min_quantity, availability, featured, active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::text[],$10::jsonb,$11,$12,$13,$14,$15) RETURNING *`,
      [
        newCode, `${p.name} (copia)`, newSlug, p.short_description, p.full_description,
        p.category_id, p.brand_id, p.main_image, galleryLiteral, specsJson, p.applications,
        p.min_quantity, p.availability, false, p.active,
      ]
    );
    return NextResponse.json(mapRow(r.rows[0]), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al duplicar' }, { status: 500 });
  }
}