'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Input } from '@/components/admin/Modal';

const empty = { name: '', logo_url: '', description: '', active: true };

export default function MarcasAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const load = () => api.get('/brands').then((r) => setItems(r.data));
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
      if (editing.id) await api.put(`/brands/${editing.id}`, editing);
      else await api.post('/brands', editing);
      toast.success('Guardado');
      setEditing(null);
      load();
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar?')) return;
    try { await api.delete(`/brands/${id}`); toast.success('Eliminado'); load(); }
    catch (e) { toast.error(getErrorMessage(e)); }
  };

  const uploadLogo = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'service-merchandise/brands');
    try {
      const res = await api.post('/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setEditing({ ...editing, logo_url: res.data.url });
    } catch { toast.error('Error al subir'); }
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
              <th className="text-left px-4 py-3">Logo</th>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="px-4 py-2">
                  {b.logo_url ? <img src={b.logo_url} className="h-10 object-contain" alt="" /> : <div className="w-10 h-10 bg-gray-100 rounded" />}
                </td>
                <td className="px-4 py-2 font-medium">{b.name}</td>
                <td className="px-4 py-2">
                  <span className={`badge ${b.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {b.active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => setEditing(b)} className="p-2 hover:bg-sm-50 rounded"><Edit className="w-4 h-4 text-sm-700" /></button>
                  <button onClick={() => remove(b.id)} className="p-2 hover:bg-rose-50 rounded"><Trash2 className="w-4 h-4 text-rose-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? 'Editar marca' : 'Nueva marca'} onClose={() => setEditing(null)} onSave={save}>
          <div className="space-y-3">
            <Input label="Nombre" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Input label="Descripción" value={editing.description || ''} onChange={(v) => setEditing({ ...editing, description: v })} />
            <div>
              <label className="text-xs font-medium text-sm-700 block mb-1.5">Logo</label>
              <div className="flex items-center gap-3">
                {editing.logo_url && <img src={editing.logo_url} className="h-12 object-contain" alt="" />}
                <label className="btn-outline cursor-pointer">
                  <Upload className="w-4 h-4" /> Subir
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
                </label>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Activa</label>
          </div>
        </Modal>
      )}
    </div>
  );
}