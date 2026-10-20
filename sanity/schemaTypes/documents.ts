import { defineArrayMember, defineField, defineType } from "sanity";
import { group, img, paragraphs, str, strings, txt } from "./objects";

/*
 * Documents mirror the built-in content in lib/data (same field names), so
 * scripts/seed.ts can load it and lib/content.ts can merge CMS values over
 * it. An empty field falls back to the built-in text.
 */

const seoField = defineField({ name: "seo", title: "SEO", type: "seo" });
const list = (name: string, title: string, type: string) => defineField({ name, title, type: "array", of: [defineArrayMember({ type })] });
const slugField = defineField({
  name: "slug",
  title: "URL slug",
  type: "slug",
  validation: (r) => r.required(),
  description: "Changing it changes the page address. Keep the old one unless a redirect is added in .htaccess.",
});
const orderField = defineField({ name: "order", title: "Order", type: "number" });

/* ---------- Settings ---------- */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "practice", title: "Practice", default: true },
    { name: "hours", title: "Hours" },
    { name: "menus", title: "Menus & footer" },
  ],
  fields: [
    defineField({ ...str("name", "Practice name"), group: "practice" }),
    defineField({ ...str("legalName", "Business name (Google / schema)"), group: "practice" }),
    defineField({ ...str("phone", "Phone", "e.g. (916) 755-4769. Every call link uses this number."), group: "practice" }),
    defineField({ ...str("email", "Email"), group: "practice" }),
    defineField({ ...str("street", "Street address"), group: "practice" }),
    defineField({ ...str("city", "City"), group: "practice" }),
    defineField({ ...str("region", "State"), group: "practice" }),
    defineField({ ...str("postalCode", "ZIP code"), group: "practice" }),
    defineField({ ...str("country", "Country"), group: "practice" }),
    defineField({ name: "latitude", type: "number", group: "practice" }),
    defineField({ name: "longitude", type: "number", group: "practice" }),
    defineField({ ...str("mapsUrl", "Google Maps link"), group: "practice" }),
    defineField({ ...str("mapQuery", "Map strip search text", "What the map above the footer shows."), group: "practice" }),
    defineField({ ...str("bookingUrl", "Online scheduler link", "The Jarvis Analytics scheduler shown on the Contact page."), group: "practice" }),
    defineField({ ...img("logo", "Logo"), group: "practice" }),
    defineField({ ...txt("tagline", "Footer text"), group: "practice" }),
    defineField({ name: "hours", title: "Office hours", type: "array", group: "hours", of: [defineArrayMember({ type: "dayHours" })] }),
    defineField({ name: "headerCta", title: "Header button", type: "link", group: "menus" }),
    defineField({ ...str("mobileBookLabel", "Phone 'Book' bar label"), group: "menus" }),
    defineField({
      name: "menu",
      title: "Main menu",
      type: "array",
      group: "menus",
      description: "The item linking to /services/ opens the services menu, built from the Services documents (their Group field).",
      of: [defineArrayMember({ type: "link" })],
    }),
    defineField({ name: "footerLinks", title: "Footer Quick Links", type: "array", group: "menus", of: [defineArrayMember({ type: "link" })] }),
    defineField({ name: "legalLinks", title: "Footer small links", type: "array", group: "menus", of: [defineArrayMember({ type: "link" })] }),
    defineField({
      name: "social",
      title: "Social links",
      type: "array",
      group: "menus",
      description: "Shown as icons in the footer. Add the practice's real profile links.",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [defineField({ name: "network", type: "string", options: { list: ["facebook", "instagram"] } }), str("href", "Link")],
          preview: { select: { title: "network", subtitle: "href" } },
        }),
      ],
    }),
    defineField({ ...str("copyright", "Copyright line"), group: "menus" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

/* ---------- Pages (singletons) ---------- */

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  fields: [
    group("hero", "Banner", [str("heading", "Heading (H1)"), txt("text"), str("button"), str("note"), img("image", "Photo")]),
    defineField({
      name: "trust",
      title: "Trust strip",
      type: "array",
      description: "Text starting with [PLACEHOLDER is hidden until it is confirmed.",
      of: [
        defineArrayMember({
          type: "object",
          name: "trustItem",
          fields: [str("text"), defineField({ name: "icon", type: "string", options: { list: ["stars", "shieldCheck", "clock", "mapPin", "star", "shield", "circleCheck"] } })],
          preview: { select: { title: "text" } },
        }),
      ],
    }),
    group("why", "Why choose us", [str("heading"), list("items", "Cards", "iconFeature")]),
    group("journey", "How it works", [str("eyebrow"), str("heading"), list("items", "Steps", "iconFeature")]),
    group("featured", "Featured services", [str("heading"), list("items", "Cards", "serviceCard"), str("button"), str("buttonHref", "Button link")]),
    group("offers", "Grand opening offers", [
      str("heading"),
      txt("text"),
      str("badge"),
      group("main", "Main offer", [str("title"), str("text"), strings("items"), str("button")]),
      list("others", "Other offers", "offer"),
      str("otherButton", "Other offers button"),
      str("footer", "Line above the phone number"),
    ]),
    group("insurance", "Insurance card", [str("heading"), txt("text"), str("link", "Link label")]),
    group("membership", "Membership card", [str("heading"), str("text", "Text before the price"), str("price"), str("textAfter", "Text after the price"), str("link", "Link label")]),
    group("dentist", "Meet your dentist", [str("eyebrow"), str("heading"), txt("text"), str("link", "Link label"), img("image", "Photo")]),
    group("reviews", "Reviews section", [str("heading"), str("rating", "Rating shown", "e.g. 5.0. Starts with [PLACEHOLDER until confirmed (then hidden).")], "Reviews themselves are under Reviews; only approved ones are shown."),
    group("cta", "Bottom call to action", [str("heading"), str("text"), str("button")]),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Home" }) },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  fields: [
    group("hero", "Banner", [str("heading", "Heading (H1)"), str("text")]),
    group("dentist", "Dentist", [str("eyebrow"), str("heading"), txt("text"), txt("quote"), strings("credentials"), img("image", "Photo")]),
    group("practice", "The practice", [str("heading"), txt("text"), list("items", "Cards", "feature")]),
    group("team", "The team", [str("heading"), txt("text"), list("items", "Cards", "iconFeature")]),
    group("cta", "Bottom call to action", [str("heading"), str("button")]),
    seoField,
  ],
  preview: { prepare: () => ({ title: "About" }) },
});

