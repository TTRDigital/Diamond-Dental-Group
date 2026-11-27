import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { getAbout, getHome, getServicesHub, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { OFFICE } from "@/lib/data/photos";
import { CategoryCards, CtaPanel, IntroSplit, PageHero, ValuesGrid, VisitSection } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const a = await getAbout();
  return pageMetadata(a.seo, "/about/", a.dentist.image);
}

/*
 * About, in the Valencia "Our Practice" order: photo hero, the practice beside a framed photo, the values grid,
 * the lead dentist, the service groups, the visit block and the closing panel. All words are the site's own.
 */
export default async function AboutPage() {
  const [a, s, home, hub] = await Promise.all([getAbout(), getSiteSettings(), getHome(), getServicesHub()]);
  const groups = s.menu.find((m) => m.groups?.length)?.groups ?? [];
  return (
    <>
      <PageSchema seo={a.seo} />
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about/" },
        ]}
        crumbJsonLd={!seoSchemaNodes(a.seo.schema)}
        heading={a.hero.heading}
        lead={a.hero.text}
        image={OFFICE.hallway}
        imageClass="object-center"
        primary={{ label: a.cta.button, href: "/contact/", track: "book_appointment" }}
        secondary={{ label: home.featured.button, href: "/services/" }}
      />

      {/* The practice, beside a framed photo of the office with its address */}
      <IntroSplit heading={a.practice.heading} paragraphs={[a.practice.text]} image={OFFICE.waitingRoom2} tag={{ title: s.street, text: `${s.city}, ${s.region} ${s.postalCode}` }} />

      {/* Values: the team's promises and the practice's, numbered */}
      <ValuesGrid heading={a.team.heading} text={a.team.text} items={[...a.team.items, ...a.practice.items]} />

      {/* The lead dentist: photo card on the left, her story and credentials on the right */}
      <section className="section bg-sand" aria-labelledby="dentist-heading">
        <div className="container-x">
          <div className="max-w-2xl" data-reveal>
            <p className="eyebrow mb-4">{a.dentist.eyebrow}</p>
            <h2 id="dentist-heading">{a.dentist.heading}</h2>
          </div>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="overflow-hidden rounded-lg bg-white lg:col-span-4" data-reveal>
              <div className="relative aspect-[4/5]">
                <Image src={a.dentist.image.src} alt={a.dentist.image.alt} fill loading="lazy" sizes="(min-width: 1024px) 380px, 100vw" className="object-cover object-top" />
              </div>
              <div className="p-5">
                <p className="font-semibold text-ink-900">{a.dentist.heading}</p>
                <p className="text-sm text-grey-600">{a.dentist.credentials[0]}</p>
              </div>
            </div>
            <div className="lg:col-span-8" data-reveal>
              <p className="text-grey-700">{a.dentist.text}</p>
              <blockquote className="mt-6 border-l-2 border-gold-500 pl-5 text-[1.125rem] leading-snug text-ink-900">&ldquo;{a.dentist.quote}&rdquo;</blockquote>
              <ul className="mt-8 grid gap-x-8 gap-y-3 border-t border-ink-900/10 pt-6 sm:grid-cols-2">
                {a.dentist.credentials.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-sm text-ink-900">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
              <Link href="/contact/" data-track="book_appointment" className="btn btn-primary mt-8">
                {a.cta.button}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Everything under one roof: the service groups */}
      <CategoryCards heading={hub.heading} text={hub.text} groups={groups} exploreLabel={home.featured.button} book={{ label: a.cta.button, href: "/contact/", track: "book_appointment" }} />

      <VisitSection s={s} heading={home.cta.heading} text={home.cta.text} bookLabel={a.cta.button} />

      <CtaPanel s={s} heading={a.cta.heading} button={{ label: a.cta.button, href: "/contact/", track: "book_appointment" }} image={OFFICE.frontDesk} />
    </>
  );
}
