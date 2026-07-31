import { CompanySettings } from '@/lib/types';
import { query } from '@/lib/server/db';

export async function getCompanySettings(): Promise<CompanySettings | null> {
  const r = await query(`SELECT * FROM company_settings WHERE id = 1`);
  if (r.rows.length === 0) return null;
  return r.rows[0];
}
