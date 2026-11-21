import { revalidatePath, revalidateTag } from "next/cache";
import { isValidWebhook, planRevalidate } from "@/lib/revalidate";

/*
 * Refresh after a publish (Vercel build only; next.config.ts leaves this file out of the SiteGround static export).
 *
 *   POST /api/revalidate   body: JSON, for example { "_id": "...", "_type": "post", "path": "/blog/x/" }
 *   header sanity-webhook-signature: t=<ms>,v1=<base64url HMAC-SHA256(SANITY_REVALIDATE_SECRET, "<t>.<body>")>
 *
 * Called by TTR OS after it publishes, and by the Sanity publish webhook (same secret; projection
 * {_id, _type, "slug": slug.current}). It refreshes the document's id and type tags and the path if one is given,
 * so the next visit gets the new version. Without a valid signature nothing is refreshed.
 */
export const dynamic = "force-dynamic";

const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return json({ ok: false, message: "Refresh is not set up: add SANITY_REVALIDATE_SECRET in the Vercel environment variables." }, 503);

  const raw = await request.text();
  if (raw.length > 100_000) return json({ ok: false, message: "Body too large." }, 413);
  if (!isValidWebhook(secret, raw, request.headers.get("sanity-webhook-signature"))) return json({ ok: false, message: "Invalid signature." }, 401);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, message: "Body is not JSON." }, 400);
  }

  const plan = planRevalidate(body);
  if (!plan.tags.length && !plan.paths.length) return json({ ok: false, message: "Nothing to refresh: send _id, _type or path." }, 400);
  // expire 0: the next visit waits for the fresh version instead of getting the old one (TTR OS checks the live page right after).
  for (const tag of plan.tags) revalidateTag(tag, { expire: 0 });
  for (const path of plan.paths) revalidatePath(path);
  return json({ ok: true, revalidated: plan }, 200);
}
