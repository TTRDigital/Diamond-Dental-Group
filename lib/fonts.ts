import localFont from "next/font/local";

/**
 * Urbanist (OFL, app/fonts), the typeface of the Ideal Dental / Valencia Dentistry design this site follows.
 * Variable weight axis, Latin subset, self-hosted and preloaded by next/font (no request to Google).
 */
export const urbanist = localFont({
  src: "../app/fonts/urbanist-latin-wght.woff2",
  variable: "--font-urbanist",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});
