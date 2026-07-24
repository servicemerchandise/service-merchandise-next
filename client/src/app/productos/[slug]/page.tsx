'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useEffect } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';
import {
  Plus, Minus, ChevronRight, ShoppingBag, Check, Package, Tag,
  Truck, Shield, FileText
} from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const addItem = useCart((s) => s.add);

  useEffect(() => {
    setLoading(true);
    api
      .get<Product>(`/products/slug/${slug}`)
      .then(async (res) => {
        setProduct(res.data);
        setQuantity(res.data.min_quantity || 1);
        if (res.data.category_id) {
          const rel = await api.get<Product[]>(`/products?category=${res.data.category_id}&limit=5`);
          setRelated((rel.data || []).filter((p) => p.id !== res.data.id).slice(0, 4));
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-page py-20 text-center">
        <div className="inline-block w-10 h-10 border-4 border-sm-300 border-t-sm-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <h1 className="text-2xl font-bold text-sm-700">Producto no encontrado</h1>
        <Link href="/productos" className="btn-primary mt-5 inline-flex">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const images = [product.main_image, ...(product.gallery || [])].filter(Boolean) as string[];

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      code: product.internal_code,
      name: product.name,
      image: product.main_image,
      quantity,
    });
    toast.success('Agregado a tu carrito de cotización');
  };

  return (
    <section className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-gray-500 mb-5 gap-1">
        <Link href="/" className="hover:text-sm-700">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/productos" className="hover:text-sm-700">Productos</Link>
        {product.category_name && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/productos?category=${product.category_id}`} className="hover:text-sm-700">
              {product.category_name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-sm-700 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div
            className="aspect-square bg-gray-50 rounded-xl overflow-hidden border cursor-zoom-in relative"
            onClick={() => setZoom(true)}
          >
            {images[activeImage] ? (
              <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package className="w-16 h-16" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${activeImage === i ? 'border-sm-accent' : 'border-gray-200 hover:border-sm-300'
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.category_name && (
              <Link
                href={`/productos?category=${product.category_id}`}
                className="text-xs uppercase tracking-wider text-sm-400 font-semibold hover:text-sm-accent"
              >
                {product.category_name}
              </Link>
            )}
            <span className="badge-green">
              <Check className="w-3 h-3 inline mr-1" />
              {product.availability === 'disponible' ? 'Disponible' : product.availability === 'bajo_pedido' ? 'Bajo pedido' : 'Agotado'}
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-sm-700">{product.name}</h1>

          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className="text-gray-500">Código: <span className="font-mono text-sm-700">{product.internal_code}</span></span>
            {product.brand_name && (
              <span className="text-gray-500">Marca: <span className="font-semibold text-sm-700">{product.brand_name}</span></span>
            )}
          </div>

          {product.short_description && (
            <p className="mt-4 text-base text-gray-700 leading-relaxed">{product.short_description}</p>
          )}

          {/* Quantity */}
          <div className="mt-6 card p-4">
            <label className="text-xs font-medium text-sm-700 block mb-2">Cantidad</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 text-center text-lg font-semibold border border-gray-300 rounded-lg py-2"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
              {product.min_quantity > 1 && (
                <span className="text-xs text-gray-500">Cantidad mínima sugerida: {product.min_quantity}</span>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={handleAdd} className="btn-primary w-full">
              <ShoppingBag className="w-4 h-4" /> Agregar a Cotización
            </button>
            <Link href="/cotizar" className="btn-outline w-full">
              <FileText className="w-4 h-4" /> Solicitar Cotización
            </Link>
          </div>

          {/* Trust */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-sm-700" /> Cobertura nacional</div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-sm-700" /> Calidad garantizada</div>
            <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-sm-700" /> Mejor precio</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-display font-bold text-xl text-sm-700 mb-3">Precio</h2>
          {product.full_description ? (
            <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: product.full_description }} />
          ) : (
            <p className="text-sm text-gray-500">Sin descripción adicional.</p>
          )}

          {product.applications && (
            <>
              <h2 className="font-display font-bold text-xl text-sm-700 mt-8 mb-3">Aplicaciones</h2>
              <p className="text-sm text-gray-700">{product.applications}</p>
            </>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display font-bold text-xl text-sm-700 mb-3">Especificaciones</h2>
          {product.specifications && Object.keys(product.specifications).length > 0 ? (
            <dl className="space-y-2">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-100 py-2 text-sm">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="text-sm-700 font-medium text-right">{String(v)}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-gray-500">Sin especificaciones registradas.</p>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="section-title mb-5">Productos relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Zoom modal */}
      {zoom && images[activeImage] && (
        <div
          onClick={() => setZoom(false)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
        >
          <img src={images[activeImage]} alt="" className="max-w-full max-h-full" />
        </div>
      )}
    </section>
  );
}