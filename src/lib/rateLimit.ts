/**
 * Lightweight in-memory rate limiter using a sliding window algorithm.
 * Tracks client IP submission timestamps and purges stale records periodically.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup of stale rate-limit keys every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function purgeStaleRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [key, record] of rateLimitStore.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 15 minutes)
  maxRequests?: number; // Max allowed requests per window (default: 5)
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Checks whether an identifier (e.g., client IP) has exceeded the rate limit.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const isLocal =
    identifier === '127.0.0.1' ||
    identifier === '::1' ||
    identifier === 'localhost' ||
    process.env.NODE_ENV === 'development';

  const windowMs = options.windowMs ?? 15 * 60 * 1000; // 15 minutes
  const maxRequests = options.maxRequests ?? (isLocal ? 100 : 25); // 25 submissions per window for public, 100 for local

  purgeStaleRecords(windowMs);

  const now = Date.now();
  const record = rateLimitStore.get(identifier) ?? { timestamps: [] };

  // Filter timestamps within current window
  const activeTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (activeTimestamps.length >= maxRequests) {
    const oldestTimestamp = activeTimestamps[0] || now;
    const resetTime = oldestTimestamp + windowMs;
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetTime,
    };
  }

  // Record this request
  activeTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: activeTimestamps });

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - activeTimestamps.length,
    resetTime: now + windowMs,
  };
}

/**
 * Resets the rate limiter for a specific identifier (useful for tests).
 */
export function resetRateLimit(identifier?: string) {
  if (identifier) {
    rateLimitStore.delete(identifier);
  } else {
    rateLimitStore.clear();
  }
}
