import type { NextConfig } from "next";

/*
 * Static export for SiteGround (Apache) hosting: `npm run build` writes plain
 * HTML/CSS/JS to `out/`, which goes into public_html.
 *
 * What a static host has no Node server for lives elsewhere:
 * - redirects, security headers (CSP) and caching: public/.htaccess
 * - appointments: the Jarvis Analytics online scheduler on /contact/ (iframe)
 * - images: WebP copies made before the build by scripts/optimize-images.mjs,
 *   picked by lib/image-loader.ts
 * - CMS updates: rebuild and upload (.github/workflows/deploy-siteground.yml),
 *   started by a push, a Sanity webhook or the "Run workflow" button
 */
/*
 * Vercel (VERCEL is set during Vercel builds) serves the live site since Oct 22, 2026 and runs it as a normal Next.js
 * app, so the Studio's inner addresses (/cms/structure/...) render on demand instead of needing an .htaccess rewrite.
 * Redirects, security headers and caching for Vercel are in vercel.json. The static export stays for SiteGround.
 */
const onVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  output: onVercel ? undefined : "export",
  // /about-us/ -> about-us/index.html, which Apache serves as is
  // (the live URLs had no slash; .htaccess sends /about to /about/).
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    // Keep in sync with WIDTHS in scripts/optimize-images.mjs.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [96, 256, 384],
    qualities: [75],
  },
};

export default nextConfig;
