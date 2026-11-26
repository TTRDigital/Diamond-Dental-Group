import type { Metadata } from "next";
import { CircleCheck } from "lucide-react";
import { getAbout, getHome, getPatientCare, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { images } from "@/lib/data/images";
import { INSURER_LOGOS, STOCK, photoForHref } from "@/lib/data/stock";
import { Icon } from "@/components/ui/Icon";
import { CtaPanel, DoctorSplit, InsuranceStrip, PageHero, PhotoTrio, SectionHead, TechCards } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const a = await getAbout();
  return pageMetadata(a.seo, "/about/", a.dentist.image);
}

export default async function AboutPage() {
  const [a, s, home, care] = await Promise.all([getAbout(), getSiteSettings(), getHome(), getPatientCare()]);
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

      {/* The practice and its technology, as photo cards */}
      <TechCards
        heading={a.practice.heading}
        text={a.practice.text}
        items={a.practice.items.map((it, i) => ({ label: String(i + 1).padStart(2, "0"), title: it.title, text: it.text, image: [STOCK.jawboneXrayScreen, STOCK.calmPatientChair, STOCK.restorativeModels][i % 3] }))}
      />

      {/* What the practice treats */}
      <PhotoTrio
        heading={home.featured.heading}
        items={home.featured.items.slice(0, 3).map((it) => ({ title: it.title, text: it.text, image: photoForHref(it.href) ?? images.treatmentRoom }))}
      />

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

      <InsuranceStrip heading={care.insurance.heading} text={care.insurance.text} plans={care.insurance.plans} logos={care.insurance.plans.map((p) => INSURER_LOGOS[p]).filter((l) => !!l)} />

      <CtaPanel s={s} heading={a.cta.heading} button={{ label: a.cta.button, href: "/contact/", track: "book_appointment" }} image={images.treatmentRoom} />
    </>
  );
}
