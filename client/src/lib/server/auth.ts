import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export function verifyToken(req: Request | NextRequest): { error?: string; user?: UserPayload; status?: number } {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Token no proporcionado', status: 401 };
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return { user: decoded };
  } catch (e) {
    return { error: 'Token inválido o expirado', status: 401 };
  }
}

export function requireAuth(req: Request | NextRequest) {
  const result = verifyToken(req);
  if (result.error) {
    return { authorized: false, response: NextResponse.json({ error: result.error }, { status: result.status }), user: null as any };
  }
  return { authorized: true, user: result.user!, response: null as any };
}

export function requireAdmin(req: Request | NextRequest) {
  const result = requireAuth(req);
  if (!result.authorized) return result;
  if (result.user.role !== 'admin') {
    return { authorized: false, response: NextResponse.json({ error: 'Acceso denegado' }, { status: 403 }), user: null as any };
  }
  return result;
}
