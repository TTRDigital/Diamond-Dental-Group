import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getServices, getServicesHub, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { images } from "@/lib/data/images";
import { CtaBanner, PageHero, SectionHead } from "@/components/sections/Blocks";

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
        <section key={g.heading} className={`section ${i % 2 ? "bg-sand" : ""}`}>
          <div className="container-x">
            <SectionHead heading={g.heading} />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((sv) => (
                <Link key={sv.slug} href={`/services/${sv.slug}/`} className="card card-hover flex flex-col border border-line p-7" data-reveal>
                  <h3>{sv.name}</h3>
                  <p className="mt-2 grow text-grey-700">{sv.sub}</p>
                  <span className="link-arrow mt-5">
                    {hub.cardLink}
                    <ArrowRight className="arrow-nudge h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
      <CtaBanner heading={hub.template.ctaHeading} image={images.storefront} primary={{ label: hub.template.ctaButton, href: "/contact/", track: "book_appointment" }} phone={s.phone} phoneHref={s.phoneHref} />
    </>
  );
}
