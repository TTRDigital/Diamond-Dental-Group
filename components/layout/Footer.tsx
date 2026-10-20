import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
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

/** Map strip, footer and the phone-only "Book Online" bar, as on the live site. */
export function Footer({ settings: s }: { settings: SiteSettings }) {
  return (
    <>
      {/* Lazy map: the iframe loads only when it scrolls near the screen. */}
      <div className="w-full h-[350px] bg-gray-100 relative group border-t border-gray-200 map-frame">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none z-10" />
        <iframe
          title={`Map of ${s.name}, ${s.street}, ${s.city}`}
          src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodeURIComponent(s.mapQuery)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <footer className="bg-black text-white pt-16 pb-24 md:pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <Image src={s.logo.src} alt={s.logo.alt} width={s.logo.width} height={s.logo.height} unoptimized loading="lazy" className="h-10 w-auto object-contain" />
                <span className="font-bold text-xl tracking-wide">{s.name}</span>
              </Link>
              <p className="text-white/70 text-sm leading-relaxed mb-6">{s.tagline}</p>
              {s.social.length ? (
                <div className="flex space-x-4">
                  {s.social.map((x) => (
                    <a key={x.network} href={x.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} on ${x.network === "facebook" ? "Facebook" : "Instagram"}`} className="text-secondary hover:text-white transition-colors">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {socialIcons[x.network]}
                      </svg>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            <div>
              <h2 className="font-bold text-lg mb-6 text-secondary">Contact</h2>
              <address className="not-italic text-sm text-white/80 space-y-4">
                <p>
                  <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                    {s.street}
                    <br />
                    {s.city}, {s.region} {s.postalCode}, {s.country}
                  </a>
                </p>
                <p>
                  <a href={s.phoneHref} data-track="click_to_call" className="hover:text-secondary flex items-center">
                    <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                    {s.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${s.email}`} className="hover:text-secondary">
                    {s.email}
                  </a>
                </p>
              </address>
            </div>
            <div>
              <h2 className="font-bold text-lg mb-6 text-secondary">Office Hours</h2>
              <ul className="text-sm text-white/80 space-y-2">
                {s.hours.map((h) => (
                  <li key={h.day} className={`flex justify-between ${h.opens ? "" : "text-white/50"}`}>
                    <span>{h.day}</span>
                    <span>{h.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-lg mb-6 text-secondary">Quick Links</h2>
              <ul className="text-sm text-white/80 space-y-2">
                {s.footerLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-secondary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2">
                {s.legalLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="block text-xs text-white/50 hover:text-white">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-xs text-white/50">{s.copyright}</div>
        </div>
      </footer>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-3 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-40">
        <Link
          href={s.headerCta.href}
          data-track="book_appointment"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm px-4 py-2 w-full bg-secondary hover:bg-gold-hover text-black font-bold h-12 shadow-[0_4px_14px_rgba(229,184,51,0.4)] transition-colors"
        >
          {s.mobileBookLabel}
        </Link>
      </div>
    </>
  );
}
