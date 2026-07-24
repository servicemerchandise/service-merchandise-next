import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { Providers } from './providers';
import { api } from '@/lib/api';
import { CompanySettings } from '@/lib/types';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Service Merchandise — Marketplace B2B de cotización empresarial',
    template: '%s | Service Merchandise',
  },
  description: 'Solicita cotizaciones personalizadas de productos corporativos. Atención en menos de 24h, cobertura nacional.',
  keywords: 'marketplace B2B, cotización empresarial, productos corporativos, merchandising, papelería corporativa, Colombia',
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

async function getCompany(): Promise<CompanySettings | null> {
  try {
    const res = await api.get('/company');
    return res.data;
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const company = await getCompany();
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