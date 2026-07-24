import Link from 'next/link';
import { api } from '@/lib/api';
import { Category } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

const ICON_MAP: Record<string, string> = {
  Tecnología: '💻',
  Herramientas: '🛠️',
  Papelería: '📝',
  Oficina: '🏢',
  Promocionales: '🎁',
  'Seguridad Industrial': '🦺',
  Hogar: '🏠',
  Eventos: '🎉',
  'Merchandising Corporativo': '👔',
  Personalizados: '✨',
};

async function getCategories() {
  try {
    const res = await api.get<Category[]>('/categories?active=true');
    return res.data;
  } catch {
    return [];
  }
}

export const metadata = { title: 'Categorías' };

export default async function CategoriasPage() {
  const categories = await getCategories();
  return (
    <section className="container-page py-10">
      <h1 className="font-display text-3xl font-bold text-sm-700 mb-2">Categorías</h1>
      <p className="text-sm text-gray-600 mb-8">Explora todas nuestras líneas de productos corporativos.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/productos?category=${c.id}`}
            className="card p-6 hover:border-sm-accent transition group flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-sm-50 text-3xl flex items-center justify-center group-hover:bg-sm-700 transition">
              {ICON_MAP[c.name] || '✨'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-sm-700 group-hover:text-sm-accent transition truncate">
                {c.name}
              </h3>
              {c.description && <p className="text-xs text-gray-500 line-clamp-1">{c.description}</p>}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-sm-accent" />
          </Link>
        ))}
      </div>
    </section>
  );
}