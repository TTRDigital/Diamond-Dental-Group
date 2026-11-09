// Sanity access for the ad pages. The project id is public (it is in every image URL). Reads need no token while the
// dataset is public; SANITY_READ_TOKEN is used only if a person sets it in Vercel. No token is ever written in code.
export const PROJECT_ID = process.env.SANITY_PROJECT_ID || "stnpzvwa";
export const DATASET = process.env.SANITY_DATASET || "production";
export const API_VERSION = "2025-02-19";
export const DOC_TYPE = "landingPage";
export const docId = (slug) => `landingPage.${slug}`;

export async function fetchLandingPage(slug) {
  const q = `*[_type == "${DOC_TYPE}" && slug.current == $slug][0]`;
  const host = process.env.SANITY_READ_TOKEN ? "api" : "apicdn";
  const url = `https://${PROJECT_ID}.${host}.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(q)}&$slug=${encodeURIComponent(JSON.stringify(slug))}&perspective=published`;
  const headers = process.env.SANITY_READ_TOKEN ? { authorization: `Bearer ${process.env.SANITY_READ_TOKEN}` } : {};
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Sanity answered ${res.status}`);
  return (await res.json()).result || null;
}
