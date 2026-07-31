/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Forzamos runtime Node.js en producción (necesario para pg, bcrypt, jsonwebtoken,
  // nodemailer y cloudinary). En Vercel, las funciones Serverless mantienen Node por
  // defecto en Next 14.2, pero lo dejamos explícito.
  experimental: {
    serverComponentsExternalPackages: ['pg', 'pg-mem', 'bcryptjs', 'jsonwebtoken', 'nodemailer', 'cloudinary'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
  },
  // No generar páginas estáticas para rutas dinámicas de Server Components
  // (cada página SC con DB se marca como force-dynamic individualmente).
};

module.exports = nextConfig;
