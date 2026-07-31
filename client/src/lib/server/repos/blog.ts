import { BlogPost } from '@/lib/types';
import { query } from '@/lib/server/db';

export async function listBlogPosts(limit = 100): Promise<BlogPost[]> {
  const r = await query(
    `SELECT * FROM blog_posts WHERE published = TRUE ORDER BY published_at DESC NULLS LAST, created_at DESC LIMIT $1`,
    [limit]
  );
  return r.rows;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const r = await query(
    `SELECT * FROM blog_posts WHERE slug = $1 AND published = TRUE`,
    [slug]
  );
  if (r.rows.length === 0) return null;
  return r.rows[0];
}
