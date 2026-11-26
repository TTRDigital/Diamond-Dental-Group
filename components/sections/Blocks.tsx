import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, Clock, MapPin, Navigation, Phone } from "lucide-react";
import type { Faq, Img, SiteSettings } from "@/lib/types";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";

/*
 * The redesign's shared sections, ported from the Valencia Dentistry site (Ideal Dental / Beverly Hills style):
 * full-bleed photo heroes with the words low on the left, three photos edge to edge, a full-width photo banner,
 * numbered steps over photos, the doctor beside a half-screen photo, the visit block with the map, plain FAQ rows
 * and the closing panel. Valencia's olive is Diamond's warm charcoal; its bronze is Diamond's gold.
 */

export type Action = { label: string; href: string; track?: string };

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

const FADE = "lg:bg-[linear-gradient(90deg,rgba(47,43,39,0.92)_0%,rgba(47,43,39,0.6)_38%,rgba(47,43,39,0)_62%)]";
const FADE_HOME = "lg:bg-[linear-gradient(90deg,rgba(47,43,39,0.92)_0%,rgba(47,43,39,0.6)_32%,rgba(47,43,39,0)_52%)]";

/**
 * Page hero (Valencia PageHero): one full-width photo, the title low on the left over a charcoal fade.
 * Phones: the photo stands on its own and the words sit below it on charcoal. Without a photo: a charcoal band.
 * `home` is the taller home-page version.
 */
