import type { Faq, SiteSettings } from "@/lib/types";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { images } from "@/lib/data/images";

const abs = (src: string) => (src.startsWith("http") ? src : absoluteUrl(src));

/** The one Dentist entity for the whole site, from the practice's own address, phone and hours. */
export function businessSchema(s: SiteSettings) {
  // Days with the same hours are grouped.
  const groups = new Map<string, string[]>();
  for (const h of s.hours) {
    if (!h.opens || !h.closes) continue;
    const k = `${h.opens}-${h.closes}`;
    groups.set(k, [...(groups.get(k) ?? []), h.day]);
  }
  const digits = s.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${siteUrl}/#dentist`,
    name: s.legalName,
    url: absoluteUrl("/"),
    telephone: `+1-${digits.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3")}`,
    email: s.email,
    image: abs(images.storefront.src),
    logo: abs(s.logo.src),
    address: { "@type": "PostalAddress", streetAddress: s.street, addressLocality: s.city, addressRegion: s.region, postalCode: s.postalCode, addressCountry: "US" },
    ...(s.latitude && s.longitude ? { geo: { "@type": "GeoCoordinates", latitude: s.latitude, longitude: s.longitude } } : {}),
    hasMap: s.mapsUrl,
    openingHoursSpecification: [...groups].map(([k, days]) => {
      const [opens, closes] = k.split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
    }),
    ...(s.social.length ? { sameAs: s.social.map((x) => x.href) } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

/** FAQPage with the questions and answers exactly as they appear on the page. */
export function faqPageSchema(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.filter((f) => f.answer).map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

/**
 * Blog post (BlogPosting). The author is a Person linked to the About page ("Dr." and the credential go in the
 * honorific fields, so name holds only the name); the publisher is the practice's Dentist entity by its site-wide @id.
 */
export function articleSchema(p: {
  title: string;
  description: string;
  date: string;
  image: string;
  path: string;
  author: { name: string; credential?: string; jobTitle?: string; url?: string; image?: string };
  publisher: string;
  wordCount?: number;
  /** Reading time in minutes (timeRequired, ISO 8601: PT7M). */
  minutes?: number;
  /** The post's topic (articleSection). */
  section?: string;
}) {
  const a = p.author;
  const dr = /^Dr\.?\s+/.test(a.name);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    image: [abs(p.image)],
    datePublished: p.date,
    dateModified: p.date,
    ...(p.wordCount ? { wordCount: p.wordCount } : {}),
    ...(p.minutes ? { timeRequired: `PT${p.minutes}M` } : {}),
    ...(p.section ? { articleSection: p.section } : {}),
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: a.name.replace(/^Dr\.?\s+/, ""),
      ...(dr ? { honorificPrefix: "Dr." } : {}),
      ...(a.credential ? { honorificSuffix: a.credential } : {}),
      ...(a.jobTitle ? { jobTitle: a.jobTitle } : {}),
      ...(a.url ? { url: absoluteUrl(a.url) } : {}),
      ...(a.image ? { image: abs(a.image) } : {}),
    },
    publisher: { "@type": "Dentist", "@id": `${siteUrl}/#dentist`, name: p.publisher },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(p.path) },
  };
}
