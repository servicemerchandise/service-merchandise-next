import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Cache global del pool en entornos serverless (Vercel). Evita abrir un nuevo
// pool por cada invocación de una Function.
declare global {
  // eslint-disable-next-line no-var
  var __sm_pg_pool__: Pool | undefined;
  // eslint-disable-next-line no-var
  var __sm_initialized__: boolean | undefined;
}

let pgPool: Pool | null = global.__sm_pg_pool__ ?? null;
let pgMemDb: any = null;
let usingPgMem = false;
let initialized = global.__sm_initialized__ ?? false;

const EMBEDDED_SCHEMA_PATH = path.join(
  process.cwd(),
  'src',
  'lib',
  'server',
  'db',
  'embedded-schema.sql'
);
const REAL_SCHEMA_PATH = path.join(
  process.cwd(),
  'src',
  'lib',
  'server',
  'db',
  'schema.sql'
);

function uuidv4(): string {
  const bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const isProduction = process.env.NODE_ENV === 'production';

async function initPgMem() {
  const { newDb } = require('pg-mem');
  const db = newDb({ autoCreateForeignKeyIndices: true });

  db.public.registerFunction({
    name: 'uuid_generate_v4',
    returns: 'uuid',
    implementation: () => uuidv4(),
    impure: true,
  });

  const schemaSql = fs.readFileSync(EMBEDDED_SCHEMA_PATH, 'utf-8');
  db.public.none(schemaSql);

  const { Pool: PgMemPool } = db.adapters.createPg();
  const pool = new PgMemPool();

  const seedIds = [
    { name: 'Tecnología', slug: 'tecnologia', display_order: 1 },
    { name: 'Herramientas', slug: 'herramientas', display_order: 2 },
    { name: 'Papelería', slug: 'papeleria', display_order: 3 },
    { name: 'Oficina', slug: 'oficina', display_order: 4 },
    { name: 'Promocionales', slug: 'promocionales', display_order: 5 },
    { name: 'Seguridad Industrial', slug: 'seguridad-industrial', display_order: 6 },
    { name: 'Hogar', slug: 'hogar', display_order: 7 },
    { name: 'Eventos', slug: 'eventos', display_order: 8 },
    { name: 'Merchandising Corporativo', slug: 'merchandising-corporativo', display_order: 9 },
    { name: 'Personalizados', slug: 'personalizados', display_order: 10 },
  ];
  for (const s of seedIds) {
    try {
      await pool.query(
        'INSERT INTO categories (id, name, slug, display_order) VALUES ($1, $2, $3, $4)',
        [uuidv4(), s.name, s.slug, s.display_order]
      );
    } catch {
      /* ignore */
    }
  }

  const trustedNames = ['Bavaria', 'Nutresa', 'Éxito', 'Sura', 'Argos', 'Terpel', 'Davivienda'];
  for (let i = 0; i < trustedNames.length; i++) {
    try {
      await pool.query(
        'INSERT INTO trusted_brands (id, name, logo_url, display_order) VALUES ($1, $2, $3, $4)',
        [uuidv4(), trustedNames[i], '', i + 1]
      );
    } catch {
      /* ignore */
    }
  }

  const testimonials = [
    {
      client_name: 'Carlos Ramírez',
      company: 'Grupo Industrial XYZ',
      position: 'Director de Compras',
      message: 'Excelente atención y rapidez en nuestras cotizaciones.',
      rating: 5,
    },
    {
      client_name: 'María Fernández',
      company: 'Constructora Andina',
      position: 'Gerente Administrativa',
      message: 'La calidad y la personalización superaron nuestras expectativas.',
      rating: 5,
    },
    {
      client_name: 'Juan Pablo Ortiz',
      company: 'TechSolutions S.A.',
      position: 'CEO',
      message: 'Proceso ágil, profesional y con muy buenas opciones.',
      rating: 5,
    },
  ];
  for (const t of testimonials) {
    try {
      await pool.query(
        'INSERT INTO testimonials (id, client_name, company, position, message, rating) VALUES ($1, $2, $3, $4, $5, $6)',
        [uuidv4(), t.client_name, t.company, t.position, t.message, t.rating]
      );
    } catch {
      /* ignore */
    }
  }

  try {
    await pool.query(
      "INSERT INTO company_settings (id, company_name) VALUES (1, 'Service Merchandise')"
    );
  } catch {
    /* ignore */
  }

  return { pool, db };
}

async function initRealPg() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  // Reusar pool si ya existe (serverless warm starts)
  const existingPool: Pool | undefined = global.__sm_pg_pool__;
  if (existingPool) return existingPool;

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    ssl:
      databaseUrl.includes('sslmode=require') || databaseUrl.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : undefined,
  });
  pool.on('error', (err: any) => console.error('PG error:', err.message));

  await pool.query('SELECT 1');

  // Solo crear esquema si las tablas no existen (evita trabajo innecesario en cada cold start).
  const { rows } = await pool.query(
    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'"
  );
  if (Number(rows[0].count) === 0) {
    await pool.query(fs.readFileSync(REAL_SCHEMA_PATH, 'utf-8'));
    console.log('✓ Esquema PostgreSQL ejecutado');
  }

  // Cachear el pool en globalThis para reusarlo entre invocaciones serverless.
  global.__sm_pg_pool__ = pool;
  return pool;
}

/**
 * Determina si tenemos una URL real de Postgres.
 */
async function tryRealPg(): Promise<boolean> {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!databaseUrl) return false;
  if (
    databaseUrl.includes('***') ||
    databaseUrl.includes('tu_') ||
    databaseUrl.includes('change_me') ||
    databaseUrl.includes('placeholder')
  ) {
    return false;
  }
  try {
    const pool = new Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 2000,
      ssl: databaseUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
    });
    await pool.query('SELECT 1');
    await pool.end();
    return true;
  } catch {
    return false;
  }
}

export async function initDb(): Promise<void> {
  if (initialized) return;

  // PRODUCCIÓN: SIEMPRE PostgreSQL real. Si no hay DATABASE_URL válido, fallar ruidosamente.
  if (isProduction) {
    console.log('🐘 [production] Conectando a PostgreSQL...');
    pgPool = await initRealPg();
    usingPgMem = false;
    initialized = true;
    global.__sm_initialized__ = true;
    return;
  }

  // DESARROLLO: intentar Postgres real; si no, caer a pg-mem (sandbox sin internet).
  const hasReal = await tryRealPg();
  if (hasReal) {
    console.log('🐘 [dev] Conectando a PostgreSQL real...');
    pgPool = await initRealPg();
    usingPgMem = false;
  } else {
    console.log('💾 [dev] Sin DATABASE_URL — usando pg-mem (datos en memoria)');
    const res = await initPgMem();
    pgPool = res.pool;
    pgMemDb = res.db;
    usingPgMem = true;
  }
  initialized = true;
  global.__sm_initialized__ = true;
}

export const pool: Pool = new Proxy({} as Pool, {
  get(_t, prop: string) {
    if (!pgPool) throw new Error('DB no inicializada — llama a initDb() primero');
    return (pgPool as any)[prop];
  },
});

export async function query(text: string, params?: any[]) {
  if (!pgPool) await initDb();
  const start = Date.now();
  const res = await (pgPool as any).query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log(`executed query (${usingPgMem ? 'pg-mem' : 'pg'})`, {
      text: text.substring(0, 60),
      duration,
      rows: res.rowCount,
    });
  }
  return res;
}

export async function getClient(): Promise<PoolClient> {
  if (!pgPool) await initDb();
  return (pgPool as any).connect();
}

export function isUsingPgMem(): boolean {
  return usingPgMem;
}
