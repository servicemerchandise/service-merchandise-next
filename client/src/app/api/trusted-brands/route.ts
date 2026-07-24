import { NextResponse } from 'next/server';
import { query } from '@/lib/server/db';

export async function GET() {
  try {
    const r = await query('SELECT * FROM trusted_brands WHERE active = TRUE ORDER BY display_order ASC');
    return NextResponse.json(r.rows);
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
