/*
 * TTR OS's "Suggest a change" bar (TTR-585), on Vercel previews only (never the live site, so it is never in a
 * production page). It does nothing unless the page was opened from the client's private review link (a review
 * token after #); the client highlights words on the draft and leaves notes for TTR. The site's CSP already
 * allows ttr-portal.vercel.app.
 */
export function ReviewBar() {
  return process.env.VERCEL_ENV === "preview" ? <script defer src="https://ttr-portal.vercel.app/api/site/notes/bar" /> : null;
}
