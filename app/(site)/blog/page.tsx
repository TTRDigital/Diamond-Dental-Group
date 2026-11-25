import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAbout, getBlogIndex, getPosts, getSiteSettings } from "@/lib/content";
import { postAuthor } from "@/lib/author";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/ui/PageSchema";
import { seoSchemaNodes } from "@/lib/schema";
import { images } from "@/lib/data/images";
import { CtaBanner, PageHero } from "@/components/sections/Blocks";
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
      return `#${id}:target~.blog-grid>li:not([data-cat="${cat}"]){display:none}#${id}:target~.blog-chips a[href="#${id}"]{background:var(--color-gold-400);border-color:var(--color-gold-400);color:var(--color-ink-900)}#${id}:target~.blog-chips a[href="#all"]{background:var(--color-ivory);border-color:var(--color-line);color:var(--color-grey-700)}`;
    })
    .join("");

  return (
    <>
      <PageSchema seo={b.seo} />
      {/* Hero band with the author strip. */}
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog/" },
        ]}
        crumbSchema={[
          { name: "Home", path: "/" },
          { name: b.heading, path: "/blog/" },
        ]}
        crumbJsonLd={!seoSchemaNodes(b.seo.schema)}
        eyebrow={b.eyebrow}
        heading={b.heading}
        lead={b.text}
      >
        {writer ? (
          <div className="mt-8 inline-flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 px-5 py-4 text-left" data-stage="4">
            {writer.image ? <Image src={writer.image.src} alt={writer.image.alt} width={56} height={56} sizes="56px" className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-gold-400" /> : null}
            <div className="text-sm leading-snug">
              <span className="block text-white/70">Every article is written by</span>
              <span className="mt-0.5 block font-semibold text-white">
                {writer.url ? (
                  <Link href={writer.url} className="underline decoration-gold-400/60 underline-offset-4 transition-colors hover:text-gold-400">
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
          <p className="mt-6 text-white/70" data-stage="4">
            Articles by the {s.name} team.
          </p>
        )}
      </PageHero>

      {/* Topic chips and the post cards. The anchors, chips and grid are siblings so the :target rules can reach them. */}
      <section className="section-tight">
        <div className="container-x">
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
          <ul className="blog-grid grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <li key={p.slug} className="h-full" data-cat={p.category ?? ""} data-reveal>
                <PostCard post={p} author={authors[i]} readMore={b.readMore} priority={i === 0} sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 100vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Have a question? */}
      <CtaBanner heading={b.cta.heading} text={b.cta.text} image={images.treatmentRoom} primary={{ label: b.cta.button, href: "/contact/", track: "book_appointment" }} phone={s.phone} phoneHref={s.phoneHref} />
    </>
  );
}
