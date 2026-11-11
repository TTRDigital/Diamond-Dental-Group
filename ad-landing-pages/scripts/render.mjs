// Renders an ad page (/offer or /implant) from its content object. Same markup the hand-written pages had.
import { ICONS } from "./icons.mjs";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s) => esc(s).replace(/"/g, "&quot;");
const svg = (name, cls = "icon") => (ICONS[name] || ICONS.check).replace("<svg ", `<svg class="${cls}" `);
const telDigits = (t) => String(t || "").replace(/[^\d+]/g, "");

const checks = (items, extra = "") =>
  `<ul class="checks${extra}">${(items || []).map((t) => `<li>${svg("check")}<span>${esc(t)}</span></li>`).join("")}</ul>`;

export function renderPage(c) {
  const { hero, offer, extra, membership, urgency, doctor, office, footer, form, topbar, phone } = c;
  const tel = telDigits(phone.tel);
  const cta = (label, big) => `<a class="btn${big ? " btn-lg" : ""}" href="#claim" data-open-lead>${esc(label)}</a>`;
  const robots = c.seo?.noindex === false ? "index, follow" : "noindex, nofollow";

  const trust = (c.trust || [])
    .map((t) => (t.icon === "stars" ? `<li><span class="stars" aria-hidden="true">★★★★★</span>${esc(t.text)}</li>` : `<li>${svg(t.icon, "")}${esc(t.text)}</li>`))
    .join("\n    ");

  const pill = [hero.eyebrow && `<div class="eyebrow">${esc(hero.eyebrow)}</div>`, `<div class="big">${esc(hero.big)}</div>`, hero.sub && `<div class="sub">${esc(hero.sub)}</div>`].filter(Boolean).join("");

  const cards = (extra.cards || [])
    .map((k) =>
      k.icon
        ? `<div class="card"><div class="ic">${svg(k.icon, "")}</div><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></div>`
        : `<div class="card"><div class="deal">${esc(k.deal)}</div><h3>${esc(k.title)}</h3></div>`,
    )
    .join("\n      ");
  const btn = extra.button || {};
  const extraBtn =
    btn.type === "call"
      ? `<div class="center mt"><a class="btn" href="tel:${telDigits(btn.tel)}">${svg("phone")}${esc(btn.label)}</a></div>`
      : btn.label
        ? `<div class="center mt">${cta(btn.label, true)}</div>`
        : "";

  const member = membership
    ? `<section class="section">
  <div class="container">
    <div class="heading"><h2>${esc(membership.heading)}</h2><div class="rule"></div></div>
    <div class="plans">
      <div class="plan big-check">${svg("shield", "")}<h3>${esc(membership.ppo)}</h3></div>
      <div class="plan">
        <h3>${esc(membership.noInsurance)}</h3>
        <div class="price">${esc(membership.price)}</div>
        <div class="label">${esc(membership.label)}</div>
        ${checks(membership.items, " tight")}
      </div>
    </div>
  </div>
</section>
`
    : "";

  const faq = (c.faq || []).length
    ? `<section class="section">
  <div class="container">
    <div class="heading"><h2>${esc(c.faqHeading || "Frequently Asked Questions")}</h2><div class="rule"></div></div>
${c.faq.map((f) => `    <details class="faq"><summary>${esc(f.question)}</summary><p>${esc(f.answer)}</p></details>`).join("\n")}
  </div>
</section>
`
    : "";

  const hours = office.hours
    .map((h) => `<li data-day="${h.day}" data-open="${attr(h.open)}" data-close="${attr(h.close)}"${h.open ? "" : ' class="off"'}><span>${esc(h.name)}</span><span>${esc(h.text)}</span></li>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.title)}</title>
<meta name="description" content="${attr(c.description)}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="#000000">
<link rel="icon" href="/images/icon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/images/icon-180.png">
<link rel="preload" as="image" href="${attr(hero.image)}" fetchpriority="high">
<link rel="stylesheet" href="/assets/site.css">
<!-- Google Tag Manager: same container as the old ad pages (Google Ads AW-18248006682, form and phone-tap conversions) -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${c.gtm}');</script>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${c.gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<div class="topbar"><a href="${attr(topbar.mapsUrl)}" target="_blank" rel="noopener">${esc(topbar.text)}</a></div>
<header class="header">
  <div class="container">
    <span class="brand"><img src="/images/logo.png" alt="${esc(c.brand)} logo" width="270" height="200"><span>${esc(c.brand)}</span></span>
    <div class="header-right">
      <a class="header-phone" href="tel:${tel}">${svg("phone")}<span>${esc(phone.display)}</span></a>
      <a class="btn btn-sm" href="#claim" data-open-lead>${esc(c.headerCta)}</a>
    </div>
  </div>
</header>
<main>
<section class="hero">
  <img src="${attr(hero.image)}" alt="${attr(hero.imageAlt)}" width="1200" height="800" fetchpriority="high">
  <div class="hero-inner">
    <h1>${esc(hero.h1)}</h1>
    <div class="offer-pill">${pill}</div>
    ${cta(hero.cta, true)}
    <p class="note${hero.noteCaps ? " caps" : ""}">${esc(hero.note)}</p>
  </div>
</section>
<section class="trust" aria-label="${attr(c.trustLabel)}">
  <div class="container"><ul>
    ${trust}
  </ul></div>
</section>
<section class="section" id="offer">
  <div class="container">
    <div class="heading"><h2>${esc(offer.h2)}</h2><div class="rule"></div>
      <p>${esc(offer.intro)}</p></div>
    <div class="offer-card">
      <div class="top"><span class="badge">${esc(offer.badge)}</span><div class="was"${offer.wasPlain ? ' style="text-decoration:none"' : ""}>${esc(offer.was)}</div><div class="now">${esc(offer.now)}</div><div class="save">${esc(offer.save)}</div></div>
      <div class="body">
        ${checks(offer.checks)}
        ${cta(offer.cta)}
      </div>
    </div>
  </div>
</section>
<section class="section muted">
  <div class="container">
    <div class="heading"><h2>${esc(extra.h2)}</h2><div class="rule"></div>
      <p>${esc(extra.intro)}</p></div>
    <div class="cards ${attr(extra.layout)}">
      ${cards}
    </div>
    ${extraBtn}
  </div>
</section>
${member}<section class="section dark">
  <div class="glow"></div>
  <div class="container doc">
    <div class="doc-photo"><img src="${attr(doctor.image)}" alt="${attr(doctor.name)}" width="720" height="719" loading="lazy"></div>
    <div>
      <span class="eyebrow-gold">${esc(doctor.eyebrow)}</span>
      <h2>${esc(doctor.name)}</h2>
      <p>${esc(doctor.bio)}</p>
      <blockquote>${esc(doctor.quote)}</blockquote>
      ${checks(doctor.checks, " tight")}
    </div>
  </div>
</section>
${faq}<section class="urgency">
  <h2>${esc(urgency.h2)}</h2>
  <p>${esc(urgency.text)}</p>
  ${cta(urgency.cta, true)}
</section>
<section class="section muted">
  <div class="container">
    <div class="heading"><h2>${esc(office.heading)}</h2><div class="rule"></div></div>
    <div class="office">
      <div class="plan">
        <span class="status">Open</span>
        <div class="contact-line">${svg("phone")}<a href="tel:${tel}">${esc(phone.display)}</a></div>
        <div class="contact-line">${svg("pin")}<a href="${attr(topbar.mapsUrl)}" target="_blank" rel="noopener">${office.addressHtml.split(/<br\s*\/?>/i).map(esc).join("<br>")}</a></div>
      </div>
      <div class="plan">
        <h3>${esc(office.hoursHeading)}</h3>
        <ul class="hours">${hours}</ul>
      </div>
    </div>
  </div>
</section>
</main>
<footer class="footer">
  <span class="brand"><img src="/images/logo.png" alt="" width="270" height="200" loading="lazy"><span>${esc(c.brand)}</span></span>
  <p>${esc(footer.text)}</p>
  <small>${esc(footer.small)}</small>
</footer>
<div class="mobile-bar">
  <a class="call" href="tel:${tel}">${svg("phone")}Call</a>
  <button type="button" class="claim" data-open-lead>${esc(c.mobileCta)}</button>
</div>
<dialog class="lead" id="lead" aria-labelledby="lead-title">
  <div class="lead-inner">
    <button type="button" class="close" data-close aria-label="Close">×</button>
    <div class="lead-body">
      <h2 id="lead-title">${esc(form.title)}</h2>
      <p class="intro">${esc(form.intro)}</p>
      <form id="lead-form" action="/api/lead" method="post" novalidate>
        <div class="row2">
          <div class="field"><label for="f-first">${esc(form.firstName)}</label><input id="f-first" name="firstName" autocomplete="given-name" maxlength="60"></div>
          <div class="field"><label for="f-last">${esc(form.lastName)}</label><input id="f-last" name="lastName" autocomplete="family-name" maxlength="60"></div>
        </div>
        <div class="field"><label for="f-email">${esc(form.email)}</label><input id="f-email" name="email" type="email" autocomplete="email" required maxlength="160"></div>
        <div class="field"><label for="f-phone">${esc(form.phone)}</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(555) 555-5555" required maxlength="40"></div>
        <div class="field"><label for="f-date">${esc(form.visitDate)}</label><input id="f-date" name="visitDate" type="date" required></div>
        <div class="field"><label for="f-msg">${esc(form.message)}</label><textarea id="f-msg" name="message" placeholder="${attr(form.messagePlaceholder)}" maxlength="1000"></textarea></div>
        <div class="hp" aria-hidden="true"><label for="f-website">Website</label><input id="f-website" name="website" tabindex="-1" autocomplete="off"></div>
        <input type="hidden" name="offer" value="${attr(form.offerValue)}">
        <label class="consent"><input type="checkbox" name="consent" value="yes" required><span>${esc(form.consent)}</span></label>
        <p class="form-error" role="alert"></p>
        <button type="submit" class="btn">${esc(form.submit)}</button>
      </form>
    </div>
    <div class="thanks" hidden>
      ${svg("check")}
      <h2>${esc(form.thanksTitle)}</h2>
      <p>${esc(form.thanksText)}</p>
      <a class="btn" href="tel:${tel}">Call ${esc(phone.display)}</a>
    </div>
  </div>
</dialog>
<script src="/assets/lead.js" defer></script>
${c.callTracking === true ? '<script src="/number.js" defer></script>\n' : ""}</body>
</html>
`;
}
