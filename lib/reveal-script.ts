/**
 * Inline, dependency-free scroll reveal. Runs at the end of <body>.
 *
 * - Content stays visible if this never runs: CSS only hides [data-reveal]
 *   once <html data-reveal-ready> is set here.
 * - Elements get a data-in attribute (not a class) so React re-renders
 *   never undo it.
 * - Marks below the first screen are queued until React has hydrated (the
 *   "ddg:hydrated" event from <HydrationSignal/>), so server and client HTML
 *   match. Elements already on the first screen are revealed at once: they
 *   would otherwise stay invisible until the JavaScript has run, which held
 *   back the largest-contentful-paint photo (About page, PageSpeed TTR-1449).
 *   A 4s failsafe reveals everything queued if hydration never completes.
 * - A section that starts inside the first screen is shown as soon as any part of it is in view, instead of waiting for
 *   12% of it to clear the 8% bottom margin. While hidden it sits 24px lower, which could keep a tall block that is
 *   only partly on the first screen (About photo at 1440px) just under that threshold, hidden until the first scroll.
 *   Sections that start below the first screen keep the 12% rule and the same scroll animation.
 * - [data-anim] scopes get data-playing only while on screen, so looping
 *   decorative animations never run off screen. SVG (SMIL) animations inside
 *   them are paused from the start and only run while on screen.
 */
export const revealScript = `(function(){var d=document.documentElement;if(!("IntersectionObserver" in window))return;d.setAttribute("data-reveal-ready","");var ready=!!window.__ddgHydrated,queue=[];function mark(el){if(ready||el.getBoundingClientRect().top<innerHeight)el.setAttribute("data-in","");else queue.push(el)}function flush(){if(ready)return;ready=true;for(var i=0;i<queue.length;i++)queue[i].setAttribute("data-in","");queue=[];scan()}window.addEventListener("ddg:hydrated",flush,{once:true});setTimeout(flush,4000);function onIntersect(es){for(var i=0;i<es.length;i++){var e=es[i];if(e.isIntersecting){mark(e.target);e.target.__io.unobserve(e.target)}}}var io=new IntersectionObserver(onIntersect,{rootMargin:"0px 0px -8% 0px",threshold:0.12});var ioTop=new IntersectionObserver(onIntersect,{threshold:0});function smil(el,on){var s=el.querySelectorAll("svg");for(var k=0;k<s.length;k++){var v=s[k];if(v.pauseAnimations){if(on)v.unpauseAnimations();else v.pauseAnimations()}}}var pre=document.querySelectorAll("[data-anim]");for(var q=0;q<pre.length;q++)smil(pre[q],false);var play=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){var e=es[i];if(e.isIntersecting)e.target.setAttribute("data-playing","");else e.target.removeAttribute("data-playing");smil(e.target,e.isIntersecting)}});var seen=new WeakSet(),seenAnim=new WeakSet();function scan(){var els=document.querySelectorAll("[data-reveal],[data-reveal-words]");for(var i=0;i<els.length;i++){var el=els[i];if(!seen.has(el)){seen.add(el);var o=el.getBoundingClientRect().top<innerHeight?ioTop:io;el.__io=o;o.observe(el)}}if(!ready)return;var an=document.querySelectorAll("[data-anim]");for(var j=0;j<an.length;j++){var a=an[j];if(!seenAnim.has(a)){seenAnim.add(a);play.observe(a)}}}scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true})})();`;
