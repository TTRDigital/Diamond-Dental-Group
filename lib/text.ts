/** Inline markup used in paragraphs: **bold** and [label](/link/). */
export const stripMarks = (s: string) => s.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

/** Title-case a URL slug, the way the live site labels the last breadcrumb ("all-on-x" -> "All On X"). */
export const slugLabel = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
