import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
// The live site's Tag Manager container, so Vercel builds carry it without an env var ("off" turns it off).
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID === "off" ? "" : process.env.NEXT_PUBLIC_GTM_ID || "GTM-M664LDQG";
// TTR OS website tracker (visits by source and form leads; no personal data). The site key is public.
const TTR_SITE_KEY = process.env.NEXT_PUBLIC_TTR_SITE_KEY === "off" ? "" : process.env.NEXT_PUBLIC_TTR_SITE_KEY || "jFPFfmHN6H1wH9hZT0Pbkg";

/*
 * Clicks on elements with data-track="event_name" (click_to_call, book_appointment)
 * are sent as events, with data-track-page as a "page" parameter so each area page
 * can be reported on its own. Sent to GA4 when it is set up, otherwise to the
 * Tag Manager dataLayer.
 */
const TRACK_CLICKS = `document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-track]');if(!a)return;var n=a.getAttribute('data-track'),p={link_url:a.href||''},pg=a.getAttribute('data-track-page');if(pg)p.page=pg;if(window.gtag)window.gtag('event',n,p);else(window.dataLayer=window.dataLayer||[]).push(Object.assign({event:n},p))});`;

/** Google Analytics 4 and/or Tag Manager. Nothing loads when the env vars are empty. */
export function Analytics() {
  return (
    <>
      {TTR_SITE_KEY ? <script async src="https://ttr-portal.vercel.app/api/site/script" data-site={TTR_SITE_KEY} /> : null}
      {GTM_ID ? (
        <Script id="gtm" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}
      {GA_ID ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
          <Script id="ga" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      ) : null}
      {GA_ID || GTM_ID ? (
        <Script id="track-clicks" strategy="lazyOnload">
          {TRACK_CLICKS}
        </Script>
      ) : null}
    </>
  );
}
