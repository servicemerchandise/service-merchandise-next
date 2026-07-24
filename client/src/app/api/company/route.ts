import { NextResponse } from 'next/server';
import { query } from '@/lib/server/db';

export async function GET() {
  try {
    const r = await query('SELECT * FROM company_settings WHERE id = 1');
    return NextResponse.json(r.rows[0] || {});
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
