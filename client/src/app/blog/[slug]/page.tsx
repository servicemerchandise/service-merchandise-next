import { api } from '@/lib/api';
import { BlogPost } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Calendar } from 'lucide-react';

interface Props {
  params: { slug: string };
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await api.get<BlogPost>(`/blog/${slug}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) return { title: 'No encontrado' };
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) return notFound();

  return (
    <article className="container-page py-12 max-w-3xl">
      <span className="badge-blue">{post.category || 'Artículo'}</span>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-sm-700 mt-3">{post.title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
        {post.author && <span>Por {post.author}</span>}
        {post.published_at && (
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />
            {new Date(post.published_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        )}
      </div>
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="w-full aspect-video object-cover rounded-xl mt-6" />
      )}
      <div className="prose prose-sm md:prose-base max-w-none mt-6 text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}