import { Category, Brand } from '@/lib/types';
import { query } from '@/lib/server/db';

export async function listCategories(activeOnly = false): Promise<Category[]> {
  const where = activeOnly ? 'WHERE active = TRUE' : '';
  const r = await query(`SELECT * FROM categories ${where} ORDER BY display_order ASC, name ASC`);
  return r.rows;
}

export async function listBrands(activeOnly = false): Promise<Brand[]> {
  const where = activeOnly ? 'WHERE active = TRUE' : '';
  const r = await query(`SELECT * FROM brands ${where} ORDER BY name ASC`);
  return r.rows;
}
