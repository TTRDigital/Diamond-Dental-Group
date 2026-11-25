import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export type Crumb = { name: string; path: string };

/**
 * Breadcrumb trail. `variant="hero"` sits inside a dark page hero (light text); the default is a slim cream bar
 * under the header. Also writes the page's BreadcrumbList schema; `schema` can differ from the visible trail (e.g. the
 * readable post title instead of the slug label). jsonLd={false} leaves the schema out (the page's own seo.schema
 * replaces it).
 */
export function Breadcrumbs({ items, schema, jsonLd = true, variant = "bar" }: { items: Crumb[]; schema?: Crumb[]; jsonLd?: boolean; variant?: "bar" | "hero" }) {
  const onHero = variant === "hero";
  const trail = (
    <ol className={`flex items-center overflow-x-auto whitespace-nowrap text-sm no-scrollbar ${onHero ? "text-white/70" : "text-grey-600"}`}>
      {items.map((c, i) => (
        <li key={c.path} className="flex items-center">
          {i > 0 ? (
            <span className={`mx-2 ${onHero ? "text-white/40" : "text-grey-400"}`} aria-hidden="true">
              /
            </span>
          ) : null}
          {i < items.length - 1 ? (
            <Link href={c.path} className={`inline-flex min-h-9 items-center transition-colors ${onHero ? "hover:text-white" : "hover:text-ink-900"}`}>
              {c.name}
            </Link>
          ) : (
            <span className={`font-semibold ${onHero ? "text-white" : "text-ink-900"}`} aria-current="page">
              {c.name}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
  return (
    <>
      {jsonLd ? <JsonLd data={breadcrumbSchema(schema ?? items)} /> : null}
      {onHero ? (
        <nav aria-label="Breadcrumb">{trail}</nav>
      ) : (
        <nav aria-label="Breadcrumb" className="border-b border-line bg-cream">
          <div className="container-x py-2">{trail}</div>
        </nav>
      )}
    </>
  );
}
