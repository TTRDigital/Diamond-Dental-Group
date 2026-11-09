/**
 * Sanity document type `landingPage` for the Google Ads pages (/offer, /implant). One document per page, ID
 * `landingPage.<slug>`. Empty fields keep the built-in text, so a page can never go blank. The ad site reads it at
 * build time (ad-landing-pages/scripts/build.mjs). To use it in the Studio, import this file in
 * sanity/schemaTypes/documents.ts and add `landingPage` to documentTypes (a one-line change in the main site).
 */
import { defineArrayMember, defineField, defineType } from "sanity";

const s = (name: string, title: string, description?: string) => defineField({ name, title, type: "string", description });
const t = (name: string, title: string, description?: string) => defineField({ name, title, type: "text", rows: 3, description });
const strs = (name: string, title: string) => defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })] });
const obj = (name: string, title: string, fields: ReturnType<typeof defineField>[]) => defineField({ name, title, type: "object", fields, options: { collapsible: true, collapsed: true } });

export const landingPage = defineType({
  name: "landingPage",
  title: "Ad landing page",
  type: "document",
  fields: [
    s("internalTitle", "Internal title"),
    defineField({ name: "slug", title: "Page (offer or implant)", type: "slug", validation: (r) => r.required(), description: "Must stay offer or implant." }),
    s("title", "Browser / Google title"),
    t("description", "Meta description"),
    obj("seo", "Search engines", [defineField({ name: "noindex", title: "Hide from search engines (noindex)", type: "boolean", initialValue: true })]),
    s("headerCta", "Header button"),
    obj("hero", "Hero", [s("h1", "Headline"), s("eyebrow", "Small line above the offer"), s("big", "Big offer text"), s("sub", "Line under the offer"), s("cta", "Button"), s("note", "Note under the button"), defineField({ name: "noteCaps", title: "Note in capitals", type: "boolean" }), s("imageAlt", "Photo description")]),
    obj("offer", "Offer card", [s("h2", "Heading"), t("intro", "Intro"), s("badge", "Badge"), s("was", "Top line"), s("now", "Price / offer line"), s("save", "Savings line"), strs("checks", "What is included"), s("cta", "Button")]),
    obj("extra", "Second section", [s("h2", "Heading"), t("intro", "Intro"), defineField({ name: "cards", title: "Cards", type: "array", of: [defineArrayMember({ type: "object", fields: [s("deal", "Deal"), s("title", "Title"), t("text", "Text")] })] }), obj("button", "Button", [s("label", "Label")])]),
    obj("membership", "Insurance / membership (offer page)", [s("heading", "Heading"), s("ppo", "PPO line"), s("noInsurance", "No insurance heading"), s("price", "Price"), s("label", "List label"), strs("items", "Plan includes")]),
    obj("doctor", "Dentist", [s("name", "Name"), t("bio", "Bio"), t("quote", "Quote"), strs("checks", "Credentials")]),
    obj("urgency", "Closing banner", [s("h2", "Heading"), t("text", "Text"), s("cta", "Button")]),
    defineField({ name: "faqHeading", title: "FAQ heading", type: "string" }),
    defineField({ name: "faq", title: "FAQ", type: "array", of: [defineArrayMember({ type: "object", fields: [s("question", "Question"), t("answer", "Answer")] })] }),
    s("mobileCta", "Mobile bottom button"),
    obj("form", "Lead form text", [s("title", "Title"), t("intro", "Intro"), s("offerValue", "Offer name sent with the lead"), s("consent", "Consent checkbox text"), s("submit", "Submit button"), t("thanksText", "Thank-you text")]),
  ],
  preview: { select: { title: "internalTitle", subtitle: "title" } },
});
