import type { Metadata } from "next";
import type { Img, Seo } from "@/lib/types";
import { images } from "@/lib/data/images";

const SITE_NAME = "Diamond Dental Group";

/** One place for title, description, canonical, Open Graph and Twitter tags. Titles are used as written (same as the live site). */
export function pageMetadata(seo: Seo, path: string, fallbackImage?: Img): Metadata {
  const image = seo.image ?? fallbackImage ?? images.storefront;
  const og = { url: image.src, width: image.width, height: image.height, alt: image.alt };
  return {
    title: { absolute: seo.title },
    description: seo.description || undefined,
    alternates: { canonical: path },
    robots: seo.noIndex ? { index: false, follow: true } : undefined,
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", url: path, title: seo.title, description: seo.description || undefined, images: [og] },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description || undefined, images: [image.src] },
  };
}
