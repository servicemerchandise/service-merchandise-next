import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const rows = body.rows;
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Sin filas para importar' }, { status: 400 });
    }

    const created: any[] = [];
    for (const row of rows) {
      let categoryId: string | null = null;
      if (row.category) {
        const slug = slugify(String(row.category), { lower: true, strict: true });
        const existing = await query('SELECT id FROM categories WHERE slug = $1', [slug]);
        if (existing.rows[0]) categoryId = existing.rows[0].id;
        else {
          const ins = await query('INSERT INTO categories (name, slug) VALUES ($1,$2) RETURNING id', [row.category, slug]);
          categoryId = ins.rows[0].id;
        }
      }

      let brandId: string | null = null;
      if (row.brand) {
        const slug = slugify(String(row.brand), { lower: true, strict: true });
        const existing = await query('SELECT id FROM brands WHERE slug = $1', [slug]);
        if (existing.rows[0]) brandId = existing.rows[0].id;
        else {
          const ins = await query('INSERT INTO brands (name, slug) VALUES ($1,$2) RETURNING id', [row.brand, slug]);
          brandId = ins.rows[0].id;
        }
      }

      const slug = slugify(String(row.name), { lower: true, strict: true }) + '-' + Date.now().toString().slice(-5);
      const gallery = typeof row.gallery === 'string'
        ? row.gallery.split('|').map((s: string) => s.trim()).filter(Boolean)
        : Array.isArray(row.gallery) ? row.gallery : [];

      let specifications: any = {};
      if (typeof row.specifications === 'string') {
        try { specifications = JSON.parse(row.specifications); } catch { specifications = {}; }
      } else if (typeof row.specifications === 'object') {
        specifications = row.specifications;
      }

      const galleryLiteral = '{' + gallery.map((s: string) => '"' + String(s).replace(/"/g, '\\"') + '"').join(',') + '}';
      const specsJson = JSON.stringify(specifications);

      const r = await query(
        `INSERT INTO products (internal_code, name, slug, short_description, full_description,
           category_id, brand_id, main_image, gallery, specifications, applications, min_quantity)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::text[],$10::jsonb,$11,$12) RETURNING *`,
        [
          row.internal_code || `IMP-${Date.now()}`,
          row.name,
          slug,
          row.short_description,
          row.full_description,
          categoryId,
          brandId,
          row.main_image || '',
          galleryLiteral,
          specsJson,
          row.applications,
          Number(row.min_quantity) || 1,
        ]
      );
      created.push(r.rows[0]);
    }
    return NextResponse.json({ imported: created.length, products: created }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error en la importación' }, { status: 500 });
  }
}