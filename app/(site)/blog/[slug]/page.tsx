import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Calendar, ChevronDown, Clock, ListChecks, Phone, Stethoscope, Tag, User } from "lucide-react";
import { getAbout, getBlogIndex, getPost, getPosts, getServices, getSiteSettings } from "@/lib/content";
import { postAuthor } from "@/lib/author";
import { pageMetadata } from "@/lib/seo";
import { articleSchema, faqPageSchema } from "@/lib/schema";
import { slugLabel, stripMarks } from "@/lib/text";
import { articleModel, ctaBand, linkedServices, morePosts, photoFrame } from "@/lib/post-design";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Inline } from "@/components/ui/RichText";
import { btnBase, btnGold } from "@/components/ui/Buttons";
import { ArticleBody, BODY_LINK, Blocks } from "@/components/blog/ArticleBody";
import { PostCard } from "@/components/blog/PostCard";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [p, about] = await Promise.all([getPost((await params).slug), getAbout()]);
  if (!p) return {};
  const meta = pageMetadata(p.seo, `/blog/${p.slug}/`, p.image);
  const author = postAuthor(p.author, about.dentist);
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: p.date, authors: [author.label] } };
}

/**
 * Reading progress: a thin gold line at the very top (.blog-progress) that grows as the article scrolls by. The script
 * adds the line itself and only touches that one element, so without JavaScript there is simply no line.
 */
const progressScript = `(function(){var a=document.querySelector("article[data-progress]");if(!a)return;var b=document.createElement("div");b.className="blog-progress";b.setAttribute("aria-hidden","true");document.body.appendChild(b);var t=false;function u(){t=false;var r=a.getBoundingClientRect(),p=(window.innerHeight-r.top)/r.height;b.style.transform="scaleX("+(p<0?0:p>1?1:p)+")"}function s(){if(!t){t=true;requestAnimationFrame(u)}}addEventListener("scroll",s,{passive:true});addEventListener("resize",s);u()})();`;

const EYEBROW = "text-xs font-bold uppercase tracking-wider text-gray-600";
const BTN_OUTLINE = `${btnBase} h-11 rounded-lg border-2 border-black px-5 text-sm font-bold text-black transition-all hover:-translate-y-0.5 hover:bg-black hover:text-white`;

