export default function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Service Merchandise',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
    description: 'Marketplace B2B de cotización de productos corporativos en Colombia.',
    address: { '@type': 'PostalAddress', addressCountry: 'CO' },
    sameAs: [],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}