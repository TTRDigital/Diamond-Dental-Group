import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleCheck, Phone, ShieldCheck, Star } from "lucide-react";
import { getHome, getSiteSettings, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { isPlaceholder } from "@/lib/placeholders";
import { images } from "@/lib/data/images";
import { Icon, Stars } from "@/components/ui/Icon";
import { CtaBanner, PageHero, SectionHead, VisitSection } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const h = await getHome();
  return pageMetadata(h.seo, "/", h.hero.image);
}

export default async function HomePage() {
  const [h, s, reviews] = await Promise.all([getHome(), getSiteSettings(), getTestimonials()]);
  // Items still marked [PLACEHOLDER] (e.g. an unconfirmed review count) are not shown.
  const trust = h.trust.filter((t) => !isPlaceholder(t.text));
  const rating = isPlaceholder(h.reviews.rating) ? "" : h.reviews.rating;

  return (
    <>
      <PageSchema seo={h.seo} />

      {/* Hero: the storefront photo, the page's largest image, loaded first. */}
      <PageHero
        tall
        heading={h.hero.heading}
        lead={h.hero.text}
        image={h.hero.image}
        imageClass="object-center lg:object-top"
        primary={{ label: h.hero.button, href: "/contact/", track: "book_appointment" }}
        secondary={{ label: s.phone, href: s.phoneHref, track: "click_to_call" }}
        note={h.hero.note}
      />

      {/* Trust strip */}
      {trust.length ? (
        <section aria-label="Why patients choose us" className="dark-section border-t border-white/10">
          <ul className={`container-x grid grid-cols-2 gap-x-6 gap-y-6 py-8 ${trust.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
            {trust.map((t) => (
              <li key={t.text} className="flex items-center gap-3" data-reveal>
                {t.icon === "stars" ? <Stars className="h-4 w-4" /> : <Icon name={t.icon} className="h-6 w-6 shrink-0 text-gold-400" />}
                <span className="text-[0.9375rem] font-semibold text-white">{t.text}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Why choose */}
      <section className="section">
        <div className="container-x">
          <SectionHead heading={h.why.heading} center />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {h.why.items.map((it) => (
              <div key={it.title} className="card border border-line p-8" data-reveal>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-gold-400">
                  <Icon name={it.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-6">{it.title}</h3>
                <p className="mt-3 text-grey-700">{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="section bg-sand">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHead heading={h.featured.heading} />
            <Link href={h.featured.buttonHref} className="btn btn-outline shrink-0" data-reveal>
              {h.featured.button}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {h.featured.items.map((it) => (
              <Link key={it.href} href={it.href} className="card card-hover flex flex-col p-7" data-reveal>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/60 text-gold-700">
                  <Icon name={it.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5">{it.title}</h3>
                <p className="mt-2 grow text-grey-700">{it.text}</p>
                <span className="link-arrow mt-5">
                  Learn More
                  <ArrowRight className="arrow-nudge h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works: numbered steps */}
      <section className="section">
        <div className="container-x">
          <SectionHead eyebrow={h.journey.eyebrow} heading={h.journey.heading} center />
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {h.journey.items.map((it, i) => (
              <li key={it.title} className="card relative border border-line p-7" data-reveal>
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-gold-400">
                    <Icon name={it.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-[2rem] font-semibold leading-none text-line" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6">{it.title}</h3>
                <p className="mt-2 text-grey-700">{it.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Grand opening offers */}
      <section className="dark-section section">
        <div className="container-x">
          <SectionHead heading={h.offers.heading} text={h.offers.text} center />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <div className="relative flex flex-col justify-between overflow-hidden rounded-lg border border-gold-400/40 bg-night-800 p-8 md:p-10" data-reveal>
              <span className="absolute right-0 top-0 rounded-bl-md bg-gold-400 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-900">{h.offers.badge}</span>
              <div>
                <h3 className="pr-24 text-[1.75rem] text-gold-400">{h.offers.main.title}</h3>
                <p className="mt-2 text-white/70">{h.offers.main.text}</p>
                <ul className="mt-6 space-y-3">
                  {h.offers.main.items.map((it) => (
                    <li key={it} className="flex items-start gap-3">
                      <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" />
                      <span className="text-white/90">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/contact/" data-track="book_appointment" className="btn btn-gold mt-8 w-full">
                {h.offers.main.button}
              </Link>
            </div>
            <div className="grid gap-4">
              {h.offers.others.map((o) => (
                <div key={o.title} className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-night-800 p-6 transition-colors hover:border-gold-400/60" data-reveal>
                  <div>
                    <span className="block text-[1.75rem] font-semibold leading-tight text-gold-400">{o.amount}</span>
                    <span className="text-white/90">{o.title}</span>
                  </div>
                  <Link href="/contact/" data-track="book_appointment" aria-label={`${h.offers.otherButton} ${o.amount} ${o.title}`} className="btn btn-outline btn-sm shrink-0">
                    {h.offers.otherButton}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center" data-reveal>
            <p className="text-white/65">{h.offers.footer}</p>
            <a href={s.phoneHref} data-track="click_to_call" className="mt-3 inline-flex items-center gap-3 text-[1.5rem] font-semibold text-gold-400 transition-colors hover:text-white">
              <Phone className="h-6 w-6" aria-hidden="true" />
              {s.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Insurance + membership */}
      <section className="section-tight">
        <div className="container-x grid gap-5 md:grid-cols-2">
          <div className="card border border-line p-8" data-reveal>
            <h2 className="flex items-center gap-3 text-[1.375rem]">
              <ShieldCheck className="h-6 w-6 shrink-0 text-gold-700" aria-hidden="true" />
              {h.insurance.heading}
            </h2>
            <p className="mt-3 text-grey-700">{h.insurance.text}</p>
            <Link href="/patient-care/" className="link-arrow mt-6">
              {h.insurance.link}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="on-dark rounded-lg bg-ink-900 p-8 text-white" data-reveal>
            <h2 className="flex items-center gap-3 text-[1.375rem] text-gold-400">
              <Star className="h-6 w-6 shrink-0" aria-hidden="true" />
              {h.membership.heading}
            </h2>
            <p className="mt-3 text-white/80">
              {h.membership.text} <strong className="text-gold-400">{h.membership.price}</strong> {h.membership.textAfter}
            </p>
            <Link href="/patient-care/" className="link-arrow mt-6">
              {h.membership.link}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Meet your dentist */}
      <section className="section bg-sand">
        <div className="container-x grid items-center gap-10 md:grid-cols-2 lg:gap-20">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden arch bg-line" data-reveal>
            <Image src={h.dentist.image.src} alt={h.dentist.image.alt} fill sizes="(min-width: 768px) 448px, 100vw" className="origin-top scale-[1.02] object-cover" />
          </div>
          <div data-reveal>
            <p className="eyebrow mb-3">{h.dentist.eyebrow}</p>
            <h2>{h.dentist.heading}</h2>
            <p className="lead mt-5">{h.dentist.text}</p>
            <Link href="/about/" className="btn btn-primary mt-8">
              {h.dentist.link}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews: shown only once real, approved reviews are in /cms. */}
      {reviews.length ? (
        <section className="section">
          <div className="container-x">
            <SectionHead heading={h.reviews.heading} center />
            {rating ? (
              <div className="mt-4 flex items-center justify-center gap-2" data-reveal>
                <span className="text-xl font-semibold">{rating}</span>
                <Stars />
              </div>
            ) : null}
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {reviews.slice(0, 3).map((r) => (
                <figure key={r.name} className="card border border-line p-8" data-reveal>
                  <Stars className="h-4 w-4" />
                  <blockquote className="mt-4 text-grey-700">&ldquo;{r.quote}&rdquo;</blockquote>
                  <figcaption className="mt-5 font-semibold">— {r.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <VisitSection s={s} heading={`Visit ${s.name}`} bookLabel={h.cta.button} />

      <CtaBanner heading={h.cta.heading} text={h.cta.text} image={images.treatmentRoom} primary={{ label: h.cta.button, href: "/contact/", track: "book_appointment" }} phone={s.phone} phoneHref={s.phoneHref} />
    </>
  );
}
