# Diamond Dental Group website

Next.js 16 (App Router) + Sanity Studio embedded at `/cms`, Tailwind CSS v4, served by **Vercel** (a static export for SiteGround is kept as the fallback). Rebuild of https://diamonddentalgroups.com (a client-rendered GoHighLevel "Vibe" React app) by TTR Digital, on the same architecture as Beverly-Hills-Top-Dentist.

- **Design:** the live site's look, page by page. Sizes, spacing and colors were measured from the live pages at 1440px and 390px; every section's height matches the live page. Like the live site, no web fonts are loaded (system UI text, Montserrat-or-system headings).
- **Content:** the live site's text, word for word, with the same page titles and meta descriptions (checked by a word-level diff of every page). Everything is editable in `/cms`. Until Sanity has content (or a field is left empty), the site shows the built-in copy from `lib/data`, so it never breaks.
- **Appointments:** `/contact/` embeds the practice's Jarvis Analytics online scheduler, as on the live site. The site has no form of its own.

## Pages (trailing slash)

| URL | Route |
|---|---|
| `/` | home: storefront hero, trust strip, why choose, how it works, featured services, grand opening offers, insurance/membership, meet your dentist, (reviews), call to action |
| `/about/`, `/patient-care/`, `/contact/`, `/privacy-policy/`, `/thank-you/` (noindex) | singletons |
| `/services/` | **new** services hub (the live site linked here but had no page) |
| `/services/<slug>/` | 18 service pages, one template (`app/(site)/services/[slug]`) |
| `/blog/` + `/blog/<slug>/` | Patient Education + 7 articles |
| `/cms` | Sanity Studio |

All dynamic routes use `generateStaticParams` with `dynamicParams = false`. Unknown URLs get the 404 page **with a 404 status** (the live site answered 200).

### Old URLs (`public/.htaccess` on SiteGround, `vercel.json` on Vercel)

- The live URLs had no trailing slash (`/about`, `/services/invisalign`): each one answers **301** to the same page with a slash.
- One host: `www.`, the SiteGround temporary address and any other host pointed at the account go to `https://diamonddentalgroups.com` (301, path kept); http goes to https.
- WordPress leftovers: the web archive has no earlier version of this domain, so no old file names are known. `/wp-content/uploads/…` and `?page_id=` / `?p=` links 301 to the home page, WordPress sitemaps to `/sitemap.xml`; `wp-admin`, `wp-json`, `wp-login.php`, `xmlrpc.php`, feeds, `category/`, `tag/`, `author/` answer **410 Gone**.
- To change a redirect, edit its line in `.htaccess` (keep it above the trailing-slash rule).

## Changes from the live site (agreed in the audit)

- Meta descriptions added where the live pages had none (18 services, privacy, thank-you), built from each page's own intro sentence.
- Canonical tags on every page; one `Dentist` schema site-wide (address, phone, hours from the site); `BreadcrumbList` on inner pages; `FAQPage` (word for word) on service pages; `Article` on posts (as the live site had).
- Reviews section, the "5.0" rating and the "Hundreds of 5-Star Reviews" badge are **hidden** until real reviews are added (Reviews in /cms, switch "Real review, OK to publish" on). The three live testimonials are kept in /cms marked `[PLACEHOLDER]`.
- Dead links removed: "Terms & Conditions" and "Accessibility Statement" (pointed to `/`), the Facebook/Instagram icons (pointed to `#`; they come back once real links are added in Site settings > Social links). "View All Services" and the "Services" breadcrumb now open the new `/services/` page.
- The privacy policy's "Last updated" date was the visitor's current date; it is now fixed (10/20/2026, the day it was copied) and editable.
- Photos are served from this site (WebP, resized) instead of `vibe.filesafe.space`, with metadata removed (the treatment-room photo carried GPS coordinates) and descriptive alt text.
- The menu never wraps: the full menu shows from 1312px, below that the phone menu; a size check also switches to the phone menu if a visitor's system font is wider.
- `/thank-you/` is noindex.

## Setup

1. **Sanity project:** set the project ID as the repository variable `SANITY_PROJECT_ID` (Settings > Secrets and variables > Actions > Variables) and in `sanity/env.ts`; dataset `production`.
2. **CORS:** sanity.io/manage > project > API > CORS origins: add `https://diamonddentalgroups.com`, `https://www.diamonddentalgroups.com`, the Vercel preview URL and `http://localhost:3000`, each with "Allow credentials". Without it, /cms shows "Add CORS origin".
3. **Local env:** copy `.env.example` to `.env.local`.
4. **Load the content into Sanity (once), all in the browser:**
   1. sanity.io/manage > project > API > Tokens > Add API token, permission **Editor**.
   2. GitHub: Settings > Secrets and variables > Actions > New repository secret, name `SANITY_WRITE_TOKEN`.
   3. Actions > "Load content into Sanity" > Run workflow, mode **add-missing**. It uploads 11 photos and writes 37 documents. **overwrite** replaces the CMS with the built-in content; **dry-run** checks without writing. The **only** box limits a run to documents whose ID starts with the given text, e.g. `homePage,service-invisalign`.
   4. Delete or rotate the token afterwards.

   On a computer instead: put the token in `.env.local`, then `npm install && npm run seed` (`-- --force` to overwrite, `-- --dry-run` to check).
