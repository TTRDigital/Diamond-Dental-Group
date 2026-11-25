import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { getService, getServices, getServicesHub, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { faqPageSchema, seoSchemaNodes } from "@/lib/schema";
import { slugLabel } from "@/lib/text";
import { images } from "@/lib/data/images";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageSchema } from "@/components/ui/PageSchema";
import { CtaBanner, FaqList, PageHero } from "@/components/sections/Blocks";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const sv = await getService((await params).slug);
  if (!sv) return {};
  return pageMetadata(sv.seo, `/services/${sv.slug}/`, sv.heroImage);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [sv, hub, s] = await Promise.all([getService(slug), getServicesHub(), getSiteSettings()]);
  if (!sv) notFound();
  const t = hub.template;
  const path = `/services/${sv.slug}/`;
  const ownSchema = !!seoSchemaNodes(sv.seo.schema);

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <PageSchema seo={sv.seo} />
      {!ownSchema && sv.faqs.length ? <JsonLd data={faqPageSchema(sv.faqs)} /> : null}
      {/* Visible trail as on the live site; the schema uses the readable service name. */}
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services/" },
          { name: slugLabel(sv.slug), path },
        ]}
        crumbSchema={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services/" },
          { name: sv.name, path },
        ]}
        crumbJsonLd={!ownSchema}
        eyebrow={t.badge}
        heading={sv.heading}
        headingSuffix={sv.headingSuffix}
        lead={sv.sub}
        image={sv.heroImage}
        primary={{ label: t.primaryButton, href: "/contact/", track: "book_appointment" }}
        secondary={{ label: s.phone, href: s.phoneHref, track: "click_to_call" }}
      />

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div className="min-w-0 space-y-16">
            <div data-reveal>
              <h2>{t.whatItIsHeading}</h2>
              <div className="mt-5 max-w-[68ch] space-y-5 text-[1.0625rem] text-grey-700">
                {sv.whatItIs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div data-reveal>
              <h2>{t.rightForYouHeading}</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {sv.rightForYou.map((it) => (
                  <li key={it} className="card flex items-start gap-3 border border-line p-5">
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
                    <span className="font-medium text-ink-900">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            {sv.faqs.length ? (
              <div data-reveal>
                <h2 className="mb-6">{t.faqHeading}</h2>
                <FaqList faqs={sv.faqs} />
              </div>
            ) : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
            {sv.offer ? (
              <div className="on-dark rounded-lg bg-ink-900 p-7 text-white" data-reveal>
                <p className="eyebrow">{t.offerLabel}</p>
                <p className="mt-3 text-[2.5rem] font-semibold leading-none text-white">{sv.offer.amount}</p>
                <p className="mt-2 text-white/70">{sv.offer.title}</p>
                <Link href="/contact/" data-track="book_appointment" className="btn btn-gold mt-6 w-full">
                  {t.offerButton}
                </Link>
              </div>
            ) : null}
            <div className="card border border-line p-7" data-reveal>
              <h2 className="text-[1.25rem]">{t.stepsHeading}</h2>
              <ol className="mt-6 space-y-5">
                {t.steps.map((st, i) => (
                  <li key={st.title} className="flex gap-4">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-gold-400">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-ink-900">{st.title}</p>
                      <p className="mt-0.5 text-sm text-grey-600">{st.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <CtaBanner heading={t.ctaHeading} image={images.storefront} primary={{ label: t.ctaButton, href: "/contact/", track: "book_appointment" }} phone={s.phone} phoneHref={s.phoneHref} />
    </>
  );
}
