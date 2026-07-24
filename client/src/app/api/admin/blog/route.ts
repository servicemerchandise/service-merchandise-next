import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { query } from '@/lib/server/db';
import { requireAuth, requireAdmin } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authorized) return auth.response;

    const r = await query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    return NextResponse.json(r.rows);
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { title, excerpt, content, cover_image, author, category, published, meta_title, meta_description } = body;
    const slug = slugify(title, { lower: true, strict: true });
    const r = await query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author, category, published, published_at, meta_title, meta_description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [title, slug, excerpt, content, cover_image, author, category, !!published, published ? new Date() : null, meta_title, meta_description]
    );
    return NextResponse.json(r.rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
