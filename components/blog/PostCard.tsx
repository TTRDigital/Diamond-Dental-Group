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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        <Image src={p.image.src} alt={p.image.alt} fill priority={priority} fetchPriority={priority ? "high" : undefined} sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {p.category ? <span className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-sm">{p.category}</span> : null}
      </div>
      <div className="flex grow flex-col p-6">
        <Title className={`${compact ? "text-lg" : "text-xl"} font-heading font-bold leading-snug text-black transition-colors group-hover:text-gold-hover`}>{p.title}</Title>
        {!compact ? <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-gray-600">{p.excerpt}</p> : null}
        <div className="mt-auto flex items-center gap-3 pt-5">
          {author.image ? <Image src={author.image.src} alt="" width={36} height={36} sizes="36px" className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-secondary/60" /> : null}
          <div className="text-sm leading-tight">
            <p className="font-semibold text-gray-800">{author.shortName}</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-gray-600">
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
          <span className="mt-4 inline-flex items-center text-sm font-bold text-black">
            {readMore}
            <ArrowRight className="ml-2 h-4 w-4 text-secondary transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </Link>
  );
}
