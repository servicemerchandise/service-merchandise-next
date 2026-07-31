import * as XLSX from 'xlsx';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAuth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authorized) return auth.response;

    const r = await query('SELECT * FROM quotations ORDER BY created_at DESC');
    const rows = r.rows.map((q: any) => ({
      ID: q.id,
      Fecha: q.created_at,
      Cliente: q.full_name,
      Empresa: q.company,
      Correo: q.email,
      Celular: q.phone,
      Ciudad: q.city,
      Estado: q.status,
      Comentarios: q.comments || '',
      Productos: (typeof q.items === 'string' ? JSON.parse(q.items) : q.items || []).map((i: any) => `${i.code} x${i.quantity}`).join(' | '),
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Cotizaciones');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename=cotizaciones.xlsx',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Error al exportar' }, { status: 500 });
  }
}