import { defineArrayMember, defineField, defineType } from "sanity";
import { iconNames } from "../icons";

/* ---------- Field helpers (keep the document schemas short and consistent) ---------- */

export const str = (name: string, title?: string, description?: string) => defineField({ name, title, type: "string", description });
export const txt = (name: string, title?: string, description?: string) => defineField({ name, title, type: "text", rows: 3, description });
export const img = (name: string, title?: string, description?: string) => defineField({ name, title, type: "altImage", description });
export const strings = (name: string, title?: string, description?: string) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })], description });
export const paragraphs = (name: string, title?: string) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "text", rows: 4 })], description: "One box per paragraph." });
export const group = (name: string, title: string, fields: ReturnType<typeof defineField>[], description?: string) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: false }, fields, description });
export const icon = defineField({ name: "icon", type: "string", options: { list: [...iconNames] } });

/* ---------- Object types ---------- */

/** SEO fields on every page. Lengths are warnings, not hard errors. */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "SEO title", type: "string", description: "Shown in Google and the browser tab.", validation: (r) => r.max(90).warning("Long titles may be cut off in Google.") }),
    defineField({ name: "description", title: "Meta description", type: "text", rows: 3, description: "Aim for under 155 characters.", validation: (r) => r.max(170).warning("Long descriptions may be cut off in Google.") }),
    defineField({ name: "image", title: "Social share image", type: "altImage", description: "1200 x 630. Leave empty to use the page's main photo." }),
    defineField({ name: "noIndex", title: "Hide from search engines", type: "boolean", initialValue: false }),
  ],
});

/** Image that always has alt text. */
export const altImage = defineType({
  name: "altImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe the photo for people who cannot see it." })],
});

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", title: "Link", type: "string", description: "A page on this site like /contact/, or a full URL. tel:+19167554769 calls.", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

/** Title + text (cards, steps). */
export const feature = defineType({
  name: "feature",
  title: "Item",
  type: "object",
  fields: [str("title"), txt("text")],
  preview: { select: { title: "title", subtitle: "text" } },
});

export const iconFeature = defineType({
  name: "iconFeature",
  title: "Item with icon",
  type: "object",
  fields: [icon, str("title"), txt("text")],
  preview: { select: { title: "title", subtitle: "icon" } },
});

export const serviceCard = defineType({
  name: "serviceCard",
  title: "Service card",
  type: "object",
  fields: [icon, str("title"), txt("text"), str("href", "Link", "e.g. /services/dental-implants/")],
  preview: { select: { title: "title", subtitle: "href" } },
});

export const offer = defineType({
  name: "offer",
  title: "Offer",
  type: "object",
  fields: [str("amount", "Amount", "e.g. $300 OFF"), str("title"), txt("text"), img("image", "Photo")],
  preview: { select: { title: "amount", subtitle: "title", media: "image" } },
});

export const faqItem = defineType({
  name: "faqItem",
  title: "Question",
  type: "object",
  fields: [str("question"), defineField({ name: "answer", type: "text", rows: 4 })],
  preview: { select: { title: "question" } },
});

/** A block of article text: paragraph, heading or list. */
export const richBlock = defineType({
  name: "richBlock",
  title: "Block",
  type: "object",
  fields: [
    defineField({
      name: "style",
      type: "string",
      options: { list: [{ title: "Paragraph", value: "p" }, { title: "Heading", value: "h2" }, { title: "Bulleted list", value: "ul" }, { title: "Numbered list", value: "ol" }], layout: "radio", direction: "horizontal" },
      initialValue: "p",
    }),
    defineField({
      name: "text",
      type: "text",
      rows: 4,
      description: "**double asterisks** make bold text; [words](/page/) makes a link.",
      hidden: ({ parent }) => parent?.style === "ul" || parent?.style === "ol",
    }),
    defineField({ name: "items", type: "array", of: [defineArrayMember({ type: "text", rows: 2 })], hidden: ({ parent }) => parent?.style !== "ul" && parent?.style !== "ol" }),
  ],
  preview: {
    select: { style: "style", text: "text", items: "items" },
    prepare: ({ style, text, items }) => ({ title: text || (items ?? []).join(" · ") || "(empty)", subtitle: { p: "Paragraph", h2: "Heading", ul: "List", ol: "Numbered list" }[style as string] }),
  },
});

export const dayHours = defineType({
  name: "dayHours",
  title: "Day",
  type: "object",
  fields: [
    str("day"),
    str("value", "Hours as shown", "e.g. 10:00 am – 7:00 pm or Closed"),
    str("opens", "Opens (24h, for Google)", "e.g. 10:00. Leave empty when closed."),
    str("closes", "Closes (24h, for Google)", "e.g. 19:00"),
  ],
  preview: { select: { title: "day", subtitle: "value" } },
});

export const objectTypes = [seo, altImage, link, feature, iconFeature, serviceCard, offer, faqItem, richBlock, dayHours];
