import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleCheck, Phone, ShieldCheck, Star } from "lucide-react";
import { getHome, getSiteSettings, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { bgSrc } from "@/lib/img";
import { isPlaceholder } from "@/lib/placeholders";
import { Icon, Stars } from "@/components/ui/Icon";
import { CtaBand, SectionHeading, btnBase, btnGold } from "@/components/ui/Buttons";

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
    <div className="bg-background font-sans">
      {/* Hero: storefront photo, the page's largest image, loaded first. */}
      <section className="relative pt-48 pb-24 md:pt-64 md:pb-32 lg:pt-72 lg:pb-40 flex items-center justify-center text-center px-4 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={h.hero.image.src}
            alt={h.hero.image.alt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="w-full h-full object-cover md:object-contain object-center opacity-90"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight md:leading-none drop-shadow-lg">{h.hero.heading}</h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-medium">{h.hero.text}</p>
          <div className="w-full max-w-md flex flex-col items-center">
            <Link
              href="/contact/"
              data-track="book_appointment"
              className={`${btnGold} font-bold rounded-lg px-8 py-7 text-lg md:text-xl shadow-[0_4px_14px_rgba(229,184,51,0.4)] hover:shadow-[0_6px_20px_rgba(229,184,51,0.6)] hover:-translate-y-1 transition-all w-full mb-6`}
            >
              {h.hero.button}
            </Link>
            <a href={s.phoneHref} data-track="click_to_call" className="text-white hover:text-secondary transition-colors font-bold text-xl mb-2">
              {s.phone}
            </a>
            <p className="text-white/80 text-sm">{h.hero.note}</p>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-black text-white py-6 md:py-8 relative z-20 -mt-2">
        <div className="container mx-auto px-4">
          <ul className={`grid grid-cols-2 ${trust.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"} gap-6 text-center divide-x divide-white/10`}>
            {trust.map((t) => (
              <li key={t.text} className="flex flex-col items-center px-2" data-reveal>
                {t.icon === "stars" ? (
                  <span className="mb-2">
                    <Stars />
                  </span>
                ) : (
                  <Icon name={t.icon} className="w-8 h-8 text-secondary mb-2" />
                )}
                <span className="text-sm md:text-base font-semibold">{t.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why choose */}
      <section className="py-20 md:py-28 bg-white relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16" data-reveal>
            <SectionHeading>{h.why.heading}</SectionHeading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {h.why.items.map((it) => (
              <div
                key={it.title}
                data-reveal
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 shadow-lg shadow-black/10">
                  <Icon name={it.icon} className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4">{it.title}</h3>
                <p className="text-gray-600 leading-relaxed">{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-32 bg-black text-white relative overflow-hidden" data-anim>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -translate-y-1/2 mix-blend-screen pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 mix-blend-screen pointer-events-none" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-20" data-reveal>
            <span className="text-secondary font-bold tracking-wider text-sm uppercase mb-3 block">{h.journey.eyebrow}</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">{h.journey.heading}</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
          </div>
          <div className="relative mt-12 mb-8">
            <div className="hidden md:block absolute top-[40px] left-[10%] w-[80%] h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-full bg-secondary shadow-[0_0_15px_rgba(229,184,51,0.8)]" />
            </div>
            <div className="md:hidden absolute left-[39px] top-[40px] w-1 h-[80%] bg-white/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-secondary shadow-[0_0_15px_rgba(229,184,51,0.8)]" />
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
              {h.journey.items.map((it, i) => (
                <li key={it.title} data-reveal className="relative flex flex-row md:flex-col items-center md:text-center gap-6 md:gap-4 group">
                  <div className="w-20 h-20 rounded-full bg-black border-4 border-black ring-4 ring-white/10 flex items-center justify-center shrink-0 relative transition-all duration-500 group-hover:ring-secondary/50 group-hover:bg-[#1A1A1A]">
                    <div className="absolute inset-[-8px] rounded-full border-2 border-secondary/50 ring-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
                    <Icon name={it.icon} className="w-8 h-8 text-secondary" />
                    <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-8 h-8 bg-secondary text-black font-black rounded-full flex items-center justify-center text-sm border-2 border-black">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">{it.title}</h3>
                    <p className="text-white/70 text-sm md:text-base leading-relaxed md:leading-6">{it.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="py-20 md:py-28 bg-animated-mesh" data-anim>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16" data-reveal>
            <SectionHeading>{h.featured.heading}</SectionHeading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {h.featured.items.map((it) => (
              <div key={it.href} data-reveal>
                <Link
                  href={it.href}
                  className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 group flex flex-col items-start h-full hover:-translate-y-2"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                    <Icon name={it.icon} className="w-6 h-6 text-secondary group-hover:text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{it.title}</h3>
                  <p className="text-gray-600 mb-4 grow">{it.text}</p>
                  <span className="text-secondary font-bold group-hover:text-black flex items-center mt-auto">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center" data-reveal>
            <Link
              href={h.featured.buttonHref}
              className={`${btnBase} rounded-md transition-colors border h-10 border-secondary text-black hover:bg-secondary hover:text-black px-8 py-6 text-lg font-bold bg-white/50 backdrop-blur-sm`}
            >
              {h.featured.button}
            </Link>
          </div>
        </div>
      </section>

      {/* Grand opening offers */}
      <section className="py-20 md:py-28 bg-black text-white relative overflow-hidden" data-anim>
        <div className="absolute inset-0 bg-gradient-drift bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#2a2000] opacity-80" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16" data-reveal>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">{h.offers.heading}</h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">{h.offers.text}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div
              data-reveal
              className="border-2 border-secondary/50 rounded-2xl p-8 md:p-10 bg-white/5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between hover:border-secondary transition-colors"
            >
              <div className="absolute top-0 right-0 bg-secondary text-black text-xs font-bold px-4 py-2 rounded-bl-lg uppercase tracking-wider">{h.offers.badge}</div>
              <div>
                <h3 className="text-3xl font-bold text-secondary mb-2">{h.offers.main.title}</h3>
                <p className="text-white/70 mb-6">{h.offers.main.text}</p>
                <ul className="space-y-3 mb-8">
                  {h.offers.main.items.map((it) => (
                    <li key={it} className="flex items-start">
                      <CircleCheck className="w-5 h-5 text-secondary mr-3 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-white/90">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/contact/"
                data-track="book_appointment"
                className={`${btnGold} transition-colors px-4 font-bold rounded-lg py-6 text-lg w-full shadow-[0_0_15px_rgba(229,184,51,0.3)]`}
              >
                {h.offers.main.button}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {h.offers.others.map((o) => (
                <div
                  key={o.title}
                  data-reveal
                  className="border border-secondary/30 rounded-xl p-6 bg-white/5 backdrop-blur-md flex items-center justify-between hover:border-secondary/80 transition-colors group hover:-translate-y-1"
                >
                  <div>
                    <span className="text-2xl md:text-3xl font-black text-secondary block mb-1 group-hover:scale-105 transition-transform origin-left">{o.amount}</span>
                    <span className="text-lg text-white font-medium">{o.title}</span>
                  </div>
                  <Link
                    href="/contact/"
                    data-track="book_appointment"
                    aria-label={`${h.offers.otherButton} ${o.amount} ${o.title}`}
                    className={`${btnBase} rounded-md text-sm font-medium transition-colors border bg-background h-10 px-4 py-2 border-secondary text-secondary hover:bg-secondary hover:text-black`}
                  >
                    {h.offers.otherButton}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center" data-reveal>
            <p className="text-white/60 mb-4">{h.offers.footer}</p>
            <a href={s.phoneHref} data-track="click_to_call" className="inline-flex items-center text-2xl font-bold text-secondary hover:text-white transition-colors">
              <Phone className="w-6 h-6 mr-3 animate-pulse" aria-hidden="true" />
              {s.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Insurance + membership */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div data-reveal className="bg-[#F9FAFB] rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold text-black mb-4 flex items-center">
                <ShieldCheck className="w-6 h-6 text-secondary mr-3" aria-hidden="true" />
                {h.insurance.heading}
              </h2>
              <p className="text-gray-600 mb-6">{h.insurance.text}</p>
              <Link href="/patient-care/" className="text-secondary font-bold hover:text-black flex items-center group">
                {h.insurance.link}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>
            <div
              data-reveal
              className="bg-black rounded-2xl p-8 border border-[#1A1A1A] text-white hover:shadow-xl hover:shadow-secondary/10 transition-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center relative z-10">
                <Star className="w-6 h-6 text-secondary mr-3" aria-hidden="true" />
                {h.membership.heading}
              </h2>
              <p className="text-white/80 mb-6 relative z-10">
                {h.membership.text} <strong className="text-secondary">{h.membership.price}</strong> {h.membership.textAfter}
              </p>
              <Link href="/patient-care/" className="text-secondary font-bold hover:text-white flex items-center group relative z-10">
                {h.membership.link}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Meet your dentist */}
      <section className="py-20 md:py-28 bg-white overflow-hidden relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2" data-reveal>
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-gray-100 bg-gray-50 aspect-[4/5] group">
                <Image
                  src={h.dentist.image.src}
                  alt={h.dentist.image.alt}
                  fill
                  sizes="(min-width: 1152px) 512px, (min-width: 768px) 45vw, 100vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
            <div className="w-full md:w-1/2" data-reveal>
              <span className="text-secondary font-bold tracking-wider text-sm uppercase mb-3 block">{h.dentist.eyebrow}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">{h.dentist.heading}</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">{h.dentist.text}</p>
              <Link href="/about/" className="inline-flex items-center text-secondary font-bold hover:text-black text-lg transition-colors group">
                {h.dentist.link}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews: shown only once real, approved reviews are in /cms. */}
      {reviews.length ? (
        <section className="py-20 bg-animated-mesh" data-anim>
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-16" data-reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">{h.reviews.heading}</h2>
              {rating ? (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="font-bold text-xl">{rating}</span>
                  <Stars />
                </div>
              ) : null}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((r) => (
                <figure key={r.name} data-reveal className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                  <div className="mb-4">
                    <Stars className="w-4 h-4" />
                  </div>
                  <blockquote className="text-gray-600 mb-6 italic">&quot;{r.quote}&quot;</blockquote>
                  <figcaption className="font-bold text-black">— {r.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        heading={h.cta.heading}
        text={h.cta.text}
        button={h.cta.button}
        phone={s.phone}
        phoneHref={s.phoneHref}
        bgImage={bgSrc(h.hero.image.src)}
        bgClass="bg-cover md:bg-contain bg-center opacity-30"
      />
    </div>
  );
}
