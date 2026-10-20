import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CircleCheck, ShieldCheck } from "lucide-react";
import { getPatientCare, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { bgSrc } from "@/lib/img";
import { images } from "@/lib/data/images";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DarkHero } from "@/components/sections/DarkHero";
import { CtaBand, btnBase, btnGold } from "@/components/ui/Buttons";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPatientCare();
  return pageMetadata(p.seo, "/patient-care/");
}

export default async function PatientCarePage() {
  const [p, s] = await Promise.all([getPatientCare(), getSiteSettings()]);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Patient Care", path: "/patient-care/" },
        ]}
      />
      <div className="bg-background font-sans pb-16">
        <DarkHero heading={p.hero.heading} text={p.hero.text} />

        {/* $49 new patient special */}
        <section className="py-20 bg-animated-mesh" data-anim>
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div data-reveal>
              <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-shadow duration-500">
                <div className="absolute top-0 right-0 bg-secondary text-black text-sm font-bold px-6 py-2 rounded-bl-xl uppercase tracking-wider group-hover:scale-105 origin-top-right transition-transform">
                  {p.special.badge}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 pr-32">{p.special.heading}</h2>
                <p className="text-lg text-gray-600 mb-8">{p.special.text}</p>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10" />
                  <p className="text-gray-400 line-through font-medium mb-1">{p.special.regular}</p>
                  <p className="text-4xl font-extrabold text-secondary mb-2 group-hover:scale-105 origin-left transition-transform">{p.special.price}</p>
                  <p className="text-[#3DBA6F] font-bold text-lg mb-6">{p.special.savings}</p>
                  <ul className="space-y-4">
                    {p.special.items.map((it) => (
                      <li key={it} className="flex items-start text-black font-medium">
                        <CircleCheck className="w-6 h-6 text-secondary mr-3 shrink-0" aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/contact/"
                  data-track="book_appointment"
                  className={`${btnGold} font-bold rounded-lg px-8 py-7 text-lg shadow-xl w-full sm:w-auto hover:scale-105 transition-transform`}
                >
                  {p.special.button}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* More grand opening offers */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-20" data-reveal>
              <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-6 tracking-tight">{p.offers.heading}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{p.offers.text}</p>
            </div>
            <div className="space-y-12 md:space-y-24 mb-16">
              {p.offers.items.map((o, i) => (
                <div key={o.title} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                  <div className="w-full md:w-1/2" data-reveal>
                    <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl border-4 border-gray-50 group">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                      {o.image ? (
                        <Image
                          src={o.image.src}
                          alt={o.image.alt}
                          fill
                          sizes="(min-width: 1152px) 512px, (min-width: 768px) 45vw, 100vw"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : null}
                      <div className="absolute bottom-6 left-6 z-20 bg-black text-secondary font-black text-3xl px-6 py-3 rounded-xl shadow-xl group-hover:-translate-y-2 transition-transform">
                        {o.amount}
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2" data-reveal>
                    <h3 className="text-3xl font-bold text-black mb-4">{o.title}</h3>
                    <p className="text-lg text-gray-600 mb-8">{o.text}</p>
                    <Link
                      href="/contact/"
                      data-track="book_appointment"
                      aria-label={`${p.offers.button}: ${o.amount} ${o.title}`}
                      className={`${btnBase} transition-colors border bg-background h-10 border-secondary text-black hover:bg-secondary hover:text-black font-bold px-8 py-6 rounded-xl text-lg`}
                    >
                      {p.offers.button}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Insurance */}
        <section className="py-20 bg-white border-y border-gray-200">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12" data-reveal>
              <ShieldCheck className="w-16 h-16 text-secondary mx-auto mb-6 drop-shadow-md" aria-hidden="true" />
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">{p.insurance.heading}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{p.insurance.text}</p>
            </div>
            <div data-reveal>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
                <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-500 font-medium text-center">
                  {p.insurance.plans.map((plan) => (
                    <li key={plan} className="px-4 py-2 bg-white rounded-lg border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform cursor-default">
                      {plan}
                    </li>
                  ))}
                </ul>
                <div className="text-center mt-8 pt-8 border-t border-gray-200">
                  <p className="text-gray-800 font-medium">
                    {p.insurance.notePrefix}{" "}
                    <a href={s.phoneHref} data-track="click_to_call" className="text-secondary hover:underline font-bold">
                      {p.insurance.noteLink}
                    </a>{" "}
                    {p.insurance.noteSuffix}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Membership plan */}
        <section className="py-20 bg-animated-mesh" data-anim>
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div data-reveal>
              <div className="bg-[#1A1A1A]/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors duration-700" />
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 relative z-10">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">{p.membership.heading}</h2>
                    <p className="text-white/80 text-lg">{p.membership.text}</p>
                  </div>
                  <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-6 text-center min-w-[200px] hover:bg-secondary/20 transition-colors">
                    <p className="text-white/60 mb-1 text-sm uppercase tracking-wider">{p.membership.priceLabel}</p>
                    <p className="text-4xl font-black text-secondary">
                      {p.membership.price}
                      <span className="text-xl">{p.membership.per}</span>
                    </p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 md:p-8 relative z-10">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">{p.membership.includesHeading}</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {p.membership.items.map((it) => (
                      <li key={it} className="flex items-center text-white/90">
                        <CircleCheck className="w-5 h-5 text-secondary mr-3 shrink-0" aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 text-center relative z-10">
                  <a
                    href={s.phoneHref}
                    data-track="click_to_call"
                    className={`${btnGold} font-bold rounded-lg px-8 py-7 text-lg w-full sm:w-auto shadow-[0_0_15px_rgba(229,184,51,0.2)] hover:scale-105 transition-transform`}
                  >
                    {p.membership.button}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div data-reveal>
              <h2 className="text-2xl font-bold text-black mb-4">{p.payment.heading}</h2>
              <p className="text-gray-600 text-lg">{p.payment.text}</p>
            </div>
          </div>
        </section>

        <CtaBand heading={p.cta.heading} button={p.cta.button} phone={s.phone} phoneHref={s.phoneHref} bgImage={bgSrc(images.treatmentRoom.src)} />
      </div>
    </>
  );
}