export const patientCarePage = defineType({
  name: "patientCarePage",
  title: "Patient Care",
  type: "document",
  fields: [
    group("hero", "Banner", [str("heading", "Heading (H1)"), str("text")]),
    group("special", "New patient special", [str("badge"), str("heading"), txt("text"), str("regular", "Regular value line"), str("price"), str("savings"), strings("items"), str("button")]),
    group("offers", "More offers", [str("heading"), txt("text"), list("items", "Offers", "offer"), str("button")]),
    group("insurance", "Insurance", [str("heading"), txt("text"), strings("plans", "Plans accepted"), str("notePrefix", "Note: first words"), str("noteLink", "Note: call link words"), str("noteSuffix", "Note: last words")]),
    group("membership", "Membership plan", [str("heading"), txt("text"), str("priceLabel"), str("price"), str("per"), str("includesHeading"), strings("items"), str("button")]),
    group("payment", "Payment options", [str("heading"), txt("text")]),
    group("cta", "Bottom call to action", [str("heading"), str("button")]),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Patient Care" }) },
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact",
  type: "document",
  fields: [
    str("badge"),
    str("heading", "Heading (first line)"),
    str("headingAccent", "Heading (gold second line)"),
    txt("text"),
    str("bookingTitle", "Scheduler title (for screen readers)"),
    str("directHeading", "Direct contact heading"),
    str("callLabel", "Line under the phone number"),
    str("hoursHeading", "Hours heading"),
    group("form", "Message form", [str("heading"), txt("text"), str("button")]),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Contact" }) },
});

export const blogPage = defineType({
  name: "blogPage",
  title: "Patient Education (blog)",
  type: "document",
  fields: [str("eyebrow"), str("heading", "Heading (H1)"), txt("text"), str("readMore", "Card link label"), str("backLink", "Back link on posts"), group("cta", "Bottom call to action", [str("heading"), txt("text"), str("button")]), seoField],
  preview: { prepare: () => ({ title: "Patient Education" }) },
});

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services hub",
  type: "document",
  fields: [
    str("heading", "Heading (H1)"),
    txt("text"),
    str("cardLink", "Card link label"),
    group("template", "Labels on every service page", [
      str("badge"),
      str("primaryButton", "Banner button"),
      str("whatItIsHeading"),
      str("rightForYouHeading"),
      str("faqHeading"),
      str("offerLabel"),
      str("offerButton"),
      str("stepsHeading"),
      list("steps", "Steps", "feature"),
      str("ctaHeading"),
      str("ctaButton"),
    ]),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Services hub" }) },
});

export const privacyPage = defineType({
  name: "privacyPage",
  title: "Privacy policy",
  type: "document",
  fields: [str("badge"), str("heading", "Heading (H1)"), str("updated", "Last updated line"), txt("intro"), list("body", "Body", "richBlock"), txt("contactIntro", "Line above the address box"), seoField],
  preview: { prepare: () => ({ title: "Privacy policy" }) },
});

export const thankYouPage = defineType({
  name: "thankYouPage",
  title: "Thank you",
  type: "document",
  fields: [str("heading", "Heading (H1)"), txt("text"), str("callButton"), str("homeButton"), seoField],
  preview: { prepare: () => ({ title: "Thank you" }) },
});

/* ---------- Collections ---------- */

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ ...str("name", "Name in menus"), validation: (r) => r.required() }),
    defineField({ ...slugField, options: { source: "name" } }),
    orderField,
    defineField({ name: "group", title: "Menu group", type: "string", options: { list: ["Cosmetic", "Implants & Restorative", "General & Preventive"] } }),
    str("heading", "Heading (H1)", "e.g. Invisalign"),
    str("headingSuffix", "Gold second line", "e.g. in Roseville, CA"),
    txt("sub", "Intro line"),
    img("heroImage", "Banner photo"),
    paragraphs("whatItIs", "Understanding the treatment"),
    strings("rightForYou", "Is this right for you? (points)"),
    defineField({ name: "faqs", title: "Common questions", type: "array", of: [defineArrayMember({ type: "faqItem" })] }),
    group("offer", "Grand opening offer (optional)", [str("amount"), str("title")]),
    seoField,
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "group", media: "heroImage" } },
});

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({ ...str("title", "Title (H1)"), validation: (r) => r.required() }),
    defineField({ ...slugField, options: { source: "title" } }),
    defineField({ name: "date", type: "date", validation: (r) => r.required() }),
    str("dateLabel", "Date as shown", "e.g. August 20, 2026"),
    txt("excerpt", "Card text"),
    img("image", "Photo"),
    list("body", "Article", "richBlock"),
    group("cta", "Call to action box", [str("heading", "Heading (optional)"), txt("text", "Text", "[words](/contact/) makes a link."), str("buttonLabel"), str("buttonHref", "Button link")]),
    txt("disclaimer"),
    seoField,
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "dateLabel", media: "image" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Review",
  type: "document",
  fields: [
    txt("quote"),
    str("name", "Name as shown", "e.g. Sarah M."),
    defineField({ name: "rating", type: "number", initialValue: 5, validation: (r) => r.min(1).max(5) }),
    defineField({
      name: "approved",
      title: "Real review, OK to publish",
      type: "boolean",
      initialValue: false,
      description: "Only switch on for a genuine review the patient agreed to share. The reviews section stays hidden until at least one is on.",
    }),
    orderField,
  ],
  preview: { select: { title: "name", subtitle: "quote" } },
});


export const singletonTypes = new Set(["siteSettings", "homePage", "aboutPage", "patientCarePage", "contactPage", "blogPage", "servicesPage", "privacyPage", "thankYouPage"]);

export const documentTypes = [siteSettings, homePage, aboutPage, patientCarePage, contactPage, blogPage, servicesPage, privacyPage, thankYouPage, service, post, testimonial];
