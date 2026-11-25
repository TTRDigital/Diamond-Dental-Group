import "./globals.css";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata = { title: { absolute: "Page Not Found | Diamond Dental Group" }, robots: { index: false } };

/* The live 404's words, in the new design; served with a real 404 status. */
export default function NotFound() {
  return (
    <SiteShell>
      <section className="section flex min-h-[60vh] items-center">
        <div className="container-x text-center">
          <p className="text-[4.5rem] font-semibold leading-none text-gold-700">404</p>
          <h1 className="mt-4">Oops! Page not found</h1>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
