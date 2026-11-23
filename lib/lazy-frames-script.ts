/**
 * Inline, dependency-free loader for the two third-party iframes (Google Maps above the footer, the Jarvis online
 * scheduler on /contact/). Runs at the end of <body>, before React hydrates.
 *
 * Why (TTR-2880, Lighthouse mobile): with only loading="lazy", Chrome on a phone loads an iframe as soon as it is within
 * about 1,250 to 2,500 px of the screen, so on a short page the map started loading before the main content had painted,
 * and every request that starts before the largest paint counts against it.
 *
 * - iframe[data-src][data-load="near"]: gets its src once it is within 300 px of the screen (the map).
 * - iframe[data-src][data-load="after-load"]: gets its src once the page has loaded (the scheduler, which is on the
 *   first screen of /contact/).
 * - The box around each iframe keeps its size and background, so nothing moves while it waits.
 * - Pages opened by a link inside the site (no new document) are handled too: new iframes are picked up as they appear.
 * - No IntersectionObserver (very old browsers): the src is set right away. Without JavaScript, a <noscript> copy of
 *   the iframe loads instead.
 */
export const lazyFramesScript = `(function(){var loaded=document.readyState==="complete",io="IntersectionObserver" in window?new IntersectionObserver(function(es){for(var j=0;j<es.length;j++)if(es[j].isIntersecting){go(es[j].target);io.unobserve(es[j].target)}},{rootMargin:"300px 0px"}):null,seen=new WeakSet(),late=[];function go(f){var s=f.getAttribute("data-src");if(s&&f.getAttribute("src")!==s)f.setAttribute("src",s)}function scan(){var fs=document.querySelectorAll("iframe[data-src]");for(var i=0;i<fs.length;i++){var f=fs[i];if(seen.has(f))continue;seen.add(f);if(f.getAttribute("data-load")==="after-load"){if(loaded)go(f);else late.push(f)}else if(io)io.observe(f);else go(f)}}addEventListener("load",function(){loaded=true;for(var k=0;k<late.length;k++)go(late[k]);late=[]},{once:true});scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true})})();`;
