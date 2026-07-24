'use client';

import { useEffect } from 'react';
import { TrustedBrand } from '@/lib/types';

interface TrustedBrandsProps {
  items: TrustedBrand[];
}

export function TrustedBrandsCarousel({ items }: TrustedBrandsProps) {
  // Doble lista para efecto marquee infinito
  const looped = [...items, ...items];

  if (!items.length) return null;

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 py-8">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      <div className="flex animate-marquee gap-12 items-center" style={{ width: 'max-content' }}>
        {looped.map((b, i) => (
          <div
            key={`${b.id}-${i}`}
            className="flex items-center justify-center h-16 px-4 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition"
            title={b.name}
          >
            {b.logo_url ? (
              <img src={b.logo_url} alt={b.name} className="max-h-12 max-w-[140px] object-contain" />
            ) : (
              <span className="font-display font-bold text-sm-300 text-lg whitespace-nowrap">{b.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}