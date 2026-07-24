'use client';

import { useState } from 'react';
import { FileText, Check, Mail, Phone, Building2, MapPin, User, MessageSquare } from 'lucide-react';
import { api, getErrorMessage } from '@/lib/api';
import { useCart } from '@/lib/cart';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CotizarPage() {
  const { items, count } = useCart();
  const [form, setForm] = useState({
    full_name: '', company: '', phone: '', email: '', city: '', comments: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = 'Requerido';
    if (!form.company.trim()) e.company = 'Requerido';
    if (!form.phone.trim()) e.phone = 'Requerido';
    if (!form.email.trim()) e.email = 'Requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.city.trim()) e.city = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    if (items.length === 0) {
      toast.error('Agrega al menos un producto antes de enviar la solicitud.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/quotations', {
        ...form,
        items: items.map((i) => ({
          product_id: i.product_id,
          code: i.code,
          name: i.name,
          quantity: i.quantity,
          observations: i.observations,
        })),
      });
      useCart.getState().clear();
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <section className="container-page py-20 max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 mx-auto flex items-center justify-center mb-5">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="font-display text-3xl font-bold text-sm-700">¡Solicitud enviada con éxito!</h1>
        <p className="text-gray-600 mt-3 leading-relaxed">
          Hemos recibido tu solicitud de cotización. Te enviaremos una respuesta personalizada
          al correo registrado en menos de 24 horas hábiles.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/productos" className="btn-primary">Seguir explorando</Link>
          <Link href="/" className="btn-outline">Volver al inicio</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="badge-blue"><FileText className="w-3 h-3 inline mr-1" /> Solicitud de cotización</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-sm-700 mt-3">
            Solicita tu cotización personalizada
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Completa el formulario y te enviaremos una propuesta a medida en menos de 24 horas.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-600 mb-4">No tienes productos en tu carrito.</p>
            <Link href="/productos" className="btn-primary">Explorar productos</Link>
          </div>
        ) : (
          <>
            <div className="card p-5 mb-6">
              <h2 className="font-display font-bold text-sm-700 mb-3">
                Productos en tu solicitud ({count()})
              </h2>
              <ul className="divide-y">
                {items.map((i) => (
                  <li key={i.product_id} className="py-3 flex items-center gap-3 text-sm">
                    {i.image && <img src={i.image} className="w-12 h-12 rounded object-cover" alt="" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm-700 truncate">{i.name}</p>
                      <p className="text-xs text-gray-500">Cód: {i.code} · Cant: {i.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-sm-700 mb-5">Datos de contacto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombre completo *" icon={User} error={errors.full_name}>
                  <input
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className={`input-base ${errors.full_name ? 'border-rose-400' : ''}`}
                  />
                </Field>
                <Field label="Empresa *" icon={Building2} error={errors.company}>
                  <input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className={`input-base ${errors.company ? 'border-rose-400' : ''}`}
                  />
                </Field>
                <Field label="Número celular *" icon={Phone} error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`input-base ${errors.phone ? 'border-rose-400' : ''}`}
                  />
                </Field>
                <Field label="Correo electrónico *" icon={Mail} error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`input-base ${errors.email ? 'border-rose-400' : ''}`}
                  />
                </Field>
                <Field label="Ciudad *" icon={MapPin} error={errors.city}>
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={`input-base ${errors.city ? 'border-rose-400' : ''}`}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Comentarios adicionales" icon={MessageSquare}>
                    <textarea
                      rows={4}
                      value={form.comments}
                      onChange={(e) => setForm({ ...form, comments: e.target.value })}
                      className="input-base"
                      placeholder="Cuéntanos más sobre lo que necesitas, plazos, presupuesto, etc."
                    />
                  </Field>
                </div>
              </div>

              <button
                onClick={submit}
                disabled={submitting}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                {submitting ? 'Enviando solicitud...' : 'Enviar Solicitud'}
                <FileText className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Al enviar, aceptas nuestras políticas de tratamiento de datos.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Field({ label, icon: Icon, error, children }: any) {
  return (
    <div>
      <label className="text-xs font-medium text-sm-700 block mb-1.5 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}