export function PageHero({
  crumbs,
  crumbSchema,
  crumbJsonLd = true,
  eyebrow,
  heading,
  sub,
  lead,
  image,
  imageClass = "object-[50%_30%]",
  primary,
  secondary,
  note,
  home = false,
  pill,
  light = false,
  children,
}: {
  crumbs?: Crumb[];
  crumbSchema?: Crumb[];
  crumbJsonLd?: boolean;
  eyebrow?: string;
  heading: ReactNode;
  sub?: string;
  lead?: string;
  image?: Img;
  imageClass?: string;
  primary?: Action;
  secondary?: Action;
  note?: ReactNode;
  home?: boolean;
  /** Short line in a pill above the heading (Valencia's rating pill). */
  pill?: ReactNode;
  /** Light header without a photo (Valencia's blog). */
  light?: boolean;
  children?: ReactNode;
}) {
  if (light)
    return (
      <section className="border-b border-ink-900/10 bg-cream" aria-labelledby="hero-heading">
        <div className="container-x py-12 lg:py-16">
          <div className="max-w-[40rem]">
            {crumbs ? (
              <div className="mb-6">
                <Breadcrumbs variant="plain" items={crumbs} schema={crumbSchema} jsonLd={crumbJsonLd} />
              </div>
            ) : null}
            {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
            <h1 id="hero-heading">{heading}</h1>
            {lead ? <p className="mt-3 text-grey-700">{lead}</p> : null}
            {children}
          </div>
        </div>
      </section>
    );
  return (
    <section className={`on-dark relative isolate overflow-hidden bg-night-900 text-white lg:flex lg:items-end ${image ? (home ? "lg:min-h-[640px]" : "lg:min-h-[520px]") : ""}`} aria-labelledby="hero-heading">
      {image ? (
        <div className={`hero-photo relative w-full lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto ${home ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-[16/10]"}`}>
          <Image src={image.src} alt={image.alt} fill priority fetchPriority="high" sizes="100vw" className={`object-cover ${imageClass}`} />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-night-900 lg:hidden" />
        </div>
      ) : null}
      <div aria-hidden="true" className={image ? `absolute inset-0 -z-10 hidden lg:block ${home ? FADE_HOME : FADE}` : "hidden"} />
      <div className={`container-x w-full ${image ? "pb-10 pt-4 lg:pb-16 lg:pt-28" : "py-14 lg:py-20"} ${home && image ? "lg:pb-24" : ""}`}>
        <div className={`hero-stage ${home ? "lg:max-w-[31rem]" : "max-w-[34rem]"}`}>
          {crumbs ? (
            <div className="mb-5" data-stage="0">
              <Breadcrumbs variant="hero" items={crumbs} schema={crumbSchema} jsonLd={crumbJsonLd} />
            </div>
          ) : null}
          {pill ? (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/90 ring-1 ring-white/25" data-stage="0">
              {pill}
            </p>
          ) : null}
          {eyebrow ? (
            <p className="eyebrow mb-3" data-stage="1">
              {eyebrow}
            </p>
          ) : null}
          <h1 id="hero-heading" className="text-white" data-stage="1">
            {heading}
          </h1>
          {sub ? (
            <p className="mt-3 text-[1.25rem] font-semibold text-white" data-stage="2">
              {sub}
            </p>
          ) : null}
          {lead ? (
            <p className="mt-3 text-white/85" data-stage="2">
              {lead}
            </p>
          ) : null}
          {primary || secondary ? (
            <div className="mt-6 flex flex-wrap gap-3" data-stage="3">
              {primary ? <ActionLink a={primary} className="btn btn-ghost" /> : null}
              {secondary ? <ActionLink a={secondary} className="btn btn-light" /> : null}
            </div>
          ) : null}
          {note ? (
            <div className="mt-5 text-sm text-white/75" data-stage="4">
              {note}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Section heading: eyebrow, H2 and a lead line; centred or left (Valencia RichHeading). */
export function SectionHead({ eyebrow, heading, text, center = false, upper = false, className = "", id }: { eyebrow?: string; heading: ReactNode; text?: string; center?: boolean; upper?: boolean; className?: string; id?: string }) {
  return (
    <div className={`max-w-[46rem] ${center ? "mx-auto text-center" : ""} ${className}`} data-reveal>
      {eyebrow ? <p className={`eyebrow mb-4 ${center ? "justify-center" : ""}`}>{eyebrow}</p> : null}
      <h2 id={id} className={upper ? "uppercase" : ""}>
        {heading}
      </h2>
      {text ? <p className="lead mt-3">{text}</p> : null}
    </div>
  );
}

/** FAQ rows (Beverly Hills style): plain rows, question at 20px, + / − on the right, the first one open. */
export function FaqList({ faqs, dark = false, className = "" }: { faqs: Faq[]; dark?: boolean; className?: string }) {
  return (
    <div className={className}>
      {faqs.map((f, i) => (
        <details key={f.question} className="faq-item group" name="faq" open={i === 0 || undefined}>
          <summary className={`flex min-h-14 cursor-pointer items-center justify-between gap-6 py-3 text-left ${dark ? "text-white" : "text-ink-900"}`}>
            <h3 className={`text-[1.125rem] font-semibold sm:text-[1.25rem] ${dark ? "text-white" : ""}`}>{f.question}</h3>
            <span aria-hidden="true" className="shrink-0 text-2xl font-light leading-none">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <div className={`faq-answer pb-4 ${dark ? "text-white/85" : "pl-4 text-grey-700"}`}>
            <p>{f.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/** Centred heading and line, then three photos edge to edge, each with a title and text below (Ideal Dental). */
export function PhotoTrio({ heading, text, items, id }: { heading: string; text?: string; items: { title: string; text: string; image: Img; imageClass?: string }[]; id?: string }) {
  return (
    <section className="section bg-cream pb-0 sm:pb-0" id={id}>
      <div className="container-x text-center" data-reveal>
        <h2>{heading}</h2>
        {text ? <p className="mx-auto mt-3 max-w-2xl text-grey-700">{text}</p> : null}
      </div>
      <ul className="mt-10 grid sm:grid-cols-3">
        {items.map((it) => (
          <li key={it.title} className="flex flex-col bg-ivory" data-reveal>
            <span className="relative block aspect-[16/9] overflow-hidden sm:aspect-[16/10]">
              <Image src={it.image.src} alt={it.image.alt} fill sizes="(min-width: 640px) 34vw, 100vw" className={`object-cover transition-transform duration-700 hover:scale-[1.04] ${it.imageClass ?? ""}`} />
            </span>
            <span className="block px-5 py-6 sm:px-7 sm:py-8">
              <h3>{it.title}</h3>
              <p className="mt-2 text-grey-700">{it.text}</p>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** A full-width office photo with a short statement in caps and a link, low on the left. */
export function PhotoBanner({ eyebrow, heading, text, image, link, children }: { eyebrow?: string; heading: string; text?: string; image: Img; link?: Action; children?: ReactNode }) {
  return (
    <section className="on-dark relative isolate flex min-h-[420px] items-end overflow-hidden text-white sm:min-h-[520px]">
      <Image src={image.src} alt={image.alt} fill loading="lazy" sizes="100vw" className="-z-20 object-cover object-center" />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-night-900/90 via-night-900/50 to-night-900/15 sm:bg-gradient-to-r sm:from-night-900/90 sm:via-night-900/50 sm:to-night-900/5" />
      <div className="container-x w-full pb-10 sm:pb-16" data-reveal>
        <div className="max-w-lg">
          {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
          <h2 className="font-bold uppercase tracking-[0.08em] text-white">{heading}</h2>
          {text ? <p className="mt-3 text-[1.0625rem] text-white/90">{text}</p> : null}
          {children}
          {link ? <ActionLink a={link} className="link-line mt-5 px-1 uppercase tracking-[0.12em] text-white hover:text-gold-300" /> : null}
        </div>
      </div>
    </section>
  );
}

/** Numbered steps, each written over its own photo (or a charcoal tile), under a centred heading and a square button. */
export function PhotoSteps({ eyebrow, heading, text, button, items }: { eyebrow?: string; heading: string; text?: string; button?: Action; items: { title: string; text: string; image?: Img; link?: Action }[] }) {
  const cols = items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";
  return (
    <section aria-labelledby="steps-heading" className="bg-cream">
      <div className="container-x section pb-10 text-center sm:pb-12" data-reveal>
        {eyebrow ? <p className="eyebrow mb-4 justify-center">{eyebrow}</p> : null}
        <h2 id="steps-heading">{heading}</h2>
        {text ? <p className="mx-auto mt-3 max-w-2xl text-grey-700">{text}</p> : null}
        {button ? <ActionLink a={button} className="btn-square mt-6" /> : null}
      </div>
      <ol className={`grid ${cols}`}>
        {items.map((it, i) => (
          <li key={it.title} className="on-dark relative isolate flex min-h-[260px] items-end overflow-hidden bg-night-900 text-white sm:min-h-[420px]">
            {it.image ? (
              <Image src={it.image.src} alt={it.image.alt} fill loading="lazy" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="-z-20 object-cover" />
            ) : (
              <span aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_30%_20%,rgba(220,192,120,0.22),transparent_60%)]" />
            )}
            <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-night-900/92 via-night-900/50 to-transparent" />
            <span className="block p-6 sm:p-8">
              <h3 className="text-white">
                {i + 1}. {it.title}
              </h3>
              <p className="mt-2 text-white/85">{it.text}</p>
              {it.link ? <ActionLink a={it.link} className="link-line mt-4 text-white hover:text-gold-300" /> : null}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The dentist: words on the left, a large photo filling the right half to the screen edge (phones: photo first). */
export function DoctorSplit({ eyebrow, heading, paragraphs, image, primary, secondary, children, id }: { eyebrow?: string; heading: string; paragraphs: string[]; image: Img; primary?: Action; secondary?: Action; children?: ReactNode; id?: string }) {
  return (
    <section className="bg-cream" id={id} aria-labelledby="doctor-heading">
      <div className="grid lg:min-h-[640px] lg:grid-cols-2">
        <div className="flex items-center">
          <div className="w-full px-4 py-12 sm:px-8 sm:py-16 lg:ml-auto lg:max-w-[38rem] lg:py-24 lg:pl-0 lg:pr-16 xl:pr-20" data-reveal>
            {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
            <h2 id="doctor-heading">{heading}</h2>
            <div className="mt-5 space-y-4 text-grey-700 sm:mt-6">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {children}
            {primary || secondary ? (
              <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
                {primary ? (
                  <ActionLink a={primary} className="btn btn-primary">
                    {primary.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ActionLink>
                ) : null}
                {secondary ? <ActionLink a={secondary} className="btn btn-outline" /> : null}
              </div>
            ) : null}
          </div>
        </div>
        <div className="relative order-first aspect-[5/4] w-full bg-sand sm:aspect-[4/3] lg:order-none lg:aspect-auto">
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top" />
        </div>
      </div>
    </section>
  );
}

/** Opening hours as a two-column list; closed days dimmed. */
export function HoursList({ hours, dark = false }: { hours: SiteSettings["hours"]; dark?: boolean }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-0.5">
      {hours.map((h) => (
        <div key={h.day} className="contents">
          <dt className={h.opens ? "" : dark ? "text-white/50" : "text-grey-600"}>{h.day}</dt>
          <dd className={`tabular-nums ${h.opens ? (dark ? "font-medium text-white" : "font-medium text-ink-900") : dark ? "text-white/50" : "text-grey-600"}`}>{h.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The lazy Google map (loads only when it comes within 300 px of the screen; lib/lazy-frames-script.ts). */
export function MapFrame({ s, className = "" }: { s: SiteSettings; className?: string }) {
  const mapTitle = `Map of ${s.name}, ${s.street}, ${s.city}`;
  const mapSrc = `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodeURIComponent(s.mapQuery)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`;
  return (
    <div className={`map-frame overflow-hidden rounded-lg bg-sand ring-1 ring-ink-900/10 ${className}`}>
      <iframe title={mapTitle} data-src={mapSrc} data-load="near" loading="lazy" referrerPolicy="no-referrer-when-downgrade" suppressHydrationWarning />
      <noscript>
        <iframe title={mapTitle} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </noscript>
    </div>
  );
}

/** Visit block (Valencia): heading and contact details on the left, the map on the right. */
export function VisitSection({ s, heading, text, bookLabel }: { s: SiteSettings; heading: string; text?: string; bookLabel: string }) {
  const chip = "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sand text-gold-700";
  return (
    <section className="section bg-cream" id="visit">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5" data-reveal>
          <h2>{heading}</h2>
          {text ? <p className="lead mt-3">{text}</p> : null}
          <ul className="mt-8 space-y-5">
            <li className="flex gap-4">
              <span className={chip}>
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="text-grey-700">
                <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-ink-900 hover:underline">
                  {s.street}
                </a>
                <br />
                {s.city}, {s.region} {s.postalCode}
              </div>
            </li>
            <li className="flex gap-4">
              <span className={chip}>
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="text-grey-700">
                <a href={s.phoneHref} data-track="click_to_call" className="inline-flex min-h-11 items-center font-semibold text-ink-900 hover:underline">
                  {s.phone}
                </a>
                <br />
                <a href={`mailto:${s.email}`} className="inline-flex min-h-11 items-center break-all hover:underline">
                  {s.email}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <span className={chip}>
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="pt-2.5 text-grey-700">
                <HoursList hours={s.hours} />
              </div>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Get directions
            </a>
            <Link href={s.headerCta.href} data-track="book_appointment" className="btn btn-primary">
              {bookLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="lg:col-span-7" data-reveal>
          <MapFrame s={s} className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[480px]" />
        </div>
      </div>
    </section>
  );
}

/** Closing panel (Valencia CtaBanner): a rounded charcoal panel with the booking button, phone, hours, address and a photo. */
export function CtaPanel({ s, heading, text, button, image }: { s: SiteSettings; heading: string; text?: string; button: Action; image?: Img }) {
  const open = s.hours.find((h) => h.opens);
  return (
    <section className="section bg-cream">
      <div className="container-x">
        <div className="on-dark relative isolate overflow-hidden rounded-lg bg-night-900 text-white" data-reveal>
          <div className="grid items-center gap-10 p-6 sm:p-12 lg:grid-cols-12 lg:gap-14 lg:p-16">
            <div className="lg:col-span-7">
              <h2 className="text-white">{heading}</h2>
              {text ? <p className="mt-5 max-w-xl text-[1.0625rem] text-white/80">{text}</p> : null}
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <ActionLink a={button} className="btn btn-light">
                  {button.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ActionLink>
                <div className="grid gap-2">
                  <a href={s.phoneHref} data-track="click_to_call" className="inline-flex min-h-11 items-center gap-2 text-[1.5rem] font-semibold text-white hover:text-gold-300">
                    <Phone className="h-6 w-6 text-gold-300" aria-hidden="true" />
                    {s.phone}
                  </a>
                  {open ? (
                    <p className="flex items-center gap-2 text-sm text-white/75">
                      <Clock className="h-4 w-4 text-gold-300" aria-hidden="true" />
                      {open.day}, {open.value}
                    </p>
                  ) : null}
                  <p className="flex items-center gap-2 text-sm text-white/75">
                    <MapPin className="h-4 w-4 text-gold-300" aria-hidden="true" />
                    {s.street}, {s.city}
                  </p>
                </div>
              </div>
            </div>
            {image ? (
              <div className="relative hidden aspect-[4/5] overflow-hidden rounded-lg lg:col-span-5 lg:block">
                <Image src={image.src} alt={image.alt} fill loading="lazy" sizes="(min-width: 1024px) 460px, 100vw" className="object-cover" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Full-width photo with the closing call to action (service pages): caps heading, white button, outlined phone. */
export function PhotoCta({ heading, text, image, button, phone, phoneHref }: { heading: string; text?: string; image: Img; button: Action; phone: string; phoneHref: string }) {
  return (
    <section className="on-dark relative isolate flex min-h-[460px] items-center overflow-hidden text-white sm:min-h-[560px]">
      <Image src={image.src} alt={image.alt} fill loading="lazy" sizes="100vw" className="-z-20 object-cover object-[50%_15%]" />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-night-900/92 via-night-900/65 to-night-900/25" />
      <div className="container-x w-full py-14" data-reveal>
        <div className="max-w-2xl">
          <h2 className="uppercase text-white">{heading}</h2>
          {text ? <p className="mt-3 text-white/90">{text}</p> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionLink a={button} className="btn btn-light" />
            <a href={phoneHref} data-track="click_to_call" className="btn btn-ghost">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Photo cards that open to a line of text on hover or focus (Valencia's technology cards). */
export function TechCards({ eyebrow, heading, text, items, link }: { eyebrow?: string; heading: string; text?: string; items: { label: string; title: string; text: string; image: Img }[]; link?: Action }) {
  return (
    <section className="section bg-cream">
      <div className="container-x">
        <SectionHead eyebrow={eyebrow} heading={heading} text={text} center />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <li key={it.title} className="tech-card group" tabIndex={0} data-reveal>
              <span className="relative block aspect-[4/3] overflow-hidden">
                <Image src={it.image.src} alt={it.image.alt} fill loading="lazy" sizes="(min-width: 768px) 400px, 100vw" className="tech-photo object-cover" />
              </span>
              <span className="block p-6">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-gold-700">{it.label}</span>
                <span className="mt-1 flex items-center justify-between gap-4">
                  <span className="text-[1.25rem] font-semibold text-ink-900">{it.title}</span>
                  <span aria-hidden="true" className="tech-plus text-2xl font-light leading-none text-ink-900">+</span>
                </span>
                <span className="tech-desc block text-grey-700">{it.text}</span>
              </span>
            </li>
          ))}
        </ul>
        {link ? (
          <p className="mt-8 text-center">
            <ActionLink a={link} className="link-arrow">
              {link.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ActionLink>
          </p>
        ) : null}
      </div>
    </section>
  );
}

/** Treatments as a photo grid: one large photo card, the rest as photo cards around it (Valencia's services bento). */
export function ServiceBento({ heading, text, items, allLink, featuredLabel }: { heading: string; text?: string; items: { title: string; text: string; href: string; image: Img }[]; allLink: Action; featuredLabel: string }) {
  const [first, ...rest] = items;
  return (
    <section className="section bg-cream" id="services">
      <div className="container-x">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHead heading={heading} text={text} />
          <ActionLink a={allLink} className="link-arrow hidden shrink-0 sm:inline-flex">
            {allLink.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ActionLink>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
          {first ? (
            <li className="col-span-2 lg:row-span-2" data-reveal>
              <Link href={first.href} className="group relative flex aspect-[4/3] h-full flex-col justify-end overflow-hidden rounded-lg text-white sm:aspect-[16/10] lg:aspect-auto lg:min-h-[560px]">
                <Image src={first.image.src} alt={first.image.alt} fill loading="lazy" sizes="(min-width: 1024px) 820px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/55 to-transparent" />
                <span className="relative p-6 sm:p-9">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-300">{featuredLabel}</span>
                  <span className="mt-2 block text-[1.5rem] font-semibold text-white sm:text-[2.125rem]">{first.title}</span>
                  <span className="mt-2 block max-w-md text-white/85">{first.text}</span>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-night-900">
                    Explore {first.title}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          ) : null}
          {rest.map((it) => (
            <li key={it.href} data-reveal>
              <Link href={it.href} className="group flex h-full flex-col overflow-hidden rounded-lg bg-ivory ring-1 ring-ink-900/5 transition-shadow hover:shadow-[var(--shadow-lift)]">
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <Image src={it.image.src} alt={it.image.alt} fill loading="lazy" sizes="(min-width: 1024px) 400px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                </span>
                <span className="flex flex-1 items-start justify-between gap-2 p-4 sm:p-5">
                  <span>
                    <span className="block font-semibold text-ink-900 sm:text-[1.125rem]">{it.title}</span>
                    <span className="mt-1 hidden text-sm text-grey-700 sm:block">{it.text}</span>
                  </span>
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-night-900 text-white transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center sm:hidden">
          <ActionLink a={allLink} className="link-arrow">
            {allLink.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ActionLink>
        </p>
      </div>
    </section>
  );
}

/** Accepted insurance: heading and line, the insurers' logos gliding past, every plan name listed below. */
export function InsuranceStrip({ heading, text, plans, logos, note }: { heading: string; text: string; plans: string[]; logos: Img[]; note?: ReactNode }) {
  return (
    <section className="section-tight border-y border-ink-900/10 bg-cream" id="insurance">
      <div className="container-x">
        <div className="text-center" data-reveal>
          <h2>{heading}</h2>
          <p className="mx-auto mt-3 max-w-[48rem] text-grey-600">{text}</p>
        </div>
        {logos.length ? (
          <div className="marquee mt-10">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center gap-4 pr-4">
                  {logos.map((l) => {
                    const ratio = l.width / l.height;
                    const h = ratio > 4.5 ? "h-7" : ratio > 3 ? "h-8" : ratio > 2 ? "h-10" : "h-12";
                    return (
                      <li key={l.src} className="flex h-24 w-52 items-center justify-center rounded-lg bg-ivory px-6 opacity-85 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0">
                        <Image src={l.src} alt={copy === 1 ? "" : l.alt} width={l.width} height={l.height} loading="lazy" sizes="180px" className={`${h} w-auto max-w-full object-contain`} />
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          </div>
        ) : null}
        <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-grey-700" data-reveal>
          {plans.map((p) => (
            <li key={p} className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold-700" />
              {p}
            </li>
          ))}
        </ul>
        {note ? <div className="mt-6 text-center text-ink-900">{note}</div> : null}
      </div>
    </section>
  );
}

/** Other treatments as photo cards (service pages, services hub). */
export function PhotoCards({ items, columns = 3 }: { items: { title: string; text?: string; href: string; image: Img }[]; columns?: 3 | 4 }) {
  return (
    <ul className={`grid gap-5 sm:grid-cols-2 ${columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((it) => (
        <li key={it.href} data-reveal>
          <Link href={it.href} className="group flex h-full flex-col overflow-hidden rounded-lg bg-ivory ring-1 ring-ink-900/5 transition-shadow hover:shadow-[var(--shadow-lift)]">
            <span className="relative block aspect-[4/3] overflow-hidden">
              <Image src={it.image.src} alt={it.image.alt} fill loading="lazy" sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
            </span>
            <span className="flex flex-1 items-start justify-between gap-3 p-5">
              <span>
                <span className="block text-[1.125rem] font-semibold text-ink-900">{it.title}</span>
                {it.text ? <span className="mt-1 block text-grey-700">{it.text}</span> : null}
              </span>
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-night-900 text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * One large photo with a label and caption on the left, a 3 x 2 grid of smaller photos on the right, each a link
 * with its name (the shape of Valencia's before/after showcase, used here for the treatments).
 */
export function ShowcaseGrid({ heading, text, items, moreLabel, allLink }: { heading: string; text?: string; items: { title: string; text: string; href: string; image: Img }[]; moreLabel: string; allLink: Action }) {
  const [first, ...rest] = items;
  if (!first) return null;
  return (
    <section className="section bg-cream" id="treatments">
      <div className="container-x">
        <SectionHead heading={heading} text={text} center />
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5" data-reveal>
            <Link href={first.href} className="group relative block aspect-square overflow-hidden rounded-lg">
              <Image src={first.image.src} alt={first.image.alt} fill loading="lazy" sizes="(min-width: 1024px) 500px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <span className="absolute left-3 top-3 rounded-sm bg-night-900/85 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">{first.title}</span>
            </Link>
            <p className="mt-3 text-sm">
              <span className="font-semibold text-ink-900">{first.title}:</span> <span className="text-grey-600">{first.text}</span>
            </p>
          </div>
          <div className="lg:col-span-7" data-reveal>
            {moreLabel ? <p className="mb-3 text-sm font-semibold text-ink-900">{moreLabel}</p> : null}
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {rest.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} className="group relative block aspect-[4/3] overflow-hidden rounded-lg">
                    <Image src={it.image.src} alt={it.image.alt} fill loading="lazy" sizes="(min-width: 1024px) 230px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night-900/80 via-night-900/10 to-transparent" />
                    <span className="absolute inset-x-3 bottom-2.5 text-sm font-semibold text-white">{it.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              <ActionLink a={allLink} className="link-arrow text-sm">
                {allLink.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ActionLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Heading on the left, a summary box on the right, then a row of white cards running off the right edge (Valencia's reviews row). */
export function CardRail({ heading, text, box, cards, footer }: { heading: string; text?: string; box?: ReactNode; cards: ReactNode[]; footer?: ReactNode }) {
  return (
    <section className="section overflow-hidden bg-cream" aria-labelledby="rail-heading">
      <div className="container-x">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl" data-reveal>
            <h2 id="rail-heading">{heading}</h2>
            {text ? <p className="mt-3 text-grey-700">{text}</p> : null}
          </div>
          {box ? <div className="shrink-0">{box}</div> : null}
        </div>
      </div>
      <div className="no-scrollbar mt-10 overflow-x-auto pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-1280px)/2+2rem))]">
        <ul className="flex w-max gap-4 pr-4 sm:pr-6">
          {cards.map((c, i) => (
            <li key={i} className="flex w-[17rem] shrink-0 flex-col rounded-lg bg-white p-6 sm:w-[19rem]">
              {c}
            </li>
          ))}
        </ul>
      </div>
      {footer ? <div className="container-x mt-6 text-sm text-grey-600">{footer}</div> : null}
    </section>
  );
}

/** Text on the left, a framed photo on the right with a small address tag over its corner (Valencia's "Our story"). */
export function IntroSplit({ eyebrow, heading, paragraphs, image, tag }: { eyebrow?: string; heading: string; paragraphs: string[]; image: Img; tag?: { title: string; text: string } }) {
  return (
    <section className="section bg-cream">
      <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6" data-reveal>
          {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
          <h2>{heading}</h2>
          <div className="mt-5 space-y-4 text-grey-700">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="relative lg:col-span-6" data-reveal>
          <div className="relative ml-auto aspect-[4/3] w-full max-w-[34rem] overflow-hidden rounded-lg bg-sand shadow-[var(--shadow-lift)]">
            <Image src={image.src} alt={image.alt} fill loading="lazy" sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" />
          </div>
          {tag ? (
            <div className="absolute -bottom-5 left-2 flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-[var(--shadow-lift)] sm:left-0 lg:bottom-10 lg:-left-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-sand text-gold-700">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold text-ink-900">{tag.title}</span>
                <span className="text-grey-600">{tag.text}</span>
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Numbered values in a grid, each under a short rule (Valencia's "The values behind every appointment"). */
export function ValuesGrid({ eyebrow, heading, text, items }: { eyebrow?: string; heading: string; text?: string; items: { title: string; text: string }[] }) {
  return (
    <section className="section bg-cream pt-0 sm:pt-0">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16" data-reveal>
          <div>
            {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
            <h2>{heading}</h2>
          </div>
          {text ? <p className="text-grey-700">{text}</p> : null}
        </div>
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <li key={it.title} data-reveal>
              <span aria-hidden="true" className="block h-px w-8 bg-ink-900/40" />
              <p className="mt-5 text-xs font-semibold tabular-nums text-grey-600">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-[1.0625rem]">{it.title}</h3>
              <p className="mt-2 text-sm text-grey-700">{it.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Service groups as cards with a check list of what each covers and two buttons (Valencia's "Everything under one roof"). */
export function CategoryCards({ eyebrow, heading, text, groups, exploreLabel, book }: { eyebrow?: string; heading: string; text?: string; groups: { heading: string; links: { label: string; href: string }[] }[]; exploreLabel: string; book: Action }) {
  return (
    <section className="section bg-cream">
      <div className="container-x">
        <SectionHead eyebrow={eyebrow} heading={heading} text={text} center />
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <li key={g.heading} className="flex flex-col rounded-lg bg-ivory p-7 ring-1 ring-ink-900/5" data-reveal>
              <h3>{g.heading}</h3>
              <ul className="mt-5 grid grow grid-cols-1 content-start gap-x-6 gap-y-2 text-sm text-grey-700 sm:grid-cols-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex items-start gap-2 hover:text-ink-900 hover:underline">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-700" aria-hidden="true" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/services/" className="btn btn-outline btn-sm">
                  {exploreLabel}
                </Link>
                <ActionLink a={book} className="btn btn-primary btn-sm" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
