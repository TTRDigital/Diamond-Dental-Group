// Vercel build for the ad pages: reads each page's content from Sanity (document type landingPage) and writes
// public/<slug>/index.html. The built-in content (content/*.json) is the fallback, so a missing document, an empty
// field, a Sanity outage or a bad value never breaks the build or blanks a page. This script always exits 0.
import { mkdirSync, writeFileSync } from "node:fs";
import { SLUGS, fallbackFor } from "./fallback.mjs";
import { overlay } from "./merge.mjs";
import { renderPage } from "./render.mjs";
import { fetchLandingPage } from "./sanity.mjs";

// What every finished page must still contain: the lead form, the conversion container and the page title.
const MUST_HAVE = ['id="lead-form"', "GTM-M664LDQG", "<title>", 'name="consent"', "data-open-lead"];

for (const slug of SLUGS) {
  const base = fallbackFor(slug);
  let html = renderPage(base), from = "built-in content";
  try {
    const doc = await fetchLandingPage(slug);
    if (doc) {
      const merged = { ...overlay(base, doc), gtm: base.gtm }; // the tracking container is not editable
      if (base.membership === null && !doc.membership) merged.membership = null;
      const out = renderPage(merged);
      if (MUST_HAVE.every((m) => out.includes(m))) { html = out; from = "Sanity (empty fields from built-in)"; }
      else console.warn(`[${slug}] Sanity content failed the page check; using built-in content`);
    } else from = "built-in content (no Sanity document yet)";
  } catch (e) {
    console.warn(`[${slug}] Sanity not read (${e.message}); using built-in content`);
  }
  mkdirSync(new URL(`../public/${slug}/`, import.meta.url), { recursive: true });
  writeFileSync(new URL(`../public/${slug}/index.html`, import.meta.url), html);
  console.log(`[${slug}] built from ${from}`);
}
