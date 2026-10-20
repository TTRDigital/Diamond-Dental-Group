import Link from "next/link";
import type { Metadata } from "next";
import { CircleCheck, Phone } from "lucide-react";
import { getSiteSettings, getThankYou } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { btnBase, btnGold } from "@/components/ui/Buttons";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getThankYou();
  return pageMetadata(t.seo, "/thank-you/");
}

export default async function ThankYouPage() {
  const [t, s] = await Promise.all([getThankYou(), getSiteSettings()]);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Thank You", path: "/thank-you/" },
        ]}
      />
      <div className="min-h-[70vh] bg-background font-sans flex items-center justify-center py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CircleCheck className="w-10 h-10 text-secondary" aria-hidden="true" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-6">{t.heading}</h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">{t.text}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={s.phoneHref} data-track="click_to_call" className={`${btnGold} transition-colors font-bold rounded-lg px-8 py-6 text-lg shadow-xl`}>
              <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
              {t.callButton}
            </a>
            <Link
              href="/"
              className={`${btnBase} rounded-md transition-colors border bg-background h-10 border-secondary text-black hover:bg-secondary hover:text-black px-8 py-6 text-lg font-bold`}
            >
              {t.homeButton}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
