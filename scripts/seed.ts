/**
 * Loads the built-in content (lib/data) and its photos into Sanity, so the
 * CMS starts full instead of empty.
 *
 *   npm run seed                 # create documents that don't exist yet (add-missing)
 *   npm run seed -- --force      # overwrite with the built-in content
 *   npm run seed -- --dry-run    # build every document without uploading or writing
 *   npm run seed -- --force --only=service-invisalign,homePage  # only documents whose ID starts with these
 *
 * Writes to NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET
 * (environment or .env.local). Needs SANITY_WRITE_TOKEN (Editor token from
 * sanity.io/manage > API > Tokens). Without --force, anything an editor
 * already created is kept.
 */
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { createClient } from "@sanity/client";
import type { Img } from "../lib/types";
import { fallbackSettings, fallbackTestimonials } from "../lib/data/site.ts";
import { fallbackServices } from "../lib/data/services.ts";
import { fallbackPosts } from "../lib/data/posts.ts";
import {
  fallbackAbout,
  fallbackBlogIndex,
  fallbackContact,
  fallbackHome,
  fallbackPatientCare,
  fallbackPrivacy,
  fallbackServicesHub,
  fallbackThankYou,
} from "../lib/data/pages.ts";

const root = new URL("..", import.meta.url).pathname;

// Minimal .env.local reader so the script works without extra packages.
if (existsSync(join(root, ".env.local"))) {
  for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// Imported after .env.local is loaded so its values apply.
const { dataset, projectId } = await import("../sanity/env.ts");
const token = process.env.SANITY_WRITE_TOKEN;
const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");
// --only=homePage,service- limits the run to documents whose ID starts with one of these.
const only = (process.argv.find((a) => a.startsWith("--only="))?.slice(7) ?? "")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);

if (!dryRun && (!projectId || !token)) {
  console.error(!projectId ? "Set NEXT_PUBLIC_SANITY_PROJECT_ID (sanity/env.ts, .env.local or the workflow)." : "Set SANITY_WRITE_TOKEN (Editor token from sanity.io/manage > API > Tokens).");
  process.exit(1);
}

const client = createClient({ projectId: projectId || "dry-run", dataset, token, apiVersion: "2025-02-19", useCdn: false });

/* ---------- helpers ---------- */

let keyN = 0;
const key = () => `k${(keyN++).toString(36)}`;
const uploaded = new Map<string, string>();

async function asset(src: string) {
  if (uploaded.has(src)) return uploaded.get(src)!;
  const file = join(root, "public", src);
  if (!existsSync(file)) throw new Error(`Missing file: ${file}`);
  if (dryRun) {
    // A reference shaped like Sanity's (image-<hash>-<w>x<h>-<ext>), so a dry run also checks lib/content.ts can read it.
    const { createHash } = await import("node:crypto");
    const { default: sharp } = await import("sharp");
    const m = await sharp(file).metadata();
    uploaded.set(src, `image-${createHash("sha1").update(src).digest("hex")}-${m.width}x${m.height}-${src.split(".").pop()}`);
    return uploaded.get(src)!;
  }
  const doc = await client.assets.upload("image", createReadStream(file), { filename: basename(file) });
  uploaded.set(src, doc._id);
  process.stdout.write(".");
  return doc._id;
}

const isImg = (v: unknown): v is Img => !!v && typeof v === "object" && "src" in v && "alt" in v && "width" in v;

/**
 * Built-in value -> Sanity value: photos are uploaded and become altImage,
 * array members get a _key (and the object type the schema expects).
 */
async function sanityValue(v: unknown, arrayType?: string): Promise<unknown> {
  if (isImg(v)) return { _type: "altImage", alt: v.alt, asset: { _type: "reference", _ref: await asset(v.src) } };
  if (Array.isArray(v)) {
    return Promise.all(
      v.map(async (x) => {
        const out = await sanityValue(x);
        return out && typeof out === "object" && !Array.isArray(out) ? { ...(arrayType ? { _type: arrayType } : {}), ...out, _key: key() } : out;
      }),
    );
  }
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) out[k] = await sanityValue(x, ARRAY_TYPES[k]);
    return out;
  }
  return v;
}

/** Object type of array members, by field name (see sanity/schemaTypes). */
const ARRAY_TYPES: Record<string, string> = {
  hours: "dayHours",
  menu: "link",
  footerLinks: "link",
  legalLinks: "link",
  social: "socialLink",
  trust: "trustItem",
  faqs: "faqItem",
  body: "richBlock",
  sections: "postSection",
  others: "offer",
  steps: "feature",
};
/** Per-path overrides where one field name holds different types. */
const typed = (list: unknown[], type: string) => list.map((x) => ({ _type: type, ...(x as object) }));

const seo = (s: { title: string; description: string; noIndex?: boolean }) => ({ _type: "seo", title: s.title, description: s.description, noIndex: !!s.noIndex });
const slug = (current: string) => ({ _type: "slug", current });
const link = (l: { label: string; href: string }) => ({ _type: "link", label: l.label, href: l.href });

/* ---------- documents ---------- */

async function page(id: string, content: Record<string, unknown>, fix: (c: Record<string, unknown>) => Record<string, unknown> = (c) => c) {
  const { seo: s, ...rest } = content as Record<string, unknown> & { seo: { title: string; description: string; noIndex?: boolean } };
  return { _id: id, _type: id, ...((await sanityValue(fix(rest))) as object), seo: seo(s) };
}

