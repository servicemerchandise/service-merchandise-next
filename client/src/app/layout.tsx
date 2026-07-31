import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { Providers } from './providers';
import { getCompanySettings } from '@/lib/server/repos/company';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Service Merchandise — Marketplace B2B de cotización empresarial',
    template: '%s | Service Merchandise',
  },
  description:
    'Solicita cotizaciones personalizadas de productos corporativos. Atención en menos de 24h, cobertura nacional.',
  keywords:
    'marketplace B2B, cotización empresarial, productos corporativos, merchandising, papelería corporativa, Colombia',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: '/',
    siteName: 'Service Merchandise',
    title: 'Service Merchandise — Marketplace B2B',
    description: 'Cotizaciones empresariales rápidas y personalizadas.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Acceso directo a DB (Server Component) — sin self-fetch HTTP.
  let company = null;
  try {
    company = await getCompanySettings();
  } catch {
    company = null;
  }

  return (
    <html lang="es" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans">
        <Providers>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer company={company || undefined} />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
