# Diamond Dental Group ad pages (own Vercel project)

Google Ads landing pages, apart from the SEO site (Kia: GoHighLevel is the CRM only, not the page host). Rebuilt from the GHL pages
offer.diamonddentalgroups.com ($49 new patient bundle) and implant.diamonddentalgroups.com (free implant consult + $500 off), in the
main site's design.

- Pages: `public/offer/index.html` -> `/offer`, `public/implant/index.html` -> `/implant`. On offer.diamonddentalgroups.com every path except `/api/` and real files shows `/offer`, and on implant.diamonddentalgroups.com it shows `/implant` (rewrites in vercel.json, so `?gclid=` and old deep links keep working). On any other host `/` redirects to `/offer`. Static HTML, shared `public/assets/site.css` and `public/assets/lead.js`.
- Form: `api/lead.js` (Vercel Function) sends each lead to GHL (`GHL_DIAMOND_WEBHOOK_URL`, an inbound webhook, set by a person in Vercel) and to TTR OS `/api/site/form` (public site key, `TTR_SITE_KEY` overrides). Honeypot field `website`.
- Project: `diamond-ad-pages`, Root Directory `ad-landing-pages`, Framework Other, branch `claude/diamond-ad-pages`. Domains offer. and implant.diamonddentalgroups.com (DNS at GoDaddy, Kia's yes Nov 6 2026). Production branch `claude/diamond-ad-pages`.
- noindex on every response (vercel.json header) and in each page.
- Google Ads (account 927-809-7895, conversion ID AW-18248006682) runs through the old pages' Tag Manager container GTM-M664LDQG:
  - Submit lead form, label `QZYrCJeAm8IcEJr4qf1D`: fires on dataLayer event `lead`, pushed after a successful send.
  - Contact (1) (phone tap), label `NrG4CM6boMIcEJr4qf1D`: fires on any `tel:` link click.

## Content in Sanity, build, call tracking (TTR-1342)

- **Content** lives in the client's Sanity project `stnpzvwa` as document type `landingPage` (IDs `landingPage.offer`, `landingPage.implant`; schema in `sanity/landingPage.ts`, to be registered in the Studio by a one-line import in `sanity/schemaTypes/documents.ts` of the main site). `scripts/build.mjs` (Vercel `buildCommand`) reads the published documents at build time and writes `public/<slug>/index.html`. Built-in content (`content/*.json`) is the fallback: no document, an empty field, a Sanity outage or a failed page check keeps the built-in text, and the build always passes. Built from the built-in content the pages are byte-identical to the previous hand-written ones. Tag Manager id and the form field names are not editable. Note: the `X-Robots-Tag: noindex` header in `vercel.json` applies to every response regardless of the Sanity noindex switch.
- **Seed**: `node scripts/seed-sanity.mjs` is a dry run (no token needed). `--write` with `SANITY_WRITE_TOKEN` in the environment uses `createIfNotExists`, so it never overwrites an editor's document.
- **Call tracking**: `public/number.js` swaps the Google Ads number for a TTR OS pool number when the visitor has a gclid (POST `/api/site/number`), and does nothing otherwise. It is OFF: the pages load it only when `callTracking` is true. Visible numbers are unchanged until Kia decides which to swap (`SWAP` list in the script) and the Twilio number (916, Diamond Dental subaccount, forward to (916) 755-4769, recording on with a notice) is in the pool.
- **Form**: still posts to GHL and TTR OS. The free-text message now goes to TTR OS only (it is removed from the GHL payload); TTR OS also gets a line that the existing consent box was checked.
