import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getContact, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { images } from "@/lib/data/images";
import { HoursList, PageHero } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContact();
  return pageMetadata(c.seo, "/contact/");
}

export default async function ContactPage() {
  const [c, s] = await Promise.all([getContact(), getSiteSettings()]);
  const mapTitle = `Map of ${s.name}, ${s.street}, ${s.city}`;
  const mapSrc = `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodeURIComponent(s.mapQuery)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`;
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
        image={images.storefront}
        imageClass="object-[50%_20%] lg:object-top"
        lead={c.text}
      />

      <section className="section-tight bg-cream">
        <div className="container-x grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* Online scheduler (Jarvis Analytics), as on the live page. Loads once the page has loaded
                (lib/lazy-frames-script.ts), so it never competes with the first paint. */}
            <div className="relative h-full min-h-[700px] overflow-hidden rounded-lg bg-white ring-1 ring-ink-900/5">
              <iframe title={c.bookingTitle} data-src={s.bookingUrl} data-load="after-load" className="absolute inset-0 h-full w-full border-0" suppressHydrationWarning />
              <noscript>
                <iframe title={c.bookingTitle} src={s.bookingUrl} loading="lazy" className="absolute inset-0 h-full w-full border-0" />
              </noscript>
            </div>
          </div>
          <div className="grid content-start gap-6 lg:col-span-5">
            <div className="on-dark rounded-lg bg-night-900 p-8 text-white">
              <h2 className="text-[1.25rem]">{c.directHeading}</h2>
              <a href={s.phoneHref} data-track="click_to_call" className="group mt-6 flex items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white group-hover:text-night-900">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[1.5rem] font-semibold text-gold-300">{s.phone}</span>
                  <span className="text-sm text-white/65">{c.callLabel}</span>
                </span>
              </a>
              <div className="mt-6 flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <span className="block font-semibold">{s.name}</span>
                  <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 transition-colors hover:text-gold-300">
                    {s.street}
                    <br />
                    {s.city}, {s.region} {s.postalCode}, {s.country}
                  </a>
                </div>
              </div>
              <a href={`mailto:${s.email}`} className="mt-6 flex items-center gap-4 break-all text-sm text-white/80 transition-colors hover:text-gold-300">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                {s.email}
              </a>
            </div>
            <div className="rounded-lg bg-ivory p-8 ring-1 ring-ink-900/5">
              <h2 className="flex items-center gap-3 text-[1.25rem]">
                <Clock className="h-5 w-5 text-gold-700" aria-hidden="true" />
                {c.hoursHeading}
              </h2>
              <div className="mt-5">
                <HoursList hours={s.hours} />
              </div>
            </div>
            {/* Lazy map: loads only when it comes near the screen (lib/lazy-frames-script.ts). */}
            <div className="map-frame aspect-[4/3] overflow-hidden rounded-lg bg-sand ring-1 ring-ink-900/10">
              <iframe title={mapTitle} data-src={mapSrc} data-load="near" loading="lazy" referrerPolicy="no-referrer-when-downgrade" suppressHydrationWarning />
              <noscript>
                <iframe title={mapTitle} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </noscript>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
