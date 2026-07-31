import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const fields = [
      'company_name', 'email', 'phone', 'whatsapp', 'address', 'city', 'country',
      'facebook_url', 'instagram_url', 'linkedin_url', 'tiktok_url', 'logo_url', 'favicon_url',
      'meta_title', 'meta_description', 'meta_keywords'
    ];
    const updates: string[] = [];
    const values: any[] = [];
    
    fields.forEach((f) => {
      if (body[f] !== undefined) {
        values.push(body[f]);
        updates.push(`${f} = $${values.length}`);
      }
    });

    if (updates.length === 0) return NextResponse.json({ error: 'Sin cambios' }, { status: 400 });
    
    values.push(1);
    const r = await query(
      `UPDATE company_settings SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`, 
      values
    );
    
    return NextResponse.json(r.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}