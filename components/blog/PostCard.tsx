import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Post } from "@/lib/types";
import type { Author } from "@/lib/author";
import { readingMinutes, wordCount } from "@/lib/post-design";

/** A post in a grid: photo, topic pill, title, excerpt (not when compact), author, date and reading time. */
export function PostCard({ post: p, author, readMore, priority = false, compact = false, sizes }: { post: Post; author: Author; readMore?: string; priority?: boolean; compact?: boolean; sizes: string }) {
  const minutes = readingMinutes(wordCount(p.body));
  const Title = compact ? "h3" : "h2";
  return (
    <Link
      href={`/blog/${p.slug}/`}
      className="card-hover group flex h-full flex-col overflow-hidden rounded-lg bg-ivory ring-1 ring-ink-900/5"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-sand">
        <Image src={p.image.src} alt={p.image.alt} fill priority={priority} fetchPriority={priority ? "high" : undefined} sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {p.category ? <span className="absolute left-4 top-4 rounded-full bg-night-900 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-gold-300">{p.category}</span> : null}
      </div>
      <div className="flex grow flex-col p-6">
        <Title className={`${compact ? "text-lg" : "text-xl"} font-semibold leading-snug text-ink-900 transition-colors group-hover:text-gold-700`}>{p.title}</Title>
        {!compact ? <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-grey-700">{p.excerpt}</p> : null}
        <div className="mt-auto flex items-center gap-3 pt-5">
          {author.image ? <Image src={author.image.src} alt={author.image.alt || author.label} width={36} height={36} sizes="36px" className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-gold-300/60" /> : null}
          <div className="text-sm leading-tight">
            <p className="font-semibold text-ink-900">{author.shortName}</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-grey-600">
              <time dateTime={p.date}>{p.dateLabel}</time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {minutes} min read
              </span>
            </p>
          </div>
        </div>
        {readMore ? (
          <span className="link-arrow mt-4 text-sm">
            {readMore}
            <ArrowRight className="arrow-nudge h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </Link>
  );
}
