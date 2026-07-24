'use client';

import { useState } from 'react';
import { X, Trash2, Plus, Minus, FileText, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { api, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

export function CartDrawer() {
  const { items, isOpen, setOpen, remove, update, clear, count } = useCart();
  const [step, setStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    comments: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setStep('cart');
    setForm({ full_name: '', company: '', phone: '', email: '', city: '', comments: '' });
    setErrors({});
  };

  const close = () => {
    setOpen(false);
    setTimeout(reset, 300);
  };

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
      clear();
      setStep('success');
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between p-4 border-b bg-sm-700 text-white">
          <div className="flex items-center gap-2">
            {step === 'cart' ? <ShoppingBag className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            <h2 className="font-display font-semibold">
              {step === 'cart' && `Carrito de Cotización (${count()})`}
              {step === 'form' && 'Datos de contacto'}
              {step === 'success' && '¡Solicitud enviada!'}
            </h2>
          </div>
          <button onClick={close} className="p-1 hover:bg-white/10 rounded">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="p-10 text-center">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">Tu carrito está vacío.</p>
                  <p className="text-gray-400 text-xs mt-1">Agrega productos para solicitar tu cotización.</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {items.map((item) => (
                    <li key={item.product_id} className="p-4 flex gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&q=80'}
                        alt={item.name}
                        className="w-16 h-16 rounded-md object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-gray-400">Cód: {item.code}</p>
                        <p className="text-sm font-medium text-sm-700 line-clamp-2">{item.name}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() =>
                              update(item.product_id, { quantity: Math.max(1, item.quantity - 1) })
                            }
                            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              update(item.product_id, { quantity: Math.max(1, Number(e.target.value)) })
                            }
                            className="w-14 text-center text-sm border border-gray-300 rounded py-1"
                          />
                          <button
                            onClick={() => update(item.product_id, { quantity: item.quantity + 1 })}
                            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => remove(item.product_id)}
                            className="ml-auto text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={1}
                          placeholder="Observaciones (opcional)"
                          value={item.observations || ''}
                          onChange={(e) => update(item.product_id, { observations: e.target.value })}
                          className="mt-2 w-full text-xs px-2 py-1.5 border border-gray-200 rounded resize-none focus:outline-none focus:border-sm-accent"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {step === 'form' && (
            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-500">
                Completa tus datos para enviar la solicitud. Te contactaremos en menos de 24 horas.
              </p>
              {(['full_name', 'company', 'phone', 'email', 'city'] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs font-medium text-sm-700 block mb-1">
                    {field === 'full_name' && 'Nombre completo *'}
                    {field === 'company' && 'Empresa *'}
                    {field === 'phone' && 'Número celular *'}
                    {field === 'email' && 'Correo electrónico *'}
                    {field === 'city' && 'Ciudad *'}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className={`input-base ${errors[field] ? 'border-rose-400' : ''}`}
                  />
                  {errors[field] && <p className="text-xs text-rose-500 mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-sm-700 block mb-1">Comentarios adicionales</label>
                <textarea
                  rows={3}
                  value={form.comments}
                  onChange={(e) => setForm({ ...form, comments: e.target.value })}
                  className="input-base"
                  placeholder="Cuéntanos más sobre lo que necesitas..."
                />
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-display font-bold text-lg text-sm-700">¡Recibimos tu solicitud!</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Enviaremos tu cotización al correo registrado en menos de 24 horas hábiles.
              </p>
              <button onClick={close} className="btn-primary mt-6 w-full">
                Cerrar
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {(step === 'cart' || step === 'form') && (
          <footer className="border-t p-4 bg-gray-50">
            {step === 'cart' && (
              <button
                disabled={items.length === 0}
                onClick={() => setStep('form')}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar con la solicitud <FileText className="w-4 h-4" />
              </button>
            )}
            {step === 'form' && (
              <div className="space-y-2">
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {submitting ? 'Enviando...' : 'Enviar Solicitud'} <FileText className="w-4 h-4" />
                </button>
                <button onClick={() => setStep('cart')} className="btn-ghost w-full">
                  Volver al carrito
                </button>
              </div>
            )}
          </footer>
        )}
      </aside>
    </>
  );
}