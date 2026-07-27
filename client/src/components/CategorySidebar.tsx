'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Category } from '@/lib/types';
import { api } from '@/lib/api';
import { ChevronRight, Grid3x3 } from 'lucide-react';

interface CategorySidebarProps {
  selected?: string;
}

const ICON_MAP: Record<string, string> = {
  Tecnología: '💻',
  Herramientas: '🛠️',
  Papelería: '📝',
  Oficina: '🏢',
  Promocionales: '🎁',
  'Seguridad Industrial': '🦺',
  'Accesorios y belleza': '💄',
  Joyería: '💍',
  Hogar: '🏠',
  Eventos: '🎉',
  Juguetería: '🧸',
  Personalizados: '🔥',

};

export function CategorySidebar({ selected }: CategorySidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories?active=true').then((r) => setCategories(r.data)).catch(() => { });
  }, []);

  return (
    <aside className="card p-4 sticky top-32">
      <div className="flex items-center gap-2 pb-3 mb-2 border-b border-gray-100">
        <Grid3x3 className="w-4 h-4 text-sm-700" />
        <h3 className="font-display font-bold text-sm-700">Categorías</h3>
      </div>
      <nav className="flex flex-col">
        <Link
          href="/productos"
          className={`flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-sm-50 transition ${!selected ? 'bg-sm-50 text-sm-700 font-semibold' : 'text-ink-muted'
            }`}
        >
          <span className="flex items-center gap-2">
            <span>🏷️</span> Todos los productos
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/productos?category=${c.id}`}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-sm-50 transition ${selected === c.id ? 'bg-sm-50 text-sm-700 font-semibold' : 'text-ink-muted'
              }`}
          >
            <span className="flex items-center gap-2">
              <span>{ICON_MAP[c.name] || '✨'}</span> {c.name}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        ))}
      </nav>
    </aside>
  );
}