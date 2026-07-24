'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Input } from '@/components/admin/Modal';

const empty = { name: '', logo_url: '', website_url: '', display_order: 0, active: true };

export default function MarcasConfianzaAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const load = () => api.get('/admin/trusted-brands').then((r) => setItems(r.data));
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
      if (editing.id) await api.put(`/admin/trusted-brands/${editing.id}`, editing);
      else await api.post('/admin/trusted-brands', editing);
      toast.success('Guardado');
      setEditing(null);
      load();
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar?')) return;
    try { await api.delete(`/admin/trusted-brands/${id}`); toast.success('Eliminado'); load(); }
    catch (e) { toast.error(getErrorMessage(e)); }
  };

  const upload = async (f: File) => {
    const fd = new FormData();
    fd.append('file', f);
    fd.append('folder', 'service-merchandise/trusted');
    try {
      const res = await api.post('/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setEditing({ ...editing, logo_url: res.data.url });
    } catch { toast.error('Error al subir'); }
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={() => setEditing({ ...empty })} className="btn-primary"><Plus className="w-4 h-4" /> Añadir marca</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((b) => (
          <div key={b.id} className="card p-4 flex flex-col items-center">
            <div className="h-16 flex items-center justify-center mb-2">
              {b.logo_url ? <img src={b.logo_url} className="max-h-12 max-w-full object-contain" alt="" /> : <span className="text-gray-400">{b.name}</span>}
            </div>
            <p className="text-sm font-medium text-center">{b.name}</p>
            <div className="mt-2 flex gap-1">
              <button onClick={() => setEditing(b)} className="p-1.5 hover:bg-sm-50 rounded"><Edit className="w-3.5 h-3.5 text-sm-700" /></button>
              <button onClick={() => remove(b.id)} className="p-1.5 hover:bg-rose-50 rounded"><Trash2 className="w-3.5 h-3.5 text-rose-500" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing.id ? 'Editar marca cliente' : 'Nueva marca cliente'} onClose={() => setEditing(null)} onSave={save}>
          <div className="space-y-3">
            <Input label="Nombre" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Input label="Sitio web" value={editing.website_url || ''} onChange={(v) => setEditing({ ...editing, website_url: v })} />
            <Input label="Orden" type="number" value={String(editing.display_order)} onChange={(v) => setEditing({ ...editing, display_order: Number(v) })} />
            <div>
              <label className="text-xs font-medium text-sm-700 block mb-1.5">Logo</label>
              <div className="flex items-center gap-3">
                {editing.logo_url && <img src={editing.logo_url} className="h-12 object-contain" alt="" />}
                <label className="btn-outline cursor-pointer">
                  <Upload className="w-4 h-4" /> Subir
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                </label>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Activo</label>
          </div>
        </Modal>
      )}
    </div>
  );
}