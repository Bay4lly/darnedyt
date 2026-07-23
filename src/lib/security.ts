import { db } from './db';

// Simple In-Memory Rate Limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ipOrKey: string, maxRequests: number = 10, windowMs: number = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ipOrKey);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ipOrKey, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count };
}

// Sanitize HTML string to prevent XSS attacks
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Record security audit logs
export async function createAuditLog(userId: string | null, action: string, details: string, ipAddress: string = '127.0.0.1') {
  try {
    await db.auditLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
}
