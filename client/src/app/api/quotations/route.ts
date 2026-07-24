import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAuth } from '@/lib/server/auth';
import { sendQuotationAdminEmail, sendQuotationClientEmail } from '@/lib/server/mailer';

function normalizeQuotation(q: any) {
  if (!q) return q;
  if (typeof q.items === 'string') {
    try { q.items = JSON.parse(q.items); } catch { q.items = []; }
  }
  return q;
}

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authorized) return auth.response;

    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const params: any[] = [];
    const conds: string[] = [];

    if (status) {
      params.push(status);
      conds.push(`status = $${params.length}`);
    }
    if (search) {
      params.push(`%${String(search).toLowerCase()}%`);
      conds.push(`(LOWER(full_name) LIKE $${params.length} OR LOWER(company) LIKE $${params.length} OR LOWER(email) LIKE $${params.length})`);
    }
    if (from) {
      params.push(from);
      conds.push(`created_at >= $${params.length}`);
    }
    if (to) {
      params.push(to);
      conds.push(`created_at <= $${params.length}`);
    }

    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
    const r = await query(`SELECT * FROM quotations ${where} ORDER BY created_at DESC LIMIT 500`, params);
    return NextResponse.json(r.rows.map(normalizeQuotation));
  } catch (e) {
    return NextResponse.json({ error: 'Error al listar' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, company, phone, email, city, comments, items } = body;

    if (!full_name || !company || !phone || !email || !city || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || '';

    const r = await query(
      `INSERT INTO quotations (full_name, company, phone, email, city, comments, items, ip_address, user_agent)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9) RETURNING *`,
      [full_name, company, phone, email, city, comments, JSON.stringify(items), ip, userAgent]
    );
    const quotation = r.rows[0];

    try {
      await sendQuotationAdminEmail({ full_name, company, phone, email, city, comments, items }, quotation.id);
      await sendQuotationClientEmail({ full_name, company, phone, email, city, comments, items }, quotation.id);
    } catch (mailErr) {
      console.error('Error enviando correos:', mailErr);
    }

    return NextResponse.json({
      ok: true,
      message: 'Solicitud enviada correctamente',
      id: quotation.id,
    }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al enviar la cotización' }, { status: 500 });
  }
}
