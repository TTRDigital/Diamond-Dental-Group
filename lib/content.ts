import "server-only";
import { cache } from "react";
import { sanityFetch } from "@/lib/sanity/fetch";
import { merge } from "@/lib/merge";
import { dataset, projectId } from "@/sanity/env";
import { fallbackMenu, fallbackSettings, fallbackTestimonials, servicesMenu } from "@/lib/data/site";
import { fallbackServices } from "@/lib/data/services";
import { fallbackPosts } from "@/lib/data/posts";
import {
  fallbackAbout,
  fallbackBlogIndex,
  fallbackContact,
  fallbackHome,
  fallbackPatientCare,
  fallbackPrivacy,
  fallbackServicesHub,
  fallbackThankYou,
} from "@/lib/data/pages";
import type { MenuGroup, MenuItem, Post, Service, SiteSettings, Testimonial } from "@/lib/types";

/* ==========================================================================
   Content layer
   Every page reads through these functions. Sanity values win when present;
   anything missing falls back to lib/data, so the site works before the CMS
   is filled in, and an empty field never breaks a page.
   ========================================================================== */

type Loose = Record<string, unknown>;
const isObj = (v: unknown): v is Loose => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Sanity image -> { src, alt, width, height }, read straight from the asset
 * reference (image-<id>-<w>x<h>-<ext>), so no query has to list image paths.
 */
function toImg(v: Loose) {
  const ref = (v.asset as Loose | undefined)?._ref;
  if (typeof ref !== "string") return null;
  const m = ref.match(/^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/);
  if (!m) return null;
  return { src: `https://cdn.sanity.io/images/${projectId}/${dataset}/${m[1]}-${m[2]}x${m[3]}.${m[4]}`, alt: typeof v.alt === "string" ? v.alt : "", width: Number(m[2]), height: Number(m[3]) };
}

/** Drops Sanity's system keys, turns images into Img and slugs into strings. */
function normalize(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(normalize).filter((x) => x !== null && x !== undefined);
  if (!isObj(v)) return v;
  if (v._type === "altImage" || (isObj(v.asset) && typeof v.asset._ref === "string" && v.asset._ref.startsWith("image-"))) return toImg(v);
  if (v._type === "slug") return v.current;
  const out: Loose = {};
  for (const [k, x] of Object.entries(v)) {
    if (k.startsWith("_")) continue;
    out[k] = normalize(x);
  }
  return out;
}

async function singleton<T>(id: string, fallback: T): Promise<T> {
  const cms = await sanityFetch<Loose>(`*[_id == $id][0]`, { id }, [id]);
  return merge(fallback, normalize(cms));
}

/** CMS documents merge over the matching built-in item (same slug); CMS-only documents are added. */
async function collection<T extends { slug: string }>(type: string, fallback: T[], sort: (a: T, b: T) => number): Promise<T[]> {
  const cms = await sanityFetch<Loose[]>(`*[_type == $type && defined(slug.current) && !(_id in path("drafts.**"))]`, { type }, [type]);
  if (!cms?.length) return fallback;
  const bySlug = new Map(fallback.map((f) => [f.slug, f]));
  const merged = cms.map((raw) => {
    const c = normalize(raw) as Partial<T>;
    const base = bySlug.get(c.slug ?? "");
    return base ? merge(base, c) : (c as T);
  });
  const missing = fallback.filter((f) => !merged.some((m) => m.slug === f.slug));
  return [...merged, ...missing].sort(sort);
}

/* ---------- Settings & menus ---------- */

export const getServices = cache(async (): Promise<Service[]> => collection("service", fallbackServices, (a, b) => a.order - b.order));

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const s = await singleton("siteSettings", fallbackSettings);
  const services = await getServices();
  const groups: MenuGroup[] = servicesMenu
    .map((g) => ({ heading: g.heading, links: services.filter((sv) => sv.group === g.heading).map((sv) => ({ label: sv.name, href: `/services/${sv.slug}/` })) }))
    .filter((g) => g.links.length);
  // The Services item always opens the mega menu built from the service pages.
  const menu: MenuItem[] = (s.menu.length ? s.menu : fallbackMenu).map((m) => (m.href === "/services/" ? { ...m, groups } : { label: m.label, href: m.href }));
  // tel: link always follows the displayed phone number.
  const digits = s.phone.replace(/\D/g, "");
  return { ...s, menu, phoneHref: `tel:+${digits.length === 10 ? `1${digits}` : digits}` };
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const cms = await sanityFetch<Loose[]>(`*[_type == "testimonial" && !(_id in path("drafts.**"))] | order(order asc)`, {}, ["testimonial"]);
  const list = cms?.length ? (normalize(cms) as Testimonial[]) : fallbackTestimonials;
  // Only reviews marked approved (real, with permission) are shown.
  return list.filter((t) => t.approved && t.quote && !/\[PLACEHOLDER\b/.test(t.quote));
});

/* ---------- Pages ---------- */

export const getHome = cache(() => singleton("homePage", fallbackHome));
export const getAbout = cache(() => singleton("aboutPage", fallbackAbout));
export const getPatientCare = cache(() => singleton("patientCarePage", fallbackPatientCare));
export const getContact = cache(() => singleton("contactPage", fallbackContact));
export const getBlogIndex = cache(() => singleton("blogPage", fallbackBlogIndex));
export const getServicesHub = cache(() => singleton("servicesPage", fallbackServicesHub));
export const getPrivacy = cache(() => singleton("privacyPage", fallbackPrivacy));
export const getThankYou = cache(() => singleton("thankYouPage", fallbackThankYou));

export const getService = cache(async (slug: string) => (await getServices()).find((s) => s.slug === slug));

/* ---------- Blog ---------- */

export const getPosts = cache(async (): Promise<Post[]> => collection("post", fallbackPosts, (a, b) => b.date.localeCompare(a.date)));

export const getPost = cache(async (slug: string) => (await getPosts()).find((p) => p.slug === slug));
