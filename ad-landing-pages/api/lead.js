// Lead form of the Diamond Dental Google Ads pages (/offer and /implant). Sends each request to the GoHighLevel inbound
// webhook (GHL_DIAMOND_WEBHOOK_URL in Vercel, set by a person, never in the page) and to TTR OS (the client's Leads page),
// so a lead is never lost to one side being down. The visitor gets a thank-you when either side took it. Each call gives
// up after 5 seconds. The free-text message goes to TTR OS only (never to GHL). The TTR OS site key is public (it is in the main site's page source too); TTR_SITE_KEY overrides it.
const SITE_KEY = process.env.TTR_SITE_KEY || "jFPFfmHN6H1wH9hZT0Pbkg";
const OS_URL = process.env.TTR_OS_URL || "https://ttr-portal.vercel.app";
const FALLBACK_ORIGIN = "https://diamond-ad-pages.vercel.app";
const PAGES = { "/offer": "Google Ads - $49 bundle page", "/implant": "Google Ads - implant page" };
const clean = (v, n) => String(v ?? "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, n);

export async function POST(req) {
  let form;
  try { form = await req.formData(); } catch { return Response.json({ ok: false, error: "Bad request." }, { status: 400 }); }
  if (clean(form.get("website"), 50)) return Response.json({ ok: true }); // honeypot: a person never fills this
  const firstName = clean(form.get("firstName"), 60), lastName = clean(form.get("lastName"), 60);
  const email = clean(form.get("email"), 160), phone = clean(form.get("phone"), 40);
  const visitDate = clean(form.get("visitDate"), 20), message = clean(form.get("message"), 1000);
  const offer = clean(form.get("offer"), 80), consent = clean(form.get("consent"), 5) === "yes";
  const path = clean(form.get("page"), 40).replace(/\/$/, "") || "/offer";
  const source = PAGES[path] || "Google Ads - landing page";
  const digits = phone.replace(/\D/g, "");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || digits.length < 10 || !/^\d{4}-\d{2}-\d{2}$/.test(visitDate) || !consent)
    return Response.json({ ok: false, error: "Please check your email, phone, visit date and the consent box." }, { status: 400 });

  // The page's own address (preview or, later, a real domain); only https hosts we expect are passed on.
  const origin = (() => {
    const o = req.headers.get("origin") || "";
    return /^https:\/\/([a-z0-9-]+\.)*(vercel\.app|diamonddentalgroups\.com)$/i.test(o) ? o : FALLBACK_ORIGIN;
  })();
  const landing = clean(form.get("landing"), 500);
  const pageUrl = landing.startsWith(origin) ? landing : `${origin}${path}`;
  const ua = req.headers.get("user-agent") || "", ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const name = `${firstName} ${lastName}`.trim();
  const tasks = [];

  const hook = process.env.GHL_DIAMOND_WEBHOOK_URL;
  if (hook && /^https:\/\//.test(hook)) {
    tasks.push(fetch(hook, {
      method: "POST", headers: { "content-type": "application/json" }, signal: AbortSignal.timeout(5000),
      body: JSON.stringify({ firstName, lastName, fullName: name, email, phone, visitDate, offer, source, consent: "yes", page: pageUrl }),
    }).then((r) => r.ok).catch(() => false));
  }

  const note = [offer && `Offer: ${offer}.`, `Visit date requested: ${visitDate}.`, "Consent box checked: agreed to receive communications from the practice.", message && `Message: ${message}`, source].filter(Boolean).join(" ");
  const os = new URLSearchParams({ k: SITE_KEY, p: `${path}/`, r: clean(form.get("referrer"), 500) || req.headers.get("referer") || "", u: pageUrl, f_name: name || email, f_phone: phone, f_email: email, f_message: note });
  tasks.push(fetch(`${OS_URL}/api/site/form`, {
    method: "POST", signal: AbortSignal.timeout(5000), body: os,
    headers: { "content-type": "application/x-www-form-urlencoded", "user-agent": ua || "Mozilla/5.0 (Diamond Dental ad page form)", "x-forwarded-for": ip, origin },
  }).then((r) => r.status < 500).catch(() => false));

  const done = await Promise.all(tasks);
  if (!done.some(Boolean)) return Response.json({ ok: false, error: "We could not send that. Please call (916) 282-5377." }, { status: 502 });
  return Response.json({ ok: true });
}
