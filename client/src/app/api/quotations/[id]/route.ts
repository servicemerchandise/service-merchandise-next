import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAuth, requireAdmin } from '@/lib/server/auth';

function normalizeQuotation(q: any) {
  if (!q) return q;
  if (typeof q.items === 'string') {
    try { q.items = JSON.parse(q.items); } catch { q.items = []; }
  }
  return q;
}

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    if (!auth.authorized) return auth.response;

    const r = await query('SELECT * FROM quotations WHERE id = $1', [params.id]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    return NextResponse.json(normalizeQuotation(r.rows[0]));
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const r = await query('DELETE FROM quotations WHERE id = $1 RETURNING id', [params.id]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
