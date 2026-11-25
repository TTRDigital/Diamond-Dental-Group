import type { Metadata } from "next";
import { getPrivacy, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { Inline } from "@/components/ui/RichText";
import { PageHero } from "@/components/sections/Blocks";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPrivacy();
  return pageMetadata(p.seo, "/privacy-policy/");
}

export default async function PrivacyPage() {
  const [p, s] = await Promise.all([getPrivacy(), getSiteSettings()]);
  return (
    <>
      <PageSchema seo={p.seo} />
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy/" },
        ]}
        crumbJsonLd={!seoSchemaNodes(p.seo.schema)}
        eyebrow={p.badge}
        heading={p.heading}
        note={p.updated}
      />
      <section className="section-tight">
        <div className="container-x">
          <article className="mx-auto max-w-3xl space-y-6 text-[1.0625rem] text-grey-700">
            <p className="text-[1.1875rem] text-ink-900">{p.intro}</p>
            {p.body.map((b, i) =>
              b.style === "h2" ? (
                <h2 key={i} className="pt-4 text-[1.25rem]">
                  {b.text}
                </h2>
              ) : b.style === "p" ? (
                <p key={i}>
                  <Inline text={b.text} />
                </p>
              ) : (
                <ul key={i} className="list-disc space-y-1.5 rounded-lg border border-line bg-ivory py-5 pl-10 pr-6">
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              ),
            )}
            <p>{p.contactIntro}</p>
            <address className="on-dark rounded-lg bg-ink-900 p-8 not-italic text-white/85">
              <strong className="mb-2 block text-gold-400">{s.name}</strong>
              {s.street}
              <br />
              {s.city}, {s.region} {s.postalCode}, {s.country}
              <br />
              Phone:{" "}
              <a href={s.phoneHref} data-track="click_to_call" className="text-gold-400 hover:underline">
                {s.phone}
              </a>
            </address>
          </article>
        </div>
      </section>
    </>
  );
}