5. **Run:** `npm run dev`, then http://localhost:3000 and http://localhost:3000/cms.

Document IDs: `siteSettings`, `homePage`, `aboutPage`, `patientCarePage`, `contactPage`, `blogPage`, `servicesPage`, `privacyPage`, `thankYouPage`, `service-<slug>`, `post-<slug>`, `testimonial-<n>`.

## Hosting on Vercel (the live site since Oct 22, 2026)

The Vercel project `diamond-dental-group` builds this branch and serves the live domain (`www` redirects to it). On Vercel the site runs as a normal Next.js app (`next.config.ts` turns the static export off when `VERCEL` is set), so the Studio's inner addresses (`/cms/structure/...`) work without `.htaccess`. Vercel does not read `.htaccess`: the old-address redirects, the security headers with the content security policy (not on `/cms`) and a day of caching for photos are in `vercel.json`. Sanity does not rebuild Vercel by itself: add a Vercel Deploy Hook (Project > Settings > Git > Deploy Hooks) as a second URL on the Sanity webhook, otherwise a publish only reaches the site at the next push.

## Hosting on SiteGround (kept as the fallback)

`npm run build` writes the whole site to `out/`: HTML pages, `_next/` scripts, `_img/` WebP photos and `.htaccess` (canonical host, redirects, trailing slashes, security headers + CSP, caching, gzip incl. `text/javascript`, 404 page, /cms deep links). Upload the **contents** of `out/` into the site's `public_html`.

Automatic deploys (`.github/workflows/deploy-siteground.yml`) build and upload over FTPS on every push to this branch or `main`, when Sanity publishes, and from Actions > "Deploy to SiteGround" > Run workflow. Until the FTP secrets exist the workflow only builds (the site is kept as a run artifact for 14 days).

| Secret | Value |
|---|---|
| `SG_FTP_SERVER` | FTP host (Site Tools > Site > FTP Accounts > Manage > FTP credentials) |
| `SG_FTP_USERNAME` / `SG_FTP_PASSWORD` | an FTP account whose folder is the site's `public_html` |

Repository **variables** (not secrets): `SANITY_PROJECT_ID`, `GHL_CHAT_WIDGET_ID` (shows the GoHighLevel chat, loaded after the first interaction or 4 s), `GA_ID`, `GTM_ID` (defaults to the live site's container `GTM-M664LDQG`, which also fires the Google Ads tag).

**Publish → live:** sanity.io/manage > API > Webhooks: URL `https://api.github.com/repos/TTRDigital/Diamond-Dental-Group/dispatches`, method POST, triggers create/update/delete, projection `{"event_type": "sanity-publish"}`, headers `Authorization: Bearer <GitHub fine-grained token with Contents: read and write on this repo>` and `Accept: application/vnd.github+json`.

**Go-live:** the live domain is currently served by the Vibe app through Cloudflare. Point the FTP account at the SiteGround site, check it on the temporary address first (note: `.htaccess` sends every other host to the main domain, so check before or right after the DNS switch), then point the domain at SiteGround. Turn on Site Tools > Security > SSL Manager (Let's Encrypt) and HTTPS Enforce.

## Editing in /cms

- **Site settings:** name, phone, email, address, map, online scheduler link, hours, header button, main menu, footer links, social links, logo.
- **Pages:** Home, About, Services hub (also the labels shared by every service page), Patient Care, Patient Education, Contact, Privacy policy, Thank you.
- **Services** (name, menu group, banner, paragraphs, points, FAQs, optional offer), **Blog posts** (article blocks: paragraph, heading, list; `**bold**` and `[words](/page/)` links), **Reviews**.
- Text starting with `[PLACEHOLDER` is never shown on the site.

## Development

```bash
npm run dev        # local site
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # WebP copies + static export to out/
```

- `lib/data/*`: built-in content (fallbacks and seed source). `services.ts` and `posts.ts` were generated from the live site's own data; `images.ts` lists every photo with alt text.
- `lib/content.ts`: GROQ queries and the merge over fallbacks. Sanity images are read straight from their asset reference.
- `SANITY_API_URL` (build time, normally unset) points the queries at another host. It was used to build the site from a local mock of the seeded dataset: all 36 pages rendered identically from the CMS and from the built-in data.
