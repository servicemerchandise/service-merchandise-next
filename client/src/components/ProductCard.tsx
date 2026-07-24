'use client';

import { useState } from 'react';
import { Plus, Check, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const fallbackImage = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80';

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((s) => s.add);
  const [adding, setAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem({
      product_id: product.id,
      code: product.internal_code,
      name: product.name,
      image: product.main_image || fallbackImage,
      quantity: product.min_quantity || 1,
    });
    toast.success('Agregado al carrito de cotización');
    setTimeout(() => setAdding(false), 800);
  };

  const availabilityBadge = {
    disponible: 'bg-emerald-50 text-emerald-700',
    bajo_pedido: 'bg-amber-50 text-amber-700',
    agotado: 'bg-rose-50 text-rose-700',
  }[product.availability] || 'bg-gray-50 text-gray-700';

  const availabilityLabel = {
    disponible: 'Disponible',
    bajo_pedido: 'Bajo pedido',
    agotado: 'Agotado',
  }[product.availability] || product.availability;

  return (
    <Link href={`/productos/${product.slug}`} className="card group overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.main_image || fallbackImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute top-2 left-2 badge ${availabilityBadge}`}>
          {availabilityLabel}
        </span>
        {product.featured && (
          <span className="absolute top-2 right-2 badge bg-sm-accent text-white">
            Destacado
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {product.category_name && (
          <span className="text-xs text-sm-400 uppercase tracking-wide font-medium">
            {product.category_name}
          </span>
        )}
        <h3 className="font-display font-semibold text-sm-700 mt-1 line-clamp-2 group-hover:text-sm-accent transition">
          {product.name}
        </h3>
        {product.brand_name && (
          <p className="text-xs text-gray-500 mt-1">Marca: <span className="font-medium">{product.brand_name}</span></p>
        )}
        {product.short_description && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">{product.short_description}</p>
        )}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-400">Cód: {product.internal_code}</span>
          <button
            onClick={handleAdd}
        disabled={adding}
            className="btn-primary !px-3 !py-1.5 !text-xs"
      >
        {adding ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        Agregar
      </button>
        </div>
      </div>
    </Link>
  );
}