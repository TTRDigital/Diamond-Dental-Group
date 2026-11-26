import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, CircleCheck, Phone } from "lucide-react";
import { getAbout, getBlogIndex, getHome, getPatientCare, getPosts, getSiteSettings, getTestimonials } from "@/lib/content";
import { postAuthor } from "@/lib/author";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { isPlaceholder } from "@/lib/placeholders";
import { images } from "@/lib/data/images";
import { INSURER_LOGOS, STOCK, photoForHref } from "@/lib/data/stock";
import { Icon, Stars } from "@/components/ui/Icon";
import { PostCard } from "@/components/blog/PostCard";
import { DoctorSplit, InsuranceStrip, PageHero, PhotoBanner, PhotoSteps, PhotoTrio, SectionHead, ServiceBento, TechCards, VisitSection } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const h = await getHome();
  return pageMetadata(h.seo, "/", h.hero.image);
}

/*
 * Home, in the Valencia Dentistry order and density: photo hero, three photos edge to edge, a full-width photo
 * banner, the treatments as a photo grid, technology cards, offers, the dentist beside a half-screen photo,
 * insurance logos, the membership plan, articles, steps written over photos, and the visit block with the map.
 * All words come from the site's own content (home, About, Patient Care, blog); stock photos show treatments,
 * technology and smiling patients only (lib/data/stock.ts).
 */
export default async function HomePage() {
  const [h, s, reviews, about, care, blog, posts] = await Promise.all([getHome(), getSiteSettings(), getTestimonials(), getAbout(), getPatientCare(), getBlogIndex(), getPosts()]);
  // Items still marked [PLACEHOLDER] (e.g. an unconfirmed review count) are not shown.
  const trust = h.trust.filter((t) => !isPlaceholder(t.text));
  const rating = isPlaceholder(h.reviews.rating) ? "" : h.reviews.rating;
  const trioPhotos = [
    { image: images.drNikpour, imageClass: "object-[50%_18%]" },
    { image: STOCK.panoramicXrayDetail },
    { image: STOCK.restorativeModels },
  ];
  const techPhotos = [STOCK.panoramicXrayOnScreen, STOCK.calmPatientChair, STOCK.shadeGuideHands];
  const offerPhotos = [STOCK.whiteningLight, STOCK.clearAlignerSmile, STOCK.implantModel];
  const stepPhotos = [STOCK.smilingWomanChair, images.drNikpour, images.treatmentRoom, STOCK.happyPatientMirror];
  const logos = care.insurance.plans.map((p) => INSURER_LOGOS[p]).filter((l) => !!l);
  const latest = posts.slice(0, 3);

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
      <PhotoTrio heading={h.why.heading} text={h.hero.text} items={h.why.items.map((it, i) => ({ title: it.title, text: it.text, ...trioPhotos[i % trioPhotos.length] }))} />

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

      {/* Treatments as a photo grid */}
      <ServiceBento
        heading={h.featured.heading}
        featuredLabel={h.featured.heading}
        allLink={{ label: h.featured.button, href: h.featured.buttonHref }}
        items={h.featured.items.map((it) => ({ title: it.title, text: it.text, href: it.href, image: photoForHref(it.href) ?? images.treatmentRoom }))}
      />

      {/* The practice and its technology (About page's words) */}
      <TechCards
        heading={about.practice.heading}
        text={about.practice.text}
        items={about.practice.items.map((it, i) => ({ label: String(i + 1).padStart(2, "0"), title: it.title, text: it.text, image: techPhotos[i % techPhotos.length] }))}
      />

      {/* Grand opening offers, each with its treatment's photo */}
      <section className="dark-section section">
        <div className="container-x">
          <SectionHead heading={h.offers.heading} text={h.offers.text} center />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {h.offers.others.map((o, i) => (
              <li key={o.title} className="overflow-hidden rounded-lg bg-white/[0.06] ring-1 ring-white/10" data-reveal>
                <span className="relative block aspect-[16/10] overflow-hidden">
                  <Image src={offerPhotos[i % offerPhotos.length].src} alt={offerPhotos[i % offerPhotos.length].alt} fill loading="lazy" sizes="(min-width: 768px) 400px, 100vw" className="object-cover" />
                  <span className="absolute bottom-4 left-4 rounded-md bg-night-900/90 px-4 py-2 text-[1.5rem] font-semibold text-gold-300">{o.amount}</span>
                </span>
                <span className="flex items-center justify-between gap-4 p-6">
                  <span className="text-[1.125rem] font-semibold text-white">{o.title}</span>
                  <Link href="/contact/" data-track="book_appointment" aria-label={`${h.offers.otherButton} ${o.amount} ${o.title}`} className="btn btn-primary btn-sm">
                    {h.offers.otherButton}
                  </Link>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center" data-reveal>
            <p className="text-white/70">{h.offers.footer}</p>
            <a href={s.phoneHref} data-track="click_to_call" className="mt-2 inline-flex min-h-11 items-center gap-2 text-[1.5rem] font-semibold text-white hover:text-gold-300">
              <Phone className="h-5 w-5 text-gold-300" aria-hidden="true" />
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
      >
        <blockquote className="mt-6 border-l-2 border-gold-500 pl-5 text-[1.125rem] leading-snug text-ink-900">&ldquo;{about.dentist.quote}&rdquo;</blockquote>
      </DoctorSplit>

      {/* Insurance: the insurers' logos and every accepted plan */}
      <InsuranceStrip
        heading={h.insurance.heading}
        text={care.insurance.text}
        plans={care.insurance.plans}
        logos={logos}
        note={
          <Link href="/patient-care/" className="link-arrow">
            {h.insurance.link}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      {/* No insurance: the membership plan, what it includes, beside a photo */}
      <section className="section bg-cream">
        <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6" data-reveal>
            <h2>{care.membership.heading}</h2>
            <p className="lead mt-4">
              {h.membership.text} <strong className="font-semibold text-ink-900">{h.membership.price}</strong> {h.membership.textAfter}
            </p>
            <p className="mt-6 font-semibold text-ink-900">{care.membership.includesHeading}</p>
            <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {care.membership.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-ink-900">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-night-900 text-white">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {it}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/patient-care/" className="btn btn-primary">
                {h.membership.link}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href={s.phoneHref} data-track="click_to_call" className="btn btn-outline">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {s.phone}
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:col-span-6 lg:aspect-[5/4]" data-reveal>
            <Image src={STOCK.relaxedWomanChair.src} alt={STOCK.relaxedWomanChair.alt} fill loading="lazy" sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
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

      {/* Patient education: the latest articles */}
      {latest.length ? (
        <section className="section border-t border-ink-900/10 bg-cream">
          <div className="container-x">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <SectionHead eyebrow={blog.eyebrow} heading={blog.heading} text={blog.text} />
              <Link href="/blog/" className="link-arrow shrink-0">
                {blog.heading}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {latest.map((p) => (
                <li key={p.slug} data-reveal>
                  <PostCard post={p} author={postAuthor(p.author, about.dentist)} compact sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* How it works: numbered steps written over photos. */}
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
