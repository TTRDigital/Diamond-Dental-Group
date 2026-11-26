import { Fragment } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleCheck, Phone, ShieldCheck, Star } from "lucide-react";
import { getAbout, getHome, getSiteSettings, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { isPlaceholder } from "@/lib/placeholders";
import { images } from "@/lib/data/images";
import { STOCK, photoForHref } from "@/lib/data/stock";
import { Stars } from "@/components/ui/Icon";
import { CardRail, DoctorSplit, PageHero, PhotoBanner, PhotoSteps, PhotoTrio, ShowcaseGrid, TechCards, VisitSection } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const h = await getHome();
  return pageMetadata(h.seo, "/", h.hero.image);
}

/*
 * Home, section for section in the Valencia Dentistry order: photo hero, three photos edge to edge, a full-width
 * photo banner, technology cards, the large-photo showcase (here: the treatments), the dentist beside a half-screen
 * photo, a row of cards running off the edge (here: offers, membership and insurance; reviews join once approved),
 * steps written over photos, and the visit block with the map. All words are the site's own.
 */
export default async function HomePage() {
  const [h, s, reviews, about] = await Promise.all([getHome(), getSiteSettings(), getTestimonials(), getAbout()]);
  // Items still marked [PLACEHOLDER] (e.g. an unconfirmed review count) are not shown.
  const trust = h.trust.filter((t) => !isPlaceholder(t.text));
  const rating = isPlaceholder(h.reviews.rating) ? "" : h.reviews.rating;
  const trioPhotos = [{ image: images.drNikpour, imageClass: "object-[50%_18%]" }, { image: STOCK.panoramicXrayDetail }, { image: STOCK.relaxedWomanChair }];
  const techPhotos = [STOCK.panoramicXrayOnScreen, STOCK.calmPatientChair, STOCK.shadeGuideHands];
  const stepPhotos = [STOCK.smilingWomanChair, images.drNikpour, images.treatmentRoom, STOCK.happyPatientMirror];

  const offerCards = h.offers.others.map((o) => (
    <Fragment key={o.title}>
      <span className="text-[1.75rem] font-semibold leading-none text-ink-900">{o.amount}</span>
      <span className="mt-2 text-grey-700">{o.title}</span>
      <span className="mt-auto pt-6">
        <Link href="/contact/" data-track="book_appointment" aria-label={`${h.offers.otherButton} ${o.amount} ${o.title}`} className="link-arrow">
          {h.offers.otherButton}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </span>
    </Fragment>
  ));
  const membershipCard = (
    <>
      <Star className="h-6 w-6 text-gold-700" aria-hidden="true" />
      <span className="mt-3 text-[1.125rem] font-semibold text-ink-900">{h.membership.heading}</span>
      <span className="mt-2 text-grey-700">
        {h.membership.text} <strong className="font-semibold text-ink-900">{h.membership.price}</strong> {h.membership.textAfter}
      </span>
      <span className="mt-auto pt-6">
        <Link href="/patient-care/" className="link-arrow">
          {h.membership.link}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </span>
    </>
  );
  const insuranceCard = (
    <>
      <ShieldCheck className="h-6 w-6 text-gold-700" aria-hidden="true" />
      <span className="mt-3 text-[1.125rem] font-semibold text-ink-900">{h.insurance.heading}</span>
      <span className="mt-2 text-grey-700">{h.insurance.text}</span>
      <span className="mt-auto pt-6">
        <Link href="/patient-care/" className="link-arrow">
          {h.insurance.link}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </span>
    </>
  );
  const reviewCards = reviews.slice(0, 6).map((r) => (
    <Fragment key={r.name}>
      <Stars className="h-4 w-4" />
      <blockquote className="mt-4 text-grey-700">&ldquo;{r.quote}&rdquo;</blockquote>
      <span className="mt-auto pt-6 font-semibold text-ink-900">{r.name}</span>
    </Fragment>
  ));

  return (
    <>
      <PageSchema seo={h.seo} />

      {/* 1. Hero: the storefront photo edge to edge, the words low on the left (phones: photo first, words below). */}
      <PageHero
        home
        pill={h.hero.note}
        heading={h.hero.heading}
        lead={h.hero.text}
        image={h.hero.image}
        imageClass="object-[50%_20%] lg:object-top"
        primary={{ label: h.hero.button, href: "/contact/", track: "book_appointment" }}
        secondary={{ label: s.phone, href: s.phoneHref, track: "click_to_call" }}
      />

      {/* 2. Three photos edge to edge, title and line under each. */}
      <PhotoTrio heading={h.why.heading} text={trust.map((t) => t.text).join(" · ") || h.hero.text} items={h.why.items.map((it, i) => ({ title: it.title, text: it.text, ...trioPhotos[i % trioPhotos.length] }))} />

      {/* 3. Full-width photo banner: the new patient special. */}
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

      {/* 4. Technology cards (the About page's words). */}
      <TechCards
        heading={about.practice.heading}
        text={about.practice.text}
        items={about.practice.items.map((it, i) => ({ label: String(i + 1).padStart(2, "0"), title: it.title, text: it.text, image: techPhotos[i % techPhotos.length] }))}
        link={{ label: h.featured.button, href: h.featured.buttonHref }}
      />

      {/* 5. Showcase: one large photo, the other treatments as a photo grid. */}
      <ShowcaseGrid
        heading={h.featured.heading}
        items={h.featured.items.map((it) => ({ title: it.title, text: it.text, href: it.href, image: photoForHref(it.href) ?? images.treatmentRoom }))}
        moreLabel=""
        allLink={{ label: h.featured.button, href: h.featured.buttonHref }}
      />

      {/* 6. Meet your dentist: words left, the photo filling the right half. */}
      <DoctorSplit
        id="meet-your-dentist"
        eyebrow={h.dentist.eyebrow}
        heading={h.dentist.heading}
        paragraphs={[h.dentist.text]}
        image={h.dentist.image}
        primary={{ label: h.cta.button, href: "/contact/", track: "book_appointment" }}
        secondary={{ label: h.dentist.link, href: "/about/" }}
      />

      {/* 7. Card row running off the edge: approved reviews (once in /cms), the offers, membership and insurance. */}
      <CardRail
        heading={reviews.length ? h.reviews.heading : h.offers.heading}
        text={reviews.length ? undefined : h.offers.text}
        box={
          <div className="flex items-center gap-4 rounded-lg bg-white px-5 py-4">
            {rating ? (
              <>
                <span className="text-xl font-semibold text-ink-900">{rating}</span>
                <Stars className="h-4 w-4" />
              </>
            ) : (
              <>
                <Phone className="h-6 w-6 text-gold-700" aria-hidden="true" />
                <span className="text-sm leading-tight">
                  <span className="block text-grey-600">{h.offers.footer}</span>
                  <a href={s.phoneHref} data-track="click_to_call" className="text-[1.125rem] font-semibold text-ink-900 hover:underline">
                    {s.phone}
                  </a>
                </span>
              </>
            )}
          </div>
        }
        cards={[...reviewCards, ...offerCards, membershipCard, insuranceCard]}
      />

      {/* 8. Steps written over photos. */}
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

      {/* 9. Visit block with the map. */}
      <VisitSection s={s} heading={h.cta.heading} text={h.cta.text} bookLabel={h.cta.button} />
    </>
  );
}

