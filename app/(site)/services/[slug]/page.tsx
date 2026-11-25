import Image from "next/image";
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
import { FaqList, PageHero, PhotoCta } from "@/components/sections/Blocks";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const sv = await getService((await params).slug);
  if (!sv) return {};
  return pageMetadata(sv.seo, `/services/${sv.slug}/`, sv.heroImage);
}

/*
 * Service page in the Valencia template: photo banner, what it is, a charcoal band (photo beside who it suits and
 * the offer), the steps, a full-width photo call to action and the questions as plain rows.
 */
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [sv, hub, s] = await Promise.all([getService(slug), getServicesHub(), getSiteSettings()]);
  if (!sv) notFound();
  const t = hub.template;
  const path = `/services/${sv.slug}/`;
  const ownSchema = !!seoSchemaNodes(sv.seo.schema);

  return (
    <article>
      <div className="reading-progress" aria-hidden="true" />
      <PageSchema seo={sv.seo} />
      {!ownSchema && sv.faqs.length ? <JsonLd data={faqPageSchema(sv.faqs)} /> : null}

      {/* 1. Photo banner. Visible trail as on the live site; the schema uses the readable service name. */}
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
        heading={`${sv.heading} ${sv.headingSuffix}`.trim()}
        lead={sv.sub}
        image={sv.heroImage}
        primary={{ label: t.primaryButton, href: "/contact/", track: "book_appointment" }}
        secondary={{ label: s.phone, href: s.phoneHref, track: "click_to_call" }}
      />

      {/* 2. What it is */}
      <section id="overview" className="section bg-cream">
        <div className="container-x">
          <div className="max-w-3xl" data-reveal>
            <h2>{t.whatItIsHeading}</h2>
            <div className="mt-4 space-y-4 text-grey-700">
              {sv.whatItIs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Who it suits and the offer: photo beside the list, on charcoal */}
      <section id="right-for-you" className="dark-section section">
        <div className="container-x">
          <h2 className="uppercase">{t.rightForYouHeading}</h2>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-[4/5] overflow-hidden bg-night-800 lg:sticky lg:top-28">
              <Image src={images.drNikpour.src} alt={images.drNikpour.alt} fill loading="lazy" sizes="(min-width: 1024px) 560px, 100vw" className="object-cover object-top" />
            </div>
            <div>
              <ul className="divide-y divide-white/15 border-y border-white/15">
                {sv.rightForYou.map((it) => (
                  <li key={it} className="flex min-h-14 items-start gap-4 py-4 text-[1.125rem] font-semibold text-white sm:text-[1.25rem]">
                    <CircleCheck className="mt-1 h-5 w-5 shrink-0 text-gold-300" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
              {sv.offer ? (
                <div className="mt-10 rounded-lg bg-white/[0.06] p-7 ring-1 ring-white/15">
                  <p className="eyebrow">{t.offerLabel}</p>
                  <p className="mt-3 text-[2.125rem] font-semibold leading-none text-white">{sv.offer.amount}</p>
                  <p className="mt-2 text-white/75">{sv.offer.title}</p>
                  <Link href="/contact/" data-track="book_appointment" className="btn btn-light mt-6">
                    {t.offerButton}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 4. The steps */}
      <section id="how-it-works" className="section bg-cream">
        <div className="container-x">
          <h2 className="uppercase">{t.stepsHeading}</h2>
          <ol className={`mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 ${t.steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {t.steps.map((st, i) => (
              <li key={st.title} className="border-t border-ink-900/15 pt-5" data-reveal>
                <p className="text-sm font-semibold text-gold-700">Step {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 uppercase">{st.title}</h3>
                <p className="mt-2 text-grey-700">{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Full-width photo with the call to action */}
      <PhotoCta heading={t.ctaHeading} image={images.storefront} button={{ label: t.ctaButton, href: "/contact/", track: "book_appointment" }} phone={s.phone} phoneHref={s.phoneHref} />

      {/* 6. Questions */}
      {sv.faqs.length ? (
        <section id="questions" className="section bg-cream">
          <div className="container-x">
            <h2 className="text-center uppercase">{t.faqHeading}</h2>
            <FaqList faqs={sv.faqs} className="mx-auto mt-10 max-w-4xl" />
          </div>
        </section>
      ) : null}
    </article>
  );
}
