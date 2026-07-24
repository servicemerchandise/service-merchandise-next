-- Schema simplificado para pg-mem (compatible en memoria)
-- Elimina CREATE EXTENSION, ON CONFLICT, multi-row INSERTs y los seeds problemáticos

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    image_url TEXT,
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    internal_code VARCHAR(80) UNIQUE NOT NULL,
    name VARCHAR(250) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    category_id UUID,
    brand_id UUID,
    main_image TEXT,
    gallery TEXT[],
    specifications TEXT,
    applications TEXT,
    min_quantity INT DEFAULT 1,
    availability VARCHAR(50) DEFAULT 'disponible',
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    title VARCHAR(250),
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    cta_text VARCHAR(100),
    position VARCHAR(50) DEFAULT 'hero',
    display_order INT DEFAULT 0,
    starts_at TIMESTAMP,
    ends_at TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    full_name VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(200) NOT NULL,
    city VARCHAR(150) NOT NULL,
    comments TEXT,
    items TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'nueva',
    ip_address VARCHAR(60),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    client_name VARCHAR(200) NOT NULL,
    company VARCHAR(200),
    position VARCHAR(150),
    message TEXT NOT NULL,
    rating INT DEFAULT 5,
    avatar_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trusted_brands (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    name VARCHAR(200) NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    author VARCHAR(150),
    category VARCHAR(100),
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    meta_title VARCHAR(200),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    email VARCHAR(200) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_settings (
    id INT PRIMARY KEY,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
