import Link from "next/link";
import type { Metadata } from "next";
import { CircleCheck, Phone } from "lucide-react";
import { getSiteSettings, getThankYou } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getThankYou();
  return pageMetadata(t.seo, "/thank-you/");
}

export default async function ThankYouPage() {
  const [t, s] = await Promise.all([getThankYou(), getSiteSettings()]);
  return (
    <>
      <PageSchema seo={t.seo} />
      <Breadcrumbs
        jsonLd={!seoSchemaNodes(t.seo.schema)}
        items={[
          { name: "Home", path: "/" },
          { name: "Thank You", path: "/thank-you/" },
        ]}
      />
      <section className="section flex min-h-[60vh] items-center">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-night-900 text-gold-300">
              <CircleCheck className="h-8 w-8" aria-hidden="true" />
            </span>
            <h1 className="mt-8">{t.heading}</h1>
            <p className="lead mt-4">{t.text}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={s.phoneHref} data-track="click_to_call" className="btn btn-primary">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {t.callButton}
              </a>
              <Link href="/" className="btn btn-outline">
                {t.homeButton}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
