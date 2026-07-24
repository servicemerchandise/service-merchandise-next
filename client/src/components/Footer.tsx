'use client';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, MessageCircle, Twitter } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  company?: {
    company_name?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    city?: string;
    country?: string;
    facebook_url?: string;
    instagram_url?: string;
    linkedin_url?: string;
    tiktok_url?: string;
  };
}

export function Footer({ company }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-sm-700 text-white mt-16">
      {/* Newsletter strip */}
      <div className="bg-sm-500">
        <div className="container-page py-8 grid md:grid-cols-2 gap-4 items-center">
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold">
              Recibe nuestras novedades
            </h3>
            <p className="text-sm-100 text-sm mt-1">
              Promociones, productos destacados y soluciones para tu empresa.
            </p>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              if (!email) return;
              try {
                const res = await fetch('/api/newsletter/subscribe', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email }),
                });
                if (res.ok) alert('¡Gracias por suscribirte!');
              } catch { }
            }}
            className="flex gap-2"
          >
            <input
              name="email"
              type="email"
              required
              placeholder="tu@empresa.com"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm-700 text-sm focus:outline-none"
            />
            <button className="px-5 py-2.5 rounded-lg bg-white text-sm-700 font-medium text-sm hover:bg-sm-50">
              Suscribirme
            </button>
          </form>
        </div>
      </div>

      <div className="container-page py-12 grid md:grid-cols-4 gap-8">
        <div>
          <Logo variant="light" size="md" />
          <p className="text-sm-100 text-sm mt-4 leading-relaxed">
            Marketplace B2B especializado en cotización de productos corporativos.
            Soluciones personalizadas para tu empresa con cobertura nacional.
          </p>
          <div className="flex gap-3 mt-5">
            {company?.facebook_url && (
              <a href={company.facebook_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-sm-accent flex items-center justify-center transition">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {company?.instagram_url && (
              <a href={company.instagram_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-sm-accent flex items-center justify-center transition">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {company?.linkedin_url && (
              <a href={company.linkedin_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-sm-accent flex items-center justify-center transition">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {company?.tiktok_url && (
              <a href={company.tiktok_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-sm-accent flex items-center justify-center transition">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Enlaces rápidos</h4>
          <ul className="space-y-2 text-sm text-sm-100">
            <li><Link href="/productos" className="hover:text-white">Productos</Link></li>
            <li><Link href="/categorias" className="hover:text-white">Categorías</Link></li>
            <li><Link href="/marcas" className="hover:text-white">Marcas</Link></li>
            <li><Link href="/cotizar" className="hover:text-white">Solicitar Cotización</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Políticas</h4>
          <ul className="space-y-2 text-sm text-sm-100">
            <li><Link href="/politicas/privacidad" className="hover:text-white">Política de privacidad</Link></li>
            <li><Link href="/politicas/terminos" className="hover:text-white">Términos y condiciones</Link></li>
            <li><Link href="/politicas/datos" className="hover:text-white">Tratamiento de datos</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contáctanos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Contacto</h4>
          <ul className="space-y-3 text-sm text-sm-100">
            {company?.address && (
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{company.address}{company.city ? `, ${company.city}` : ''}</span>
              </li>
            )}
            {company?.phone && (
              <li className="flex gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href={`tel:${company.phone}`} className="hover:text-white">{company.phone}</a>
              </li>
            )}
            {company?.whatsapp && (
              <li className="flex gap-2">
                <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a
                  href={`https://wa.me/${company.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
            )}
            {company?.email && (
              <li className="flex gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${company.email}`} className="hover:text-white break-all">{company.email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-sm-100">
          <p>© {year} Service Merchandise. Todos los derechos reservados.</p>
          <p>Marketplace B2B de cotización empresarial</p>
        </div>
      </div>
    </footer>
  );
}