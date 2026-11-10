import "server-only";

import { draftMode } from "next/headers";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Draft Mode (the signed /api/preview link TTR OS and editors open) exists only in the Vercel build: a static export has
 * no requests to carry the cookie. Reading it here is safe for static pages: while prerendering it is simply off.
 */
async function draftsOn(): Promise<boolean> {
  if (!process.env.VERCEL) return false;
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

/**
 * Fetch published content from Sanity's API CDN. In Draft Mode (Vercel only) it reads the draft version instead, from
 * the live API with SANITY_READ_TOKEN (server-side only, never sent to the browser), uncached.
 *
 * - Runs at build time only (static export): publishing in Sanity starts a
 *   rebuild + upload (.github/workflows/deploy-siteground.yml).
 * - Never throws: returns null on any failure so pages fall back to
 *   lib/content.ts defaults and the site keeps working.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = [],
): Promise<T | null> {
  if (!projectId) return null;

  const token = process.env.SANITY_READ_TOKEN;
  const drafts = (await draftsOn()) && !!token;
  const search = new URLSearchParams({ query, perspective: drafts ? "drafts" : "published" });
  for (const [key, value] of Object.entries(params)) {
    search.set(`$${key}`, JSON.stringify(value));
  }
  // SANITY_API_URL points the build at another API host (used to test the
  // queries against a local mock of the seeded dataset); normally unset.
  const host = process.env.SANITY_API_URL?.replace(/\/$/, "") || `https://${projectId}.${drafts ? "api" : "apicdn"}.sanity.io`;
  const url = `${host}/v${apiVersion}/data/query/${dataset}?${search}`;

  try {
    const res = await fetch(url, drafts ? { cache: "no-store", headers: { Authorization: `Bearer ${token}` } } : { cache: "force-cache" });
    if (!res.ok) {
      console.warn(`[sanity] ${res.status} for query tags=${tags.join(",")}`);
      return null;
    }
    const json = (await res.json()) as { result?: T };
    return json.result ?? null;
  } catch (error) {
    console.warn("[sanity] fetch failed, using fallbacks", error);
    return null;
  }
}
