import type { Metadata } from "next";
import { CircleCheck } from "lucide-react";
import { getAbout, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { images } from "@/lib/data/images";
import { Icon } from "@/components/ui/Icon";
import { CtaPanel, DoctorSplit, PageHero, SectionHead } from "@/components/sections/Blocks";

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
        imageClass="object-[50%_20%] lg:object-top"
      />

      {/* Meet your dentist: words left, the photo filling the right half */}
      <DoctorSplit eyebrow={a.dentist.eyebrow} heading={a.dentist.heading} paragraphs={[a.dentist.text]} image={a.dentist.image} primary={{ label: a.cta.button, href: "/contact/", track: "book_appointment" }}>
        <blockquote className="mt-7 border-l-2 border-gold-500 pl-5 text-[1.25rem] leading-snug text-ink-900">&ldquo;{a.dentist.quote}&rdquo;</blockquote>
        <ul className="mt-7 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {a.dentist.credentials.map((c) => (
            <li key={c} className="flex items-start gap-3 text-ink-900">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-night-900 text-white">
                <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              {c}
            </li>
          ))}
        </ul>
      </DoctorSplit>

      {/* The practice: heading and text on the left, the three promises on the right (Ideal Dental's icon band) */}
      <section className="dark-section section">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:self-center lg:pr-8" data-reveal>
            <h2 className="uppercase">{a.practice.heading}</h2>
            <p className="mt-4 text-white/90">{a.practice.text}</p>
          </div>
          <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:col-span-7">
            {a.practice.items.map((it, i) => (
              <li key={it.title} data-reveal>
                <span className="text-[2.125rem] font-semibold leading-none text-gold-300">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4">{it.title}</h3>
                <p className="mt-2 text-white/90">{it.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The team */}
      <section className="section bg-cream">
        <div className="container-x">
          <SectionHead heading={a.team.heading} text={a.team.text} center />
          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {a.team.items.map((it) => (
              <li key={it.title} data-reveal>
                <Icon name={it.icon} className="h-12 w-12 stroke-[1.1] text-gold-700" />
                <h3 className="mt-5">{it.title}</h3>
                <p className="mt-2 text-grey-700">{it.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaPanel s={s} heading={a.cta.heading} button={{ label: a.cta.button, href: "/contact/", track: "book_appointment" }} image={images.treatmentRoom} />
    </>
  );
}
