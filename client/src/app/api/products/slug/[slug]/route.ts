import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

const mapRow = (row: any) => ({
  ...row,
  gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery) : row.gallery || [],
  specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : row.specifications || {},
});

type Params = { params: { slug: string } };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const r = await query(
      `SELECT p.*, c.name AS category_name, b.name AS brand_name, b.logo_url AS brand_logo
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.slug = $1 AND p.active = TRUE`,
      [params.slug]
    );
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(mapRow(r.rows[0]));
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}