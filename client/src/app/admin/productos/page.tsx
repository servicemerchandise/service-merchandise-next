'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, getErrorMessage } from '@/lib/api';
import { Plus, Edit, Trash2, Copy, Upload, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductosAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showImport, setShowImport] = useState(false);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('limit', '500');
    api.get(`/products?${params}`).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Eliminado');
      load();
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  const downloadTemplate = () => {
    const csv = 'internal_code,name,category,brand,short_description,full_description,applications,min_quantity,main_image,gallery,specifications\nSKU-001,Ejemplo producto,Tecnología,Samsung,Descripción corta,Precio,Oficina,1,https://ejemplo.com/img.jpg,https://ejemplo.com/g1.jpg|https://ejemplo.com/g2.jpg,"{""Color"":""Negro"",""Material"":""Plástico""}"';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'plantilla_productos.csv'; a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="input-base pl-10" />
        </div>
        <div className="flex gap-2">
          <button onClick={downloadTemplate} className="btn-ghost"><Download className="w-4 h-4" /> Plantilla</button>
          <button onClick={() => setShowImport(true)} className="btn-outline"><Upload className="w-4 h-4" /> Importar</button>
          <Link href="/admin/productos/nuevo" className="btn-primary"><Plus className="w-4 h-4" /> Nuevo</Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="text-left px-4 py-3">Imagen</th>
              <th className="text-left px-4 py-3">Producto</th>
              <th className="text-left px-4 py-3">Categoría</th>
              <th className="text-left px-4 py-3">Marca</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-500">Cargando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-500">No hay productos.</td></tr>
            ) : items.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  {p.main_image && <img src={p.main_image} className="w-10 h-10 rounded object-cover" alt="" />}
                </td>
                <td className="px-4 py-2">
                  <p className="font-medium text-sm-700 line-clamp-1">{p.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{p.internal_code}</p>
                </td>
                <td className="px-4 py-2 text-gray-600">{p.category_name || '—'}</td>
                <td className="px-4 py-2 text-gray-600">{p.brand_name || '—'}</td>
                <td className="px-4 py-2">
                  <span className={`badge ${p.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/productos/${p.id}`} className="p-2 hover:bg-sm-50 rounded"><Edit className="w-4 h-4 text-sm-700" /></Link>
                    <button onClick={() => remove(p.id)} className="p-2 hover:bg-rose-50 rounded"><Trash2 className="w-4 h-4 text-rose-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onDone={() => { setShowImport(false); load(); }}
        />
      )}
    </div>
  );
}

function ImportModal({ onClose, onDone }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);

  const handleFile = async (f: File) => {
    setFile(f);
    setParsing(true);
    try {
      const XLSX = await import('xlsx');
      const buf = await f.arrayBuffer();
      const wb = XLSX.read(buf);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws) as any[];
      setRows(data);
    } catch {
      toast.error('Error al leer el archivo');
    } finally {
      setParsing(false);
    }
  };

  const importRows = async () => {
    setImporting(true);
    try {
      const res = await api.post('/products/import', { rows });
      toast.success(`${res.data.imported} productos importados`);
      onDone();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-display font-bold text-lg">Importar productos</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-rose-500">✕</button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {!file ? (
            <label className="block border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-sm-accent">
              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Arrastra o haz clic para subir Excel/CSV</p>
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </label>
          ) : (
            <>
              <p className="text-sm mb-3"><strong>{file.name}</strong> · {rows.length} filas detectadas</p>
              <div className="border rounded-lg overflow-x-auto max-h-80">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>{rows[0] && Object.keys(rows[0]).slice(0, 6).map((k) => <th key={k} className="px-2 py-2 text-left">{k}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 10).map((r, i) => (
                      <tr key={i} className="border-t">
                        {Object.keys(rows[0]).slice(0, 6).map((k) => (
                          <td key={k} className="px-2 py-1.5 truncate max-w-[150px]">{String(r[k] || '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rows.length > 10 && <p className="text-xs text-gray-500 mt-2">Mostrando 10 de {rows.length} filas...</p>}
            </>
          )}
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={importRows} disabled={!rows.length || importing} className="btn-primary disabled:opacity-50">
            {importing ? 'Importando...' : `Importar ${rows.length} productos`}
          </button>
        </div>
      </div>
    </div>
  );
}