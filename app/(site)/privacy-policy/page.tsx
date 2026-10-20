import type { Metadata } from "next";
import { getPrivacy, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Inline } from "@/components/ui/RichText";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPrivacy();
  return pageMetadata(p.seo, "/privacy-policy/");
}

/* Styled like the live page, whose section headings render at body size (its "prose" classes had no stylesheet behind them). */
export default async function PrivacyPage() {
  const [p, s] = await Promise.all([getPrivacy(), getSiteSettings()]);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy/" },
        ]}
      />
      <div className="bg-animated-mesh font-sans py-24 min-h-screen" data-anim>
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="inline-block bg-black text-white font-bold px-4 py-1.5 rounded-full text-xs mb-8 uppercase tracking-widest">{p.badge}</div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-8 tracking-tight">{p.heading}</h1>
            <div className="max-w-none text-gray-600 space-y-8">
              <p className="text-sm font-bold text-secondary tracking-widest uppercase">{p.updated}</p>
              <p className="text-xl leading-relaxed text-gray-800">{p.intro}</p>
              {p.body.map((b, i) =>
                b.style === "h2" ? (
                  <h2 key={i}>{b.text}</h2>
                ) : b.style === "p" ? (
                  <p key={i}>
                    <Inline text={b.text} />
                  </p>
                ) : (
                  <ul key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100 list-disc pl-10">
                    {b.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                ),
              )}
              <p>{p.contactIntro}</p>
              <address className="bg-black text-white p-8 rounded-2xl not-italic">
                <strong className="text-secondary block mb-2">{s.name}</strong>
                {s.street}
                <br />
                {s.city}, {s.region} {s.postalCode}, {s.country}
                <br />
                Phone:{" "}
                <a href={s.phoneHref} className="text-secondary hover:underline">
                  {s.phone}
                </a>
              </address>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
