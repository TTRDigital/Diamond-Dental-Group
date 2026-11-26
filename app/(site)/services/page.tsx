import type { Metadata } from "next";
import { getServices, getServicesHub, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { images } from "@/lib/data/images";
import { serviceHero } from "@/lib/data/stock";
import { CtaPanel, PageHero, PhotoCards } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const hub = await getServicesHub();
  return pageMetadata(hub.seo, "/services/");
}

/**
 * Services hub (new: the live site linked "Services" in its breadcrumbs and
 * "View All Services" but had no page there). Groups and names follow the
 * live mega menu; each card uses the service page's own intro line.
 */
export default async function ServicesPage() {
  const [hub, services, s] = await Promise.all([getServicesHub(), getServices(), getSiteSettings()]);
  const groups = (s.menu.find((m) => m.groups?.length)?.groups ?? []).map((g) => ({
    heading: g.heading,
    items: g.links.map((l) => services.find((sv) => `/services/${sv.slug}/` === l.href)).filter((sv) => sv !== undefined),
  }));

  return (
    <>
      <PageSchema seo={hub.seo} />
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services/" },
        ]}
        crumbJsonLd={!seoSchemaNodes(hub.seo.schema)}
        heading={hub.heading}
        lead={hub.text}
        image={images.treatmentRoom}
        imageClass="object-center"
        primary={{ label: hub.template.primaryButton, href: "/contact/", track: "book_appointment" }}
        secondary={{ label: s.phone, href: s.phoneHref, track: "click_to_call" }}
      />
      <section className="section bg-cream">
        <div className="container-x space-y-16 lg:space-y-24">
          {groups.map((g, i) => (
            <div key={g.heading} className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-3" data-reveal>
                <div className="lg:sticky lg:top-28">
                  <p className="flex items-center gap-2 text-xs font-semibold tabular-nums text-grey-600">
                    <span aria-hidden="true" className="h-px w-6 bg-ink-900/40" />
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3">{g.heading}</h2>
                </div>
              </div>
              <div className="lg:col-span-9">
                <PhotoCards items={g.items.map((sv) => ({ title: sv.name, text: sv.sub, href: `/services/${sv.slug}/`, image: serviceHero(sv.slug, sv.heroImage) }))} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <CtaPanel s={s} heading={hub.template.ctaHeading} button={{ label: hub.template.ctaButton, href: "/contact/", track: "book_appointment" }} image={images.storefront} />
    </>
  );
}
