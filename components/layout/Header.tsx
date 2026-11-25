"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import type { Img, Link as LinkT, MenuItem } from "@/lib/types";

/*
 * Sticky ivory header (Valencia / Ideal style): logo, uppercase menu (Services opens a three-column mega menu on
 * hover or focus), phone and a dark "Book" pill. The full menu shows only where it fits on one line (the `nav`
 * breakpoint in globals.css, plus a size check for wider system fonts); below that a slide-in phone menu takes
 * over, so the menu never wraps.
 */
export function Header({ menu, cta, phone, phoneHref, logo, siteName }: { menu: MenuItem[]; cta: LinkT; phone: string; phoneHref: string; logo: Img; siteName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const needRef = useRef(0);
  const [compact, setCompact] = useState(false);

  // Never let the menu wrap: system fonts differ per device, so besides the CSS breakpoint,
  // switch to the phone menu whenever the full row would not fit.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const ro = new ResizeObserver(() => {
      const cs = getComputedStyle(row);
      const inner = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const parts = ["[data-row-logo]", "[data-row-nav]", "[data-row-right]"].map((q) => row.querySelector<HTMLElement>(q));
      // Widths can only be read while the full menu is shown; keep the last reading.
      if (parts.every((el) => el && el.offsetWidth)) needRef.current = parts.reduce((sum, el) => sum + (el?.scrollWidth ?? 0), 0) + 48;
      setCompact(needRef.current > 0 && inner < needRef.current);
    });
    ro.observe(row);
    return () => ro.disconnect();
  }, []);
  const full = compact ? "hidden" : "hidden nav:flex";
  const phoneOnly = compact ? "" : "nav:hidden";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the phone menu on navigation (state adjusted during render, as React recommends).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Phone menu: lock page scroll, Escape closes, focus moves into the panel and back.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const toggle = toggleRef.current;
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  // The top-level item for the current page (a service page highlights Services, a post highlights Patient Education).
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-50 h-[var(--header-h)] border-b bg-ivory/95 backdrop-blur transition-[border-color,box-shadow] duration-300 ${scrolled ? "border-line shadow-[0_8px_24px_-20px_rgb(17_17_16/0.5)]" : "border-transparent"}`}>
      <div ref={rowRef} className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 xl:px-12">
        <Link href="/" data-row-logo className="flex min-h-12 shrink-0 items-center gap-2.5">
          {/* Small logo: no preload, so it never competes with the hero photo. */}
          <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} sizes="65px" className="h-10 w-auto object-contain md:h-11" />
          <span className="hidden whitespace-nowrap text-[1.0625rem] font-semibold tracking-[0.02em] text-ink-900 sm:block">{siteName}</span>
        </Link>

        <nav aria-label="Main" data-row-nav className={`${full} items-center`}>
          <ul className="flex items-center">
            {menu.map((item) =>
              item.groups?.length ? (
                <li key={item.href} className="mega-host relative">
                  <Link href={item.href} aria-haspopup="true" data-active={isActive(item.href) || undefined} className="nav-link flex min-h-11 items-center gap-1 whitespace-nowrap px-2.5 text-[0.9375rem] font-bold text-ink-900 transition-colors hover:text-gold-700">
                    {item.label}
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <div className="mega absolute left-1/2 top-full w-[680px] -translate-x-1/2 pt-3">
                    <div className="grid grid-cols-3 gap-8 rounded-lg border border-line bg-ivory p-7 shadow-[0_24px_48px_-28px_rgb(17_17_16/0.45)]">
                      {item.groups.map((g) => (
                        <div key={g.heading}>
                          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-gold-700">{g.heading}</p>
                          <ul className="space-y-1">
                            {g.links.map((l) => (
                              <li key={l.href}>
                                <Link href={l.href} className="block rounded-sm py-1 text-[0.9375rem] text-grey-700 transition-colors hover:text-ink-900 hover:underline hover:decoration-gold-500/60">
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} data-active={isActive(item.href) || undefined} aria-current={pathname === item.href ? "page" : undefined} className="nav-link flex min-h-11 items-center whitespace-nowrap px-2.5 text-[0.9375rem] font-bold text-ink-900 transition-colors hover:text-gold-700">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div data-row-right className={`${full} shrink-0 items-center gap-5`}>
          <a href={phoneHref} data-track="click_to_call" className="flex min-h-11 items-center gap-2 whitespace-nowrap text-[0.9375rem] font-bold text-ink-900 transition-colors hover:text-gold-700">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {phone}
          </a>
          <Link href={cta.href} data-track="book_appointment" className="btn btn-primary btn-sm uppercase tracking-[0.04em]">
            {cta.label}
          </Link>
        </div>

        <div className={`${phoneOnly} flex items-center gap-1`}>
          <a href={phoneHref} data-track="click_to_call" aria-label={`Call ${siteName} at ${phone}`} className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold text-ink-900 hover:bg-sand">
            <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="hidden whitespace-nowrap sm:inline">{phone}</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-900 transition-colors hover:bg-sand"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Phone menu: overlay + panel from the right. */}
      <div className={`${phoneOnly} fixed inset-0 z-50 bg-ink-950/60 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`${phoneOnly} fixed inset-y-0 right-0 z-50 flex h-dvh w-[min(22rem,100vw)] flex-col overflow-y-auto bg-ivory px-6 pb-8 pt-5 shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-gold-700">Menu</span>
          <button type="button" onClick={() => setOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {menu.map((item) =>
            item.groups?.length ? (
              <li key={item.href}>
                <button type="button" aria-expanded={servicesOpen} onClick={() => setServicesOpen((v) => !v)} className="flex min-h-14 w-full items-center justify-between text-left text-lg font-semibold uppercase tracking-[0.02em]">
                  {item.label}
                  <ChevronDown className={`h-5 w-5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                <div hidden={!servicesOpen} className="pb-4">
                  <Link href={item.href} className="block py-2 font-semibold text-gold-700">
                    All services
                  </Link>
                  {item.groups.map((g) => (
                    <div key={g.heading} className="mt-3">
                      <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-grey-600">{g.heading}</p>
                      {g.links.map((l) => (
                        <Link key={l.href} href={l.href} className="block py-2 text-grey-700">
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </li>
            ) : (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-14 items-center text-lg font-semibold uppercase tracking-[0.02em]">
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
        <div className="mt-auto space-y-3 pt-8">
          <Link href={cta.href} data-track="book_appointment" className="btn btn-primary w-full">
            {cta.label}
          </Link>
          <a href={phoneHref} data-track="click_to_call" className="btn btn-outline w-full">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {phone}
          </a>
        </div>
      </div>
    </header>
  );
}
