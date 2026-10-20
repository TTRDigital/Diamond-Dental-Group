import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight, House, Phone } from "lucide-react";
import { getBlogIndex, getPost, getPosts, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";
import { slugLabel } from "@/lib/text";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArticleBody, Inline } from "@/components/ui/RichText";
import { btnGold } from "@/components/ui/Buttons";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  const meta = pageMetadata(p.seo, `/blog/${p.slug}/`, p.image);
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: p.date } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, b, s] = await Promise.all([getPost(slug), getBlogIndex(), getSiteSettings()]);
  if (!p) notFound();
  const path = `/blog/${p.slug}/`;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog/" },
          { name: slugLabel(p.slug), path },
        ]}
        schema={[
          { name: "Home", path: "/" },
          { name: b.heading, path: "/blog/" },
          { name: p.title, path },
        ]}
      />
      <JsonLd data={articleSchema({ title: p.title, description: p.seo.description, date: p.date, image: p.image.src, path, publisher: s.name, logo: s.logo.src })} />
      <article className="bg-white">
        <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200 py-4">
          <div className="container mx-auto px-4 flex items-center text-sm text-gray-500 flex-wrap gap-y-1">
            <Link href="/" className="hover:text-secondary transition-colors font-medium flex items-center">
              <House className="w-4 h-4 mr-1" aria-hidden="true" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-1 text-gray-300" aria-hidden="true" />
            <Link href="/blog/" className="hover:text-secondary transition-colors font-medium">
              {b.heading}
            </Link>
            <ChevronRight className="w-4 h-4 mx-1 text-gray-300" aria-hidden="true" />
            <span className="text-black font-semibold line-clamp-1">{p.title}</span>
          </div>
        </div>
        <div className="py-12 md:py-20 px-4">
          <div className="max-w-[720px] mx-auto">
            <header>
              <h1 className="text-3xl md:text-[2.5rem] font-extrabold text-black mb-4 leading-tight tracking-tight">{p.title}</h1>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-8">
                <time dateTime={p.date}>{p.dateLabel}</time>
              </p>
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 mb-10 shadow-sm relative">
                <Image src={p.image.src} alt={p.image.alt} fill priority fetchPriority="high" sizes="(min-width: 752px) 720px, 100vw" className="w-full h-full object-cover" />
              </div>
            </header>
            <ArticleBody blocks={p.body} />
            <div className="mt-12 rounded-2xl bg-black p-8 md:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
              {p.cta.heading ? <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-5 relative z-10 text-left">{p.cta.heading}</h2> : null}
              <p className="text-white/90 text-[17px] md:text-[18px] leading-[1.75] mb-8 relative z-10 text-left">
                <Inline text={p.cta.text} boldClassName="font-bold" />
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <Link
                  href={p.cta.buttonHref}
                  data-track="book_appointment"
                  className={`${btnGold} font-bold rounded-lg px-8 py-6 text-lg w-full sm:w-auto shadow-[0_4px_14px_rgba(229,184,51,0.4)] transition-colors`}
                >
                  {p.cta.buttonLabel}
                </Link>
                <a href={s.phoneHref} data-track="click_to_call" className="inline-flex items-center text-white hover:text-secondary transition-colors font-bold text-xl px-6 py-4">
                  <Phone className="w-5 h-5 mr-2" aria-hidden="true" /> {s.phone}
                </a>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-gray-200">
              <p className="text-sm italic text-gray-400 leading-relaxed">{p.disclaimer}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 py-12 px-4 border-t border-gray-100">
          <div className="max-w-[720px] mx-auto text-center">
            <Link href="/blog/" className="text-secondary font-bold hover:text-black transition-colors inline-flex items-center">
              {b.backLink}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
