'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, Sparkles, CheckCircle2, FileText, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/lib/types';
import { api } from '@/lib/api';

export function Hero() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories?active=true').then((r) => setCategories(r.data.slice(0, 8))).catch(() => { });
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/productos?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <section className="relative bg-gradient-hero text-white overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, white 1px, transparent 1px),
                            radial-gradient(circle at 80% 70%, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 60px 60px',
        }}
      />
      <div className="container-page relative py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-medium border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-sm-200" /> Plataforma B2B líder en Colombia
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-5 leading-tight">
            Encuentra los productos <span className="text-sm-200">ideales</span> para tu empresa
          </h1>
          <p className="mt-5 text-sm-100 text-base md:text-lg leading-relaxed max-w-xl">
            Solicita cotizaciones personalizadas de forma rápida y sencilla.
            Conectamos tu empresa con proveedores confiables, atención humana y respuesta en menos de 24 horas.
          </p>

          {/* Search bar */}
          <form onSubmit={onSearch} className="mt-7 bg-white rounded-xl p-2 shadow-lg flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca productos, marcas, categorías..."
                className="w-full pl-10 pr-3 py-2.5 text-sm-700 text-sm rounded-lg focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary">
              Buscar <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick categories */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/productos?category=${c.id}`}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium border border-white/20 transition"
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            <div className="flex items-center gap-2 text-sm-100 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Cotización en 24h
            </div>
            <div className="flex items-center gap-2 text-sm-100 text-xs">
              <Shield className="w-4 h-4 text-emerald-300" /> Proveedores verificados
            </div>
            <div className="flex items-center gap-2 text-sm-100 text-xs">
              <FileText className="w-4 h-4 text-emerald-300" /> Sin compra online
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative hidden md:block">
          <div className="relative aspect-square max-w-md mx-auto">
            {/* Tarjeta flotante 1 */}
            <div className="absolute top-4 right-4 bg-white rounded-2xl shadow-lg p-4 w-64 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-sm-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-sm-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cotización #00482</p>
                  <p className="text-sm font-bold text-sm-700">Aprobada</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1">
                <div className="h-1.5 bg-sm-700 rounded" />
                <div className="h-1.5 bg-sm-300 rounded" />
                <div className="h-1.5 bg-sm-300 rounded" />
              </div>
              <p className="mt-2 text-xs text-gray-500">3 productos · 850 unidades</p>
            </div>

            {/* Tarjeta flotante 2 */}
            <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-lg p-4 w-72 animate-slide-up">
              <p className="text-xs text-gray-500">Empresas que confían</p>
              <div className="mt-2 flex gap-2">
                {['Fashion Jewerly', 'Vepa', 'Goho', 'Magic'].map((b) => (
                  <div key={b} className="h-8 px-2 rounded bg-gray-100 flex items-center text-[10px] font-bold text-gray-600">
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Centro */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl font-display font-bold">+10K</p>
                  <p className="text-xs text-sm-100 mt-1">Productos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA strip */}
      <div className="relative border-t border-white/10 bg-black/10">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-sm-100">
            ¿Listo para cotizar? Te respondemos en menos de 24 horas hábiles.
          </p>
          <Link href="/cotizar" className="btn-accent">
            Solicitar Cotización <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}