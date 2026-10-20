import Link from "next/link";
import type { ReactNode } from "react";
import type { RichBlock } from "@/lib/types";

const LINK = "text-secondary underline decoration-secondary/40 hover:decoration-secondary underline-offset-2 transition-colors";

/** Inline markup: **bold** and [label](/link/). Internal links use next/link; tel:, mailto: and https: links are plain. */
export function Inline({ text, linkClassName = LINK, boldClassName = "font-bold text-black" }: { text: string; linkClassName?: string; boldClassName?: string }) {
  const parts: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(
        <strong key={n++} className={boldClassName}>
          {m[1]}
        </strong>,
      );
    } else {
      const href = m[3];
      parts.push(
        href.startsWith("/") ? (
          <Link key={n++} href={href} className={linkClassName}>
            {m[2]}
          </Link>
        ) : (
          <a key={n++} href={href} className={linkClassName}>
            {m[2]}
          </a>
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Article body (blog posts), styled like the live posts. */
export function ArticleBody({ blocks }: { blocks: RichBlock[] }) {
  return (
    <div className="blog-body">
      {blocks.map((b, i) => {
        if (b.style === "h2")
          return (
            <h2 key={i} className="text-2xl md:text-3xl font-bold text-black mt-12 mb-5 leading-tight md:leading-9 scroll-mt-32">
              {b.text}
            </h2>
          );
        if (b.style === "ul" || b.style === "ol") {
          const List = b.style;
          return (
            <List key={i} className={`${b.style === "ul" ? "list-disc" : "list-decimal"} pl-6 mb-6 space-y-2.5 text-[17px] md:text-[18px] text-gray-700 leading-[1.7]`}>
              {b.items.map((it, j) => (
                <li key={j} className="pl-1">
                  <Inline text={it} />
                </li>
              ))}
            </List>
          );
        }
        return (
          <p key={i} className="text-[17px] md:text-[18px] text-gray-700 mb-6 leading-[1.75]">
            <Inline text={b.text} />
          </p>
        );
      })}
    </div>
  );
}
