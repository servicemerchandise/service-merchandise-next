import { api } from '@/lib/api';
import { Product, BlogPost, Category } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap() {
  const staticUrls = ['', '/productos', '/categorias', '/marcas', '/cotizar', '/nosotros', '/contacto', '/blog', '/politicas/privacidad', '/politicas/terminos'].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.7,
  }));

  let productUrls: any[] = [];
  let blogUrls: any[] = [];
  let categoryUrls: any[] = [];

  try {
    const [products, posts, cats] = await Promise.all([
      api.get<Product[]>('/products?limit=1000'),
      api.get<BlogPost[]>('/blog'),
      api.get<Category[]>('/categories?active=true'),
    ]);
    productUrls = products.data.map((p) => ({
      url: `${SITE_URL}/productos/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    blogUrls = posts.data.map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.published_at ? new Date(b.published_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
    categoryUrls = cats.data.map((c) => ({
      url: `${SITE_URL}/productos?category=${c.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch {}

  return [...staticUrls, ...productUrls, ...blogUrls, ...categoryUrls];
}