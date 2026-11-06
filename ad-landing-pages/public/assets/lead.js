// Lead form dialog, open-now badge and today's hours row for the Diamond Dental ad pages.
// Google Ads tracking runs through the same Tag Manager container as the old pages (GTM-M664LDQG):
//  - form: on a successful send we push dataLayer event "lead", which fires conversion AW-18248006682/QZYrCJeAm8IcEJr4qf1D (Submit lead form)
//  - phone: any tel: link tap fires AW-18248006682/NrG4CM6boMIcEJr4qf1D (Contact (1)) through the container's link-click trigger
(function () {
  var dlg = document.getElementById("lead");
  var form = document.getElementById("lead-form");
  if (!dlg || !form) return;
  var err = form.querySelector(".form-error");
  var btn = form.querySelector("button[type=submit]");
  var body = dlg.querySelector(".lead-body");
  var thanks = dlg.querySelector(".thanks");

  // Earliest visit date: today in Roseville (Pacific time).
  var date = form.querySelector("input[name=visitDate]");
  try {
    var parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date());
    if (date) date.min = parts;
  } catch (e) {}

  function open(e) {
    if (e) e.preventDefault();
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
    var first = form.querySelector("input[name=firstName]");
    if (first && thanks.hidden) setTimeout(function () { first.focus(); }, 30);
  }
  function close() {
    if (typeof dlg.close === "function") dlg.close();
    else dlg.removeAttribute("open");
  }
  document.querySelectorAll("[data-open-lead]").forEach(function (a) { a.addEventListener("click", open); });
  dlg.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", close); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.classList.remove("on");
    if (!form.reportValidity()) return;
    var digits = (form.phone.value || "").replace(/\D/g, "");
    if (digits.length < 10) { err.textContent = "Please enter a valid phone number."; err.classList.add("on"); return; }
    btn.disabled = true;
    var label = btn.textContent;
    btn.textContent = "Sending...";
    var fd = new FormData(form);
    // On offer./implant. the page is served at "/" (and any other path), so name it by host for the lead's source label.
    var path = location.pathname.replace(/\/$/, "");
    if (path !== "/offer" && path !== "/implant") path = /^implant\./i.test(location.hostname) ? "/implant" : "/offer";
    fd.set("page", path);
    fd.set("landing", location.href.split("#")[0]);
    fd.set("referrer", document.referrer || "");
    fetch(form.action, { method: "POST", body: fd })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (res) {
        if (!res || !res.ok) throw new Error((res && res.error) || "We could not send that.");
        (window.dataLayer = window.dataLayer || []).push({ event: "lead", form_name: "Claim Offer Form", offer: fd.get("offer") });
        body.hidden = true;
        thanks.hidden = false;
        form.reset();
      })
      .catch(function (x) {
        err.textContent = (x && x.message) || "We could not send that. Please call (916) 282-5377.";
        err.classList.add("on");
      })
      .then(function () { btn.disabled = false; btn.textContent = label; });
  });

  // Open now / closed, and today's row, in Pacific time.
  try {
    var now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var row = document.querySelector('.hours li[data-day="' + day + '"]');
    if (row) row.classList.add("today");
    var badge = document.querySelector(".status");
    if (badge && row) {
      var o = row.getAttribute("data-open"), c = row.getAttribute("data-close");
      var isOpen = false;
      if (o && c) { var a = o.split(":"), b = c.split(":"); isOpen = mins >= +a[0] * 60 + +a[1] && mins < +b[0] * 60 + +b[1]; }
      badge.textContent = isOpen ? "Open now" : "Closed now";
      if (!isOpen) badge.classList.add("closed");
    }
  } catch (e) {}
})();
