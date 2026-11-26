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
      />
      {groups.map((g, i) => (
        <section key={g.heading} className={`section bg-cream ${i ? "border-t border-ink-900/10" : ""}`}>
          <div className="container-x">
            <h2 className="uppercase">{g.heading}</h2>
            <div className="mt-8">
              <PhotoCards items={g.items.map((sv) => ({ title: sv.name, text: sv.sub, href: `/services/${sv.slug}/`, image: serviceHero(sv.slug, sv.heroImage) }))} />
            </div>
          </div>
        </section>
      ))}
      <CtaPanel s={s} heading={hub.template.ctaHeading} button={{ label: hub.template.ctaButton, href: "/contact/", track: "book_appointment" }} image={images.storefront} />
    </>
  );
}
