import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Search and AI crawlers are welcome (as on the live site); only the studio and the thank-you page are off limits.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cms/", "/thank-you/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
