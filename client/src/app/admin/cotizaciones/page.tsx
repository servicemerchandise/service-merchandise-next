'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Download, Search, Filter, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS: any = {
  nueva: 'bg-amber-100 text-amber-700',
  en_proceso: 'bg-blue-100 text-blue-700',
  enviada: 'bg-emerald-100 text-emerald-700',
  cerrada: 'bg-gray-100 text-gray-600',
};

export default function CotizacionesAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [view, setView] = useState<any>(null);

  const load = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    api.get(`/quotations?${params}`).then((r) => setItems(r.data));
  };

  useEffect(load, [search, status]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/quotations/${id}/status`, { status: newStatus });
      toast.success('Estado actualizado');
      load();
      if (view?.id === id) setView({ ...view, status: newStatus });
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar cotización?')) return;
    try { await api.delete(`/quotations/${id}`); toast.success('Eliminada'); load(); setView(null); }
    catch (e) { toast.error(getErrorMessage(e)); }
  };

  const exportExcel = () => {
    const token = localStorage.getItem('sm_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/quotations/export/excel`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.blob())
      .then((b) => {
        const url = URL.createObjectURL(b);
        const a = document.createElement('a');
        a.href = url; a.download = 'cotizaciones.xlsx'; a.click();
      });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente, empresa..." className="input-base pl-10" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-base max-w-[180px]">
          <option value="">Todos los estados</option>
          <option value="nueva">Nueva</option>
          <option value="en_proceso">En proceso</option>
          <option value="enviada">Enviada</option>
          <option value="cerrada">Cerrada</option>
        </select>
        <button onClick={exportExcel} className="btn-outline ml-auto"><Download className="w-4 h-4" /> Exportar Excel</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="text-left px-4 py-3">Fecha</th>
              <th className="text-left px-4 py-3">Cliente</th>
              <th className="text-left px-4 py-3">Empresa</th>
              <th className="text-left px-4 py-3">Contacto</th>
              <th className="text-left px-4 py-3">Productos</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((q) => (
              <tr key={q.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-xs text-gray-500">{new Date(q.created_at).toLocaleDateString('es-CO')}</td>
                <td className="px-4 py-2 font-medium">{q.full_name}</td>
                <td className="px-4 py-2">{q.company}</td>
                <td className="px-4 py-2 text-xs">
                  <div>{q.email}</div>
                  <div className="text-gray-500">{q.phone}</div>
                </td>
                <td className="px-4 py-2">{q.items?.length || 0}</td>
                <td className="px-4 py-2">
                  <select value={q.status} onChange={(e) => updateStatus(q.id, e.target.value)} className={`badge ${STATUS_COLORS[q.status]} border-0 cursor-pointer`}>
                    <option value="nueva">Nueva</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="enviada">Enviada</option>
                    <option value="cerrada">Cerrada</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => setView(q)} className="p-2 hover:bg-sm-50 rounded"><Eye className="w-4 h-4 text-sm-700" /></button>
                  <button onClick={() => remove(q.id)} className="p-2 hover:bg-rose-50 rounded"><Trash2 className="w-4 h-4 text-rose-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-center text-gray-500 py-8 text-sm">No hay cotizaciones.</p>}
      </div>

      {view && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Cotización #{view.id.substring(0, 8).toUpperCase()}</h3>
              <button onClick={() => setView(null)}>✕</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Cliente" value={view.full_name} />
                <Info label="Empresa" value={view.company} />
                <Info label="Correo" value={view.email} />
                <Info label="Celular" value={view.phone} />
                <Info label="Ciudad" value={view.city} />
                <Info label="Fecha" value={new Date(view.created_at).toLocaleString('es-CO')} />
              </div>
              {view.comments && (
                <div className="bg-sm-50 rounded-lg p-3 text-sm">
                  <p className="font-semibold text-xs text-sm-700 mb-1">Comentarios</p>
                  <p>{view.comments}</p>
                </div>
              )}
              <div>
                <p className="font-semibold text-sm mb-2">Productos solicitados ({view.items?.length})</p>
                <table className="w-full text-sm border">
                  <thead className="bg-gray-50">
                    <tr><th className="px-2 py-2 text-left">Cód</th><th className="px-2 py-2 text-left">Producto</th><th className="px-2 py-2">Cant.</th><th className="px-2 py-2 text-left">Obs.</th></tr>
                  </thead>
                  <tbody>
                    {view.items?.map((it: any, i: number) => (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-1.5 font-mono text-xs">{it.code}</td>
                        <td className="px-2 py-1.5">{it.name}</td>
                        <td className="px-2 py-1.5 text-center font-bold">{it.quantity}</td>
                        <td className="px-2 py-1.5 text-gray-500">{it.observations || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-sm-700">{value}</p>
    </div>
  );
}