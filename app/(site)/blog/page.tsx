import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { getAbout, getBlogIndex, getPosts, getSiteSettings } from "@/lib/content";
import { postAuthor } from "@/lib/author";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { btnGold } from "@/components/ui/Buttons";
import { PostCard } from "@/components/blog/PostCard";

export async function generateMetadata(): Promise<Metadata> {
  const b = await getBlogIndex();
  return pageMetadata(b.seo, "/blog/");
}

/** Anchor id of a topic chip ("Implants & Restorative" -> cat-implants-restorative). */
const topicId = (c: string) =>
  `cat-${c
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;

export default async function BlogIndexPage() {
  const [b, posts, s, about] = await Promise.all([getBlogIndex(), getPosts(), getSiteSettings(), getAbout()]);
  const authors = posts.map((p) => postAuthor(p.author, about.dentist));
  // The author strip shows the one person who writes every article (the practice's dentist).
  const writer = authors.length && authors.every((a) => a.name === authors[0].name) ? authors[0] : undefined;
  const topics = [...new Set(posts.map((p) => p.category).filter((c): c is string => !!c))];
  const count = (c: string) => posts.filter((p) => p.category === c).length;
  // Topic filter without JavaScript: a chip targets an empty anchor, and :target hides the other cards and lights its chip.
  const filterCss = topics
    .map((c) => {
      const id = topicId(c);
      const cat = c.replace(/["\\]/g, "");
      return `#${id}:target~.blog-grid>li:not([data-cat="${cat}"]){display:none}#${id}:target~.blog-chips a[href="#${id}"]{background:var(--color-secondary);border-color:var(--color-secondary);color:#000}#${id}:target~.blog-chips a[href="#all"]{background:#fff;border-color:var(--color-border);color:#374151}`;
    })
    .join("");

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
        {/* Hero band with the author strip. */}
        <section className="relative overflow-hidden bg-black px-4 py-16 text-white md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#161616] to-[#2a2000] opacity-90" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,184,51,0.14),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <span className="blog-rise mb-4 block text-sm font-bold uppercase tracking-wider text-secondary">{b.eyebrow}</span>
            <h1 className="blog-rise blog-rise-2 mb-6 font-heading text-4xl font-extrabold leading-tight md:text-5xl md:leading-none">{b.heading}</h1>
            <p className="blog-rise blog-rise-3 text-lg leading-relaxed text-white/80 md:text-xl">{b.text}</p>
            {writer ? (
              <div className="blog-rise blog-rise-3 mt-8 inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left">
                {writer.image ? <Image src={writer.image.src} alt={writer.image.alt} width={56} height={56} sizes="56px" className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-secondary" /> : null}
                <div className="text-sm leading-snug">
                  <span className="block text-white/70">Every article is written by</span>
                  <span className="mt-0.5 block font-semibold">
                    {writer.url ? (
                      <Link href={writer.url} className="underline decoration-secondary/60 underline-offset-4 transition-colors hover:text-secondary">
                        {writer.label}
                      </Link>
                    ) : (
                      writer.label
                    )}
                  </span>
                  {writer.role ? <span className="mt-0.5 block text-white/70">{writer.role}</span> : null}
                </div>
              </div>
            ) : (
              <p className="blog-rise blog-rise-3 mt-6 text-white/70">Articles by the {s.name} team.</p>
            )}
          </div>
        </section>

        {/* Topic chips and the post cards. The anchors, chips and grid are siblings so the :target rules can reach them. */}
        <section className="bg-white px-4 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            {topics.length ? <style dangerouslySetInnerHTML={{ __html: filterCss }} /> : null}
            <span id="all" className="block scroll-mt-36" aria-hidden="true" />
            {topics.map((c) => (
              <span key={c} id={topicId(c)} className="block scroll-mt-36" aria-hidden="true" />
            ))}
            {topics.length ? (
              <nav aria-label="Topics" className="blog-chips mb-8 flex flex-wrap gap-2">
                <a href="#all" className="blog-chip" data-on>
                  All <span className="opacity-70">({posts.length})</span>
                </a>
                {topics.map((c) => (
                  <a key={c} href={`#${topicId(c)}`} className="blog-chip">
                    {c} <span className="opacity-70">({count(c)})</span>
                  </a>
                ))}
              </nav>
            ) : null}
            <ul className="blog-grid grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <li key={p.slug} className="h-full" data-cat={p.category ?? ""} data-reveal>
                  <PostCard post={p} author={authors[i]} readMore={b.readMore} priority={i === 0} sizes="(min-width: 1152px) 352px, (min-width: 768px) 45vw, 100vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Have a question? */}
        <section className="relative overflow-hidden bg-black px-4 py-20 text-white md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#2a2000] opacity-80" />
          <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
            <h2 className="mb-5 font-heading text-3xl font-bold md:text-4xl">{b.cta.heading}</h2>
            <p className="mb-8 text-lg leading-relaxed text-white/80">{b.cta.text}</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact/"
                data-track="book_appointment"
                className={`${btnGold} w-full rounded-lg px-8 py-6 text-lg font-bold shadow-[0_4px_14px_rgba(229,184,51,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(229,184,51,0.5)] sm:w-auto`}
              >
                {b.cta.button}
              </Link>
              <a href={s.phoneHref} data-track="click_to_call" className="inline-flex items-center px-6 py-4 text-xl font-bold text-white transition-colors hover:text-secondary">
                <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                {s.phone}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
