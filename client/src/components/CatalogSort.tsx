'use client';

import { useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

interface CatalogSortProps {
  currentSort?: string;
  searchParams?: Record<string, string | undefined>;
}

export function CatalogSort({ currentSort = 'recent', searchParams = {} }: CatalogSortProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams();

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, val]) => {
        if (val && key !== 'sort' && key !== 'page') {
          params.set(key, val);
        }
      });
    }

    if (newSort !== 'recent') {
      params.set('sort', newSort);
    }

    const queryString = params.toString();
    const basePath = pathname || '/productos';
    router.push(queryString ? `${basePath}?${queryString}` : basePath);
  };

  return (
    <div className="card p-3 mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-sm-700" />
        <label htmlFor="sort-select" className="font-medium text-sm-700">
          Ordenar por:
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={handleSortChange}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-sm-700 focus:outline-none focus:ring-2 focus:ring-sm-accent cursor-pointer"
        >
          <option value="recent">Más recientes</option>
          <option value="oldest">Más antiguos</option>
        </select>
      </div>

      <span className="text-xs text-gray-400">
        ¿Necesitas algo específico?{' '}
        <a href="/cotizar" className="text-sm-accent hover:underline font-medium">
          Solicita una cotización personalizada
        </a>
      </span>
    </div>
  );
}
