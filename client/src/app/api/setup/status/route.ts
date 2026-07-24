import { NextResponse } from 'next/server';
import { query, isUsingPgMem } from '@/lib/server/db';

export async function GET() {
  try {
    const r = await query('SELECT COUNT(*) FROM users');
    const count = Number(r.rows[0].count);
    return NextResponse.json({
      needs_setup: count === 0,
      admin_exists: count > 0,
      using_embedded_db: isUsingPgMem(),
    });
  } catch (e) {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
