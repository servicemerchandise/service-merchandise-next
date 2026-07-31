import { Banner, TrustedBrand, Testimonial } from '@/lib/types';
import { query } from '@/lib/server/db';

export async function listBanners(activeOnly = true): Promise<Banner[]> {
  const where = activeOnly ? 'WHERE active = TRUE' : '';
  const r = await query(`SELECT * FROM banners ${where} ORDER BY display_order ASC`);
  return r.rows;
}

export async function listTrustedBrands(): Promise<TrustedBrand[]> {
  const r = await query(`SELECT * FROM trusted_brands WHERE active = TRUE ORDER BY display_order ASC`);
  return r.rows;
}

export async function listTestimonials(): Promise<Testimonial[]> {
  const r = await query(`SELECT * FROM testimonials WHERE active = TRUE ORDER BY display_order ASC`);
  return r.rows;
}
