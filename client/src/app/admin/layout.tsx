'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, Tags, Award, Image, FileText,
  Star, Users, Mail, LogOut, Settings, ChevronDown, Bell, Search
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { api } from '@/lib/api';

const menu = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/cotizaciones', label: 'Cotizaciones', icon: FileText },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Tags },
  { href: '/admin/marcas', label: 'Marcas', icon: Award },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/testimonios', label: 'Testimonios', icon: Star },
  { href: '/admin/marcas-confianza', label: 'Marcas que confían', icon: Users },
  { href: '/admin/blog', label: 'Blog', icon: Mail },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const token = localStorage.getItem('sm_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    api
      .get('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => {
        localStorage.removeItem('sm_token');
        router.replace('/admin/login');
      })
      .finally(() => setLoaded(true));
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-sm-300 border-t-sm-700 rounded-full animate-spin" />
      </div>
    );
  }

  const logout = () => {
    localStorage.removeItem('sm_token');
    router.replace('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sm-700 text-white flex-col">
        <div className="p-5 border-b border-white/10">
          <Logo variant="light" size="sm" />
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {menu.map((m) => {
            const Icon = m.icon;
            const active = pathname === m.href || (m.href !== '/admin' && pathname.startsWith(m.href));
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  active ? 'bg-white/15 text-white font-semibold' : 'text-sm-100 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {m.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="m-3 flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sm-100 hover:bg-white/10">
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-3">
          <h2 className="font-display font-semibold text-sm-700">
            {menu.find((m) => pathname === m.href || (m.href !== '/admin' && pathname.startsWith(m.href)))?.label || 'Admin'}
          </h2>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-sm-400 hover:text-sm-700 hidden sm:inline">
              Ver sitio público ↗
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-sm-50 text-sm-700 flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-sm-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}