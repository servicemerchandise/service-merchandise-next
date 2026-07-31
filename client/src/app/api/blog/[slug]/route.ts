import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

type Params = { params: { slug: string } };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const r = await query('SELECT * FROM blog_posts WHERE slug = $1 AND published = TRUE', [params.slug]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(r.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}