import { api } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { CategorySidebar } from '@/components/CategorySidebar';
import { Product, Category } from '@/lib/types';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface Props {
  searchParams: { q?: string; category?: string; brand?: string };
}

async function getData({ q, category, brand }: Props['searchParams']) {
  const params = new URLSearchParams();
  if (q) params.set('search', q);
  if (category) params.set('category', category);
  if (brand) params.set('brand', brand);
  params.set('limit', '48');
  try {
    const res = await api.get<Product[]>(`/products?${params}`);
    return res.data;
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Catálogo de productos',
  description: 'Explora nuestro catálogo completo y solicita cotización.',
};

export default async function ProductosPage({ searchParams }: Props) {
  const products = await getData(searchParams);
  const title = searchParams.q
    ? `Resultados para "${searchParams.q}"`
    : 'Catálogo completo';

  return (
    <section className="container-page py-10">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-sm-700">{title}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {products.length} producto{products.length !== 1 ? 's' : ''} · Solicita cotización sin compromiso
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <CategorySidebar selected={searchParams.category} />
        <div>
          <div className="card p-3 mb-5 flex items-center gap-2 text-sm text-gray-600">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Ordenado por más recientes</span>
            <span className="ml-auto text-xs text-gray-400">
              ¿Necesitas algo específico? <a href="/cotizar" className="text-sm-accent hover:underline">Solicita una cotización personalizada</a>
            </span>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Filter className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600">No encontramos productos con esos filtros.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}