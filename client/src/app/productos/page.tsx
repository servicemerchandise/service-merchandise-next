import { listProductsWithCount } from '@/lib/server/repos/products';
import { ProductCard } from '@/components/ProductCard';
import { CategorySidebar } from '@/components/CategorySidebar';
import { CatalogSort } from '@/components/CatalogSort';
import { Pagination } from '@/components/Pagination';
import { Product } from '@/lib/types';
import { Filter } from 'lucide-react';

interface Props {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
  };
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Catálogo de productos',
  description: 'Explora nuestro catálogo completo y solicita cotización.',
};

export default async function ProductosPage({ searchParams }: Props) {
  const limit = 24;
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const sort = searchParams.sort === 'oldest' ? 'oldest' : 'recent';
  const offset = (page - 1) * limit;

  // Acceso directo a DB — sin self-fetch HTTP.
  const { products, total }: { products: Product[]; total: number } =
    await listProductsWithCount({
      search: searchParams.q,
      category: searchParams.category,
      brand: searchParams.brand,
      sort,
      limit,
      offset,
    });

  const totalPages = Math.ceil(total / limit);

  const title = searchParams.q
    ? `Resultados para "${searchParams.q}"`
    : 'Catálogo completo';

  return (
    <section className="container-page py-10">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-sm-700">{title}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {total} producto{total !== 1 ? 's' : ''} {total > 0 && `(página ${page} de ${totalPages || 1})`} · Solicita cotización sin compromiso
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <CategorySidebar selected={searchParams.category} />
        <div>
          <CatalogSort currentSort={sort} searchParams={searchParams} />

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                searchParams={searchParams}
              />
            </>
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
