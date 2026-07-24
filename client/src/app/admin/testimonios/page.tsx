'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Input } from '@/components/admin/Modal';

const empty = { client_name: '', company: '', position: '', message: '', rating: 5, avatar_url: '', active: true, display_order: 0 };

export default function TestimoniosAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const load = () => api.get('/admin/testimonials').then((r) => setItems(r.data));
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
      if (editing.id) await api.put(`/admin/testimonials/${editing.id}`, editing);
      else await api.post('/admin/testimonials', editing);
      toast.success('Guardado');
      setEditing(null);
      load();
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar?')) return;
    try { await api.delete(`/admin/testimonials/${id}`); toast.success('Eliminado'); load(); }
    catch (e) { toast.error(getErrorMessage(e)); }
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={() => setEditing({ ...empty })} className="btn-primary"><Plus className="w-4 h-4" /> Nuevo</button>
      </div>
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="card p-5 flex gap-3">
            <div className="w-12 h-12 rounded-full bg-sm-50 flex items-center justify-center text-xl font-bold text-sm-700 flex-shrink-0">
              {(t.client_name || 'Sin nombre').charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm-700">{t.client_name}</p>
                <span className="text-xs text-amber-500">{'★'.repeat(t.rating)}</span>
              </div>
              <p className="text-xs text-gray-500">{t.position}{t.company ? ` · ${t.company}` : ''}</p>
              <p className="text-sm mt-2">{t.message}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => setEditing(t)} className="p-2 hover:bg-sm-50 rounded"><Edit className="w-4 h-4 text-sm-700" /></button>
              <button onClick={() => remove(t.id)} className="p-2 hover:bg-rose-50 rounded"><Trash2 className="w-4 h-4 text-rose-500" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing.id ? 'Editar testimonio' : 'Nuevo testimonio'} onClose={() => setEditing(null)} onSave={save}>
          <div className="space-y-3">
            <Input label="Cliente" value={editing.client_name} onChange={(v) => setEditing({ ...editing, client_name: v })} />
            <Input label="Empresa" value={editing.company || ''} onChange={(v) => setEditing({ ...editing, company: v })} />
            <Input label="Cargo" value={editing.position || ''} onChange={(v) => setEditing({ ...editing, position: v })} />
            <div>
              <label className="text-xs font-medium text-sm-700 block mb-1.5">Mensaje</label>
              <textarea rows={4} value={editing.message} onChange={(e) => setEditing({ ...editing, message: e.target.value })} className="input-base" />
            </div>
            <Input label="Rating (1-5)" type="number" value={String(editing.rating)} onChange={(v) => setEditing({ ...editing, rating: Math.min(5, Math.max(1, Number(v))) })} />
            <Input label="URL Avatar" value={editing.avatar_url || ''} onChange={(v) => setEditing({ ...editing, avatar_url: v })} />
            <Input label="Orden" type="number" value={String(editing.display_order)} onChange={(v) => setEditing({ ...editing, display_order: Number(v) })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Activo</label>
          </div>
        </Modal>
      )}
    </div>
  );
}