import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronDown, CircleCheck, Phone, Star } from "lucide-react";
import { getService, getServices, getServicesHub, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { faqPageSchema } from "@/lib/schema";
import { slugLabel } from "@/lib/text";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { btnBase, btnGold } from "@/components/ui/Buttons";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const sv = await getService((await params).slug);
  if (!sv) return {};
  return pageMetadata(sv.seo, `/services/${sv.slug}/`, sv.heroImage);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [sv, hub, s] = await Promise.all([getService(slug), getServicesHub(), getSiteSettings()]);
  if (!sv) notFound();
  const t = hub.template;
  const path = `/services/${sv.slug}/`;

  return (
    <>
      {/* Visible trail as on the live site; the schema uses the readable service name. */}
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services/" },
          { name: slugLabel(sv.slug), path },
        ]}
        schema={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services/" },
          { name: sv.name, path },
        ]}
      />
      {sv.faqs.length ? <JsonLd data={faqPageSchema(sv.faqs)} /> : null}
      <div className="bg-background font-sans pb-16">
        <section className="relative min-h-[80vh] flex items-center bg-black overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 h-full z-0">
            <Image
              src={sv.heroImage.src}
              alt={sv.heroImage.alt}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full h-full object-cover opacity-40 lg:opacity-80 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-black/60 lg:bg-transparent" />
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          </div>
          <div className="container mx-auto px-4 relative z-10 flex">
            <div className="w-full lg:w-1/2 lg:pr-16 pt-32 pb-20">
              <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4 text-secondary fill-secondary" aria-hidden="true" />
                <span className="text-white text-xs font-bold uppercase tracking-widest">{t.badge}</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] md:leading-none tracking-tight">
                {sv.heading}
                <br />
                <span className="text-secondary text-3xl md:text-4xl lg:text-5xl font-medium tracking-normal">{sv.headingSuffix}</span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-xl font-light leading-relaxed border-l-4 border-secondary pl-6">{sv.sub}</p>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link
                  href="/contact/"
                  data-track="book_appointment"
                  className={`${btnGold} font-extrabold rounded-xl px-8 py-7 text-lg shadow-[0_4px_14px_rgba(229,184,51,0.4)] hover:-translate-y-1 transition-all`}
                >
                  {t.primaryButton}
                </Link>
                <a
                  href={s.phoneHref}
                  data-track="click_to_call"
                  className={`${btnBase} transition-colors border h-10 border-gray-200 bg-white text-black hover:bg-gray-100 hover:text-black px-8 py-7 rounded-xl text-lg font-bold`}
                >
                  <Phone className="w-5 h-5 mr-3" aria-hidden="true" />
                  {s.phone}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-animated-mesh relative" data-anim>
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="w-full lg:w-2/3 space-y-20">
                <div data-reveal>
                  <h2 className="text-4xl font-extrabold text-black mb-8 tracking-tight">{t.whatItIsHeading}</h2>
                  <div className="max-w-none text-gray-600 space-y-6">
                    {sv.whatItIs.map((p, i) => (
                      <p key={i} className="text-xl leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
                <div data-reveal>
                  <h2 className="text-3xl font-extrabold text-black mb-8">{t.rightForYouHeading}</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sv.rightForYou.map((it) => (
                      <li key={it} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start group hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 p-3 rounded-xl mr-4 group-hover:bg-secondary/10 transition-colors">
                          <CircleCheck className="w-6 h-6 text-secondary" aria-hidden="true" />
                        </div>
                        <span className="text-gray-800 font-medium leading-snug pt-1">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {sv.faqs.length ? (
                  <div data-reveal>
                    <h2 className="text-3xl font-extrabold text-black mb-8">{t.faqHeading}</h2>
                    <div className="w-full space-y-4">
                      {sv.faqs.map((f) => (
                        <details key={f.question} className="faq bg-white border border-gray-200 rounded-2xl px-6 open:shadow-md transition-all">
                          <summary className="flex flex-1 items-center justify-between py-6 text-left text-lg font-bold text-black">
                            <h3>{f.question}</h3>
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" aria-hidden="true" />
                          </summary>
                          <div className="overflow-hidden">
                            <p className="text-gray-600 text-lg pb-6">{f.answer}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="w-full lg:w-1/3">
                <div className="sticky top-32 space-y-8">
                  {sv.offer ? (
                    <div data-reveal="left">
                      <div className="bg-black rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-gray-800">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
                        <div className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">{t.offerLabel}</div>
                        <div className="text-5xl font-black text-white mb-2 tracking-tighter">{sv.offer.amount}</div>
                        <div className="text-xl text-gray-400 mb-8">{sv.offer.title}</div>
                        <Link
                          href="/contact/"
                          data-track="book_appointment"
                          className={`${btnBase} transition-colors px-4 py-2 w-full bg-secondary hover:bg-gold-hover text-black font-bold h-14 rounded-xl text-lg`}
                        >
                          {t.offerButton}
                        </Link>
                      </div>
                    </div>
                  ) : null}
                  <div data-reveal="left">
                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                      <h2 className="text-2xl font-bold text-black mb-8">{t.stepsHeading}</h2>
                      <ol className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                        {t.steps.map((st, i) => (
                          <li key={st.title} className="relative flex items-center group">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-black text-secondary font-bold shadow-[0_1px_3px_0_rgb(0_0_0/0.1),0_1px_2px_-1px_rgb(0_0_0/0.1)] shrink-0 relative z-10 mr-4">
                              {i + 1}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 group-hover:border-secondary/50 transition-colors w-full">
                              <div className="font-bold text-black">{st.title}</div>
                              <div className="text-sm text-gray-500 mt-1">{st.text}</div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-16 text-center px-4">
          <div className="container mx-auto max-w-4xl" data-reveal>
            <h2 className="text-3xl md:text-5xl font-black text-black mb-8 tracking-tight">{t.ctaHeading}</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact/"
                data-track="book_appointment"
                className={`${btnBase} h-10 bg-black hover:bg-gray-900 text-white font-bold rounded-xl px-10 py-7 text-lg shadow-xl hover:-translate-y-1 transition-transform`}
              >
                {t.ctaButton}
              </Link>
              <a
                href={s.phoneHref}
                data-track="click_to_call"
                className={`${btnBase} transition-colors border h-10 border-black text-black hover:bg-black hover:text-white font-bold rounded-xl px-10 py-7 text-lg bg-transparent`}
              >
                {s.phone}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
