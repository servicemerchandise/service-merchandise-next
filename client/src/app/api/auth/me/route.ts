import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAuth } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  try {
    const { authorized, response, user } = requireAuth(req);
    if (!authorized) return response;

    const result = await query('SELECT id, name, email, role FROM users WHERE id = $1', [user.id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
