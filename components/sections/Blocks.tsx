import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Clock, MapPin, Phone, Plus } from "lucide-react";
import type { Faq, Img, SiteSettings } from "@/lib/types";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";

/*
 * The redesign's shared sections (Valencia / Ideal design language in Diamond's black and gold): page hero,
 * section heading, FAQ list, photo call-to-action banner and the visit/map block.
 */

type Action = { label: string; href: string; track?: string };

/** Internal links use next/link; tel:/mailto:/https: are plain anchors. */
export function ActionLink({ a, className, children }: { a: Action; className: string; children?: ReactNode }) {
  const content = children ?? a.label;
  return a.href.startsWith("/") ? (
    <Link href={a.href} data-track={a.track} className={className}>
      {content}
    </Link>
  ) : (
    <a href={a.href} data-track={a.track} className={className}>
      {content}
    </a>
  );
}

/**
 * Page hero: one full-width photo with the words low on the left over a dark fade (desktop). Phones: the photo
 * stands on its own and the words sit below it on black, so nothing covers faces. Without a photo: a plain dark band.
 */
export function PageHero({
  crumbs,
  crumbSchema,
  crumbJsonLd = true,
  eyebrow,
  heading,
  headingSuffix,
  lead,
  image,
  primary,
  secondary,
  note,
  tall = false,
  imageClass = "object-center",
  children,
}: {
  crumbs?: Crumb[];
  crumbSchema?: Crumb[];
  crumbJsonLd?: boolean;
  eyebrow?: string;
  heading: ReactNode;
  headingSuffix?: string;
  lead?: string;
  image?: Img;
  primary?: Action;
  secondary?: Action;
  note?: string;
  tall?: boolean;
  /** Where the photo is anchored when cropped (e.g. "object-center lg:object-top" keeps a sign in view). */
  imageClass?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`on-dark relative isolate overflow-hidden bg-night-900 text-white lg:flex lg:items-end ${image ? (tall ? "lg:min-h-[640px]" : "lg:min-h-[500px]") : ""}`} aria-labelledby="hero-heading">
      {image ? (
        <div className="hero-photo relative aspect-[16/10] w-full sm:aspect-[16/8] lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto">
          <Image src={image.src} alt={image.alt} fill priority fetchPriority="high" sizes="100vw" className={`object-cover ${imageClass}`} />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-night-900 lg:hidden" />
        </div>
      ) : null}
      <div
        aria-hidden="true"
        className={image ? "absolute inset-0 -z-10 hidden lg:block lg:bg-[linear-gradient(90deg,rgba(21,20,19,0.94)_0%,rgba(21,20,19,0.72)_38%,rgba(21,20,19,0.15)_70%,rgba(21,20,19,0)_100%)]" : "hidden"}
      />
      {!image ? <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_20%,rgba(230,185,51,0.16),transparent_55%)]" /> : null}
      <div className={`container-x w-full pb-12 pt-4 ${image ? "lg:pb-20 lg:pt-28" : "pt-14 md:pb-20 md:pt-20"}`}>
        <div className="hero-stage max-w-[36rem]">
          {crumbs ? (
            <div className="mb-5" data-stage="0">
              <Breadcrumbs variant="hero" items={crumbs} schema={crumbSchema} jsonLd={crumbJsonLd} />
            </div>
          ) : null}
          {eyebrow ? (
            <p className="eyebrow mb-4" data-stage="1">
              {eyebrow}
            </p>
          ) : null}
          <h1 id="hero-heading" className="text-white" data-stage="1">
            {heading}
            {headingSuffix ? <span className="mt-1 block text-gold-400">{headingSuffix}</span> : null}
          </h1>
          {lead ? (
            <p className="mt-4 text-[1.0625rem] text-white/85" data-stage="2">
              {lead}
            </p>
          ) : null}
          {primary || secondary ? (
            <div className="mt-7 flex flex-wrap gap-3" data-stage="3">
              {primary ? <ActionLink a={primary} className="btn btn-gold" /> : null}
              {secondary ? (
                <ActionLink a={secondary} className="btn btn-outline">
                  {secondary.href.startsWith("tel:") ? <Phone className="h-4 w-4" aria-hidden="true" /> : null}
                  {secondary.label}
                </ActionLink>
              ) : null}
            </div>
          ) : null}
          {note ? (
            <p className="mt-4 text-sm text-white/70" data-stage="4">
              {note}
            </p>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Section heading block: eyebrow, H2 and an intro line; centred or left. */
export function SectionHead({ eyebrow, heading, text, center = false, className = "" }: { eyebrow?: string; heading: ReactNode; text?: string; center?: boolean; className?: string }) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`} data-reveal>
      {eyebrow ? <p className={`eyebrow mb-3 ${center ? "justify-center" : ""}`}>{eyebrow}</p> : null}
      <h2>{heading}</h2>
      {text ? <p className="lead mt-3">{text}</p> : null}
    </div>
  );
}

/** FAQ accordion (native details; the questions stay in the page for search engines and screen readers). */
export function FaqList({ faqs, dark = false }: { faqs: Faq[]; dark?: boolean }) {
  return (
    <div className={`divide-y border-y ${dark ? "divide-white/15 border-white/15" : "divide-line border-line"}`}>
      {faqs.map((f) => (
        <details key={f.question} className="faq-item group">
          <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-4 text-left">
            <h3 className={`text-[1.0625rem] font-semibold ${dark ? "text-white" : "text-ink-900"}`}>{f.question}</h3>
            <Plus className={`faq-plus h-5 w-5 shrink-0 ${dark ? "text-gold-400" : "text-gold-700"}`} aria-hidden="true" />
          </summary>
          <p className={`faq-answer pb-5 pr-10 ${dark ? "text-white/75" : "text-grey-700"}`}>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

/** Photo banner with a dark tint and the booking buttons (Valencia "photo CTA"). */
export function CtaBanner({ heading, text, image, primary, phone, phoneHref }: { heading: string; text?: string; image: Img; primary: Action; phone: string; phoneHref: string }) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-night-900 text-white">
      <Image src={image.src} alt={image.alt} fill loading="lazy" sizes="100vw" className="-z-20 object-cover object-center" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(21,20,19,0.92)_0%,rgba(21,20,19,0.7)_45%,rgba(21,20,19,0.45)_100%)]" />
      <div className="container-x py-20 md:py-28" data-reveal>
        <div className="max-w-xl">
          <h2 className="text-white">{heading}</h2>
          {text ? <p className="mt-3 text-white/80">{text}</p> : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <ActionLink a={primary} className="btn btn-gold">
              {primary.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ActionLink>
            <a href={phoneHref} data-track="click_to_call" className="btn btn-outline">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Opening hours as rows; closed days dimmed. */
export function HoursList({ hours, dark = false }: { hours: SiteSettings["hours"]; dark?: boolean }) {
  return (
    <ul className="space-y-1.5 text-[0.9375rem]">
      {hours.map((h) => (
        <li key={h.day} className={`flex justify-between gap-6 ${h.opens ? (dark ? "text-white/85" : "text-ink-900") : dark ? "text-white/45" : "text-grey-600"}`}>
          <span>{h.day}</span>
          <span className="tabular-nums">{h.value}</span>
        </li>
      ))}
    </ul>
  );
}

/** Visit block: address, phone, hours and the map (loads only when it comes near the screen). */
export function VisitSection({ s, heading, text, bookLabel }: { s: SiteSettings; heading: string; text?: string; bookLabel: string }) {
  const mapTitle = `Map of ${s.name}, ${s.street}, ${s.city}`;
  const mapSrc = `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodeURIComponent(s.mapQuery)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`;
  return (
    <section className="section bg-cream">
      <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div data-reveal>
          <h2>{heading}</h2>
          {text ? <p className="lead mt-3">{text}</p> : null}
          <ul className="mt-8 space-y-6">
            <li className="flex gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand text-gold-700">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="pt-2 font-semibold hover:text-gold-700">
                {s.street}
                <span className="block font-normal text-grey-600">
                  {s.city}, {s.region} {s.postalCode}
                </span>
              </a>
            </li>
            <li className="flex gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand text-gold-700">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <a href={s.phoneHref} data-track="click_to_call" className="pt-2 font-semibold hover:text-gold-700">
                {s.phone}
              </a>
            </li>
            <li className="flex gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand text-gold-700">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="w-full max-w-xs pt-2">
                <HoursList hours={s.hours} />
              </div>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Get directions
            </a>
            <Link href={s.headerCta.href} data-track="book_appointment" className="btn btn-primary">
              {bookLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        {/* Lazy map: the iframe loads only when it comes within 300 px of the screen (lib/lazy-frames-script.ts). */}
        <div className="map-frame aspect-[4/3] overflow-hidden rounded-lg border border-line bg-sand lg:aspect-auto lg:h-[480px]" data-reveal>
          <iframe title={mapTitle} data-src={mapSrc} data-load="near" loading="lazy" referrerPolicy="no-referrer-when-downgrade" suppressHydrationWarning />
          <noscript>
            <iframe title={mapTitle} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </noscript>
        </div>
      </div>
    </section>
  );
}
