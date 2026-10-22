import Image from "next/image";
import type { Metadata } from "next";
import { CircleCheck } from "lucide-react";
import { getAbout, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { images } from "@/lib/data/images";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { CtaBand } from "@/components/ui/Buttons";
import { DarkHero } from "@/components/sections/DarkHero";

export async function generateMetadata(): Promise<Metadata> {
  const a = await getAbout();
  return pageMetadata(a.seo, "/about/", a.dentist.image);
}

export default async function AboutPage() {
  const [a, s] = await Promise.all([getAbout(), getSiteSettings()]);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about/" },
        ]}
      />
      <div className="bg-background font-sans pb-16">
        <DarkHero heading={a.hero.heading} text={a.hero.text} textSpacing="mb-10" />

        <section className="py-20 md:py-28 bg-white overflow-hidden relative">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full md:w-1/2" data-reveal>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-gray-100 bg-gray-50 aspect-[4/5] group">
                  <Image
                    src={a.dentist.image.src}
                    alt={a.dentist.image.alt}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(min-width: 1152px) 512px, (min-width: 768px) 45vw, 100vw"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2" data-reveal>
                <span className="text-secondary font-bold tracking-wider text-sm uppercase mb-3 block">{a.dentist.eyebrow}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">{a.dentist.heading}</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{a.dentist.text}</p>
                <blockquote className="border-l-4 border-secondary pl-6 py-2 mb-8 bg-gray-50 rounded-r-lg">
                  <p className="text-xl italic text-black font-medium">&quot;{a.dentist.quote}&quot;</p>
                </blockquote>
                <ul className="space-y-4">
                  {a.dentist.credentials.map((c) => (
                    <li key={c} className="flex items-center text-gray-800 font-medium group hover:translate-x-2 transition-transform">
                      <CircleCheck className="w-6 h-6 text-secondary mr-3 shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-black text-white relative overflow-hidden" data-anim>
          <div className="absolute inset-0 bg-gradient-drift bg-gradient-to-tl from-black via-[#1a1a1a] to-black opacity-80" />
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-16" data-reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{a.practice.heading}</h2>
              <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">{a.practice.text}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {a.practice.items.map((it, i) => (
                <div key={it.title} data-reveal className="bg-[#1A1A1A]/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center hover:-translate-y-2 transition-transform group">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 mx-auto border border-white/20 group-hover:border-secondary transition-colors shadow-[0_0_15px_rgba(229,184,51,0.1)]">
                    <span className="text-secondary text-2xl font-bold">{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-4">{it.title}</h3>
                  <p className="text-white/70">{it.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-animated-mesh" data-anim>
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <div data-reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">{a.team.heading}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-12">{a.team.text}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-left">
              {a.team.items.map((it) => (
                <div key={it.title} data-reveal className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform group">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                    <Icon name={it.icon} className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{it.title}</h3>
                  <p className="text-gray-600">{it.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaBand heading={a.cta.heading} button={a.cta.button} phone={s.phone} phoneHref={s.phoneHref} bgImage={images.treatmentRoom.src} />
      </div>
    </>
  );
}
