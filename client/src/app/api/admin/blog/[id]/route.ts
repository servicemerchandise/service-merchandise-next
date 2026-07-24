import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { query } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/auth';

type Params = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { title, excerpt, content, cover_image, author, category, published, meta_title, meta_description } = body;
    const slug = title ? slugify(title, { lower: true, strict: true }) : undefined;
    const r = await query(
      `UPDATE blog_posts SET
         title = COALESCE($1, title), slug = COALESCE($2, slug),
         excerpt = COALESCE($3, excerpt), content = COALESCE($4, content),
         cover_image = COALESCE($5, cover_image), author = COALESCE($6, author),
         category = COALESCE($7, category), published = COALESCE($8, published),
         published_at = CASE WHEN $8 = TRUE AND published = FALSE THEN NOW() ELSE published_at END,
         meta_title = COALESCE($9, meta_title), meta_description = COALESCE($10, meta_description),
         updated_at = NOW()
       WHERE id = $11 RETURNING *`,
      [title, slug, excerpt, content, cover_image, author, category, published, meta_title, meta_description, params.id]
    );
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(r.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const r = await query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [params.id]);
    if (r.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
