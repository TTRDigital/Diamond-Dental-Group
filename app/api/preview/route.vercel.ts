import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPreview } from "@/lib/preview";

/*
 * Signed draft-preview link (Vercel build only; next.config.ts leaves this file out of the SiteGround static export).
 *
 *   GET /api/preview?path=/about/&exp=<unix seconds>&sig=<hex>
 *   sig = HMAC-SHA256(PREVIEW_SECRET, "<path>\n<exp>"), hex. exp must be in the future and at most 30 days ahead.
 *   GET /api/preview?exit=1 turns Draft Mode off again.
 *
 * With a valid link it turns on Draft Mode (a cookie) and redirects to the page, which then reads the Sanity DRAFT
 * (lib/sanity/fetch.ts, using SANITY_READ_TOKEN on the server). Everyone else keeps getting the published page.
 */
export const dynamic = "force-dynamic";

const text = (body: string, status: number) => new Response(body, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "Content-Type": "text/plain; charset=utf-8" } });

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;

  if (q.get("exit")) {
    (await draftMode()).disable();
    redirect("/");
  }

  const secret = process.env.PREVIEW_SECRET;
  const missing = [!secret && "PREVIEW_SECRET", !process.env.SANITY_READ_TOKEN && "SANITY_READ_TOKEN"].filter(Boolean);
  if (missing.length) return text(`Preview is not set up: add ${missing.join(" and ")} in the Vercel environment variables.`, 503);

  const check = verifyPreview(secret as string, { path: q.get("path"), exp: q.get("exp"), sig: q.get("sig") });
  if (!check.ok) return text(check.reason, check.status);

  (await draftMode()).enable();
  redirect(check.path);
}
