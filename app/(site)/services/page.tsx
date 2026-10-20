import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getServices, getServicesHub, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { bgSrc } from "@/lib/img";
import { images } from "@/lib/data/images";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DarkHero } from "@/components/sections/DarkHero";
import { CtaBand } from "@/components/ui/Buttons";

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
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services/" },
        ]}
      />
      <div className="bg-background font-sans pb-16">
        <DarkHero heading={hub.heading} text={hub.text} />
        <section className="py-20 md:py-28 bg-animated-mesh" data-anim>
          <div className="container mx-auto px-4 max-w-6xl relative z-10 space-y-20">
            {groups.map((g) => (
              <div key={g.heading}>
                <div className="text-center mb-12" data-reveal>
                  <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">{g.heading}</h2>
                  <div className="w-20 h-1 bg-secondary mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {g.items.map((sv) => (
                    <div key={sv.slug} data-reveal>
                      <Link
                        href={`/services/${sv.slug}/`}
                        className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 group flex flex-col items-start h-full hover:-translate-y-2"
                      >
                        <h3 className="text-xl font-bold text-black mb-3">{sv.name}</h3>
                        <p className="text-gray-600 mb-4 grow">{sv.sub}</p>
                        <span className="text-secondary font-bold group-hover:text-black flex items-center mt-auto">
                          {hub.cardLink}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <CtaBand
          heading={hub.template.ctaHeading}
          button={hub.template.ctaButton}
          phone={s.phone}
          phoneHref={s.phoneHref}
          bgImage={bgSrc(images.treatmentRoom.src)}
        />
      </div>
    </>
  );
}
