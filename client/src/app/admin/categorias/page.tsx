'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Input } from '@/components/admin/Modal';

const empty = { name: '', description: '', icon: '', image_url: '', display_order: 0, active: true };

export default function CategoriasAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/categories').then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async () => {
    try {
      if (editing.id) await api.put(`/categories/${editing.id}`, editing);
      else await api.post('/categories', editing);
      toast.success('Guardado');
      setEditing(null);
      load();
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Eliminado');
      load();
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={() => setEditing({ ...empty })} className="btn-primary"><Plus className="w-4 h-4" /> Nueva</button>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-left px-4 py-3">Orden</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2 font-medium">{c.name}</td>
                <td className="px-4 py-2 text-gray-500 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-2">{c.display_order}</td>
                <td className="px-4 py-2">
                  <span className={`badge ${c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => setEditing(c)} className="p-2 hover:bg-sm-50 rounded"><Edit className="w-4 h-4 text-sm-700" /></button>
                  <button onClick={() => remove(c.id)} className="p-2 hover:bg-rose-50 rounded"><Trash2 className="w-4 h-4 text-rose-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? 'Editar categoría' : 'Nueva categoría'} onClose={() => setEditing(null)} onSave={save}>
          <div className="space-y-3">
            <Input label="Nombre" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Input label="Descripción" value={editing.description || ''} onChange={(v) => setEditing({ ...editing, description: v })} />
            <Input label="URL imagen" value={editing.image_url || ''} onChange={(v) => setEditing({ ...editing, image_url: v })} />
            <Input label="Orden" type="number" value={String(editing.display_order)} onChange={(v) => setEditing({ ...editing, display_order: Number(v) })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Activa</label>
          </div>
        </Modal>
      )}
    </div>
  );
}