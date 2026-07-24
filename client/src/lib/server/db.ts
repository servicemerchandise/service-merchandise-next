import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

let pgPool: Pool | null = null;
let pgMemDb: any = null;
let usingPgMem = false;
let initialized = false;

const EMBEDDED_SCHEMA_PATH = path.join(process.cwd(), 'src', 'lib', 'server', 'db', 'embedded-schema.sql');
const REAL_SCHEMA_PATH = path.join(process.cwd(), 'src', 'lib', 'server', 'db', 'schema.sql');

// uuid_generate_v4 más robusto con crypto
function uuidv4(): string {
  const bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function initPgMem() {
  const { newDb } = require('pg-mem');
  const db = newDb({ autoCreateForeignKeyIndices: true });

  // Registrar generador de UUID más robusto
  db.public.registerFunction({
    name: 'uuid_generate_v4',
    returns: 'uuid',
    implementation: () => uuidv4(),
    impure: true,
  });

  // Cargar schema simplificado
  const schemaSql = fs.readFileSync(EMBEDDED_SCHEMA_PATH, 'utf-8');
  db.public.none(schemaSql);

  // Crear adapter pg
  const { Pool: PgMemPool } = db.adapters.createPg();
  const pool = new PgMemPool();

  // Insertar seed inicial
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
    } catch { }
  }

  // Seeds de marcas de confianza
  const trustedNames = ['Bavaria', 'Nutresa', 'Éxito', 'Sura', 'Argos', 'Terpel', 'Davivienda'];
  for (let i = 0; i < trustedNames.length; i++) {
    try {
      await pool.query(
        'INSERT INTO trusted_brands (id, name, logo_url, display_order) VALUES ($1, $2, $3, $4)',
        [uuidv4(), trustedNames[i], '', i + 1]
      );
    } catch { }
  }

  // Seeds de testimonios
  const testimonials = [
    { client_name: 'Carlos Ramírez', company: 'Grupo Industrial XYZ', position: 'Director de Compras', message: 'Excelente atención y rapidez en nuestras cotizaciones.', rating: 5 },
    { client_name: 'María Fernández', company: 'Constructora Andina', position: 'Gerente Administrativa', message: 'La calidad y la personalización superaron nuestras expectativas.', rating: 5 },
    { client_name: 'Juan Pablo Ortiz', company: 'TechSolutions S.A.', position: 'CEO', message: 'Proceso ágil, profesional y con muy buenas opciones.', rating: 5 },
  ];
  for (const t of testimonials) {
    try {
      await pool.query(
        'INSERT INTO testimonials (id, client_name, company, position, message, rating) VALUES ($1, $2, $3, $4, $5, $6)',
        [uuidv4(), t.client_name, t.company, t.position, t.message, t.rating]
      );
    } catch { }
  }

  // Seed company_settings
  try {
    await pool.query("INSERT INTO company_settings (id, company_name) VALUES (1, 'Service Merchandise')");
  } catch { }

  return { pool, db };
}

async function initRealPg() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 20,
    idleTimeoutMillis: 30000,
  });
  pool.on('error', (err: any) => console.error('PG error:', err.message));
  try {
    await pool.query('SELECT 1');
    const { rows } = await pool.query(
      "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'"
    );
    if (Number(rows[0].count) === 0) {
      await pool.query(fs.readFileSync(REAL_SCHEMA_PATH, 'utf-8'));
      console.log('✓ Esquema PostgreSQL ejecutado');
    }
  } catch (e) {
    throw e;
  }
  return pool;
}

export async function initDb(): Promise<void> {
  if (initialized) return;
  const useReal = await checkRealPg();
  if (useReal) {
    console.log('🐘 Conectando a PostgreSQL real...');
    pgPool = await initRealPg();
    usingPgMem = false;
  } else {
    console.log('💾 Usando base de datos embebida (pg-mem) — datos en memoria del proceso');
    const res = await initPgMem();
    pgPool = res.pool;
    pgMemDb = res.db;
    usingPgMem = true;
  }
  initialized = true;
}

async function checkRealPg(): Promise<boolean> {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!databaseUrl) return false;
  if (databaseUrl.includes('***') || databaseUrl.includes('tu_') || databaseUrl.includes('change_me')) return false;
  try {
    const test = new Pool({ connectionString: databaseUrl, connectionTimeoutMillis: 2000 });
    await test.query('SELECT 1');
    await test.end();
    return true;
  } catch {
    return false;
  }
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
    console.log(`executed query (${usingPgMem ? 'pg-mem' : 'pg'})`, { text: text.substring(0, 60), duration, rows: res.rowCount });
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
