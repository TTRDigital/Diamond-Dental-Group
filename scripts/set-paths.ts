/**
 * Fills in the `path` field (/about/, /services/invisalign/ ...) on every page, service and post document in Sanity,
 * so TTR OS's page fixer can find each page by path. Safe to re-run: documents that already have the right path
 * are left alone. Drafts are filled in too, so a draft never loses its path.
 *
 *   npm run set-paths                # dry run: lists what would change, writes nothing
 *   npm run set-paths -- --apply     # writes the changes
 *
 * Writes to NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET (environment or .env.local).
 * Needs SANITY_WRITE_TOKEN (Editor token from sanity.io/manage > API > Tokens). Never put the token in the repo.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";

const root = new URL("..", import.meta.url).pathname;
if (existsSync(join(root, ".env.local"))) {
  for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const apply = process.argv.includes("--apply");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "stnpzvwa";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Set SANITY_WRITE_TOKEN (Editor token from sanity.io/manage > API > Tokens).");
  process.exit(1);
}

// One document per page type, found by its fixed ID.
const singletons: Record<string, string> = {
  homePage: "/",
  aboutPage: "/about/",
  patientCarePage: "/patient-care/",
  contactPage: "/contact/",
  blogPage: "/blog/",
  servicesPage: "/services/",
  privacyPage: "/privacy-policy/",
  thankYouPage: "/thank-you/",
};

type Doc = { _id: string; _type: string; path?: string; slug?: { current?: string } };

const client = createClient({ projectId, dataset, token, apiVersion: "2025-02-19", useCdn: false, perspective: "raw" });
const docs = await client.fetch<Doc[]>(`*[_type in $types]{_id, _type, path, slug}`, { types: [...Object.keys(singletons), "service", "post"] });

let changes = 0;
let skipped = 0;
const tx = client.transaction();
for (const d of docs) {
  const id = d._id.replace(/^drafts\./, "");
  const expected = singletons[d._type] ?? (d.slug?.current ? `/${d._type === "service" ? "services" : "blog"}/${d.slug.current}/` : null);
  if (!expected) {
    console.warn(`skip   ${d._id} (${d._type}): no slug`);
    skipped++;
    continue;
  }
  // Singletons must be the one fixed document, not a stray copy.
  if (singletons[d._type] && id !== d._type) {
    console.warn(`skip   ${d._id} (${d._type}): not the standard ${d._type} document`);
    skipped++;
    continue;
  }
  if (d.path === expected) continue;
  console.log(`${apply ? "set " : "would set"}  ${d._id.padEnd(40)} path ${d.path ? `${d.path} -> ` : ""}${expected}`);
  tx.patch(d._id, (p) => p.set({ path: expected }));
  changes++;
}

if (!changes) console.log(`Nothing to change (${docs.length} documents checked, ${skipped} skipped).`);
else if (apply) {
  await tx.commit();
  console.log(`Done: ${changes} documents updated (${docs.length} checked, ${skipped} skipped).`);
} else console.log(`\nDry run: ${changes} documents would change (${docs.length} checked, ${skipped} skipped). Run again with --apply to write.`);
