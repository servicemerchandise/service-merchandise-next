'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import { Product } from '@/lib/types';
import { api } from '@/lib/api';
import { Sparkles, ArrowRight, FileText } from 'lucide-react';

interface FeaturedProductsSectionProps {
  initialProducts: Product[];
  initialTotal: number;
}

export function FeaturedProductsSection({
  initialProducts,
  initialTotal,
}: FeaturedProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState<number>(initialTotal);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const limit = 8;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handlePageChange = async (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages || loading) return;
    setLoading(true);
    setCurrentPage(page);

    const offset = (page - 1) * limit;
    try {
      const res = await api.get(`/products?featured=true&limit=${limit}&offset=${offset}&withCount=true`);
      if (res.data && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
        setTotal(res.data.total);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (e) {
      console.error('Error fetching featured products:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
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

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 opacity-50 transition-opacity">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : products.length > 0 ? (
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

      {/* Pagination controls only appear when total featured products > 8 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
