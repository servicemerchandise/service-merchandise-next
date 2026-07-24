export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  active: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  active: boolean;
}

export interface Product {
  id: string;
  internal_code: string;
  name: string;
  slug: string;
  short_description?: string;
  full_description?: string;
  category_id?: string;
  category_name?: string;
  brand_id?: string;
  brand_name?: string;
  brand_logo?: string;
  main_image?: string;
  gallery: string[];
  specifications: Record<string, string>;
  applications?: string;
  min_quantity: number;
  availability: 'disponible' | 'bajo_pedido' | 'agotado';
  featured: boolean;
  active: boolean;
  created_at: string;
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  cta_text?: string;
  position: string;
  display_order: number;
  starts_at?: string;
  ends_at?: string;
  active: boolean;
}

export interface QuotationItem {
  product_id: string;
  code: string;
  name: string;
  image?: string;
  quantity: number;
  observations?: string;
}

export interface Quotation {
  id: string;
  full_name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  comments?: string;
  items: QuotationItem[];
  status: 'nueva' | 'en_proceso' | 'enviada' | 'cerrada';
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company?: string;
  position?: string;
  message: string;
  rating: number;
  avatar_url?: string;
  active: boolean;
}

export interface TrustedBrand {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author?: string;
  category?: string;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface CompanySettings {
  company_name: string;
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
  logo_url?: string;
  meta_title?: string;
  meta_description?: string;
}