'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Input } from '@/components/admin/Modal';

const empty = {
  title: '', subtitle: '', image_url: '', link_url: '', cta_text: '',
  position: 'hero', display_order: 0, starts_at: '', ends_at: '', active: true,
};

export default function BannersAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const load = () => api.get('/banners/all').then((r) => setItems(r.data));
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const r = await api.get('/brands');
        setItems(r.data);
      } catch (e) {
        toast.error(getErrorMessage(e));
      }
    };

    fetchBrands();
  }, []);

  const save = async () => {
    try {
      const payload = { ...editing };
      if (!payload.starts_at) delete payload.starts_at;
      if (!payload.ends_at) delete payload.ends_at;
      if (editing.id) await api.put(`/banners/${editing.id}`, payload);
      else await api.post('/banners', payload);
      toast.success('Guardado');
      setEditing(null);
      load();
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar?')) return;
    try { await api.delete(`/banners/${id}`); toast.success('Eliminado'); load(); }
    catch (e) { toast.error(getErrorMessage(e)); }
  };

  const uploadImg = async (f: File) => {
    const fd = new FormData();
    fd.append('file', f);
    fd.append('folder', 'service-merchandise/banners');
    try {
      const res = await api.post('/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setEditing({ ...editing, image_url: res.data.url });
    } catch { toast.error('Error al subir'); }
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={() => setEditing({ ...empty })} className="btn-primary"><Plus className="w-4 h-4" /> Nuevo banner</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((b) => (
          <div key={b.id} className="card overflow-hidden">
            <div className="aspect-video bg-gray-100">
              {b.image_url && <img src={b.image_url} className="w-full h-full object-cover" alt="" />}
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-sm-700">{b.title || 'Sin título'}</h4>
              <p className="text-xs text-gray-500">{b.position}</p>
              <div className="mt-3 flex gap-1">
                <button onClick={() => setEditing(b)} className="btn-ghost text-xs"><Edit className="w-3.5 h-3.5" /> Editar</button>
                <button onClick={() => remove(b.id)} className="btn-ghost text-xs text-rose-500"><Trash2 className="w-3.5 h-3.5" /> Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing.id ? 'Editar banner' : 'Nuevo banner'} onClose={() => setEditing(null)} onSave={save}>
          <div className="space-y-3">
            <Input label="Título" value={editing.title || ''} onChange={(v) => setEditing({ ...editing, title: v })} />
            <Input label="Subtítulo" value={editing.subtitle || ''} onChange={(v) => setEditing({ ...editing, subtitle: v })} />
            <div>
              <label className="text-xs font-medium text-sm-700 block mb-1.5">Imagen</label>
              <div className="flex items-center gap-3">
                {editing.image_url && <img src={editing.image_url} className="h-16 object-cover rounded" alt="" />}
                <label className="btn-outline cursor-pointer">
                  <Upload className="w-4 h-4" /> Subir
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImg(e.target.files[0])} />
                </label>
              </div>
            </div>
            <Input label="URL enlace" value={editing.link_url || ''} onChange={(v) => setEditing({ ...editing, link_url: v })} />
            <Input label="Texto del botón" value={editing.cta_text || ''} onChange={(v) => setEditing({ ...editing, cta_text: v })} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-sm-700 block mb-1.5">Posición</label>
                <select value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value })} className="input-base">
                  <option value="hero">Hero principal</option>
                  <option value="secondary">Secundario</option>
                  <option value="promo">Promocional</option>
                </select>
              </div>
              <Input label="Orden" type="number" value={String(editing.display_order)} onChange={(v) => setEditing({ ...editing, display_order: Number(v) })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-sm-700 block mb-1.5">Inicio</label>
                <input type="datetime-local" value={editing.starts_at ? editing.starts_at.substring(0, 16) : ''} onChange={(e) => setEditing({ ...editing, starts_at: e.target.value })} className="input-base" />
              </div>
              <div>
                <label className="text-xs font-medium text-sm-700 block mb-1.5">Fin</label>
                <input type="datetime-local" value={editing.ends_at ? editing.ends_at.substring(0, 16) : ''} onChange={(e) => setEditing({ ...editing, ends_at: e.target.value })} className="input-base" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Activo</label>
          </div>
        </Modal>
      )}
    </div>
  );
}