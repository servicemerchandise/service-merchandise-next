'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConfiguracionPage() {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/company').then((r) => setForm(r.data || {})).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    try {
      await api.put('/admin/company', form);
      toast.success('Configuración guardada');
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  const upload = async (f: File, field: string) => {
    const fd = new FormData();
    fd.append('file', f);
    fd.append('folder', 'service-merchandise/company');
    try {
      const res = await api.post('/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ ...form, [field]: res.data.url });
    } catch { toast.error('Error al subir'); }
  };

  if (loading) return <div className="text-center py-10">Cargando...</div>;

  return (
    <div className="max-w-3xl space-y-5">
      <div className="card p-5">
        <h3 className="font-display font-bold text-sm-700 mb-4">Información de la empresa</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre" value={form.company_name || ''} onChange={(v) => setForm({ ...form, company_name: v })} />
          <Field label="Email" value={form.email || ''} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Teléfono" value={form.phone || ''} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="WhatsApp" value={form.whatsapp || ''} onChange={(v) => setForm({ ...form, whatsapp: v })} />
          <Field label="Ciudad" value={form.city || ''} onChange={(v) => setForm({ ...form, city: v })} />
          <Field label="País" value={form.country || ''} onChange={(v) => setForm({ ...form, country: v })} />
          <div className="col-span-2">
            <Field label="Dirección" value={form.address || ''} onChange={(v) => setForm({ ...form, address: v })} />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-display font-bold text-sm-700 mb-4">Logo</h3>
        <div className="flex items-center gap-3">
          {form.logo_url && <img src={form.logo_url} className="h-16 object-contain" alt="" />}
          <label className="btn-outline cursor-pointer">
            <Upload className="w-4 h-4" /> Subir logo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'logo_url')} />
          </label>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-display font-bold text-sm-700 mb-4">Redes sociales</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Facebook" value={form.facebook_url || ''} onChange={(v) => setForm({ ...form, facebook_url: v })} />
          <Field label="Instagram" value={form.instagram_url || ''} onChange={(v) => setForm({ ...form, instagram_url: v })} />
          <Field label="LinkedIn" value={form.linkedin_url || ''} onChange={(v) => setForm({ ...form, linkedin_url: v })} />
          <Field label="TikTok" value={form.tiktok_url || ''} onChange={(v) => setForm({ ...form, tiktok_url: v })} />
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-display font-bold text-sm-700 mb-4">SEO general</h3>
        <Field label="Meta título" value={form.meta_title || ''} onChange={(v) => setForm({ ...form, meta_title: v })} />
        <Field label="Meta descripción" value={form.meta_description || ''} onChange={(v) => setForm({ ...form, meta_description: v })} />
        <Field label="Keywords" value={form.meta_keywords || ''} onChange={(v) => setForm({ ...form, meta_keywords: v })} />
      </div>

      <button onClick={save} className="btn-primary"><Save className="w-4 h-4" /> Guardar cambios</button>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function Field({ label, value, onChange }: FieldProps) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-sm-700 block mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input-base" />
    </div>
  );
}