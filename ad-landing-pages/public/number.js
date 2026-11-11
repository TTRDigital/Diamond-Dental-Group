/* Dynamic call number for the Diamond Dental Google Ads pages (TTR-1342), same method as Pro Wildlife's number.js.
   A visitor who arrives from an ad (gclid in the address) gets one tracking number from the pool for about 30 minutes
   after their last activity; calls to it are matched to the click in TTR OS and show in the client's portal.
   Anything else (no gclid, no number in the pool yet, pool busy, error, slow answer, no JavaScript): the page keeps the
   number it already shows. Until a Twilio number is added to the pool in TTR OS, this script changes nothing.
   OFF by default: the pages load it only when content "callTracking" is true (Sanity field, or content/*.json). */
(function () {
  // Numbers on the page that should be replaced by the tracking number. Kia decides: the Google Ads number only
  // (below), or also the office line (+19167554769 / (916) 755-4769).
  var SWAP = [{ tel: '+19162825377', display: '(916) 282-5377' }];
  var KEY = 'jFPFfmHN6H1wH9hZT0Pbkg';   // TTR OS site key for Diamond Dental (public, it is already in the form code)
  var API = 'https://ttr-portal.vercel.app/api/site/number';
  var STORE = 'dd_call_number', HOLD_MS = 30 * 60 * 1000, WAIT_MS = 1500;

  function read() { try { var s = JSON.parse(localStorage.getItem(STORE) || 'null'); return s && s.exp > Date.now() && s.tel && s.display ? s : null; } catch (e) { return null; } }
  function write(n) { try { localStorage.setItem(STORE, JSON.stringify({ tel: n.tel, display: n.display, exp: Date.now() + HOLD_MS })); } catch (e) {} }

  function apply(n) {
    var links = document.querySelectorAll('a[href^="tel:"]');
    for (var i = 0; i < links.length; i++) {
      var h = links[i].getAttribute('href').replace(/[^\d+]/g, '').replace(/^tel/, '');
      for (var s = 0; s < SWAP.length; s++) if (h === SWAP[s].tel) links[i].setAttribute('href', 'tel:' + n.tel);
    }
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), node, todo = [];
    while ((node = walker.nextNode())) { if (!/^(SCRIPT|STYLE|NOSCRIPT)$/.test(node.parentNode.nodeName)) todo.push(node); }
    for (var j = 0; j < todo.length; j++) for (var k = 0; k < SWAP.length; k++) {
      if (todo[j].nodeValue.indexOf(SWAP[k].display) > -1) todo[j].nodeValue = todo[j].nodeValue.split(SWAP[k].display).join(n.display);
    }
    document.documentElement.setAttribute('data-call-number', n.tel);
  }

  function run() {
    var held = read();
    if (held) { write(held); apply(held); return; }   // keep it, and renew the hold on activity
    var q = new URLSearchParams(location.search), gclid = q.get('gclid');
    if (!gclid) return;
    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, WAIT_MS);
    fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, keepalive: true, signal: ctl ? ctl.signal : undefined,
      body: JSON.stringify({ k: KEY, gclid: gclid, campaign: q.get('campaign_id') || '', adgroup: q.get('ad_group_id') || '',
        page: location.pathname, referrer: document.referrer || '' }) })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (n) { clearTimeout(timer); if (n && /^\+1\d{10}$/.test(n.number || '') && n.display) { var v = { tel: n.number, display: n.display }; write(v); apply(v); } })
      .catch(function () { clearTimeout(timer); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  ['click', 'scroll', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, function () { var h = read(); if (h) write(h); }, { passive: true }); });
})();
