const GA_ID = process.env.NEXT_PUBLIC_GA_ID === "off" ? "" : process.env.NEXT_PUBLIC_GA_ID || "";
// The live site's Tag Manager container (it loads GA4 and the Google Ads tag), so Vercel builds carry it without an env var ("off" turns it off).
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

/*
 * Google's scripts load after the visitor's first touch, scroll or key press, or after 10 seconds, so they never compete
 * with the first paint (Lighthouse Oct 22: the container blocked the page for about 400 ms on phones and delayed the hero
 * photo). Events sent before that queue in dataLayer and go out once the tag is in. Nothing loads when the ids are empty.
 */
const GOOGLE_LOADER = `(function(){window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}if(!window.gtag)window.gtag=gtag;${GA_ID ? `gtag('js',new Date());gtag('config','${GA_ID}');` : ""}var done=false;function load(){if(done)return;done=true;${GA_ID ? `var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s);` : ""}${GTM_ID ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');` : ""}}['pointerdown','keydown','scroll','touchstart'].forEach(function(e){addEventListener(e,load,{once:true,passive:true})});setTimeout(load,10000);})();`;

/** Tag Manager and/or Google Analytics 4, plus the TTR OS tracker. Nothing loads when the ids are empty. */
export function Analytics() {
  return (
    <>
      {TTR_SITE_KEY ? <script async src="https://ttr-portal.vercel.app/api/site/script" data-site={TTR_SITE_KEY} /> : null}
      {GA_ID || GTM_ID ? <script dangerouslySetInnerHTML={{ __html: GOOGLE_LOADER + TRACK_CLICKS }} /> : null}
    </>
  );
}
