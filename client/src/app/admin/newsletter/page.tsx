'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Download, Mail } from 'lucide-react';

export default function NewsletterAdminPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/admin/newsletter').then((r) => setItems(r.data));
  }, []);

  const exportCsv = () => {
    const csv = 'email,fecha\n' + items.map((i) => `${i.email},${i.subscribed_at}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'newsletter.csv'; a.click();
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
        <p className="text-sm text-gray-600">{items.length} suscriptores</p>
        <button onClick={exportCsv} className="btn-outline"><Download className="w-4 h-4" /> Exportar CSV</button>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Fecha de suscripción</th>
              <th className="text-left px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="px-4 py-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> {i.email}
                </td>
                <td className="px-4 py-2 text-gray-500">{new Date(i.subscribed_at).toLocaleString('es-CO')}</td>
                <td className="px-4 py-2">
                  <span className={`badge ${i.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {i.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}