import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { Role } from '@/types';

const JWT_SECRET = process.env.AUTH_SECRET || 'darned-hub-super-secret-jwt-token-2026-key-secure';
const COOKIE_NAME = 'darned_session';

export interface UserSessionPayload {
  userId: string;
  email: string;
  username: string;
  name: string;
  role: Role | string;
}

export function signJwtToken(payload: UserSessionPayload, expiresIn: any = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwtToken(token: string): UserSessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const payload = verifyJwtToken(token);
    if (!payload) return null;

    const dbUser = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isBanned: true, role: true, name: true, email: true, username: true },
    });

    if (!dbUser || dbUser.isBanned) {
      return null;
    }

    return {
      userId: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      name: dbUser.name,
      role: dbUser.role,
    };
  } catch (e) {
    return null;
  }
}

export async function setSessionCookie(token: string, remember: boolean = false) {
  const cookieStore = cookies();
  const maxAge = remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireAuth(): Promise<UserSessionPayload> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireAdmin(): Promise<UserSessionPayload> {
  const user = await getSessionUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN && user.role !== Role.STAFF)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}
