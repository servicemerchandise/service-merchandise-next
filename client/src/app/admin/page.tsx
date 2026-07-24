'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Package, FileText, Users, Tag, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/products?limit=1000'),
      api.get('/categories?active=true'),
      api.get('/brands'),
      api.get('/quotations'),
    ]).then(([products, cats, brands, quotes]) => {
      const newQuotes = (quotes.data || []).filter((q: any) => q.status === 'nueva').length;
      setStats({
        products: (products.data || []).length,
        categories: (cats.data || []).length,
        brands: (brands.data || []).length,
        quotations: (quotes.data || []).length,
        newQuotes,
      });
      setRecentQuotes((quotes.data || []).slice(0, 5));
    });
  }, []);

  const cards = [
    { icon: Package, label: 'Productos', value: stats.products ?? '—', href: '/admin/productos', color: 'bg-blue-50 text-blue-700' },
    { icon: Tag, label: 'Categorías', value: stats.categories ?? '—', href: '/admin/categorias', color: 'bg-emerald-50 text-emerald-700' },
    { icon: Users, label: 'Marcas', value: stats.brands ?? '—', href: '/admin/marcas', color: 'bg-purple-50 text-purple-700' },
    { icon: FileText, label: 'Cotizaciones nuevas', value: stats.newQuotes ?? '—', href: '/admin/cotizaciones', color: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} href={c.href} className="card p-5 hover:border-sm-accent transition">
              <div className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 mt-3 uppercase tracking-wider font-semibold">{c.label}</p>
              <p className="font-display text-3xl font-bold text-sm-700 mt-1">{c.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm-700">Cotizaciones recientes</h3>
            <Link href="/admin/cotizaciones" className="text-xs text-sm-accent hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentQuotes.length === 0 ? (
            <p className="text-sm text-gray-500">Aún no hay cotizaciones.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="pb-2">Cliente</th>
                  <th className="pb-2">Empresa</th>
                  <th className="pb-2">Fecha</th>
                  <th className="pb-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotes.map((q) => (
                  <tr key={q.id} className="border-t">
                    <td className="py-2.5 font-medium">{q.full_name}</td>
                    <td>{q.company}</td>
                    <td className="text-gray-500">{new Date(q.created_at).toLocaleDateString('es-CO')}</td>
                    <td>
                      <span className={`badge ${
                        q.status === 'nueva' ? 'bg-amber-100 text-amber-700' :
                        q.status === 'en_proceso' ? 'bg-blue-100 text-blue-700' :
                        q.status === 'enviada' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-display font-bold text-sm-700 mb-3">Acciones rápidas</h3>
          <div className="space-y-2">
            <Link href="/admin/productos" className="block px-3 py-2 rounded-md hover:bg-sm-50 text-sm">+ Crear producto</Link>
            <Link href="/admin/categorias" className="block px-3 py-2 rounded-md hover:bg-sm-50 text-sm">+ Crear categoría</Link>
            <Link href="/admin/banners" className="block px-3 py-2 rounded-md hover:bg-sm-50 text-sm">+ Publicar banner</Link>
            <Link href="/admin/cotizaciones" className="block px-3 py-2 rounded-md hover:bg-sm-50 text-sm">📋 Ver cotizaciones</Link>
          </div>
        </div>
      </div>
    </div>
  );
}