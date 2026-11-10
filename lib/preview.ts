import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/** A signed preview link is valid for at most this long after it is made. */
export const MAX_PREVIEW_SECONDS = 30 * 24 * 60 * 60;

/** Same-site page paths only: "/", "/about/", "/services/invisalign/" (no scheme, host, "//", backslashes, dots-segments or control characters). */
export function isSafePath(path: string): boolean {
  return /^\/[A-Za-z0-9\-._~/]*$/.test(path) && !path.includes("//") && !path.split("/").some((seg) => seg === "." || seg === "..");
}

/** hex HMAC-SHA256(secret, "<path>\n<exp>"), the signature TTR OS puts in &sig=. */
export function signPreview(secret: string, path: string, exp: number): string {
  return createHmac("sha256", secret).update(`${path}\n${exp}`).digest("hex");
}

export type PreviewCheck = { ok: true; path: string } | { ok: false; status: number; reason: string };

/**
 * Checks /api/preview?path=&exp=&sig= : a safe site path, an expiry that is in the future but not more than 30 days
 * ahead, and a signature made with PREVIEW_SECRET (compared in constant time).
 */
export function verifyPreview(secret: string, query: { path: string | null; exp: string | null; sig: string | null }, now = Math.floor(Date.now() / 1000)): PreviewCheck {
  const { path, exp, sig } = query;
  if (!path || !exp || !sig) return { ok: false, status: 400, reason: "Missing path, exp or sig." };
  if (!isSafePath(path)) return { ok: false, status: 400, reason: "Invalid path." };
  if (!/^\d{1,12}$/.test(exp)) return { ok: false, status: 400, reason: "Invalid exp." };
  const expires = Number(exp);
  if (expires < now) return { ok: false, status: 401, reason: "This preview link has expired." };
  if (expires - now > MAX_PREVIEW_SECONDS) return { ok: false, status: 401, reason: "Expiry is more than 30 days ahead." };
  if (!/^[0-9a-f]{64}$/i.test(sig)) return { ok: false, status: 401, reason: "Invalid signature." };
  const expected = Buffer.from(signPreview(secret, path, expires), "hex");
  const given = Buffer.from(sig, "hex");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, status: 401, reason: "Invalid signature." };
  return { ok: true, path };
}
