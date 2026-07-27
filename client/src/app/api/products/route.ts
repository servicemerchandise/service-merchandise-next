import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';

const mapRow = (row: any) => ({
  ...row,
  gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery) : row.gallery || [],
  specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : row.specifications || {},
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_AVAILABILITY = ['disponible', 'bajo_pedido', 'agotado'];

const isUuid = (v: any) => typeof v === 'string' && UUID_RE.test(v);
const asString = (v: any, fallback: string | null = null) =>
  typeof v === 'string' ? v.trim() || fallback : fallback;
const asInt = (v: any, fallback: number) => {
  if (v === null || v === undefined || v === '') return fallback;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && Number.isInteger(n) && n >= 0 ? n : NaN;
};
const asBool = (v: any, fallback: boolean) => typeof v === 'boolean' ? v : fallback;

function uniqueSlug(name: string): string {
  const base = slugify(asString(name, 'producto') || 'producto', { lower: true, strict: true }) || 'producto';
  return base + '-' + Date.now().toString().slice(-9) + '-' + Math.floor(Math.random() * 1000).toString(36);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') || '24';
    const offset = searchParams.get('offset') || '0';

    const params: any[] = [];
    const conds: string[] = ['p.active = TRUE'];

    if (search) {
      params.push(`%${String(search).toLowerCase()}%`);
      conds.push(`(LOWER(p.name) LIKE $${params.length} OR LOWER(p.short_description) LIKE $${params.length} OR LOWER(p.internal_code) LIKE $${params.length})`);
    }
    if (category) {
      params.push(category);
      conds.push(`p.category_id = $${params.length}`);
    }
    if (brand) {
      params.push(brand);
      conds.push(`p.brand_id = $${params.length}`);
    }
    if (featured === 'true') conds.push('p.featured = TRUE');

    params.push(Number(limit));
    const limitIdx = params.length;
    params.push(Number(offset));
    const offsetIdx = params.length;

    const sql = `
      SELECT p.*, c.name AS category_name, b.name AS brand_name, b.logo_url AS brand_logo
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE ${conds.join(' AND ')}
      ORDER BY p.created_at DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;
    console.log("========== PRODUCTS ==========");
    console.log(sql);
    console.log("PARAMS:", params);

    const r = await query(sql, params);

    console.log("ROWS:", r.rows.length);
    console.log(r.rows);

    return NextResponse.json(r.rows.map(mapRow));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al listar productos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();

    const internal_code = asString(body.internal_code);
    const name = asString(body.name);

    if (!internal_code) return NextResponse.json({ error: 'El campo "internal_code" es obligatorio.' }, { status: 400 });
    if (!name) return NextResponse.json({ error: 'El campo "name" es obligatorio.' }, { status: 400 });

    const short_description = asString(body.short_description, '') ?? '';
    const full_description = asString(body.full_description, '') ?? '';

    let category_id: string | null = null;
    if (body.category_id) {
      if (!isUuid(body.category_id)) return NextResponse.json({ error: 'category_id debe ser un UUID valido.' }, { status: 400 });
      category_id = body.category_id;
    }

    let brand_id: string | null = null;
    if (body.brand_id) {
      if (!isUuid(body.brand_id)) return NextResponse.json({ error: 'brand_id debe ser un UUID valido.' }, { status: 400 });
      brand_id = body.brand_id;
    }

    const main_image = asString(body.main_image, '') ?? '';

    let gallery: string[] = [];
    if (Array.isArray(body.gallery)) {
      gallery = body.gallery.filter((s: any) => typeof s === 'string' && s.trim() !== '');
    } else if (typeof body.gallery === 'string' && body.gallery.trim() !== '') {
      try {
        const parsed = JSON.parse(body.gallery);
        if (Array.isArray(parsed)) gallery = parsed.filter((s: any) => typeof s === 'string' && s.trim() !== '');
      } catch {
        gallery = body.gallery.split('|').map((s: string) => s.trim()).filter(Boolean);
      }
    }

    let specifications: any = {};
    if (typeof body.specifications === 'object' && body.specifications !== null) specifications = body.specifications;
    else if (typeof body.specifications === 'string' && body.specifications.trim() !== '') {
      try { specifications = JSON.parse(body.specifications); } catch { specifications = {}; }
    }

    const applications = asString(body.applications, '') ?? '';
    const minQty = asInt(body.min_quantity, 1);
    if (Number.isNaN(minQty)) return NextResponse.json({ error: 'min_quantity debe ser un entero positivo.' }, { status: 400 });

    const availability = VALID_AVAILABILITY.includes(body.availability) ? body.availability : 'disponible';
    const featured = asBool(body.featured, false);
    const active = body.active === undefined ? true : asBool(body.active, true);

    const slug = uniqueSlug(name);
    const galleryLiteral = '{' + gallery.map((s) => '"' + String(s).replace(/"/g, '\\"') + '"').join(',') + '}';
    const specsJson = JSON.stringify(specifications);


    const r = await query(
      `INSERT INTO products (internal_code, name, slug, short_description, full_description,
         category_id, brand_id, main_image, gallery, specifications, applications,
         min_quantity, availability, featured, active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::text[],$10::jsonb,$11,$12,$13,$14,$15) RETURNING *`,
      [internal_code, name, slug, short_description, full_description, category_id, brand_id, main_image, galleryLiteral, specsJson, applications, minQty, availability, featured, active]
    );



    return NextResponse.json(mapRow(r.rows[0]), { status: 201 });
  } catch (e: any) {
    if (e.code === '23505') return NextResponse.json({ error: 'Codigo interno duplicado.' }, { status: 409 });
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}
