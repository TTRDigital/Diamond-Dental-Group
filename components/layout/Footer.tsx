import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const socialIcons = {
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  instagram: (
    <>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </>
  ),
};

/** Opening hours grouped into lines ("Monday – Thursday · 10:00 am – 7:00 pm"), days with the same hours together. */
function hourLines(hours: SiteSettings["hours"]) {
  const lines: { days: string; value: string; open: boolean }[] = [];
  for (const h of hours) {
    const last = lines[lines.length - 1];
    if (last && last.value === h.value) {
      last.days = `${last.days.split(" – ")[0]} – ${h.day}`;
    } else lines.push({ days: h.day, value: h.value, open: !!h.opens });
  }
  return lines;
}

/** Dark footer (Valencia / Ideal style): booking band, link columns, hours and location; phone-only Call / Book bar. */
export function Footer({ settings: s }: { settings: SiteSettings }) {
  const services = (s.menu.find((m) => m.groups?.length)?.groups ?? []).flatMap((g) => g.links).slice(0, 7);
  return (
    <>
      <footer className="dark-section pb-28 md:pb-10">
        <div className="container-x">
          {/* Booking band */}
          <div className="flex flex-col gap-6 border-b border-white/10 py-12 md:flex-row md:items-center md:justify-between md:py-16">
            <div>
              <p className="eyebrow">New patients welcome</p>
              <p className="mt-3 text-[1.75rem] font-semibold leading-tight text-white md:text-[2.125rem]">
                Book your visit at <span className="text-gold-300">{s.name}.</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={s.headerCta.href} data-track="book_appointment" className="btn btn-light">
                {s.headerCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href={s.phoneHref} data-track="click_to_call" className="btn btn-outline">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {s.phone}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5">
                <Image src={s.logo.src} alt={s.logo.alt} width={s.logo.width} height={s.logo.height} sizes="65px" loading="lazy" className="h-11 w-auto object-contain" />
                <span className="text-lg font-semibold tracking-[0.02em] text-white">{s.name}</span>
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">{s.tagline}</p>
              {s.social.length ? (
                <div className="mt-5 flex gap-2">
                  {s.social.map((x) => (
                    <a
                      key={x.network}
                      href={x.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.name} on ${x.network === "facebook" ? "Facebook" : "Instagram"}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white hover:text-night-900"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {socialIcons[x.network]}
                      </svg>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <nav aria-label="Quick links">
              <h2 className="text-base font-semibold text-white">Quick Links</h2>
              <ul className="mt-4 space-y-1 text-sm text-white/75">
                {s.footerLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-9 items-center transition-colors hover:text-gold-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Popular services">
              <h2 className="text-base font-semibold text-white">Popular Services</h2>
              <ul className="mt-4 space-y-1 text-sm text-white/75">
                {services.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-9 items-center transition-colors hover:text-gold-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-base font-semibold text-white">Hours &amp; location</h2>
              <address className="mt-4 space-y-4 text-sm not-italic text-white/75">
                <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition-colors hover:text-gold-300">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                  <span>
                    {s.street}
                    <br />
                    {s.city}, {s.region} {s.postalCode}
                  </span>
                </a>
                <a href={s.phoneHref} data-track="click_to_call" className="flex items-center gap-3 transition-colors hover:text-gold-300">
                  <Phone className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                  {s.phone}
                </a>
                <a href={`mailto:${s.email}`} className="flex items-center gap-3 break-all transition-colors hover:text-gold-300">
                  <Mail className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                  {s.email}
                </a>
                <div className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                  <ul className="space-y-1">
                    {hourLines(s.hours).map((h) => (
                      <li key={h.days} className={h.open ? "" : "text-white/50"}>
                        <span className="text-white/90">{h.days}</span> · {h.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </address>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
            <p>{s.copyright}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {s.legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-9 items-center hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      {/* Phones: quick actions always at hand */}
      <div className="mobile-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-ivory/95 p-3 backdrop-blur md:hidden">
        <a href={s.phoneHref} data-track="click_to_call" className="btn btn-outline btn-sm w-full">
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call
        </a>
        <Link href={s.headerCta.href} data-track="book_appointment" className="btn btn-primary btn-sm w-full">
          {s.mobileBookLabel}
        </Link>
      </div>
    </>
  );
}
