import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { CircleCheck, CircleQuestionMark, Phone } from "lucide-react";
import type { Img, RichBlock } from "@/lib/types";
import type { ArticleModel, ArticleSection, CtaBand, FaqSection } from "@/lib/post-design";
import { isCardList, photoFrame, stepItems } from "@/lib/post-design";
import { Inline } from "@/components/ui/RichText";
import { btnGold } from "@/components/ui/Buttons";

/*
 * The article itself: every section with its heading (anchored for the jump links), its photo and caption, its
 * paragraphs (or numbered steps), its lists as cards, the mid-article call to action band and the FAQ cards.
 * Semantic HTML throughout (section, h2 with id, figure and figcaption), so Google and AI tools read it as text.
 */

/** Links in the text: black with the brand-gold underline (gold text alone is too light on white). */
export const BODY_LINK = "font-medium text-black underline decoration-secondary decoration-2 underline-offset-[3px] transition-colors hover:text-gold-hover";

export const H2 = "mb-5 mt-12 scroll-mt-32 font-heading text-2xl font-bold leading-tight text-black before:mb-4 before:block before:h-1 before:w-10 before:rounded-full before:bg-secondary md:text-[1.75rem]";

const P = "mb-6 text-[17px] leading-[1.75] text-gray-700 md:text-[18px]";

export function Paragraph({ text }: { text: string }) {
  return (
    <p className={P}>
      <Inline text={text} linkClassName={BODY_LINK} />
    </p>
  );
}

/** Paragraphs and lists. Short lists become a grid of cards with a check mark; longer ones keep gold dots or numbers. */
export function Blocks({ blocks }: { blocks: RichBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.style === "h2") return null;
        if (b.style === "p") return <Paragraph key={i} text={b.text} />;
        if (b.style === "ul" && isCardList(b.items))
          return (
            <ul key={i} className="my-8 grid gap-3 sm:grid-cols-2">
              {b.items.map((it, j) => (
                <li
                  key={j}
                  data-reveal
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-[16px] leading-relaxed text-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
                  <span>
                    <Inline text={it} linkClassName={BODY_LINK} />
                  </span>
                </li>
              ))}
            </ul>
          );
        const List = b.style;
        return (
          <List key={i} className={`${b.style === "ol" ? "blog-ol" : "blog-ul"} my-7 space-y-3 text-[17px] leading-[1.7] text-gray-700 md:text-[18px]`}>
            {b.items.map((it, j) => (
              <li key={j}>
                <Inline text={it} linkClassName={BODY_LINK} />
              </li>
            ))}
          </List>
        );
      })}
    </>
  );
}

/** A section's photo with its caption, shown above the heading. Full width on phones, rounded on larger screens. */
function Figure({ image, caption }: { image: Img; caption?: string }) {
  const frame = photoFrame(image);
  return (
    <figure className="-mx-4 my-10 sm:mx-0" data-reveal>
      <div className={`relative overflow-hidden bg-gray-100 shadow-sm sm:rounded-2xl ${frame.aspect}`}>
        <Image src={image.src} alt={image.alt} fill loading="lazy" sizes="(min-width: 752px) 720px, 100vw" className={`object-cover ${frame.position}`} />
      </div>
      {caption ? <figcaption className="mt-3 px-4 text-sm leading-relaxed text-gray-600 sm:px-0">{caption}</figcaption> : null}
    </figure>
  );
}

/** "What to expect" paragraphs as a numbered timeline: the step's short first sentence is its label. */
function Steps({ blocks }: { blocks: RichBlock[] }) {
  const steps = stepItems(blocks);
  return (
    <ol className="my-8" data-reveal>
      {steps.map((st, i) => (
        <li key={i} className="relative flex gap-5 pb-8 before:absolute before:bottom-0 before:left-[21px] before:top-12 before:w-0.5 before:bg-gray-200 last:pb-0 last:before:hidden">
          <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black font-heading text-base font-bold text-secondary shadow-md ring-4 ring-white" aria-hidden="true">
            {i + 1}
          </span>
          <div className="min-w-0 pt-1.5">
            {st.label ? <p className="mb-1 font-heading text-lg font-bold text-black">{st.label}</p> : null}
            <p className="text-[17px] leading-[1.7] text-gray-700 md:text-[18px]">
              <Inline text={st.text} linkClassName={BODY_LINK} />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** One sentence that fits the topic, the Book button and the phone number, on the site's dark band. */
function Band({ text, phone, phoneHref, button }: { text: string; phone: string; phoneHref: string; button: { label: string; href: string } }) {
  return (
    <aside aria-label="Book a visit" className="relative my-12 overflow-hidden rounded-2xl bg-black bg-[radial-gradient(circle_at_top_right,rgba(229,184,51,0.16),transparent_45%)] px-6 py-8 text-white md:px-9 md:py-9" data-reveal>
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="font-heading text-xl font-bold leading-snug md:max-w-md md:text-2xl">{text}</p>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={button.href}
            data-track="book_appointment"
            className={`${btnGold} rounded-lg px-7 py-6 text-base font-bold shadow-[0_4px_14px_rgba(229,184,51,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(229,184,51,0.5)]`}
          >
            {button.label}
          </Link>
          <a href={phoneHref} data-track="click_to_call" className="inline-flex items-center justify-center gap-2 px-4 py-3 font-bold text-white transition-colors hover:text-secondary">
            <Phone className="h-5 w-5" aria-hidden="true" />
            {phone}
          </a>
        </div>
      </div>
    </aside>
  );
}

/** The FAQ as cards: the question in the heading font, the answer under it, all of it real text in the page. */
function Faq({ faq }: { faq: FaqSection }) {
  return (
    <section aria-labelledby={faq.id}>
      <h2 id={faq.id} className={H2}>
        {faq.heading}
      </h2>
      <Blocks blocks={faq.intro} />
      <div className="space-y-4">
        {faq.items.map((f) => (
          <div key={f.question} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md" data-reveal>
            <h3 className="flex gap-3 font-heading text-lg font-bold leading-snug text-black">
              <CircleQuestionMark className="mt-0.5 h-6 w-6 shrink-0 text-secondary" aria-hidden="true" />
              <span>{f.question}</span>
            </h3>
            <p className="mt-3 pl-9 text-[17px] leading-[1.7] text-gray-700">
              <Inline text={f.answer} linkClassName={BODY_LINK} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Section({ s }: { s: ArticleSection }) {
  const steps = s.extras?.steps;
  return (
    <section aria-labelledby={s.id}>
      <h2 id={s.id} className={H2}>
        {s.heading}
      </h2>
      {steps ? (
        <>
          <Steps blocks={s.blocks} />
          <Blocks blocks={s.blocks.filter((b) => b.style !== "p")} />
        </>
      ) : (
        <Blocks blocks={s.blocks} />
      )}
    </section>
  );
}

export function ArticleBody({ model, band, phone, phoneHref, button }: { model: ArticleModel; band?: CtaBand; phone: string; phoneHref: string; button: { label: string; href: string } }) {
  return (
    <>
      {model.sections.map((s) => (
        <Fragment key={s.id}>
          {band?.before === s.id ? <Band text={band.text} phone={phone} phoneHref={phoneHref} button={button} /> : null}
          {s.extras?.image ? <Figure image={s.extras.image} caption={s.extras.caption} /> : null}
          <Section s={s} />
        </Fragment>
      ))}
      {model.faq?.items.length ? <Faq faq={model.faq} /> : null}
    </>
  );
}
