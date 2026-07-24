'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Search, ShoppingCart, Menu, X, Phone, Mail,
  ChevronDown, User
} from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '@/lib/cart';
import { api } from '@/lib/api';
import { Category, CompanySettings } from '@/lib/types';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/productos', label: 'Productos' },
  { href: '/categorias', label: 'Categorías' },
  { href: '/marcas', label: 'Marcas' },
  { href: '/cotizar', label: 'Solicitar Cotización' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [search, setSearch] = useState('');
  const cartCount = useCart((s) => s.count());
  const toggleCart = useCart((s) => s.toggle);

  useEffect(() => {
    api.get('/categories?active=true').then((r) => setCategories(r.data)).catch(() => {});
    api.get('/company').then((r) => setCompany(r.data)).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/productos?q=${encodeURIComponent(search.trim())}`);
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-sm-700 text-white text-xs">
        <div className="container-page flex items-center justify-between py-2">
          <div className="hidden md:flex items-center gap-4">
            {company?.phone && (
              <a href={`tel:${company.phone}`} className="flex items-center gap-1.5 hover:text-sm-100">
                <Phone className="w-3.5 h-3.5" /> {company.phone}
              </a>
            )}
            {company?.email && (
              <a href={`mailto:${company.email}`} className="flex items-center gap-1.5 hover:text-sm-100">
                <Mail className="w-3.5 h-3.5" /> {company.email}
              </a>
            )}
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="hidden sm:inline opacity-90">Atención personalizada para tu empresa</span>
            <Link href="/admin/login" className="flex items-center gap-1 hover:text-sm-100">
              <User className="w-3.5 h-3.5" /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-page flex items-center gap-6 py-3">
        <Logo size="md" />

        {/* Search desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
          <div className="relative flex w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="¿Qué producto buscas para tu empresa?"
              className="flex-1 px-4 py-2.5 rounded-l-lg border border-gray-300 border-r-0 text-sm
                         focus:outline-none focus:ring-2 focus:ring-sm-accent focus:border-sm-accent"
            />
            <button
              type="submit"
              className="px-5 rounded-r-lg bg-sm-700 text-white hover:bg-sm-500 transition flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Buscar</span>
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleCart}
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-sm-700 text-sm-700 bg-white hover:bg-sm-50 transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden lg:inline text-sm font-medium">Carrito de Cotización</span>
            <span className="badge bg-sm-accent text-white">({cartCount})</span>
          </button>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-sm-700">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Categories bar */}
      <div className="hidden md:block border-t border-gray-100 bg-sm-50">
        <div className="container-page flex items-center gap-1 overflow-x-auto py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-1.5 text-sm font-medium text-sm-700 hover:bg-sm-700 hover:text-white rounded-md transition whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-slide-up">
          <form onSubmit={handleSearch} className="p-4">
            <div className="flex">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:border-sm-accent"
              />
              <button type="submit" className="px-4 bg-sm-700 text-white rounded-r-lg">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
          <nav className="flex flex-col px-2 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-sm-700 hover:bg-sm-50 rounded-md"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}