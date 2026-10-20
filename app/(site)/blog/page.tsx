import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Phone } from "lucide-react";
import { getBlogIndex, getPosts, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { btnGold } from "@/components/ui/Buttons";

export async function generateMetadata(): Promise<Metadata> {
  const b = await getBlogIndex();
  return pageMetadata(b.seo, "/blog/");
}

export default async function BlogIndexPage() {
  const [b, posts, s] = await Promise.all([getBlogIndex(), getPosts(), getSiteSettings()]);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog/" },
        ]}
        schema={[
          { name: "Home", path: "/" },
          { name: b.heading, path: "/blog/" },
        ]}
      />
      <div className="bg-white">
        <section className="bg-black text-white py-20 md:py-28 px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
          <div className="container mx-auto max-w-3xl relative z-10 text-center">
            <span className="text-secondary font-bold tracking-wider text-sm uppercase mb-4 block">{b.eyebrow}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight md:leading-none">{b.heading}</h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed md:leading-7">{b.text}</p>
          </div>
        </section>
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {posts.map((p, i) => (
                <li key={p.slug} className="h-full" data-reveal>
                  <Link
                    href={`/blog/${p.slug}/`}
                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
                      <Image
                        src={p.image.src}
                        alt={p.image.alt}
                        fill
                        priority={i === 0}
                        fetchPriority={i === 0 ? "high" : undefined}
                        sizes="(min-width: 1152px) 352px, (min-width: 768px) 45vw, 100vw"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col grow p-6">
                      <h2 className="text-xl font-bold text-black mb-2 leading-snug group-hover:text-secondary transition-colors">{p.title}</h2>
                      <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wider">
                        <time dateTime={p.date}>{p.dateLabel}</time>
                      </p>
                      <p className="text-gray-600 text-[15px] leading-relaxed mb-4 line-clamp-2">{p.excerpt}</p>
                      <span className="mt-auto text-secondary font-bold text-sm flex items-center group-hover:text-black transition-colors">
                        {b.readMore}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="bg-black text-white py-20 md:py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#2a2000] opacity-80" />
          <div className="container mx-auto max-w-3xl relative z-10 text-center" data-reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">{b.cta.heading}</h2>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">{b.cta.text}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact/"
                data-track="book_appointment"
                className={`${btnGold} transition-colors font-bold rounded-lg px-8 py-6 text-lg w-full sm:w-auto shadow-[0_4px_14px_rgba(229,184,51,0.4)]`}
              >
                {b.cta.button}
              </Link>
              <a href={s.phoneHref} data-track="click_to_call" className="inline-flex items-center text-white hover:text-secondary transition-colors font-bold text-xl px-6 py-4">
                <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
                {s.phone}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
