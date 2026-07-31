import Link from 'next/link';
import { listProducts } from '@/lib/server/repos/products';
import { listTestimonials, listTrustedBrands } from '@/lib/server/repos/front';
import { listBlogPosts } from '@/lib/server/repos/blog';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { CategorySidebar } from '@/components/CategorySidebar';
import { TrustedBrandsCarousel } from '@/components/TrustedBrandsCarousel';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';
import { Benefits } from '@/components/Benefits';
import { ArrowRight, Sparkles, FileText, Tag } from 'lucide-react';
import { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Acceso directo a DB (sin self-fetch HTTP).
  const [products, brands, testimonials, blog] = await Promise.all([
    listProducts({ featured: true, limit: 8 }).catch(() => [] as Product[]),
    listTrustedBrands().catch(() => []),
    listTestimonials().catch(() => []),
    listBlogPosts(3).catch(() => []),
  ]);

  return (
    <>
      <Hero />

      {/* Trust strip */}
      <section className="bg-sm-50 border-y border-gray-100">
        <div className="container-page py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-sm-400 font-semibold">
                Empresas que confían en nosotros
              </p>
              <h2 className="section-title mt-1">Marcas líderes del país</h2>
            </div>
            <Link href="/marcas" className="hidden md:inline-flex btn-ghost">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <TrustedBrandsCarousel items={brands} />
        </div>
      </section>

      {/* Products + sidebar */}
      <section className="container-page py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <CategorySidebar />
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="badge-blue">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Destacados
                </span>
                <h2 className="section-title mt-2">Productos destacados</h2>
              </div>
              <Link href="/productos" className="btn-outline">
                Ver catálogo completo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="card p-10 text-center">
                <FileText className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">Aún no hay productos destacados.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <Benefits />

      {/* Testimonials */}
      <section className="bg-gray-50 py-14">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="badge-blue">Testimonios</span>
            <h2 className="section-title mt-2">Lo que dicen nuestros clientes</h2>
          </div>
          <TestimonialsCarousel items={testimonials} />
        </div>
      </section>

      {/* Blog */}
      {blog.length > 0 && (
        <section className="container-page py-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="badge-blue">
                <Tag className="w-3 h-3 inline mr-1" /> Blog
              </span>
              <h2 className="section-title mt-2">Novedades y tendencias</h2>
            </div>
            <Link href="/blog" className="btn-ghost">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {blog.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card overflow-hidden group"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs uppercase tracking-wider text-sm-400 font-semibold">
                    {post.category || 'Artículo'}
                  </span>
                  <h3 className="font-display font-semibold text-sm-700 mt-2 group-hover:text-sm-accent transition line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
