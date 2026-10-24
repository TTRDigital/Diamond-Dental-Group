import Link from "next/link";
import type { ReactNode } from "react";

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
