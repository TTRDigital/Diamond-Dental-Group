/** Inline markup used in paragraphs: **bold** and [label](/link/). */
export const stripMarks = (s: string) => s.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

/** The first n sentences of a text. A title like "Dr." or "Mr." does not end a sentence. */
export function firstSentences(text: string, n: number): string {
  const re = /[.!?]+(?=\s|$)/g;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (/\b(?:Dr|Mr|Mrs|Ms|St|No|vs)$/.test(text.slice(0, m.index))) continue;
    if (++count === n) return text.slice(0, m.index + m[0].length).trim();
  }
  return text.trim();
}

/** Title-case a URL slug, the way the live site labels the last breadcrumb ("all-on-x" -> "All On X"). */
export const slugLabel = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
