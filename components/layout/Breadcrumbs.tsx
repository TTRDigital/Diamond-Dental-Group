import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export type Crumb = { name: string; path: string };

/**
 * Grey breadcrumb bar under the header (live: labels come from the URL).
 * Also writes the page's BreadcrumbList schema; `schema` can differ from the
 * visible trail (e.g. the readable post title instead of the slug label).
 * jsonLd={false} leaves the schema out (the page's own seo.schema replaces it).
 */
export function Breadcrumbs({ items, schema, jsonLd = true }: { items: Crumb[]; schema?: Crumb[]; jsonLd?: boolean }) {
  return (
    <>
      {jsonLd ? <JsonLd data={breadcrumbSchema(schema ?? items)} /> : null}
      <nav aria-label="Breadcrumb" className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200 py-3">
        <ol className="container mx-auto px-4 flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap no-scrollbar">
          {items.map((c, i) => (
            <li key={c.path} className="flex items-center">
              {i > 0 ? (
                <span className="mx-2 text-gray-300" aria-hidden="true">
                  /
                </span>
              ) : null}
              {i < items.length - 1 ? (
                <Link href={c.path} className="hover:text-secondary transition-colors font-medium">
                  {c.name}
                </Link>
              ) : (
                <span className="text-black font-semibold" aria-current="page">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
