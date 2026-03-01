import type { Context, Next } from "hono"

/**
 * Wraps responses in a minimal HTML document when the response body is not already a full document.
 * No-op for now: just passes through. Pages (LP, auth, app) render their own full document or fragment.
 */
export async function layoutMiddleware(c: Context, next: Next) {
  await next()
}
