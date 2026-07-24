# SERVICE MERCHANDISE — Marketplace B2B de Cotización

Plataforma web profesional tipo marketplace B2B para **Service Merchandise**, orientada a solicitudes de cotización empresariales. Inspirada en la experiencia visual de Alibaba.com pero adaptada a un modelo de cotización sin compra online ni pagos.

## 🎯 Características principales

- ✅ **Catálogo de productos** con galería, ficha técnica, especificaciones y cantidades mínimas.
- ✅ **Carrito de cotización** (sin checkout ni pago).
- ✅ **Formulario obligatorio** para generar la solicitud.
- ✅ **Envío automático de correos** al administrador y al cliente.
- ✅ **Panel administrativo completo** con CRUD para todos los recursos.
- ✅ **Importación masiva** de productos desde Excel/CSV.
- ✅ **Gestión de banners**, marcas, categorías, testimonios, blog y newsletter.
- ✅ **Sección "Marcas que confían"** con carrusel.
- ✅ **Blog / Novedades**.
- ✅ **Newsletter** integrado.
- ✅ **SEO técnico**: sitemap dinámico, robots, Open Graph, Schema.org.
- ✅ **Responsive** optimizado para móvil, tablet y desktop.
- ✅ **Identidad visual** basada en el logo: azul corporativo oscuro / medio / claro + grises suaves.

## 🧱 Stack técnico

| Capa | Tecnología |
|------|------------|
| Frontend público | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| Panel admin | Mismo Next.js, ruta `/admin` |
| Backend | Node.js, Express, TypeScript |
| Base de datos | PostgreSQL |
| Auth | JWT |
| Correos | Nodemailer (SMTP) |
| Imágenes | Cloudinary |
| Excel/CSV | SheetJS (xlsx) |

## 📁 Estructura del proyecto

```
service-merchandise/
├── client/                  # Frontend Next.js (público + admin)
│   ├── src/
│   │   ├── app/             # Rutas (App Router)
│   │   ├── components/      # Componentes reutilizables
│   │   └── lib/             # API client, tipos, store Zustand
│   └── package.json
├── server/                  # Backend Express
│   ├── src/
│   │   ├── routes/          # Rutas REST
│   │   ├── services/        # Mailer, Cloudinary
│   │   ├── middlewares/     # Auth JWT
│   │   ├── db/              # Pool de PostgreSQL
│   │   └── config/          # Variables de entorno
│   └── package.json
└── database/
    └── schema.sql           # Esquema completo de la BD
```

## 🚀 Instalación y arranque

### 1. Base de datos

```bash
psql -U postgres -c "CREATE DATABASE service_merchandise;"
psql -U postgres -d service_merchandise -f database/schema.sql
```

### 2. Backend

```bash
cd server
cp .env.example .env
# Edita .env con tus credenciales (DB, SMTP, Cloudinary, etc.)
npm install
npm run dev
# Servidor en http://localhost:4000
```

### 3. Frontend

```bash
cd client
cp .env.example .env
# NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev
# Cliente en http://localhost:3000
```

## 👤 Crear usuario administrador

Conecta a PostgreSQL y crea un usuario. Puedes generar el hash bcrypt con:

```bash
node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"
```

Luego inserta:

```sql
INSERT INTO users (name, email, password_hash, role)
VALUES ('Administrador', 'admin@servicemerchandise.com', '<HASH>', 'admin');
```

Accede al panel en `http://localhost:3000/admin/login`.

## 🔐 Endpoints API principales

### Públicos
- `GET /api/products` — Listar productos (con filtros `?search=`, `?category=`, `?brand=`, `?featured=true`)
- `GET /api/products/slug/:slug` — Detalle de producto
- `GET /api/categories?active=true` — Categorías activas
- `GET /api/brands` — Marcas activas
- `GET /api/banners` — Banners vigentes
- `GET /api/testimonials` — Testimonios
- `GET /api/trusted-brands` — Marcas que confían
- `GET /api/blog` — Posts publicados
- `GET /api/company` — Datos de la empresa
- `POST /api/quotations` — Enviar cotización
- `POST /api/newsletter/subscribe` — Suscribirse al newsletter

### Protegidos (JWT Bearer)
- `POST /api/auth/login`
- `GET /api/auth/me`
- CRUD para `/api/products`, `/api/categories`, `/api/brands`, `/api/banners`, `/api/quotations`
- `/api/admin/*` (testimonios, marcas-confianza, blog, newsletter, company)
- `POST /api/uploads/image` y `/api/uploads/images` (subida a Cloudinary)
- `GET /api/quotations/export/excel` (exporta XLSX)

## 🎨 Identidad visual

Paleta de colores (basada en el logo):

| Token | Hex | Uso |
|-------|-----|-----|
| `sm-700` | `#0B2545` | Azul corporativo oscuro (principal) |
| `sm-500` | `#13315C` | Azul corporativo medio |
| `sm-accent` | `#3A86FF` | Azul claro brillante |
| `sm-50` | `#EEF4FA` | Fondo suave |
| `sm-300` | `#8DA9C4` | Azul claro apagado |

## 📦 Importación masiva de productos

El archivo Excel/CSV debe tener estas columnas (la primera fila es el encabezado):

```
internal_code, name, category, brand, short_description, full_description,
applications, min_quantity, main_image, gallery, specifications
```

- `gallery`: URLs separadas por `|`.
- `specifications`: JSON string, ej: `{"Color":"Negro","Material":"Plástico"}`.
- `category` / `brand`: si no existen, se crean automáticamente.

## 📧 Flujo de cotización

1. Usuario agrega productos al carrito.
2. Abre el panel lateral y completa el formulario obligatorio.
3. El backend guarda la cotización en PostgreSQL.
4. Se envía correo automático al administrador con todos los detalles.
5. Se envía correo de confirmación al cliente.
6. La cotización aparece en `/admin/cotizaciones` para gestión.

## 🔎 SEO

- `sitemap.xml` dinámico con productos, categorías y blog.
- `robots.txt` con directivas correctas.
- Open Graph + Twitter Cards en `layout.tsx`.
- Schema.org Organization.
- Meta títulos/descripciones editables desde panel.

## 📱 Responsive

- Mobile-first con breakpoints `sm`, `md`, `lg`.
- Drawer lateral en móvil para el carrito.
- Menú hamburguesa en header.

## 🛡️ Seguridad

- Helmet para headers HTTP.
- CORS configurado.
- Rate limiting global.
- JWT con expiración.
- Validación con express-validator.
- Variables sensibles en `.env`.

## 📄 Licencia

© Service Merchandise. Todos los derechos reservados.