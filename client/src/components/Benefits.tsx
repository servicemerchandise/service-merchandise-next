'use client';

import { CheckCircle2, Zap, MapPin, Sparkles, HeadphonesIcon, Award } from 'lucide-react';

const benefits = [
  { icon: HeadphonesIcon, title: 'Atención personalizada', desc: 'Asesores comerciales dedicados para tu empresa.' },
  { icon: Zap, title: 'Cotizaciones rápidas', desc: 'Respuesta en menos de 24 horas hábiles.' },
  { icon: MapPin, title: 'Cobertura nacional', desc: 'Despachamos a toda Colombia.' },
  { icon: Sparkles, title: 'Productos personalizados', desc: 'Adaptamos productos a tu marca y necesidades.' },
  { icon: HeadphonesIcon, title: 'Soporte especializado', desc: 'Equipo técnico y comercial a tu servicio.' },
  { icon: Award, title: 'Calidad garantizada', desc: 'Trabajamos con marcas y proveedores verificados.' },
];

export function Benefits() {
  return (
    <section className="container-page py-14">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="badge-blue">¿Por qué elegirnos?</span>
        <h2 className="section-title mt-3">Beneficios de trabajar con Service Merchandise</h2>
        <p className="text-sm text-gray-600 mt-2">
          Una plataforma diseñada para que las empresas consigan lo que necesitan, sin fricción.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="card p-5 flex gap-3 hover:border-sm-accent transition">
              <div className="w-12 h-12 rounded-lg bg-sm-50 text-sm-700 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm-700">{b.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}