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
import { btnBase, btnGold } from "@/components/ui/Buttons";
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

const H3 = "mb-4 mt-10 font-heading text-xl font-bold leading-snug text-black md:text-2xl";
const LIST = "my-7 space-y-3 text-[17px] leading-[1.7] text-gray-700 md:text-[18px]";

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
    h4: ({ children }) => <h4 className="mb-3 mt-8 font-heading text-lg font-bold text-black">{children}</h4>,
    blockquote: ({ children }) => <blockquote className="my-8 border-l-4 border-secondary pl-5 text-[17px] italic leading-[1.75] text-gray-700">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className={`blog-ul ${LIST}`}>{children}</ul>,
    number: ({ children }) => <ol className={`blog-ol ${LIST}`}>{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => <TextLink href={(value as { href?: string } | undefined)?.href}>{children}</TextLink>,
  },
  types: {
    image: ({ value }) => {
      const img = (value as PtBlock).img;
      if (!img) return null;
      return (
        <figure className={`relative my-10 overflow-hidden rounded-2xl shadow-md ${photoFrame(img).aspect}`}>
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
      <article className="bg-white">
        {/* The site's dark band: heading and byline, with the page's photo on the right when it has one. */}
        <header className="relative overflow-hidden bg-black text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#161616] to-[#2a2000] opacity-90" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,184,51,0.16),transparent_55%)]" />
          <div className="relative z-10 mx-auto max-w-6xl lg:px-4">
            <div className={`grid items-center ${p.image ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)]" : ""} lg:gap-12 lg:py-16`}>
              {p.image ? (
                <figure className={`relative ${photoFrame(p.image).aspect} lg:order-2 lg:overflow-hidden lg:rounded-3xl lg:shadow-2xl lg:ring-1 lg:ring-white/10`}>
                  <Image src={p.image.src} alt={p.image.alt} fill priority fetchPriority="high" sizes="(min-width: 1024px) 520px, 100vw" className={`object-cover ${photoFrame(p.image).position}`} />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent lg:hidden" aria-hidden="true" />
                </figure>
              ) : null}
              <div className={`px-4 pb-12 ${p.image ? "pt-5" : "pt-12"} lg:order-1 lg:px-0 lg:py-0`}>
                <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">{h1}</h1>
                <div className="mt-7 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:inline-flex sm:pr-7">
                  {author.image ? <Image src={author.image.src} alt={author.image.alt || author.label} width={56} height={56} sizes="56px" className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-secondary" /> : null}
                  <div className="text-sm leading-snug">
                    <span className="block font-semibold">
                      By{" "}
                      {author.url ? (
                        <Link href={author.url} className="underline decoration-secondary/60 underline-offset-4 transition-colors hover:text-secondary">
                          {author.label}
                        </Link>
                      ) : (
                        author.label
                      )}
                    </span>
                    {author.role ? <span className="mt-0.5 block text-white/70">{author.role}</span> : null}
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href="/contact/" data-track="book_appointment" className={`${btnGold} rounded-lg px-8 py-6 text-lg font-bold shadow-[0_4px_14px_rgba(229,184,51,0.4)] transition-all hover:-translate-y-0.5`}>
                    {t.primaryButton}
                  </Link>
                  <a href={s.phoneHref} data-track="click_to_call" className="inline-flex items-center justify-center px-4 py-3 text-xl font-bold text-white transition-colors hover:text-secondary">
                    <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
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

      <section className="bg-secondary py-16 text-center px-4">
        <div className="container mx-auto max-w-4xl" data-reveal>
          <h2 className="text-3xl md:text-5xl font-black text-black mb-8 tracking-tight">{t.ctaHeading}</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact/"
              data-track="book_appointment"
              className={`${btnBase} h-10 bg-black hover:bg-gray-900 text-white font-bold rounded-xl px-10 py-7 text-lg shadow-xl hover:-translate-y-1 transition-transform`}
            >
              {t.ctaButton}
            </Link>
            <a
              href={s.phoneHref}
              data-track="click_to_call"
              className={`${btnBase} transition-colors border h-10 border-black text-black hover:bg-black hover:text-white font-bold rounded-xl px-10 py-7 text-lg bg-transparent`}
            >
              {s.phone}
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
