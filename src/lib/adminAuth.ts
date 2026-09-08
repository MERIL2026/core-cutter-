import { NextRequest } from 'next/server';
import crypto from 'crypto';

const ADMIN_COOKIE_NAME = 'core_cutter_admin_token';
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'core-cutter-secret-super-key-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * Generates a signed admin session token valid for 7 days
 */
export function generateAdminToken(): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `admin:${expiresAt}`;
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

/**
 * Validates the admin session token from cookies or authorization header
 */
export function verifyAdminSession(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
  const token = cookieToken || authHeader;

  if (!token) return false;

  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return false;

    const payload = Buffer.from(encodedPayload, 'base64').toString('utf8');
    const [role, expiresAtStr] = payload.split(':');

    if (role !== 'admin') return false;

    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

/**
 * Validates the provided admin password
 */
export function validateAdminPassword(password: string): boolean {
  if (!password) return false;
  return password.trim() === ADMIN_PASSWORD.trim();
}

export { ADMIN_COOKIE_NAME };
