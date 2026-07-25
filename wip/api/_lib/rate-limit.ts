// Best-effort in-memory rate limiter. State lives in module scope, so it
// persists across invocations on a warm serverless instance but resets on
// cold start and isn't shared across instances. That's an acceptable
// trade-off for a low-traffic portfolio site — it just needs to blunt
// accidental spam/loops, not stop a determined attacker. If traffic grows,
// swap this for Vercel KV / Upstash Redis for a shared, durable counter.

const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 8;

const hits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string): { allowed: boolean } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false };
  }

  entry.count += 1;
  return { allowed: true };
}
