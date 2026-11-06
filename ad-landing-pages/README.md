# Diamond Dental Group ad pages (own Vercel project)

Google Ads landing pages, apart from the SEO site (Kia: GoHighLevel is the CRM only, not the page host). Rebuilt from the GHL pages
offer.diamonddentalgroups.com ($49 new patient bundle) and implant.diamonddentalgroups.com (free implant consult + $500 off), in the
main site's design.

- Pages: `public/offer/index.html` -> `/offer`, `public/implant/index.html` -> `/implant`. `/` redirects to `/offer`. Static HTML, shared `public/assets/site.css` and `public/assets/lead.js`.
- Form: `api/lead.js` (Vercel Function) sends each lead to GHL (`GHL_DIAMOND_WEBHOOK_URL`, an inbound webhook, set by a person in Vercel) and to TTR OS `/api/site/form` (public site key, `TTR_SITE_KEY` overrides). Honeypot field `website`.
- Project: `diamond-ad-pages`, Root Directory `ad-landing-pages`, Framework Other, branch `claude/diamond-ad-pages`. No domain yet; add one (for example offer./implant. subdomains, DNS at GoDaddy) only on Kia's yes, then point the Google Ads final URLs at it.
- noindex on every response (vercel.json header) and in each page.
- Google Ads (account 927-809-7895, conversion ID AW-18248006682) runs through the old pages' Tag Manager container GTM-M664LDQG:
  - Submit lead form, label `QZYrCJeAm8IcEJr4qf1D`: fires on dataLayer event `lead`, pushed after a successful send.
  - Contact (1) (phone tap), label `NrG4CM6boMIcEJr4qf1D`: fires on any `tel:` link click.
