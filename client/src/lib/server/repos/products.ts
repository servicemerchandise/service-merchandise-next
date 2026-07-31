import { Product } from '@/lib/types';
import { query } from '@/lib/server/db';

const mapRow = (row: any): Product => ({
  ...row,
  gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery) : row.gallery || [],
  specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : row.specifications || {},
});

export interface ListProductsParams {
  search?: string;
  category?: string;
  brand?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export async function listProducts(params: ListProductsParams = {}): Promise<Product[]> {
  const { search, category, brand, featured, limit = 24, offset = 0 } = params;
  const conditions: string[] = ['p.active = TRUE'];
  const values: any[] = [];

  if (search) {
    values.push(`%${String(search).toLowerCase()}%`);
    conditions.push(`(LOWER(p.name) LIKE $${values.length} OR LOWER(p.short_description) LIKE $${values.length} OR LOWER(p.internal_code) LIKE $${values.length})`);
  }
  if (category) {
    values.push(category);
    conditions.push(`p.category_id = $${values.length}`);
  }
  if (brand) {
    values.push(brand);
    conditions.push(`p.brand_id = $${values.length}`);
  }
  if (featured) {
    conditions.push('p.featured = TRUE');
  }

  values.push(Number(limit));
  const limitIdx = values.length;
  values.push(Number(offset));
  const offsetIdx = values.length;

  const sql = `
    SELECT p.*, c.name AS category_name, b.name AS brand_name, b.logo_url AS brand_logo
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE ${conditions.join(' AND ')}
    ORDER BY p.created_at DESC
    LIMIT $${limitIdx} OFFSET $${offsetIdx}
  `;

  const r = await query(sql, values);
  return r.rows.map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const r = await query(
    `SELECT p.*, c.name AS category_name, b.name AS brand_name, b.logo_url AS brand_logo
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     LEFT JOIN brands b ON p.brand_id = b.id
     WHERE p.slug = $1 AND p.active = TRUE`,
    [slug]
  );
  if (r.rows.length === 0) return null;
  return mapRow(r.rows[0]);
}
