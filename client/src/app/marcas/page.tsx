import Link from 'next/link';
import { api } from '@/lib/api';
import { Brand } from '@/lib/types';

async function getBrands() {
  try {
    const res = await api.get<Brand[]>('/brands');
    return res.data;
  } catch {
    return [];
  }
}

export const metadata = { title: 'Marcas' };

export default async function MarcasPage() {
  const brands = await getBrands();
  return (
    <section className="container-page py-10">
      <h1 className="font-display text-3xl font-bold text-sm-700 mb-2">Marcas</h1>
      <p className="text-sm text-gray-600 mb-8">Trabajamos con las marcas líderes del mercado.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/productos?brand=${b.id}`}
            className="card aspect-square flex items-center justify-center p-6 hover:border-sm-accent transition"
            title={b.name}
          >
            {b.logo_url ? (
              <img src={b.logo_url} alt={b.name} className="max-h-20 max-w-full object-contain grayscale hover:grayscale-0 transition" />
            ) : (
              <span className="font-display font-bold text-sm-700 text-lg text-center">{b.name}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}