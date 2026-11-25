import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getServices, getServicesHub, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { images } from "@/lib/data/images";
import { CtaPanel, PageHero } from "@/components/sections/Blocks";

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
      <section className="section bg-cream">
        <div className="container-x space-y-16 lg:space-y-20">
          {groups.map((g) => (
            <div key={g.heading} className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4" data-reveal>
                <h2 className="uppercase">{g.heading}</h2>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                {g.items.map((sv) => (
                  <li key={sv.slug} data-reveal>
                    <Link href={`/services/${sv.slug}/`} className="group flex h-full items-start justify-between gap-3 rounded-lg bg-ivory p-6 ring-1 ring-ink-900/5 transition-shadow hover:shadow-[var(--shadow-lift)]">
                      <span>
                        <span className="block text-[1.125rem] font-semibold text-ink-900">{sv.name}</span>
                        <span className="mt-1 block text-grey-700">{sv.sub}</span>
                      </span>
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-night-900 text-white transition-transform group-hover:translate-x-0.5">
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">{hub.cardLink}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <CtaPanel s={s} heading={hub.template.ctaHeading} button={{ label: hub.template.ctaButton, href: "/contact/", track: "book_appointment" }} image={images.storefront} />
    </>
  );
}
