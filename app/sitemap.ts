import type { MetadataRoute } from "next";
import { getCityPages, getPosts, getServices } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Every indexable page (thank-you is noindex). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, cityPages] = await Promise.all([getServices(), getPosts(), getCityPages()]);
  const entry = (path: string, priority: number, lastModified?: string) => ({ url: absoluteUrl(path), changeFrequency: "monthly" as const, priority, ...(lastModified ? { lastModified } : {}) });
  return [
    entry("/", 1),
    entry("/about/", 0.8),
    entry("/services/", 0.8),
    ...services.map((s) => entry(`/services/${s.slug}/`, 0.8)),
    entry("/patient-care/", 0.8),
    entry("/contact/", 0.8),
    entry("/blog/", 0.6),
    ...posts.map((p) => entry(`/blog/${p.slug}/`, 0.5, p.date)),
    // Published city pages only (drafts are never listed), unless hidden from search engines. The page route is Vercel-only.
    ...(process.env.VERCEL ? cityPages : []).filter((c) => !c.seo.noIndex).map((c) => entry(c.path, 0.7, c.seo.modifiedTime)),
    entry("/privacy-policy/", 0.2),
  ];
}
