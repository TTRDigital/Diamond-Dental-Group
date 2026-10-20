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

/** Blog post Article, the same shape as the live posts' schema. */
export function articleSchema(p: { title: string; description: string; date: string; image: string; path: string; publisher: string; logo: string }) {
  const org = { "@type": "Organization", name: p.publisher };
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    image: [abs(p.image)],
    datePublished: p.date,
    dateModified: p.date,
    author: org,
    publisher: { ...org, logo: { "@type": "ImageObject", url: abs(p.logo) } },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(p.path) },
  };
}
