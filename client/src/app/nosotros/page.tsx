import Link from 'next/link';
import { Award, Target, Heart, Sparkles } from 'lucide-react';

export const metadata = { title: 'Nosotros' };

export default function NosotrosPage() {
  return (
    <section className="container-page py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="badge-blue">Sobre nosotros</span>
          <h1 className="font-display text-4xl font-bold text-sm-700 mt-3">
            Conectamos empresas con las mejores soluciones
          </h1>
          <p className="text-gray-600 mt-3 leading-relaxed">
            En Service Merchandise somos especialistas en cotización y suministro de productos
            corporativos para empresas en toda Colombia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          <Value icon={Target} title="Misión" desc="Proveer soluciones corporativas ágiles, personalizadas y confiables." />
          <Value icon={Sparkles} title="Visión" desc="Ser el marketplace B2B líder en Colombia para cotización empresarial." />
          <Value icon={Heart} title="Valores" desc="Compromiso, transparencia, innovación y atención humana." />
        </div>

        <div className="card p-8">
          <h2 className="section-title">Nuestra historia</h2>
          <p className="text-gray-700 mt-3 leading-relaxed">
            Nacimos con una idea clara: simplificar el proceso de cotización y suministro
            para empresas. Hoy atendemos a cientos de compañías con un equipo humano y
            tecnología de punta, garantizando respuestas rápidas y propuestas a la medida.
          </p>
          <h2 className="section-title mt-8">¿Por qué elegirnos?</h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            <li className="flex gap-2"><Award className="w-5 h-5 text-sm-700 flex-shrink-0 mt-0.5" /> Catálogo extenso y curado de proveedores verificados.</li>
            <li className="flex gap-2"><Award className="w-5 h-5 text-sm-700 flex-shrink-0 mt-0.5" /> Procesos de cotización sin fricción.</li>
            <li className="flex gap-2"><Award className="w-5 h-5 text-sm-700 flex-shrink-0 mt-0.5" /> Personalización y merchandising corporativo.</li>
            <li className="flex gap-2"><Award className="w-5 h-5 text-sm-700 flex-shrink-0 mt-0.5" /> Cobertura y logística nacional.</li>
          </ul>
        </div>

        <div className="text-center mt-10">
          <Link href="/cotizar" className="btn-primary">Solicita tu cotización</Link>
        </div>
      </div>
    </section>
  );
}

function Value({ icon: Icon, title, desc }: any) {
  return (
    <div className="card p-5 text-center">
      <div className="w-14 h-14 rounded-xl bg-sm-50 text-sm-700 mx-auto flex items-center justify-center">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display font-semibold text-sm-700 mt-3">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}