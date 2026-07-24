'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { ArrowLeft, Save, Trash2, Copy, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Props {
  id?: string;
}

export default function ProductoEditor({ id }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    internal_code: '',
    name: '',
    short_description: '',
    full_description: '',
    category_id: '',
    brand_id: '',
    main_image: '',
    gallery: [] as string[],
    applications: '',
    min_quantity: 1,
    availability: 'disponible',
    featured: false,
    active: true,
    specifications: {} as Record<string, string>,
  });
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  useEffect(() => {
    api.get('/categories?active=true').then((r) => setCategories(r.data));
    api.get('/brands').then((r) => setBrands(r.data));
    if (id) {
      api.get(`/products/${id}`).then((r) => {
        const p = r.data;
        setForm({
          ...p,
          category_id: p.category_id || '',
          brand_id: p.brand_id || '',
          gallery: p.gallery || [],
          specifications: p.specifications || {},
        });
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'service-merchandise/products');
    try {
      const res = await api.post('/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res.data.url as string;
    } catch (e) {
      toast.error('Error al subir imagen');
      return null;
    }
  };

  const onMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadFile(f);
    if (url) setForm({ ...form, main_image: url });
  };

  const onGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files || []);
    if (fs.length === 0) return;
    const fd = new FormData();
    fs.forEach((f) => fd.append('files', f));
    fd.append('folder', 'service-merchandise/products');
    try {
      const res = await api.post('/uploads/images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ ...form, gallery: [...(form.gallery || []), ...res.data.urls] });
    } catch {
      toast.error('Error al subir galería');
    }
  };

  const save = async () => {
    if (!form.internal_code || !form.name) {
      toast.error('Código interno y nombre son obligatorios');
      return;
    }
    setSaving(true);
    try {
      if (id) {
        await api.put(`/products/${id}`, form);
        toast.success('Producto actualizado');
      } else {
        await api.post('/products', form);
        toast.success('Producto creado');
      }
      router.push('/admin/productos');
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const duplicate = async () => {
    try {
      const res = await api.post(`/products/${id}/duplicate`);
      toast.success('Producto duplicado');
      router.push(`/admin/productos/${res.data.id}`);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const remove = async () => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Eliminado');
      router.push('/admin/productos');
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const addSpec = () => {
    if (!newSpecKey) return;
    setForm({ ...form, specifications: { ...form.specifications, [newSpecKey]: newSpecVal } });
    setNewSpecKey(''); setNewSpecVal('');
  };

  const removeSpec = (k: string) => {
    const s = { ...form.specifications };
    delete s[k];
    setForm({ ...form, specifications: s });
  };

  if (loading) return <div className="text-center py-10">Cargando...</div>;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/productos" className="flex items-center gap-1 text-sm text-ink-muted hover:text-sm-700">
          <ArrowLeft className="w-4 h-4" /> Productos
        </Link>
        <div className="flex gap-2">
          {id && (
            <>
              <button onClick={duplicate} className="btn-ghost"><Copy className="w-4 h-4" /> Duplicar</button>
              <button onClick={remove} className="btn-ghost text-rose-600"><Trash2 className="w-4 h-4" /> Eliminar</button>
            </>
          )}
          <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <h3 className="font-display font-bold text-sm-700 mb-4">Información básica</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Código interno *">
                <input value={form.internal_code} onChange={(e) => setForm({ ...form, internal_code: e.target.value })} className="input-base" />
              </Field>
              <Field label="Nombre *">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-base" />
              </Field>
              <Field label="Categoría">
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-base">
                  <option value="">Seleccionar...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Marca">
                <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} className="input-base">
                  <option value="">Seleccionar...</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
              <div className="col-span-2">
                <Field label="Descripción corta">
                  <textarea rows={2} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="input-base" />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Precio">
                  <textarea rows={5} value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} className="input-base" />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Aplicaciones">
                  <textarea rows={2} value={form.applications} onChange={(e) => setForm({ ...form, applications: e.target.value })} className="input-base" />
                </Field>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-bold text-sm-700 mb-4">Imágenes</h3>
            <Field label="Imagen principal">
              <div className="flex items-center gap-3">
                {form.main_image && <img src={form.main_image} className="w-20 h-20 rounded-lg object-cover" alt="" />}
                <label className="btn-outline cursor-pointer">
                  <Upload className="w-4 h-4" /> Subir
                  <input type="file" accept="image/*" className="hidden" onChange={onMainImage} />
                </label>
                {form.main_image && (
                  <button onClick={() => setForm({ ...form, main_image: '' })} className="text-rose-500"><X className="w-4 h-4" /></button>
                )}
              </div>
            </Field>
            <Field label="Galería">
              <div className="flex flex-wrap gap-2 mb-2">
                {form.gallery.map((g: string, i: number) => (
                  <div key={i} className="relative">
                    <img src={g} className="w-20 h-20 rounded-lg object-cover" alt="" />
                    <button onClick={() => setForm({ ...form, gallery: form.gallery.filter((_: any, idx: number) => idx !== i) })} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-sm-accent">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <input type="file" accept="image/*" multiple className="hidden" onChange={onGallery} />
                </label>
              </div>
            </Field>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-bold text-sm-700 mb-4">Especificaciones</h3>
            <div className="space-y-2">
              {Object.entries(form.specifications || {}).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <input value={k} readOnly className="input-base flex-1 bg-gray-50" />
                  <input value={String(v)} onChange={(e) => setForm({ ...form, specifications: { ...form.specifications, [k]: e.target.value } })} className="input-base flex-1" />
                  <button onClick={() => removeSpec(k)} className="text-rose-500"><X className="w-4 h-4" /></button>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <input value={newSpecKey} onChange={(e) => setNewSpecKey(e.target.value)} placeholder="Característica" className="input-base flex-1" />
                <input value={newSpecVal} onChange={(e) => setNewSpecVal(e.target.value)} placeholder="Valor" className="input-base flex-1" />
                <button onClick={addSpec} className="btn-outline">+ Añadir</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-display font-bold text-sm-700 mb-4">Estado</h3>
            <Field label="Disponibilidad">
              <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="input-base">
                <option value="disponible">Disponible</option>
                <option value="bajo_pedido">Bajo pedido</option>
                <option value="agotado">Agotado</option>
              </select>
            </Field>
            <Field label="Cantidad mínima">
              <input type="number" min={1} value={form.min_quantity} onChange={(e) => setForm({ ...form, min_quantity: Number(e.target.value) })} className="input-base" />
            </Field>
            <label className="flex items-center gap-2 mt-3">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              <span className="text-sm">Producto destacado</span>
            </label>
            <label className="flex items-center gap-2 mt-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              <span className="text-sm">Activo (visible)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-sm-700 block mb-1.5">{label}</label>
      {children}
    </div>
  );
}