import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { isSafePath } from "@/lib/preview";

/*
 * The Sanity webhook signature (the @sanity/webhook format, which TTR OS also sends):
 *   sanity-webhook-signature: t=<unix ms>,v1=<base64url HMAC-SHA256(SANITY_REVALIDATE_SECRET, "<t>.<raw body>")>
 * Checked in constant time. No extra package: the format is small and fixed.
 */
export function signWebhook(secret: string, body: string, t: number): string {
  return `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url")}`;
}

export function isValidWebhook(secret: string, body: string, header: string | null): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.trim().split("=", 2) as [string, string]));
  const t = parts.t, given = parts.v1;
  if (!t || !/^\d{1,16}$/.test(t) || !given) return false;
  const want = Buffer.from(createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url"));
  const got = Buffer.from(given);
  return want.length === got.length && timingSafeEqual(want, got);
}

export type RevalidatePlan = { tags: string[]; paths: string[] };

/**
 * What to refresh for one webhook body. Pages read Sanity through lib/sanity/fetch.ts, which tags every published read
 * with "sanity", the document id and the document type, so refreshing the id and type tags refreshes every page that
 * shows the document (its own page, lists, the sitemap). A safe `path` in the body ("/blog/x/") is refreshed as well.
 */
export function planRevalidate(body: unknown): RevalidatePlan {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const tags = new Set<string>();
  const paths = new Set<string>();
  const id = typeof b._id === "string" ? b._id.replace(/^drafts\./, "") : "";
  if (/^[A-Za-z0-9._-]{1,200}$/.test(id)) tags.add(id);
  if (typeof b._type === "string" && /^[A-Za-z0-9._-]{1,100}$/.test(b._type)) tags.add(b._type);
  if (typeof b.path === "string" && b.path.length <= 1024 && isSafePath(b.path)) paths.add(b.path);
  return { tags: [...tags], paths: [...paths] };
}
