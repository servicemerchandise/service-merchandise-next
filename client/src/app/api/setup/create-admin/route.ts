import { NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const r = await query('SELECT COUNT(*) FROM users');
    if (Number(r.rows[0].count) > 0) {
      return NextResponse.json({ error: 'Ya existe un administrador. Esta ruta está deshabilitada.' }, { status: 403 });
    }

    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Faltan campos (email, password, name)' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);
    const ins = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin') RETURNING id, name, email, role`,
      [name, email, hash]
    );

    return NextResponse.json({
      ok: true,
      user: ins.rows[0],
      message: 'Administrador creado. Ya puedes iniciar sesión.',
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}