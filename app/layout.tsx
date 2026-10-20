import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/lib/site";

/*
 * Root layout is intentionally bare: the website's styles and chrome live
 * in app/(site)/layout.tsx so the embedded Sanity Studio at /cms loads
 * without them. No web fonts are loaded: the live site uses system fonts.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Diamond Dental Group", template: "%s | Diamond Dental Group" },
  applicationName: "Diamond Dental Group",
  formatDetection: { telephone: false, address: false, email: false },
  icons: {
    icon: [
      { url: "/images/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/images/brand/icon-180.png",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#000000" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
