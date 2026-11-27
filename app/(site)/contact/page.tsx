import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { getContact, getHome, getPatientCare, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { INSURER_LOGOS, OFFICE } from "@/lib/data/photos";
import { HoursList, InsuranceStrip, PageHero, VisitSection } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContact();
  return pageMetadata(c.seo, "/contact/");
}

/*
 * Contact, in the Valencia order: photo hero with call and book buttons, direct contact beside the booking form
 * (the practice's Jarvis scheduler, as on the live page), accepted insurance, and the visit block with the map.
 */
export default async function ContactPage() {
  const [c, s, care, home] = await Promise.all([getContact(), getSiteSettings(), getPatientCare(), getHome()]);
  const rows = "grid grid-cols-[6rem_1fr] gap-4 border-t border-ink-900/10 py-4 text-sm";
  return (
    <>
      <PageSchema seo={c.seo} />
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact/" },
        ]}
        crumbJsonLd={!seoSchemaNodes(c.seo.schema)}
        eyebrow={c.badge}
        heading={
          <>
            {c.heading} <em>{c.headingAccent}</em>
          </>
        }
        lead={c.text}
        image={OFFICE.frontDesk}
        imageClass="object-center"
        primary={{ label: s.phone, href: s.phoneHref, track: "click_to_call" }}
        secondary={{ label: s.mobileBookLabel, href: "#booking" }}
      />

      <section className="section bg-cream">
        <div className="container-x grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Direct contact */}
          <div className="lg:col-span-5" data-reveal>
            <h2>{c.directHeading}</h2>
            <p className="mt-3 text-grey-700">{c.callLabel}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={s.phoneHref} data-track="click_to_call" className="btn btn-primary">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {s.phone}
              </a>
              <a href="#booking" className="btn btn-outline">
                {s.mobileBookLabel}
              </a>
            </div>
            <dl className="mt-10 border-b border-ink-900/10">
              <div className={rows}>
                <dt className="text-grey-600">{s.name}</dt>
                <dd>
                  <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-ink-900 hover:underline">
                    {s.street}, {s.city}, {s.region} {s.postalCode}, {s.country}
                  </a>
                </dd>
              </div>
              <div className={rows}>
                <dt className="text-grey-600">{c.hoursHeading}</dt>
                <dd className="text-ink-900">
                  <HoursList hours={s.hours} />
                </dd>
              </div>
              <div className={rows}>
                <dt className="text-grey-600">Email</dt>
                <dd>
                  <a href={`mailto:${s.email}`} className="break-all text-ink-900 hover:underline">
                    {s.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Online scheduler (Jarvis Analytics), as on the live page. Loads once the page has loaded
              (lib/lazy-frames-script.ts), so it never competes with the first paint. */}
          <div id="booking" className="scroll-mt-28 lg:col-span-7" data-reveal>
            <div className="overflow-hidden rounded-lg bg-white shadow-[var(--shadow-lift)] ring-1 ring-ink-900/5">
              <div className="relative min-h-[700px]">
                <iframe title={c.bookingTitle} data-src={s.bookingUrl} data-load="after-load" className="absolute inset-0 h-full w-full border-0" suppressHydrationWarning />
                <noscript>
                  <iframe title={c.bookingTitle} src={s.bookingUrl} loading="lazy" className="absolute inset-0 h-full w-full border-0" />
                </noscript>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InsuranceStrip heading={care.insurance.heading} text={care.insurance.text} plans={care.insurance.plans} logos={care.insurance.plans.map((p) => INSURER_LOGOS[p]).filter((l) => !!l)} />

      <VisitSection s={s} heading={home.cta.heading} text={home.cta.text} bookLabel={home.cta.button} />
    </>
  );
}
