-- =====================================================
-- SERVICE MERCHANDISE - DATABASE SCHEMA
-- PostgreSQL
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS (Panel Administrativo)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- CATEGORIES
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    image_url TEXT,
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- BRANDS
-- =====================================================
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- PRODUCTS
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internal_code VARCHAR(80) UNIQUE NOT NULL,
    name VARCHAR(250) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    main_image TEXT,
    gallery TEXT[], -- array de URLs
    specifications JSONB DEFAULT '{}'::jsonb,
    applications TEXT,
    min_quantity INT DEFAULT 1,
    availability VARCHAR(50) DEFAULT 'disponible', -- disponible | bajo_pedido | agotado
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- =====================================================
-- BANNERS
-- =====================================================
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(250),
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    cta_text VARCHAR(100),
    position VARCHAR(50) DEFAULT 'hero', -- hero | secondary | promo
    display_order INT DEFAULT 0,
    starts_at TIMESTAMP,
    ends_at TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- QUOTATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(200) NOT NULL,
    city VARCHAR(150) NOT NULL,
    comments TEXT,
    items JSONB NOT NULL, -- [{ product_id, name, code, quantity, observations }]
    status VARCHAR(50) DEFAULT 'nueva', -- nueva | en_proceso | enviada | cerrada
    ip_address VARCHAR(60),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created ON quotations(created_at DESC);

-- =====================================================
-- TESTIMONIALS
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(200) NOT NULL,
    company VARCHAR(200),
    position VARCHAR(150),
    message TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TRUSTED BRANDS (logos de empresas clientes)
-- =====================================================
CREATE TABLE IF NOT EXISTS trusted_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- BLOG POSTS
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    author VARCHAR(150),
    category VARCHAR(100), -- noticias | tendencias | casos | destacados
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    meta_title VARCHAR(200),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- NEWSLETTER SUBSCRIBERS
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(200) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT NOW(),
    unsubscribed_at TIMESTAMP
);

-- =====================================================
-- COMPANY SETTINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS company_settings (
    id INT PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(200) DEFAULT 'Service Merchandise',
    email VARCHAR(200),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    address TEXT,
    city VARCHAR(150),
    country VARCHAR(100),
    facebook_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    tiktok_url TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    meta_title VARCHAR(200),
    meta_description TEXT,
    meta_keywords TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO company_settings (id, company_name)
VALUES (1, 'Service Merchandise')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED: CATEGORIES
-- =====================================================
INSERT INTO categories (name, slug, display_order) VALUES
('Tecnología', 'tecnologia', 1),
('Herramientas', 'herramientas', 2),
('Papelería', 'papeleria', 3),
('Oficina', 'oficina', 4),
('Promocionales', 'promocionales', 5),
('Seguridad Industrial', 'seguridad-industrial', 6),
('Hogar', 'hogar', 7),
('Eventos', 'eventos', 8),
('Merchandising Corporativo', 'merchandising-corporativo', 9),
('Personalizados', 'personalizados', 10)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED: TRUSTED BRANDS
-- =====================================================
INSERT INTO trusted_brands (name, display_order) VALUES
('Bavaria', 1),
('Nutresa', 2),
('Éxito', 3),
('Sura', 4),
('Argos', 5),
('Terpel', 6),
('Davivienda', 7)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED: TESTIMONIALS
-- =====================================================
INSERT INTO testimonials (client_name, company, position, message, rating, display_order) VALUES
('Carlos Ramírez', 'Grupo Industrial XYZ', 'Director de Compras', 'Excelente atención y rapidez en nuestras cotizaciones. Service Merchandise se convirtió en nuestro aliado estratégico.', 5, 1),
('María Fernández', 'Constructora Andina', 'Gerente Administrativa', 'La calidad de los productos y la personalización superaron nuestras expectativas. Totalmente recomendados.', 5, 2),
('Juan Pablo Ortiz', 'TechSolutions S.A.', 'CEO', 'Proceso ágil, profesional y con muy buenas opciones de personalización. Excelente servicio.', 5, 3)
ON CONFLICT DO NOTHING;
