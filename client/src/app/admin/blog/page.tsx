'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Input } from '@/components/admin/Modal';

const empty = {
  title: '', excerpt: '', content: '', cover_image: '', author: '',
  category: 'noticias', published: false, meta_title: '', meta_description: '',
};

export default function BlogAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const load = () => api.get('/admin/blog').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing.id) await api.put(`/admin/blog/${editing.id}`, editing);
      else await api.post('/admin/blog', editing);
      toast.success('Guardado');
      setEditing(null);
      load();
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar?')) return;
    try { await api.delete(`/admin/blog/${id}`); toast.success('Eliminado'); load(); }
    catch (e) { toast.error(getErrorMessage(e)); }
  };

  const upload = async (f: File) => {
    const fd = new FormData();
    fd.append('file', f);
    fd.append('folder', 'service-merchandise/blog');
    try {
      const res = await api.post('/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setEditing({ ...editing, cover_image: res.data.url });
    } catch { toast.error('Error al subir'); }
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={() => setEditing({ ...empty })} className="btn-primary"><Plus className="w-4 h-4" /> Nuevo artículo</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="card overflow-hidden">
            {p.cover_image && <img src={p.cover_image} className="w-full aspect-video object-cover" alt="" />}
            <div className="p-4">
              <span className={`badge ${p.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {p.published ? 'Publicado' : 'Borrador'}
              </span>
              <h4 className="font-semibold text-sm-700 mt-2 line-clamp-2">{p.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{p.category}</p>
              <div className="mt-3 flex gap-1">
                <button onClick={() => setEditing(p)} className="btn-ghost text-xs"><Edit className="w-3.5 h-3.5" /> Editar</button>
                <button onClick={() => remove(p.id)} className="btn-ghost text-xs text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing.id ? 'Editar artículo' : 'Nuevo artículo'} onClose={() => setEditing(null)} onSave={save}>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            <Input label="Título" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <Input label="Extracto" value={editing.excerpt || ''} onChange={(v) => setEditing({ ...editing, excerpt: v })} />
            <div>
              <label className="text-xs font-medium text-sm-700 block mb-1.5">Contenido (HTML)</label>
              <textarea rows={8} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="input-base font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Autor" value={editing.author || ''} onChange={(v) => setEditing({ ...editing, author: v })} />
              <div>
                <label className="text-xs font-medium text-sm-700 block mb-1.5">Categoría</label>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input-base">
                  <option value="noticias">Noticias</option>
                  <option value="tendencias">Tendencias</option>
                  <option value="casos">Casos de éxito</option>
                  <option value="destacados">Productos destacados</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-sm-700 block mb-1.5">Imagen portada</label>
              <div className="flex items-center gap-3">
                {editing.cover_image && <img src={editing.cover_image} className="h-12 object-cover rounded" alt="" />}
                <label className="btn-outline cursor-pointer">
                  <Upload className="w-4 h-4" /> Subir
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Meta título (SEO)" value={editing.meta_title || ''} onChange={(v) => setEditing({ ...editing, meta_title: v })} />
              <Input label="Meta descripción (SEO)" value={editing.meta_description || ''} onChange={(v) => setEditing({ ...editing, meta_description: v })} />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Publicar</label>
          </div>
        </Modal>
      )}
    </div>
  );
}