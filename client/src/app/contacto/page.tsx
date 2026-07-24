import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export const metadata = { title: 'Contacto' };

export default function ContactoPage() {
  return (
    <section className="container-page py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="badge-blue">Contacto</span>
          <h1 className="font-display text-4xl font-bold text-sm-700 mt-3">Estamos para ayudarte</h1>
          <p className="text-gray-600 mt-3">
            Múltiples canales de atención para empresas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg text-sm-700 mb-4">Información</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3 items-center"><Phone className="w-4 h-4 text-sm-700" /> +57 (601) 808 8287</li>
              <li className="flex gap-3 items-center"><MessageCircle className="w-4 h-4 text-sm-700" /> WhatsApp +57 322 771 1881</li>
              <li className="flex gap-3 items-center"><Mail className="w-4 h-4 text-sm-700" /> atencionservicemerchandise@gmail.com</li>
              <li className="flex gap-3 items-start"><MapPin className="w-4 h-4 text-sm-700 mt-0.5" /> Bogotá D.C., Colombia</li>
            </ul>
          </div>
          <div className="card p-6 bg-sm-700 text-white">
            <h2 className="font-display font-bold text-lg mb-2">Atención comercial</h2>
            <p className="text-sm-100 text-sm mb-4">
              Solicita tu cotización personalizada y un asesor se pondrá en contacto en menos de 24h.
            </p>
            <a href="/cotizar" className="btn-accent inline-flex">
              Solicitar Cotización
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}