import type { Faq, Img, Post, PostSection, RichBlock } from "@/lib/types";
import { stripMarks } from "@/lib/text";

/*
 * How a post is laid out on the page: the direct answer, the jump links, every section with its extras (a photo,
 * numbered steps, a call to action line), the FAQ cards and the reading time. Pure functions over the post data:
 * the approved text is never changed, only arranged.
 */

export const WORDS_PER_MINUTE = 220;

const textOf = (b: RichBlock) => (b.style === "ul" || b.style === "ol" ? b.items.join(" ") : b.text);

export const wordCount = (blocks: RichBlock[]) => blocks.reduce((n, b) => n + stripMarks(textOf(b)).split(/\s+/).filter(Boolean).length, 0);

export const readingMinutes = (words: number) => Math.max(1, Math.round(words / WORDS_PER_MINUTE));

/** Anchor id for a heading ("What happens to the jawbone?" -> what-happens-to-the-jawbone), unique within the post. */
export function headingId(text: string, used: Set<string>): string {
  const base =
    stripMarks(text)
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
  let id = base;
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
}

export type ArticleSection = { id: string; heading: string; blocks: RichBlock[]; extras?: PostSection };
export type FaqSection = { id: string; heading: string; intro: RichBlock[]; items: Faq[] };
export type ArticleModel = {
  /** The first paragraph, the direct answer: shown in the In short box, first in the DOM. */
  answer?: string;
  /** The rest of the text before the first heading. */
  lead: RichBlock[];
  sections: ArticleSection[];
  faq?: FaqSection;
  /** Every heading in order, for the jump links. */
  toc: { id: string; text: string }[];
  words: number;
  minutes: number;
};

const FAQ_HEADING = /^(frequently asked questions|faqs?)\b/i;
/** A FAQ paragraph: the bold question first, then the answer. */
const FAQ_ITEM = /^\*\*(.+?)\*\*\s*([\s\S]*)$/;

const same = (a: string, b: string) => stripMarks(a).trim().toLowerCase() === stripMarks(b).trim().toLowerCase();

export function articleModel(p: Post): ArticleModel {
  const used = new Set<string>();
  const lead: RichBlock[] = [];
  const sections: ArticleSection[] = [];
  const toc: { id: string; text: string }[] = [];
  let current: ArticleSection | undefined;
  for (const b of p.body) {
    if (b.style === "h2") {
      const id = headingId(b.text, used);
      current = { id, heading: b.text, blocks: [], extras: p.sections?.find((s) => same(s.heading, b.text)) };
      sections.push(current);
      toc.push({ id, text: b.text });
    } else (current ? current.blocks : lead).push(b);
  }
  // The FAQ section (one paragraph per question: the bold question, then the answer) becomes cards and FAQPage schema.
  let faq: FaqSection | undefined;
  const fi = sections.findIndex((s) => FAQ_HEADING.test(s.heading.trim()) && s.blocks.some((b) => b.style === "p" && FAQ_ITEM.test(b.text)));
  if (fi >= 0) {
    const s = sections[fi];
    const items: Faq[] = [];
    const intro: RichBlock[] = [];
    for (const b of s.blocks) {
      const m = b.style === "p" ? b.text.match(FAQ_ITEM) : null;
      if (m) items.push({ question: m[1].trim(), answer: m[2].trim() });
      else intro.push(b);
    }
    faq = { id: s.id, heading: s.heading, intro, items };
    sections.splice(fi, 1);
  }
  const answer = lead[0]?.style === "p" ? lead[0].text : undefined;
  const words = wordCount(p.body);
  return { answer, lead: answer ? lead.slice(1) : lead, sections, faq, toc, words, minutes: readingMinutes(words) };
}

/** Lists short enough to show as a grid of cards with a check icon (2 to 8 items of at most 170 characters). */
export const isCardList = (items: string[]) => items.length >= 2 && items.length <= 8 && items.every((it) => stripMarks(it).length <= 170);

export type Step = { label?: string; text: string };

/** The paragraphs of a steps section. A short first sentence ("Numbing.") is the step's label; every word stays as written. */
export function stepItems(blocks: RichBlock[]): Step[] {
  const steps: Step[] = [];
  for (const b of blocks) {
    if (b.style !== "p") continue;
    const m = b.text.match(/^([^.!?:]{2,48}[.:])\s+(\S[\s\S]*)$/);
    steps.push(m ? { label: m[1], text: m[2] } : { text: b.text });
  }
  return steps;
}

/** Service pages the text links to (for the Related services cards), without the page the post supports. */
export function linkedServices(blocks: RichBlock[], exclude?: string): string[] {
  const out: string[] = [];
  for (const b of blocks) for (const m of textOf(b).matchAll(/\]\((\/services\/[a-z0-9-]+\/)\)/g)) if (m[1] !== exclude && !out.includes(m[1])) out.push(m[1]);
  return out;
}

export type CtaBand = { before: string; text: string };

/** The mid-article call to action: above the section that asks for one, else after the third heading's section. */
export function ctaBand(sections: ArticleSection[], fallback?: string): CtaBand | undefined {
  const own = sections.find((s) => s.extras?.cta?.trim());
  if (own?.extras?.cta) return { before: own.id, text: own.extras.cta.trim() };
  if (!fallback?.trim() || sections.length < 4) return undefined;
  return { before: sections[3].id, text: fallback.trim() };
}

/** Frame and focus for a photo shown in a wide box: portraits keep their upper part, headshots keep the face. */
export function photoFrame(img: Img): { aspect: string; position: string } {
  const r = img.width / img.height;
  if (r < 0.9) return { aspect: "aspect-[4/3]", position: "object-[center_30%]" };
  if (r < 1.2) return { aspect: "aspect-[4/3]", position: "object-[center_20%]" };
  return { aspect: "aspect-[16/10]", position: "object-center" };
}

/** Up to three other posts: the same topic first, then the newest. */
export function morePosts(all: Post[], current: Post, n = 3): Post[] {
  const others = all.filter((x) => x.slug !== current.slug);
  const sameTopic = current.category ? others.filter((x) => x.category === current.category) : [];
  return [...sameTopic, ...others.filter((x) => !sameTopic.includes(x))].slice(0, n);
}
