'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { Lock, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('sm_token', res.data.token);
      toast.success('Bienvenido');
      router.replace('/admin');
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <Logo size="md" />
        <h1 className="font-display text-2xl font-bold text-sm-700 mt-6">Panel administrativo</h1>
        <p className="text-sm text-gray-500 mt-1">Ingresa con tus credenciales</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-sm-700 block mb-1.5">Correo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-base pl-10"
                placeholder="admin@empresa.com"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-sm-700 block mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-base pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Ingresando...</> : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}