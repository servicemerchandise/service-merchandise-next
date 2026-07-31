import Link from 'next/link';
import { listBlogPosts } from '@/lib/server/repos/blog';
import { BlogPost } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Blog' };

export default async function BlogPage() {
  // Acceso directo a DB — sin self-fetch HTTP ni axios.
  let posts: BlogPost[] = [];
  try {
    posts = await listBlogPosts();
  } catch {
    posts = [];
  }

  return (
    <section className="container-page py-12">
      <div className="text-center mb-10">
        <span className="badge-blue">Blog</span>
        <h1 className="font-display text-4xl font-bold text-sm-700 mt-3">
          Novedades, tendencias y casos de éxito
        </h1>
      </div>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">Aún no hay publicaciones.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="card overflow-hidden group"
            >
              <div className="aspect-video bg-gray-100">
                {p.cover_image && (
                  <img
                    src={p.cover_image || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    alt=""
                  />
                )}
              </div>
              <div className="p-5">
                <span className="text-xs uppercase tracking-wider text-sm-400 font-semibold">
                  {p.category || 'Artículo'}
                </span>
                <h2 className="font-display font-semibold text-sm-700 mt-2 group-hover:text-sm-accent transition">
                  {p.title}
                </h2>
                {p.excerpt && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
