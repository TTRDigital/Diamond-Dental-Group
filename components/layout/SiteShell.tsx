import type { ReactNode } from "react";
import { preconnect } from "react-dom";
import { getSiteSettings } from "@/lib/content";
import { projectId } from "@/sanity/env";
import { businessSchema } from "@/lib/schema";
import { revealScript } from "@/lib/reveal-script";
import { JsonLd } from "@/components/ui/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/layout/ChatWidget";
import { Analytics } from "@/components/layout/Analytics";
import { ReviewBar } from "@/components/layout/ReviewBar";
import { HydrationSignal } from "@/components/layout/HydrationSignal";

/** Header, footer and site-wide behaviors. Used by the site layout and the 404 page. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const s = await getSiteSettings();
  // Photos come from Sanity's image CDN: open the connection while the HTML is still parsing (the hero photo arrives sooner).
  if (projectId) preconnect("https://cdn.sanity.io");
  return (
    <>
      <JsonLd data={businessSchema(s)} />
      <a href="#main" className="sr-only z-[100] rounded bg-black px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <div className="min-h-screen flex flex-col font-sans">
        <Header
          menu={s.menu}
          cta={s.headerCta}
          phone={s.phone}
          phoneHref={s.phoneHref}
          logo={s.logo}
          siteName={s.name}
          address={`${s.street}, ${s.city}, ${s.region} ${s.postalCode}, ${s.country}`}
          mapsUrl={s.mapsUrl}
        />
        <main id="main" tabIndex={-1} className="grow pt-[100px] md:pt-[116px] outline-none">
          {children}
        </main>
        <Footer settings={s} />
      </div>
      <ChatWidget />
      <HydrationSignal />
      <Analytics />
      <ReviewBar />
      <script dangerouslySetInnerHTML={{ __html: revealScript }} />
    </>
  );
}
