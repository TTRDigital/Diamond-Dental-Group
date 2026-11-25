import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleCheck, Phone, ShieldCheck, Star } from "lucide-react";
import { getHome, getSiteSettings, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { isPlaceholder } from "@/lib/placeholders";
import { images } from "@/lib/data/images";
import { Icon, Stars } from "@/components/ui/Icon";
import { DoctorSplit, PageHero, PhotoBanner, PhotoSteps, PhotoTrio, SectionHead, VisitSection } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const h = await getHome();
  return pageMetadata(h.seo, "/", h.hero.image);
}

/*
 * Home, in the Valencia Dentistry order: photo hero, three photos edge to edge, a full-width photo banner,
 * services, the dentist beside a half-screen photo, steps written over photos, and the visit block with the map.
 */
export default async function HomePage() {
  const [h, s, reviews] = await Promise.all([getHome(), getSiteSettings(), getTestimonials()]);
  // Items still marked [PLACEHOLDER] (e.g. an unconfirmed review count) are not shown.
  const trust = h.trust.filter((t) => !isPlaceholder(t.text));
  const rating = isPlaceholder(h.reviews.rating) ? "" : h.reviews.rating;
  // The practice's own three photos, each used where it fits the words.
  const trioPhotos = [
    { image: images.drNikpour, imageClass: "object-[50%_18%]" },
    { image: images.treatmentRoom, imageClass: "object-center" },
    { image: images.storefront, imageClass: "object-top" },
  ];
  const stepPhotos = [undefined, images.drNikpour, images.treatmentRoom, images.storefront];

  return (
    <>
      <PageSchema seo={h.seo} />

      {/* Hero: the storefront photo edge to edge, the words low on the left (phones: photo first, words below). */}
      <PageHero
        home
        heading={h.hero.heading}
        lead={h.hero.text}
        image={h.hero.image}
        imageClass="object-[50%_20%] lg:object-top"
        primary={{ label: h.hero.button, href: "/contact/", track: "book_appointment" }}
        secondary={{ label: s.phone, href: s.phoneHref, track: "click_to_call" }}
      />

      {/* Trust points and the new-patient note, in a slim band under the hero */}
      <section aria-label="Why patients choose us" className="border-b border-ink-900/10 bg-ivory">
        <div className="container-x flex flex-col gap-3 py-5 text-sm text-grey-700 lg:flex-row lg:items-center lg:justify-between">
          {trust.length ? (
            <ul className="flex flex-wrap gap-x-7 gap-y-2">
              {trust.map((t) => (
                <li key={t.text} className="inline-flex items-center gap-2 font-semibold text-ink-900">
                  {t.icon === "stars" ? <Stars className="h-3.5 w-3.5" /> : <Icon name={t.icon} className="h-4 w-4 text-gold-700" />}
                  <span>{t.text}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <p>{h.hero.note}</p>
        </div>
      </section>

      {/* Why choose: three photos edge to edge, title and line under each. */}
      <PhotoTrio heading={h.why.heading} items={h.why.items.map((it, i) => ({ title: it.title, text: it.text, ...trioPhotos[i % trioPhotos.length] }))} />

      {/* The new patient special on a full-width office photo. */}
      <PhotoBanner eyebrow={h.offers.badge} heading={h.offers.main.title} text={h.offers.main.text} image={images.treatmentRoom} link={{ label: h.offers.main.button, href: "/contact/", track: "book_appointment" }}>
        <ul className="mt-5 grid gap-2 text-white/90 sm:grid-cols-2">
          {h.offers.main.items.map((it) => (
            <li key={it} className="flex items-start gap-2">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              {it}
            </li>
          ))}
        </ul>
      </PhotoBanner>

      {/* Featured services */}
      <section className="section bg-cream" id="services">
        <div className="container-x">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHead heading={h.featured.heading} />
            <Link href={h.featured.buttonHref} className="link-arrow hidden shrink-0 sm:inline-flex">
              {h.featured.button}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {h.featured.items.map((it) => (
              <li key={it.href} data-reveal>
                <Link href={it.href} className="group flex h-full flex-col rounded-lg bg-ivory p-6 ring-1 ring-ink-900/5 transition-shadow hover:shadow-[var(--shadow-lift)] sm:p-7">
                  <Icon name={it.icon} className="h-10 w-10 stroke-[1.2] text-gold-700" />
                  <span className="mt-5 flex flex-1 items-start justify-between gap-3">
                    <span>
                      <span className="block text-[1.125rem] font-semibold text-ink-900">{it.title}</span>
                      <span className="mt-1 block text-grey-700">{it.text}</span>
                    </span>
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-night-900 text-white transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Learn More</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center sm:hidden">
            <Link href={h.featured.buttonHref} className="link-arrow">
              {h.featured.button}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* Grand opening offers */}
      <section className="section border-y border-ink-900/10 bg-cream">
        <div className="container-x">
          <SectionHead heading={h.offers.heading} text={h.offers.text} center />
          <ul className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {h.offers.others.map((o) => (
              <li key={o.title} className="flex flex-col items-center rounded-lg bg-ivory px-6 py-8 text-center ring-1 ring-ink-900/5" data-reveal>
                <span className="text-[2.125rem] font-semibold leading-none text-ink-900">{o.amount}</span>
                <span className="mt-2 text-grey-700">{o.title}</span>
                <Link href="/contact/" data-track="book_appointment" aria-label={`${h.offers.otherButton} ${o.amount} ${o.title}`} className="link-arrow mt-4">
                  {h.offers.otherButton}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center" data-reveal>
            <p className="text-grey-700">{h.offers.footer}</p>
            <a href={s.phoneHref} data-track="click_to_call" className="mt-2 inline-flex min-h-11 items-center gap-2 text-[1.5rem] font-semibold text-ink-900 hover:text-gold-700">
              <Phone className="h-5 w-5 text-gold-700" aria-hidden="true" />
              {s.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Meet your dentist: words left, the photo filling the right half. */}
      <DoctorSplit
        id="meet-your-dentist"
        eyebrow={h.dentist.eyebrow}
        heading={h.dentist.heading}
        paragraphs={[h.dentist.text]}
        image={h.dentist.image}
        primary={{ label: h.cta.button, href: "/contact/", track: "book_appointment" }}
        secondary={{ label: h.dentist.link, href: "/about/" }}
      />

      {/* Insurance and membership, side by side on a charcoal band. */}
      <section className="dark-section section-tight">
        <div className="container-x grid gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-white/15">
          <div className="md:pr-12" data-reveal>
            <ShieldCheck className="h-10 w-10 stroke-[1.2] text-gold-300" aria-hidden="true" />
            <h2 className="mt-4">{h.insurance.heading}</h2>
            <p className="mt-3 text-white/80">{h.insurance.text}</p>
            <Link href="/patient-care/" className="link-arrow mt-4">
              {h.insurance.link}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="md:pl-12" data-reveal>
            <Star className="h-10 w-10 stroke-[1.2] text-gold-300" aria-hidden="true" />
            <h2 className="mt-4">{h.membership.heading}</h2>
            <p className="mt-3 text-white/80">
              {h.membership.text} <strong className="font-semibold text-gold-300">{h.membership.price}</strong> {h.membership.textAfter}
            </p>
            <Link href="/patient-care/" className="link-arrow mt-4">
              {h.membership.link}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews: shown only once real, approved reviews are in /cms. */}
      {reviews.length ? (
        <section className="section bg-cream">
          <div className="container-x">
            <SectionHead heading={h.reviews.heading} />
            {rating ? (
              <div className="mt-4 flex items-center gap-2" data-reveal>
                <span className="text-xl font-semibold">{rating}</span>
                <Stars />
              </div>
            ) : null}
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {reviews.slice(0, 3).map((r) => (
                <figure key={r.name} className="rounded-lg bg-white p-6" data-reveal>
                  <Stars className="h-4 w-4" />
                  <blockquote className="mt-4 text-grey-700">&ldquo;{r.quote}&rdquo;</blockquote>
                  <figcaption className="mt-5 font-semibold text-ink-900">{r.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* How it works: numbered steps written over the practice's photos. */}
      <PhotoSteps
        eyebrow={h.journey.eyebrow}
        heading={h.journey.heading}
        button={{ label: h.hero.button, href: "/contact/", track: "book_appointment" }}
        items={h.journey.items.map((it, i) => ({
          title: it.title,
          text: it.text,
          image: stepPhotos[i],
          link: i === 0 ? { label: s.mobileBookLabel, href: "/contact/", track: "book_appointment" } : undefined,
        }))}
      />

      <VisitSection s={s} heading={h.cta.heading} text={h.cta.text} bookLabel={h.cta.button} />
    </>
  );
}
