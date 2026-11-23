/**
 * Copies the page titles and meta descriptions written in lib/data into Sanity, and fills in each document's `path`.
 *
 * Why: Sanity values win over lib/data, and Sanity still holds the SEO copy seeded on Oct 22. So a title or description
 * fixed in code (TTR-2880: target search first, titles 30 to 70 characters, descriptions 110 to 170) only shows on the
 * live site once Sanity has it too. Only seo.title, seo.description and path are touched; nothing a visitor reads on
 * the page changes, and every other field an editor or TTR OS wrote is kept.
 *
 *   npm run sync-seo                          # dry run: lists every change (old -> new), writes nothing
 *   npm run sync-seo -- --apply               # writes the changes (published documents and their drafts)
 *   npm run sync-seo -- --apply --only=service-,patientCarePage   # only documents whose ID starts with these
 *
 * Writes to NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET (environment or .env.local).
 * Needs SANITY_WRITE_TOKEN (Editor token from sanity.io/manage > API > Tokens). Never put the token in the repo.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";
import type { Seo } from "../lib/types";
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
if (existsSync(join(root, ".env.local"))) {
  for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const apply = process.argv.includes("--apply");
const only = (process.argv.find((a) => a.startsWith("--only="))?.slice(7) ?? "")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "stnpzvwa";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Set SANITY_WRITE_TOKEN (Editor token from sanity.io/manage > API > Tokens).");
  process.exit(1);
}

/** Document ID -> the page's address and the SEO fields written in lib/data. */
const wanted = new Map<string, { path: string; seo: Seo }>([
  ["homePage", { path: "/", seo: fallbackHome.seo }],
  ["aboutPage", { path: "/about/", seo: fallbackAbout.seo }],
  ["patientCarePage", { path: "/patient-care/", seo: fallbackPatientCare.seo }],
  ["contactPage", { path: "/contact/", seo: fallbackContact.seo }],
  ["blogPage", { path: "/blog/", seo: fallbackBlogIndex.seo }],
  ["servicesPage", { path: "/services/", seo: fallbackServicesHub.seo }],
  ["privacyPage", { path: "/privacy-policy/", seo: fallbackPrivacy.seo }],
  ["thankYouPage", { path: "/thank-you/", seo: fallbackThankYou.seo }],
  ...fallbackServices.map((s) => [`service-${s.slug}`, { path: `/services/${s.slug}/`, seo: s.seo }] as const),
  ...fallbackPosts.map((p) => [`post-${p.slug}`, { path: `/blog/${p.slug}/`, seo: p.seo }] as const),
]);

// The same rulers as TTR OS's page score (SOP on-page-seo): a value outside them is never written.
for (const [id, w] of wanted) {
  const t = w.seo.title.length;
  const d = w.seo.description.length;
  if (t < 30 || t > 70 || d < 110 || d > 170) {
    console.error(`${id}: lib/data has a title of ${t} or a description of ${d} characters (need 30 to 70 and 110 to 170). Fix it first.`);
    process.exit(1);
  }
}

type Doc = { _id: string; path?: string; seo?: { title?: string; description?: string } };
const client = createClient({ projectId, dataset, token, apiVersion: "2025-02-19", useCdn: false, perspective: "raw" });
const ids = [...wanted.keys()].filter((id) => !only.length || only.some((p) => id.startsWith(p)));
const docs = await client.fetch<Doc[]>(`*[_id in $ids || _id in $drafts]{_id, path, seo}`, { ids, drafts: ids.map((id) => `drafts.${id}`) });

let changes = 0;
const tx = client.transaction();
for (const d of docs) {
  const w = wanted.get(d._id.replace(/^drafts\./, ""))!;
  const set: Record<string, string> = {};
  if (d.path !== w.path) set.path = w.path;
  if ((d.seo?.title ?? "") !== w.seo.title) set["seo.title"] = w.seo.title;
  if ((d.seo?.description ?? "") !== w.seo.description) set["seo.description"] = w.seo.description;
  if (!Object.keys(set).length) continue;
  console.log(`${apply ? "set" : "would set"}  ${d._id}`);
  for (const [k, v] of Object.entries(set)) {
    const old = k === "path" ? d.path : k === "seo.title" ? d.seo?.title : d.seo?.description;
    console.log(`    ${k}: ${old ? `"${old}" (${old.length}) -> ` : ""}"${v}" (${v.length})`);
  }
  // seo may be missing on a bare document: create it first so the dotted paths have somewhere to go.
  tx.patch(d._id, (p) => p.setIfMissing({ seo: { _type: "seo" } }).set(set));
  changes++;
}
const missing = ids.filter((id) => !docs.some((d) => d._id === id));
if (missing.length) console.log(`\nNot in Sanity (the page shows lib/data as it is): ${missing.join(", ")}`);

if (!changes) console.log(`Nothing to change (${docs.length} documents checked).`);
else if (apply) {
  await tx.commit();
  console.log(`\nDone: ${changes} documents updated (${docs.length} checked).`);
} else console.log(`\nDry run: ${changes} documents would change (${docs.length} checked). Run again with --apply to write.`);
