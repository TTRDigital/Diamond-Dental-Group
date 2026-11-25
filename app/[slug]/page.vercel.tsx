import "../globals.css";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Phone } from "lucide-react";
import { getAbout, getCityPage, getCityPages, getServicesHub, getSiteSettings, type PtBlock } from "@/lib/content";
import { draftsOn } from "@/lib/sanity/fetch";
import { postAuthor } from "@/lib/author";
import { pageMetadata } from "@/lib/seo";
import { seoSchemaNodes } from "@/lib/schema";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { photoFrame } from "@/lib/post-design";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageSchema } from "@/components/ui/PageSchema";
import { images } from "@/lib/data/images";
import { CtaBanner } from "@/components/sections/Blocks";
import { BODY_LINK, H2, P } from "@/components/blog/ArticleBody";

/*
 * City pages (Sanity `cityPage`, sanity/schemaTypes/cityPage.ts) at the site's top level: /family-dentist-roseville/.
 * TTR OS saves them as drafts; a draft shows only in Draft Mode (the signed /api/preview link, Vercel only) and is
 * always noindex there. A published page renders for everyone. Fixed pages (/about/, /services/ ...) win over this route.
 * Vercel build only (next.config.ts pageExtensions); the SiteGround static export does not include it.
 * It sits outside the (site) group and draws the site shell itself (as app/not-found.tsx does), so an address with no
 * page gets the root 404 with one header and footer, exactly as before this route existed.
 * No `dynamicParams = false` (as on the blog post page): a draft or a newly published page renders on demand on Vercel,
 * and an address with no page is a 404 through notFound().
 */

export async function generateStaticParams() {
  return (await getCityPages()).map((p) => ({ slug: p.slug }));
}

const BRAND = /\s*[|–—-]\s*Diamond Dental Group\s*$/i;
const blockText = (b: PtBlock) => (b.children ?? []).map((c) => c.text ?? "").join("").trim();

/** The page's H1: the body's own first H1 when it has one, else the title without the "| Diamond Dental Group" ending. */
function splitHeading(title: string, body: PtBlock[]): { h1: string; body: PtBlock[] } {
  const i = body.findIndex((b) => b._type === "block" && b.style === "h1");
  const first = i >= 0 && body.slice(0, i).every((b) => b._type === "block" && !blockText(b)) ? i : -1;
  const rest = first >= 0 ? body.filter((_, j) => j !== first) : body;
  // Any other H1 in the text reads as a section heading (one H1 per page).
  return { h1: first >= 0 ? blockText(body[first]) : title.replace(BRAND, "").trim() || title, body: rest.map((b) => (b.style === "h1" ? { ...b, style: "h2" } : b)) };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [p, draft] = await Promise.all([getCityPage((await params).slug), draftsOn()]);
  if (!p) return {};
  // A draft (or anything seen through the preview link) is never indexed.
  return pageMetadata({ ...p.seo, noIndex: p.seo.noIndex || draft }, p.path, p.image);
}

const H3 = "mb-4 mt-10 font-heading text-xl font-semibold leading-snug text-ink-900";
const LIST = "my-7 space-y-3 text-[17px] leading-[1.7] text-grey-700 md:text-[18px]";

