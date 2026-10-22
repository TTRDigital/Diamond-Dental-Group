import type { Img } from "@/lib/types";
import { firstSentences } from "@/lib/text";

/** The practice's dentist writes the blog unless a post names someone else. */
export const defaultAuthor = "Dr. Akram Nikpour";

export type Author = {
  /** Name as written on the post, e.g. "Dr. Akram Nikpour". */
  name: string;
  /** For link labels: "Dr. Nikpour". */
  shortName: string;
  /** Name with the credential, for the byline: "Dr. Akram Nikpour, DDS". */
  label: string;
  /** Credential after the name, from the About page heading (e.g. "DDS"). Only the practice's dentist has one. */
  credential?: string;
  jobTitle?: string;
  /** The author's page on this site: the About page for the practice's dentist. */
  url?: string;
  image?: Img;
  /** Two sentences in the About page's own words, for the author box. */
  bio?: string;
};

/** What the About page says about the dentist (AboutContent.dentist in lib/data/pages.ts, editable in /cms). */
type Dentist = { heading: string; text: string; image: Img };

/**
 * Who wrote a post. When it is the practice's dentist (the About page heading starts with the same name), the byline
 * gets her credential, photo and About page link, and the author box two sentences from the About page.
 */
export function postAuthor(author: string | undefined, dentist: Dentist): Author {
  const name = author?.trim() || defaultAuthor;
  const shortName = /^Dr\.?\s/.test(name) ? `Dr. ${name.split(/\s+/).pop()}` : name;
  const [dentistName, credential] = dentist.heading.split(/,\s*/) as [string, string | undefined];
  if (dentistName.trim() !== name) return { name, shortName, label: name };
  return {
    name,
    shortName,
    label: credential ? `${name}, ${credential}` : name,
    credential,
    jobTitle: "Dentist",
    url: "/about/",
    image: dentist.image,
    bio: firstSentences(dentist.text, 2),
  };
}
