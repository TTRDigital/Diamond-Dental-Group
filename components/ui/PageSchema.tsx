import type { Seo } from "@/lib/types";
import { seoSchemaNodes } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";

/** The structured data stored on the page in the CMS (seo.schema). Renders nothing when it is empty or not valid JSON-LD. */
export function PageSchema({ seo }: { seo: Seo }) {
  const nodes = seoSchemaNodes(seo.schema);
  return nodes ? nodes.map((n, i) => <JsonLd key={i} data={n} />) : null;
}
