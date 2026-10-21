import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { getContact, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContact();
  return pageMetadata(c.seo, "/contact/");
}

export default async function ContactPage() {
  const [c, s] = await Promise.all([getContact(), getSiteSettings()]);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact/" },
        ]}
      />
      <div className="bg-animated-mesh font-sans pb-16 min-h-screen" data-anim>
        <section className="relative pt-32 pb-20 px-4">
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="inline-block bg-black text-secondary font-bold px-4 py-1.5 rounded-full text-sm mb-6 border border-secondary/20">{c.badge}</div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-black mb-6 tracking-tight">
              {c.heading}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-600">{c.headingAccent}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">{c.text}</p>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                {/* Online scheduler (Jarvis Analytics), as on the live page. */}
                <div className="bg-white/70 backdrop-blur-xl p-4 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full min-h-[700px] overflow-hidden relative">
                  <iframe title={c.bookingTitle} src={s.bookingUrl} loading="lazy" className="absolute inset-0 w-full h-full border-0 rounded-[2rem]" />
                </div>
              </div>
              <div className="lg:col-span-5 grid grid-cols-1 gap-6">
                <div className="bg-black text-white p-8 rounded-[2rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-colors" />
                  <h2 className="text-xl font-bold text-white mb-6 relative z-10">{c.directHeading}</h2>
                  <a href={s.phoneHref} data-track="click_to_call" className="flex items-center group/link mb-6 relative z-10">
                    <div className="bg-white/10 p-4 rounded-full mr-4 group-hover/link:bg-secondary group-hover/link:text-black transition-colors">
                      <Phone className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block font-bold text-2xl text-secondary group-hover/link:text-white transition-colors">{s.phone}</span>
                      <span className="text-white/60 text-sm">{c.callLabel}</span>
                    </div>
                  </a>
                  <div className="flex items-start relative z-10">
                    <div className="bg-white/10 p-4 rounded-full mr-4">
                      <MapPin className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block font-bold text-lg">{s.name}</span>
                      <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-white/60 text-sm hover:text-secondary transition-colors">
                        {s.street}
                        <br />
                        {s.city}, {s.region} {s.postalCode}, {s.country}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h2 className="text-xl font-bold text-black mb-6 flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-secondary" aria-hidden="true" />
                    {c.hoursHeading}
                  </h2>
                  <ul className="space-y-3 text-sm text-gray-600">
                    {s.hours.map((h) => (
                      <li key={h.day} className={`flex justify-between pb-2 ${h.opens ? "border-b border-gray-50" : "text-gray-400"}`}>
                        <span>{h.day}</span>
                        <span className={h.opens ? "font-medium text-black" : ""}>{h.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
