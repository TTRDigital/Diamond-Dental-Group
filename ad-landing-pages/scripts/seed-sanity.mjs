// Loads the two ad pages' built-in content into the client's Sanity project as landingPage documents.
//   node scripts/seed-sanity.mjs            DRY RUN (default): prints what would be created, writes nothing, needs no token
//   node scripts/seed-sanity.mjs --write    creates the documents that do not exist yet
// It uses createIfNotExists, so it NEVER overwrites a document an editor already has. The token is read from the
// SANITY_WRITE_TOKEN environment variable (an Editor token from sanity.io/manage), never from code or chat.
import { SLUGS, fallbackFor } from "./fallback.mjs";
import { API_VERSION, DATASET, DOC_TYPE, PROJECT_ID, docId } from "./sanity.mjs";

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (write && !token) { console.error("Set SANITY_WRITE_TOKEN (Editor token) in the environment, then run again."); process.exit(1); }

let n = 0;
const keyed = (v) => (Array.isArray(v) ? v.map((x) => (x && typeof x === "object" ? { _key: `k${n++}`, ...keyed(x) } : x)) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, keyed(x)])) : v);

const docs = SLUGS.map((slug) => {
  const { gtm, brand, ...c } = fallbackFor(slug); // gtm stays in code: tracking is not editable
  if (c.membership === null) delete c.membership;
  return keyed({ _id: docId(slug), _type: DOC_TYPE, internalTitle: `Ad page /${slug}`, ...c, slug: { _type: "slug", current: slug } });
});

console.log(`${write ? "WRITE" : "DRY RUN"} -> project ${PROJECT_ID}, dataset ${DATASET}`);
for (const d of docs) console.log(`  ${d._id}: ${Object.keys(d).length} fields, ${JSON.stringify(d).length} bytes`);
if (!write) { console.log("Nothing written. Add --write (with SANITY_WRITE_TOKEN) to create the missing documents."); process.exit(0); }

const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}?returnIds=true`, {
  method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
  body: JSON.stringify({ mutations: docs.map((d) => ({ createIfNotExists: d })) }),
});
const out = await res.json().catch(() => ({}));
if (!res.ok) { console.error(`Sanity answered ${res.status}: ${out?.error?.description || out?.message || "error"}`); process.exit(1); }
console.log(`Done. createIfNotExists for ${(out.results || []).length} documents (existing ones were left as they are).`);
