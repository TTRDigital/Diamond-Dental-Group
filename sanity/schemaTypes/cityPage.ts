import { defineArrayMember, defineField, defineType } from "sanity";

/*
 * Sanity document type `cityPage`: a page at the site's top level (/family-dentist-roseville/) written by TTR OS's SEO
 * engine for a city page (and any other non-blog page it writes, since TTR OS uses one page type for all of them).
 *
 * TTR OS saves the page as a DRAFT only (_id drafts.ttr-seo-<piece id>), with exactly these fields:
 *   _type "cityPage", title, path "/<slug>/", slug { current }, body (Portable Text, from its Markdown),
 *   seo { title, description, canonical, publishedTime, modifiedTime, schema }, and optionally mainImage (altImage)
 *   and photo blocks in body.
 * The page shows on the signed /api/preview link (Draft Mode); it goes live only when someone publishes it in /cms.
 * Rendered by app/[slug]/page.vercel.tsx.
 */
export const cityPage = defineType({
  name: "cityPage",
  title: "City page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", description: "The page's main heading. A trailing \"| Diamond Dental Group\" is left out of the heading.", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
      description: "The page lives at /<slug>/. Changing it changes the page address.",
    }),
    defineField({
      name: "path",
      title: "Page address",
      type: "string",
      readOnly: true,
      description: "Written by TTR OS (/<slug>/), which finds the page by it.",
    }),
    defineField({ name: "mainImage", title: "Photo", type: "altImage", description: "Optional. Shown next to the heading. The practice's own photos only." }),
    defineField({
      name: "author",
      title: "Byline",
      type: "string",
      description: "Leave empty for the practice's dentist (her credential, photo and About page link are added).",
    }),
    defineField({
      name: "body",
      title: "Page text",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
          ],
          lists: [
            { title: "Bullets", value: "bullet" },
            { title: "Numbers", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                title: "Link",
                type: "object",
                fields: [defineField({ name: "href", title: "Link", type: "string", description: "A page on this site like /contact/, or a full URL." })],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        }),
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "path", media: "mainImage" } },
});
