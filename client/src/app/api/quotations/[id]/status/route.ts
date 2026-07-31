import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

const STATUS_VALUES = ['nueva', 'en_proceso', 'enviada', 'cerrada'];

function normalizeQuotation(q: any) {
  if (!q) return q;
  if (typeof q.items === 'string') {
    try { q.items = JSON.parse(q.items); } catch { q.items = []; }
  }
  return q;
}

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { status } = body;
    if (!STATUS_VALUES.includes(status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }

    const r = await query(
      'UPDATE quotations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, params.id]
    );
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    return NextResponse.json(normalizeQuotation(r.rows[0]));
  } catch (e) {
    return NextResponse.json({ error: 'Error al cambiar estado' }, { status: 500 });
  }
}