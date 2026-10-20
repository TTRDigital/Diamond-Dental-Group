"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import type { Img, Link as LinkT, MenuItem } from "@/lib/types";

/*
 * Fixed header like the live site: black address bar, white bar with logo,
 * menu (Services opens a three-column mega menu on hover/focus), phone and
 * gold button. The full menu shows only where it fits on one line (the
 * `nav` breakpoint in globals.css); below that the phone menu (a slide-in
 * panel) takes over, so the menu never wraps.
 */
export function Header({
  menu,
  cta,
  phone,
  phoneHref,
  logo,
  siteName,
  address,
  mapsUrl,
}: {
  menu: MenuItem[];
  cta: LinkT;
  phone: string;
  phoneHref: string;
  logo: Img;
  siteName: string;
  address: string;
  mapsUrl: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const needRef = useRef(0);
  const [compact, setCompact] = useState(false);

  // Never let the menu wrap: system fonts differ per device, so besides the CSS
  // breakpoint, switch to the phone menu whenever the full row would not fit.
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
    const onScroll = () => setScrolled(window.scrollY > 20);
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col">
      <div className="bg-black text-white text-xs py-1.5 text-center">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
          {address}
        </a>
      </div>
      <header className={`w-full transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-white/95 backdrop-blur-sm py-4"}`}>
        <div ref={rowRef} className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" data-row-logo className="flex items-center gap-2 shrink-0">
            {/* Small logo: a plain img (no preload) so it never competes with the hero image. */}
            <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} unoptimized className="h-10 md:h-12 w-auto object-contain" />
            <span className="text-black font-bold text-lg md:text-xl tracking-wide hidden sm:block whitespace-nowrap">{siteName}</span>
          </Link>

          <nav aria-label="Main" data-row-nav className={`${full} items-center space-x-8`}>
            {menu.map((item) =>
              item.groups?.length ? (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    aria-haspopup="true"
                    className="flex items-center text-sm font-bold hover:text-secondary transition-colors py-2 whitespace-nowrap"
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Link>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white shadow-xl rounded-xl p-6 grid grid-cols-3 gap-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto border border-gray-100">
                    {item.groups.map((g) => (
                      <div key={g.heading}>
                        <p className="font-heading font-bold text-secondary mb-3 text-sm uppercase tracking-wider">{g.heading}</p>
                        <ul className="space-y-2">
                          {g.links.map((l) => (
                            <li key={l.href}>
                              <Link href={l.href} className="text-sm text-gray-600 hover:text-secondary hover:font-medium block">
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="text-sm font-bold hover:text-secondary transition-colors whitespace-nowrap">
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div data-row-right className={`${full} items-center space-x-4 shrink-0`}>
            <a href={phoneHref} data-track="click_to_call" className="flex items-center text-black font-bold hover:text-secondary transition-colors text-sm whitespace-nowrap">
              <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
              {phone}
            </a>
            <Link
              href={cta.href}
              data-track="book_appointment"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm h-10 py-2 bg-secondary hover:bg-gold-hover text-black font-bold rounded-lg px-6 shadow-md transition-all"
            >
              {cta.label}
            </Link>
          </div>

          <div className={`${phoneOnly} flex items-center gap-3`}>
            <a
              href={phoneHref}
              data-track="click_to_call"
              aria-label={`Call ${siteName} at ${phone}`}
              className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-3 sm:px-4 rounded-lg bg-secondary text-black font-bold text-xs sm:text-base shrink-0 shadow-[0_2px_8px_rgba(229,184,51,0.4)] hover:bg-gold-hover transition-colors"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">{phone}</span>
            </a>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-md h-10 w-10 min-w-[44px] min-h-[44px] text-black hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Phone menu: overlay + panel from the right (live: shadcn Sheet, 300px). */}
      <div className={`${phoneOnly} fixed inset-0 z-50 bg-black/80 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`${phoneOnly} fixed z-50 inset-y-0 right-0 h-full w-[300px] sm:max-w-sm bg-white border-l p-6 shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col space-y-6 mt-8">
          {menu.map((item) =>
            item.groups?.length ? (
              <div key={item.href}>
                <button type="button" aria-expanded={servicesOpen} onClick={() => setServicesOpen((v) => !v)} className="flex items-center text-lg font-bold w-full justify-between">
                  {item.label}
                  <ChevronDown className={`w-5 h-5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                <div hidden={!servicesOpen} className="pl-4 mt-4 space-y-4">
                  {item.groups
                    .flatMap((g) => g.links)
                    .map((l) => (
                      <Link key={l.href} href={l.href} className="block text-gray-600 py-1">
                        {l.label}
                      </Link>
                    ))}
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="text-lg font-bold">
                {item.label}
              </Link>
            ),
          )}
          <hr />
          <a href={phoneHref} data-track="click_to_call" className="flex items-center text-lg font-bold text-secondary">
            <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
            {phone}
          </a>
          <Link
            href={cta.href}
            data-track="book_appointment"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm h-10 px-4 py-2 bg-secondary hover:bg-gold-hover text-black font-bold w-full transition-colors"
          >
            {cta.label}
          </Link>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}
