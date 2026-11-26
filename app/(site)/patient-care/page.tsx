import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleCheck } from "lucide-react";
import { getPatientCare, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { images } from "@/lib/data/images";
import { INSURER_LOGOS, STOCK, isDefaultRoomPhoto } from "@/lib/data/stock";
import { CtaPanel, InsuranceStrip, PageHero, SectionHead } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPatientCare();
  return pageMetadata(p.seo, "/patient-care/");
}

export default async function PatientCarePage() {
  const [p, s] = await Promise.all([getPatientCare(), getSiteSettings()]);
  return (
    <>
      <PageSchema seo={p.seo} />
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Patient Care", path: "/patient-care/" },
        ]}
        crumbJsonLd={!seoSchemaNodes(p.seo.schema)}
        heading={p.hero.heading}
        lead={p.hero.text}
        image={images.treatmentRoom}
      />

      {/* $49 new patient special */}
      <section className="section">
        <div className="container-x">
          <div className="relative grid overflow-hidden rounded-lg bg-ivory ring-1 ring-ink-900/5 md:grid-cols-[1.2fr_1fr]" data-reveal>
            <span className="absolute right-0 top-0 rounded-bl-md bg-night-900 px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-gold-300">{p.special.badge}</span>
            <div className="p-8 md:p-12">
              <h2 className="pr-28">{p.special.heading}</h2>
              <p className="lead mt-4">{p.special.text}</p>
              <Link href="/contact/" data-track="book_appointment" className="btn btn-primary mt-8">
                {p.special.button}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="on-dark bg-night-900 p-8 text-white md:p-12">
              <p className="text-white/55 line-through">{p.special.regular}</p>
              <p className="mt-1 text-[2.75rem] font-semibold leading-none text-gold-300">{p.special.price}</p>
              <p className="mt-2 font-semibold text-white">{p.special.savings}</p>
              <ul className="mt-6 space-y-3">
                {p.special.items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-white/90">
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* More grand opening offers */}
      <section className="section border-y border-ink-900/10 bg-cream">
        <div className="container-x">
          <SectionHead heading={p.offers.heading} text={p.offers.text} center />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {p.offers.items.map((o, i) => (
              <div key={o.title} className="flex flex-col overflow-hidden rounded-lg bg-ivory ring-1 ring-ink-900/5" data-reveal>
                {(() => {
                  // The offer's own photo when one was chosen in /cms, otherwise its treatment's photo.
                  const ph = o.image && !isDefaultRoomPhoto(o.image) ? o.image : [STOCK.whiteningLight, STOCK.clearAlignerSmile, STOCK.implantModel][i % 3];
                  return (
                    <div className="relative aspect-[16/10] bg-line">
                      <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                      <span className="absolute bottom-4 left-4 rounded-md bg-night-900 px-4 py-2 text-[1.5rem] font-semibold text-gold-300">{o.amount}</span>
                    </div>
                  );
                })()}
                <div className="flex grow flex-col p-7">
                  <h3>{o.title}</h3>
                  <p className="mt-2 grow text-grey-700">{o.text}</p>
                  <Link href="/contact/" data-track="book_appointment" aria-label={`${p.offers.button}: ${o.amount} ${o.title}`} className="btn btn-outline btn-sm mt-6 self-start">
                    {p.offers.button}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance: the insurers' logos and every accepted plan */}
      <InsuranceStrip
        heading={p.insurance.heading}
        text={p.insurance.text}
        plans={p.insurance.plans}
        logos={p.insurance.plans.map((x) => INSURER_LOGOS[x]).filter((l) => !!l)}
        note={
          <p className="font-medium">
            {p.insurance.notePrefix}{" "}
            <a href={s.phoneHref} data-track="click_to_call" className="font-bold text-gold-700 underline-offset-4 hover:underline">
              {p.insurance.noteLink}
            </a>{" "}
            {p.insurance.noteSuffix}
          </p>
        }
      />

      {/* Membership plan */}
      <section className="dark-section section">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div data-reveal>
            <h2>{p.membership.heading}</h2>
            <p className="lead mt-4">{p.membership.text}</p>
            <div className="mt-8 inline-block rounded-lg bg-white/[0.06] ring-1 ring-white/15 px-8 py-6">
              <p className="text-sm uppercase tracking-[0.08em] text-white/60">{p.membership.priceLabel}</p>
              <p className="mt-1 text-[2.5rem] font-semibold leading-none text-gold-300">
                {p.membership.price}
                <span className="text-xl">{p.membership.per}</span>
              </p>
            </div>
            <div className="mt-8">
              <a href={s.phoneHref} data-track="click_to_call" className="btn btn-primary">
                {p.membership.button}
              </a>
            </div>
          </div>
          <div className="rounded-lg bg-night-800 p-8" data-reveal>
            <h3 className="border-b border-white/10 pb-4">{p.membership.includesHeading}</h3>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {p.membership.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-white/90">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <h2>{p.payment.heading}</h2>
            <p className="lead mt-3">{p.payment.text}</p>
          </div>
        </div>
      </section>

      <CtaPanel s={s} heading={p.cta.heading} button={{ label: p.cta.button, href: "/contact/", track: "book_appointment" }} image={images.storefront} />
    </>
  );
}