/** Jump links to every heading (the same list sits in the phone <details> and in the desktop side column). */
function Toc({ items, className = "" }: { items: { id: string; text: string }[]; className?: string }) {
  return (
    <ol className={`space-y-1 ${className}`}>
      {items.map((t, i) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="flex items-start gap-3 rounded-lg px-2 py-1.5 text-[15px] leading-snug text-gray-700 transition-colors hover:bg-secondary/10 hover:text-black">
            <span className="mt-0.5 w-5 shrink-0 font-heading text-xs font-bold text-gray-600" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{t.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, b, s, about, services, posts] = await Promise.all([getPost(slug), getBlogIndex(), getSiteSettings(), getAbout(), getServices(), getPosts()]);
  if (!p) notFound();
  const path = `/blog/${p.slug}/`;
  const author = postAuthor(p.author, about.dentist);
  const model = articleModel(p);
  const band = ctaBand(model.sections, p.cta.heading);
  const hero = photoFrame(p.image);
  const button = { label: p.cta.buttonLabel, href: p.cta.buttonHref };

  // The page this post supports (Related): a service page shows its heading, intro line and photo, any other page its slug.
  const relatedHref = p.service?.trim() ?? "";
  const relatedService = relatedHref ? services.find((sv) => `/services/${sv.slug}/` === relatedHref) : undefined;
  const relatedName = relatedService ? `${relatedService.heading} ${relatedService.headingSuffix}`.trim() : slugLabel(relatedHref.split("/").filter(Boolean).pop() ?? "");
  // The service's photo is shown only when the post does not already use it (the same photo can live under a local
  // address and a Sanity one, so the size is compared as well).
  const photoKey = (img: { src: string; width: number; height: number }) => [img.src, `${img.width}x${img.height}`];
  const usedPhotos = new Set([p.image, ...(p.sections ?? []).map((x) => x.image)].flatMap((img) => (img ? photoKey(img) : [])));
  const relatedImage = relatedService && !photoKey(relatedService.heroImage).some((k) => usedPhotos.has(k)) ? relatedService.heroImage : undefined;
  const relatedServices = linkedServices(p.body, relatedHref)
    .map((href) => services.find((sv) => `/services/${sv.slug}/` === href))
    .filter((sv): sv is NonNullable<typeof sv> => !!sv)
    .slice(0, 3);
  const more = morePosts(posts, p);

  const facts: { icon: typeof User; label: string; value: React.ReactNode }[] = [
    { icon: User, label: "Written by", value: author.url ? <Link href={author.url} className={BODY_LINK}>{author.label}</Link> : author.label },
    { icon: Calendar, label: "Published", value: <time dateTime={p.date}>{p.dateLabel}</time> },
    { icon: Clock, label: "Reading time", value: `${model.minutes} min read` },
    ...(p.category ? [{ icon: Tag, label: "Topic", value: p.category }] : []),
    ...(relatedHref ? [{ icon: Stethoscope, label: "Related page", value: <Link href={relatedHref} className={BODY_LINK}>{relatedService?.name ?? relatedName}</Link> }] : []),
  ];

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
      <JsonLd
        data={articleSchema({
          title: p.title,
          description: p.seo.description,
          date: p.date,
          image: p.image.src,
          path,
          author: { name: author.name, credential: author.credential, jobTitle: author.jobTitle, url: author.url, image: author.image?.src },
          publisher: s.legalName,
          wordCount: model.words,
          minutes: model.minutes,
          section: p.category,
        })}
      />
      {model.faq?.items.length ? <JsonLd data={faqPageSchema(model.faq.items.map((f) => ({ question: f.question, answer: stripMarks(f.answer) })))} /> : null}
      <article className="bg-white" data-progress>
        {/* Hero: the site's dark band. Photo first on phones (edge to edge, fading into the text); text left and photo right on desktop. */}
        <header className="relative overflow-hidden bg-black text-white">
          {/* A still gradient: the site's drifting one repaints every frame and costs a second of main-thread time on phones. */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#161616] to-[#2a2000] opacity-90" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,184,51,0.16),transparent_55%)]" />
          <div className="relative z-10 mx-auto max-w-6xl lg:px-4">
            <div className="grid items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)] lg:gap-12 lg:py-16">
              <figure className={`relative ${hero.aspect} lg:order-2 lg:overflow-hidden lg:rounded-3xl lg:shadow-2xl lg:ring-1 lg:ring-white/10`}>
                <Image src={p.image.src} alt={p.image.alt} fill priority fetchPriority="high" sizes="(min-width: 1024px) 520px, 100vw" className={`object-cover ${hero.position}`} />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent lg:hidden" aria-hidden="true" />
              </figure>
              <div className="px-4 pb-12 pt-5 lg:order-1 lg:px-0 lg:py-0">
                {p.category ? (
                  <span className="blog-rise inline-flex items-center rounded-full border border-secondary/60 bg-secondary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-secondary">{p.category}</span>
                ) : null}
                <h1 className="blog-rise blog-rise-2 mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">{p.title}</h1>
                {/* Byline card: the author (linked to her page), her role, the date and the reading time. Spans, so the first <p> on the page is the answer. */}
                <div className="blog-rise blog-rise-3 mt-7 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:inline-flex sm:pr-7">
                  {author.image ? <Image src={author.image.src} alt="" width={56} height={56} sizes="56px" className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-secondary" /> : null}
                  <div className="text-sm leading-snug">
                    <span className="block font-semibold">
                      By{" "}
                      {author.url ? (
                        <Link href={author.url} className="underline decoration-secondary/60 underline-offset-4 transition-colors hover:text-secondary">
                          {author.label}
                        </Link>
                      ) : (
                        author.label
                      )}
                    </span>
                    {author.role ? <span className="mt-0.5 block text-white/70">{author.role}</span> : null}
                    <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-white/80">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-secondary" aria-hidden="true" />
                        <time dateTime={p.date}>{p.dateLabel}</time>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-secondary" aria-hidden="true" />
                        {model.minutes} min read
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="lg:grid lg:grid-cols-[minmax(0,720px)_300px] lg:justify-center lg:gap-14">
            <div className="mx-auto w-full max-w-[720px] lg:mx-0">
              {/* In short: the direct answer, the first paragraph of the article. */}
              {model.answer ? (
                <div className="rounded-2xl border-l-4 border-secondary bg-secondary/10 px-6 py-6 md:px-8 md:py-7">
                  <span className={`${EYEBROW} mb-2 block`}>In short</span>
                  <p className="text-lg leading-[1.65] text-black md:text-[1.3rem] md:leading-[1.6]">
                    <Inline text={model.answer} linkClassName={BODY_LINK} />
                  </p>
                </div>
              ) : null}

              {/* Jump links on phones (the desktop copy is in the side column). */}
              {model.toc.length ? (
                <details className="group mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm lg:hidden">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 font-heading font-bold text-black [&::-webkit-details-marker]:hidden">
                    <ListChecks className="h-5 w-5 text-secondary" aria-hidden="true" />
                    In this article
                    <ChevronDown className="ml-auto h-5 w-5 text-gray-500 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <nav aria-label="In this article" className="px-3 pb-4">
                    <Toc items={model.toc} />
                  </nav>
                </details>
              ) : null}

              <div className="mt-8">
                <Blocks blocks={model.lead} />
              </div>

              <ArticleBody model={model} band={band} phone={s.phone} phoneHref={s.phoneHref} button={button} />

              {/* The post's own call to action. */}
              <div className="relative mt-14 overflow-hidden rounded-2xl bg-black bg-[radial-gradient(circle_at_top_right,rgba(229,184,51,0.14),transparent_45%)] p-8 text-white md:p-10" data-reveal>
                {p.cta.heading ? <h2 className="relative z-10 mb-4 font-heading text-2xl font-bold text-secondary md:text-3xl">{p.cta.heading}</h2> : null}
                <p className="relative z-10 mb-8 text-[17px] leading-[1.75] text-white/90 md:text-[18px]">
                  <Inline text={p.cta.text} boldClassName="font-bold" linkClassName="text-secondary underline decoration-secondary/50 underline-offset-4 transition-colors hover:text-white" />
                </p>
                <div className="relative z-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                  <Link
                    href={p.cta.buttonHref}
                    data-track="book_appointment"
                    className={`${btnGold} rounded-lg px-8 py-6 text-lg font-bold shadow-[0_4px_14px_rgba(229,184,51,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(229,184,51,0.5)]`}
                  >
                    {p.cta.buttonLabel}
                  </Link>
                  <a href={s.phoneHref} data-track="click_to_call" className="inline-flex items-center justify-center px-4 py-3 text-xl font-bold text-white transition-colors hover:text-secondary">
                    <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                    {s.phone}
                  </a>
                </div>
              </div>

              {/* The page this post supports, plus the other service pages it links to. */}
              {relatedHref ? (
                <aside aria-label="Related" className="mt-10">
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg sm:flex" data-reveal>
                    {relatedImage ? (
                      <div className="relative aspect-[16/9] shrink-0 sm:aspect-auto sm:w-2/5">
                        <Image src={relatedImage.src} alt={relatedImage.alt} fill loading="lazy" sizes="(min-width: 640px) 290px, 100vw" className={`object-cover ${photoFrame(relatedImage).position}`} />
                      </div>
                    ) : (
                      <div className="flex shrink-0 items-center justify-center bg-black p-8 sm:w-2/5">
                        <Stethoscope className="h-14 w-14 text-secondary" aria-hidden="true" />
                      </div>
                    )}
                    <div className="p-6 md:p-8">
                      <p className={EYEBROW}>Related</p>
                      <p className="mt-2 font-heading text-xl font-bold text-black">{relatedName}</p>
                      {relatedService?.sub ? <p className="mt-2 leading-relaxed text-gray-600">{relatedService.sub}</p> : null}
                      <Link href={relatedHref} className={`${BTN_OUTLINE} mt-5`}>
                        Explore {relatedService?.heading ?? relatedName}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                  {relatedServices.length ? (
                    <div className="mt-5">
                      <p className={`${EYEBROW} mb-3`}>Related services</p>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {relatedServices.map((sv) => (
                          <li key={sv.slug}>
                            <Link
                              href={`/services/${sv.slug}/`}
                              className="group flex h-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-black shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-md"
                            >
                              {sv.name}
                              <ArrowRight className="h-4 w-4 shrink-0 text-secondary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </aside>
              ) : null}

              {/* About the author, in the About page's own words. */}
              {author.url ? (
                <aside aria-label="About the author" className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8" data-reveal>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    {author.image ? <Image src={author.image.src} alt={author.image.alt} width={112} height={112} sizes="112px" className="h-28 w-28 shrink-0 rounded-2xl object-cover shadow-md ring-4 ring-white" /> : null}
                    <div>
                      <p className={EYEBROW}>About the author</p>
                      <p className="mt-2 font-heading text-xl font-bold text-black">{author.label}</p>
                      {author.role ? <p className="text-sm text-gray-600">{author.role}</p> : null}
                      {author.bio ? <p className="mt-3 leading-relaxed text-gray-700">{author.bio}</p> : null}
                      <Link href={author.url} className={`${BTN_OUTLINE} mt-5`}>
                        More about {author.shortName}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </aside>
              ) : null}

              <div className="mt-10 border-t border-gray-200 pt-8">
                <p className="text-sm italic leading-relaxed text-gray-600">{p.disclaimer}</p>
              </div>
            </div>

            {/* Desktop side column: jump links and quick facts, pinned while reading. */}
            <aside className="hidden lg:block" aria-label="About this article">
              <div className="sticky top-32 space-y-6">
                {model.toc.length ? (
                  <nav aria-labelledby="toc-title" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p id="toc-title" className="mb-3 flex items-center gap-2 px-2 font-heading text-base font-bold text-black">
                      <ListChecks className="h-5 w-5 text-secondary" aria-hidden="true" />
                      In this article
                    </p>
                    <Toc items={model.toc} />
                  </nav>
                ) : null}
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                  <p className="mb-4 font-heading text-base font-bold text-black">Quick facts</p>
                  <dl className="space-y-3.5 text-sm">
                    {facts.map((f) => (
                      <div key={f.label} className="flex items-start gap-3">
                        <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-gray-600">{f.label}</dt>
                          <dd className="mt-0.5 font-medium text-gray-800">{f.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* More from the blog: the same topic first. Hidden when there is nothing else to read. */}
        {more.length ? (
          <section aria-labelledby="more-posts" className="border-t border-gray-100 bg-gray-50 px-4 py-14 md:py-20">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <h2 id="more-posts" className="font-heading text-2xl font-bold text-black md:text-3xl">
                  More from the blog
                </h2>
                <Link href="/blog/" className="font-bold text-black underline decoration-secondary decoration-2 underline-offset-4 transition-colors hover:text-gold-hover">
                  {b.backLink}
                </Link>
              </div>
              <ul className="grid gap-6 md:grid-cols-3">
                {more.map((x) => (
                  <li key={x.slug} data-reveal>
                    <PostCard post={x} author={postAuthor(x.author, about.dentist)} compact sizes="(min-width: 1152px) 352px, (min-width: 768px) 30vw, 100vw" />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
        <script dangerouslySetInnerHTML={{ __html: progressScript }} />
      </article>
    </>
  );
}
