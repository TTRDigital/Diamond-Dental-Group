import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/* The live site's button styles (shadcn Button + the site's classes). */
export const btnBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0";
export const btnGold = `${btnBase} h-10 bg-secondary hover:bg-gold-hover text-black`;

/** Internal links use next/link; tel:/mailto:/https: are plain anchors. */
export function A({ href, className, children, track }: { href: string; className?: string; children: ReactNode; track?: string }) {
  if (href.startsWith("/"))
    return (
      <Link href={href} className={className} data-track={track}>
        {children}
      </Link>
    );
  return (
    <a href={href} className={className} data-track={track}>
      {children}
    </a>
  );
}

/**
 * Dark band with a faded photo behind it and the gold Book button + phone (bottom of most pages).
 * The photo is decorative and loads only when the band comes near the screen, at the screen's width.
 */
export function CtaBand({ heading, text, button, phone, phoneHref, bgImage, bgClass = "opacity-20", headingClass = "mb-8" }: {
  heading: string;
  text?: string;
  button: string;
  phone: string;
  phoneHref: string;
  /** The photo's own address (/images/... or a Sanity image); it is resized here. */
  bgImage: string;
  bgClass?: string;
  headingClass?: string;
}) {
  return (
    <section className="bg-black py-20 text-center px-4 relative overflow-hidden">
      <div className={`absolute inset-0 mix-blend-luminosity ${bgClass}`}>
        <Image src={bgImage} alt="" fill loading="lazy" sizes="100vw" className="object-cover object-center" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      <div className="relative z-10 container mx-auto" data-reveal>
        <h2 className={`text-3xl md:text-4xl font-extrabold text-white ${text ? "mb-4" : headingClass}`}>{heading}</h2>
        {text ? <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">{text}</p> : null}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact/"
            data-track="book_appointment"
            className={`${btnGold} font-extrabold rounded-lg px-8 py-7 text-lg shadow-[0_0_20px_rgba(229,184,51,0.4)] w-full sm:w-auto hover:scale-105 transition-transform`}
          >
            {button}
          </Link>
          <a href={phoneHref} data-track="click_to_call" className="text-white hover:text-secondary transition-colors font-bold text-xl px-6 py-4">
            {phone}
          </a>
        </div>
      </div>
    </section>
  );
}

/** Centered section heading with the short gold rule under it. */
export function SectionHeading({ children, dark = false, size = "text-3xl md:text-4xl", ruleWidth = "w-20" }: { children: ReactNode; dark?: boolean; size?: string; ruleWidth?: string }) {
  return (
    <>
      <h2 className={`${size} font-bold ${dark ? "text-white" : "text-black"} mb-4`}>{children}</h2>
      <div className={`${ruleWidth} h-1 bg-secondary mx-auto rounded-full`} />
    </>
  );
}
