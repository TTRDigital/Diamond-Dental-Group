import "./globals.css";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata = { title: { absolute: "Page Not Found | Diamond Dental Group" }, robots: { index: false } };

/* Same look as the live 404, but served with a real 404 status (.htaccess ErrorDocument). */
export default function NotFound() {
  return (
    <SiteShell>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <Link href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
