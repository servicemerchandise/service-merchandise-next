import type { MetadataRoute } from 'next';
import { listProducts } from '@/lib/server/repos/products';
import { listBlogPosts } from '@/lib/server/repos/blog';
import { listCategories } from '@/lib/server/repos/catalog';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    '',
    '/productos',
    '/categorias',
    '/marcas',
    '/cotizar',
    '/nosotros',
    '/contacto',
    '/blog',
    '/politicas/privacidad',
    '/politicas/terminos',
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));

  let productUrls: MetadataRoute.Sitemap = [];
  let blogUrls: MetadataRoute.Sitemap = [];
  let categoryUrls: MetadataRoute.Sitemap = [];

  try {
    const [products, posts, cats] = await Promise.all([
      listProducts({ limit: 1000 }),
      listBlogPosts(1000),
      listCategories(true),
    ]);

    productUrls = products.map((p) => ({
      url: `${SITE_URL}/productos/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    blogUrls = posts.map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.published_at ? new Date(b.published_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
    categoryUrls = cats.map((c) => ({
      url: `${SITE_URL}/productos?category=${c.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch {
    // Ignore DB errors during sitemap build; static URLs are still emitted.
  }

  return [...staticUrls, ...productUrls, ...blogUrls, ...categoryUrls];
}