async function build() {
  const docs: Record<string, unknown>[] = [];

  const { phoneHref: _phoneHref, menu, headerCta, ...settings } = fallbackSettings;
  void _phoneHref; // always derived from the phone number
  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    ...((await sanityValue(settings)) as object),
    headerCta: link(headerCta),
    // The services mega menu is built from the Service documents, so only label + link are stored.
    menu: menu.map((m) => ({ ...link(m), _key: key() })),
  });

  docs.push(
    await page("homePage", fallbackHome, (h) => {
      const c = h as unknown as typeof fallbackHome;
      return {
        ...c,
        why: { ...c.why, items: typed(c.why.items, "iconFeature") },
        journey: { ...c.journey, items: typed(c.journey.items, "iconFeature") },
        featured: { ...c.featured, items: typed(c.featured.items, "serviceCard") },
      };
    }),
  );
  docs.push(
    await page("aboutPage", fallbackAbout, (a) => {
      const c = a as unknown as typeof fallbackAbout;
      return { ...c, practice: { ...c.practice, items: typed(c.practice.items, "feature") }, team: { ...c.team, items: typed(c.team.items, "iconFeature") } };
    }),
  );
  docs.push(
    await page("patientCarePage", fallbackPatientCare, (p) => {
      const c = p as unknown as typeof fallbackPatientCare;
      return { ...c, offers: { ...c.offers, items: typed(c.offers.items, "offer") } };
    }),
  );
  docs.push(await page("contactPage", fallbackContact));
  docs.push(await page("blogPage", fallbackBlogIndex));
  docs.push(await page("servicesPage", fallbackServicesHub));
  docs.push(await page("privacyPage", fallbackPrivacy));
  docs.push(await page("thankYouPage", fallbackThankYou));

  for (const sv of fallbackServices) {
    const { seo: s, slug: sl, ...rest } = sv;
    docs.push({ _id: `service-${sl}`, _type: "service", slug: slug(sl), ...((await sanityValue(rest)) as object), seo: seo(s) });
  }
  for (const p of fallbackPosts) {
    const { seo: s, slug: sl, ...rest } = p;
    docs.push({ _id: `post-${sl}`, _type: "post", slug: slug(sl), ...((await sanityValue(rest)) as object), seo: seo(s) });
  }
  fallbackTestimonials.forEach((t, n) => docs.push({ _id: `testimonial-${n + 1}`, _type: "testimonial", ...t, order: n + 1 }));

  return docs;
}

const clean = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(clean)
    : v && typeof v === "object"
      ? Object.fromEntries(
          Object.entries(v)
            .filter(([, x]) => x !== undefined && x !== "")
            .map(([k, x]) => [k, clean(x)]),
        )
      : v;

console.log(`Seeding ${projectId || "(no project)"}/${dataset}${force ? " (overwriting)" : " (keeping existing documents)"}${dryRun ? " [dry run]" : ""}${only.length ? ` only: ${only.join(", ")}` : ""}. Uploading photos`);
const docs = (await build()).map((d) => clean(d) as { _id: string; _type: string }).filter((d) => !only.length || only.some((p) => d._id.startsWith(p)));
console.log(`\n${uploaded.size} photos ${dryRun ? "checked" : "uploaded"}. ${dryRun ? "Built" : "Writing"} ${docs.length} documents…`);

if (dryRun) {
  const counts = docs.reduce<Record<string, number>>((acc, d) => ((acc[d._type] = (acc[d._type] ?? 0) + 1), acc), {});
  // Every array member that is an object needs a _key, or Sanity refuses the write.
  const missingKeys: string[] = [];
  const walk = (v: unknown, path: string) => {
    if (Array.isArray(v)) v.forEach((x, i) => (x && typeof x === "object" && !Array.isArray(x) && !("_key" in x) ? missingKeys.push(`${path}[${i}]`) : walk(x, `${path}[${i}]`)));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
  };
  docs.forEach((d) => walk(d, d._id));
  if (missingKeys.length) {
    console.error("Array items without _key:", missingKeys.slice(0, 10));
    process.exit(1);
  }
  console.log("Dry run, nothing written:", counts, `${Math.round(JSON.stringify(docs).length / 1024)} KB of content`);
  if (process.env.SEED_DUMP) {
    const { writeFileSync } = await import("node:fs");
    writeFileSync(process.env.SEED_DUMP, JSON.stringify(docs, null, 1));
    console.log(`Documents written to ${process.env.SEED_DUMP}`);
  }
  process.exit(0);
}

// Existing documents, so add-missing can say what it skipped.
const existing = new Set(await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: docs.map((d) => d._id) }));
if (!force && existing.size) console.log(`Keeping ${existing.size} documents that already exist (use overwrite to replace them).`);

// Small transactions keep each request well under Sanity's size limit.
for (let i = 0; i < docs.length; i += 20) {
  const tx = client.transaction();
  for (const d of docs.slice(i, i + 20)) {
    if (force) tx.createOrReplace(d);
    else tx.createIfNotExists(d);
  }
  await tx.commit({ visibility: "async" });
  process.stdout.write(`${Math.min(i + 20, docs.length)}/${docs.length} `);
}
console.log(`\nDone: ${force ? docs.length : docs.length - [...existing].filter((id) => docs.some((d) => d._id === id)).length} documents written. Open /cms to see the content.`);