/** A link in the text: this site's own addresses (also written as full diamonddentalgroups.com URLs) stay on the site. */
function TextLink({ href, children }: { href?: string; children: React.ReactNode }) {
  const h = (href ?? "").trim();
  const own = h.match(/^https?:\/\/(?:www\.)?diamonddentalgroups\.com(\/[^\s]*)?$/i);
  const local = own ? own[1] || "/" : h;
  if (local.startsWith("/")) return <Link href={local} className={BODY_LINK}>{children}</Link>;
  if (!/^(https?:|mailto:|tel:)/i.test(local)) return <>{children}</>;
  return <a href={local} className={BODY_LINK} {...(/^https?:/i.test(local) ? { rel: "noopener" } : {})}>{children}</a>;
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className={P}>{children}</p>,
    h2: ({ children }) => <h2 className={H2}>{children}</h2>,
    h3: ({ children }) => <h3 className={H3}>{children}</h3>,
    h4: ({ children }) => <h4 className="mb-3 mt-8 text-lg font-semibold text-ink-900">{children}</h4>,
    blockquote: ({ children }) => <blockquote className="my-8 border-l-2 border-gold-500 pl-5 text-[17px] italic leading-[1.75] text-grey-700">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className={`blog-ul ${LIST}`}>{children}</ul>,
    number: ({ children }) => <ol className={`blog-ol ${LIST}`}>{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-ink-900">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => <TextLink href={(value as { href?: string } | undefined)?.href}>{children}</TextLink>,
  },
  types: {
    image: ({ value }) => {
      const img = (value as PtBlock).img;
      if (!img) return null;
      return (
        <figure className={`relative my-10 overflow-hidden rounded-lg ${photoFrame(img).aspect}`}>
          <Image src={img.src} alt={img.alt} fill loading="lazy" sizes="(min-width: 768px) 720px, 100vw" className={`object-cover ${photoFrame(img).position}`} />
        </figure>
      );
    },
  },
  // A block type this page does not know is left out instead of printing a warning box.
  unknownType: () => null,
};

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, s, about, hub] = await Promise.all([getCityPage(slug), getSiteSettings(), getAbout(), getServicesHub()]);
  if (!p) notFound();
  const { h1, body } = splitHeading(p.title, p.body);
  const author = postAuthor(p.author, about.dentist);
  const ownSchema = !!seoSchemaNodes(p.seo.schema);
  const t = hub.template;

  return (
    <SiteShell>
      <Breadcrumbs
        jsonLd={!ownSchema}
        items={[
          { name: "Home", path: "/" },
          { name: h1, path: p.path },
        ]}
      />
      <PageSchema seo={p.seo} />
      {ownSchema ? null : (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": absoluteUrl(p.path),
            url: absoluteUrl(p.path),
            name: h1,
            ...(p.seo.description ? { description: p.seo.description } : {}),
            inLanguage: "en-US",
            ...(p.seo.publishedTime ? { datePublished: p.seo.publishedTime } : {}),
            ...(p.seo.modifiedTime ? { dateModified: p.seo.modifiedTime } : {}),
            ...(p.image ? { primaryImageOfPage: { "@type": "ImageObject", url: p.image.src.startsWith("http") ? p.image.src : absoluteUrl(p.image.src) } } : {}),
            about: { "@id": `${siteUrl}/#dentist` },
            publisher: { "@type": "Dentist", "@id": `${siteUrl}/#dentist`, name: s.legalName },
            author: {
              "@type": "Person",
              name: author.name.replace(/^Dr\.?\s+/, ""),
              ...(/^Dr\.?\s+/.test(author.name) ? { honorificPrefix: "Dr." } : {}),
              ...(author.credential ? { honorificSuffix: author.credential } : {}),
              ...(author.jobTitle ? { jobTitle: author.jobTitle } : {}),
              ...(author.url ? { url: absoluteUrl(author.url) } : {}),
            },
          }}
        />
      )}
      <article>
        {/* The site's dark band: heading and byline, with the page's photo on the right when it has one. */}
        <header className="on-dark relative overflow-hidden bg-night-900 text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(230,185,51,0.14),transparent_55%)]" />
          <div className="relative z-10 mx-auto max-w-[1280px] lg:px-12">
            <div className={`grid items-center ${p.image ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)]" : ""} lg:gap-12 lg:py-16`}>
              {p.image ? (
                <figure className={`relative ${photoFrame(p.image).aspect} lg:order-2 lg:overflow-hidden lg:rounded-lg`}>
                  <Image src={p.image.src} alt={p.image.alt} fill priority fetchPriority="high" sizes="(min-width: 1024px) 520px, 100vw" className={`object-cover ${photoFrame(p.image).position}`} />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-night-900 to-transparent lg:hidden" aria-hidden="true" />
                </figure>
              ) : null}
              <div className={`px-4 pb-12 ${p.image ? "pt-5" : "pt-12"} lg:order-1 lg:px-0 lg:py-0`}>
                <h1 className="text-white">{h1}</h1>
                <div className="mt-7 flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 sm:inline-flex sm:pr-7">
                  {author.image ? <Image src={author.image.src} alt={author.image.alt || author.label} width={56} height={56} sizes="56px" className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-gold-400" /> : null}
                  <div className="text-sm leading-snug">
                    <span className="block font-semibold">
                      By{" "}
                      {author.url ? (
                        <Link href={author.url} className="underline decoration-gold-400/60 underline-offset-4 transition-colors hover:text-gold-400">
                          {author.label}
                        </Link>
                      ) : (
                        author.label
                      )}
                    </span>
                    {author.role ? <span className="mt-0.5 block text-white/70">{author.role}</span> : null}
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/contact/" data-track="book_appointment" className="btn btn-gold">
                    {t.primaryButton}
                  </Link>
                  <a href={s.phoneHref} data-track="click_to_call" className="btn btn-outline">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {s.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[720px] px-4 py-10 md:py-14">
          <PortableText value={body as never} components={components} />
        </div>
      </article>

      <CtaBanner heading={t.ctaHeading} image={images.storefront} primary={{ label: t.ctaButton, href: "/contact/", track: "book_appointment" }} phone={s.phone} phoneHref={s.phoneHref} />
    </SiteShell>
  );
}
