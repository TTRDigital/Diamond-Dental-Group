import Image from "next/image";
import type { Metadata } from "next";
import { CircleCheck } from "lucide-react";
import { getAbout, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { images } from "@/lib/data/images";
import { Icon } from "@/components/ui/Icon";
import { CtaBanner, PageHero, SectionHead } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const a = await getAbout();
  return pageMetadata(a.seo, "/about/", a.dentist.image);
}

export default async function AboutPage() {
  const [a, s] = await Promise.all([getAbout(), getSiteSettings()]);
  return (
    <>
      <PageSchema seo={a.seo} />
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about/" },
        ]}
        crumbJsonLd={!seoSchemaNodes(a.seo.schema)}
        heading={a.hero.heading}
        lead={a.hero.text}
        image={images.storefront}
        imageClass="object-center lg:object-top"
      />

      {/* Meet your dentist */}
      <section className="section">
        <div className="container-x grid items-start gap-10 md:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden arch bg-line md:sticky md:top-[calc(var(--header-h)+1.5rem)]" data-reveal>
            <Image src={a.dentist.image.src} alt={a.dentist.image.alt} fill sizes="(min-width: 768px) 448px, 100vw" className="origin-top scale-[1.02] object-cover" />
          </div>
          <div data-reveal>
            <p className="eyebrow mb-3">{a.dentist.eyebrow}</p>
            <h2>{a.dentist.heading}</h2>
            <p className="lead mt-5">{a.dentist.text}</p>
            <blockquote className="mt-8 border-l-2 border-gold-500 pl-6">
              <p className="text-[1.1875rem] font-medium italic text-ink-900">&ldquo;{a.dentist.quote}&rdquo;</p>
            </blockquote>
            <ul className="mt-8 space-y-3">
              {a.dentist.credentials.map((c) => (
                <li key={c} className="flex items-start gap-3 font-medium text-ink-900">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The practice */}
      <section className="dark-section section">
        <div className="container-x">
          <SectionHead heading={a.practice.heading} text={a.practice.text} center className="max-w-3xl" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {a.practice.items.map((it, i) => (
              <div key={it.title} className="rounded-lg border border-white/10 bg-night-800 p-8" data-reveal>
                <span className="text-[2rem] font-semibold leading-none text-gold-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5">{it.title}</h3>
                <p className="mt-2 text-white/70">{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The team */}
      <section className="section">
        <div className="container-x">
          <SectionHead heading={a.team.heading} text={a.team.text} center className="max-w-3xl" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.team.items.map((it) => (
              <div key={it.title} className="card border border-line p-7" data-reveal>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-gold-400">
                  <Icon name={it.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5">{it.title}</h3>
                <p className="mt-2 text-grey-700">{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner heading={a.cta.heading} image={images.treatmentRoom} primary={{ label: a.cta.button, href: "/contact/", track: "book_appointment" }} phone={s.phone} phoneHref={s.phoneHref} />
    </>
  );
}
