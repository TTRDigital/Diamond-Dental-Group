/* Content types shared by the built-in content (lib/data), the Sanity queries (lib/content.ts) and the components. */

export type Img = { src: string; alt: string; width: number; height: number };

export type Seo = { title: string; description: string; noIndex?: boolean; image?: Img };

export type Link = { label: string; href: string };

/** Answers are plain text, shown and put in FAQPage schema word for word. */
export type Faq = { question: string; answer: string };

export type DayHours = { day: string; value: string; opens?: string; closes?: string };

export type MenuGroup = { heading: string; links: Link[] };

/** A main-menu item; `groups` makes it the Services mega menu (desktop) / accordion (phone). */
export type MenuItem = { label: string; href: string; groups?: MenuGroup[] };

export type SocialLink = { network: "facebook" | "instagram"; href: string };

export type SiteSettings = {
  name: string;
  legalName: string;
  phone: string;
  /** Built from `phone` (tel:+1…), never edited by hand. */
  phoneHref: string;
  email: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  mapsUrl: string;
  /** Text Google Maps searches for in the map strip above the footer. */
  mapQuery: string;
  /** Jarvis Analytics online scheduler shown on /contact/. */
  bookingUrl: string;
  logo: Img;
  tagline: string;
  hours: DayHours[];
  social: SocialLink[];
  headerCta: Link;
  mobileBookLabel: string;
  menu: MenuItem[];
  footerLinks: Link[];
  legalLinks: Link[];
  copyright: string;
};

/** Inline markup in paragraphs: **bold** and [label](/link/). */
export type RichBlock = { style: "p"; text: string } | { style: "h2"; text: string } | { style: "ul"; items: string[] } | { style: "ol"; items: string[] };

export type Feature = { title: string; text: string };

export type Offer = { amount: string; title: string; text?: string; image?: Img };

export type Testimonial = { quote: string; name: string; rating: number; approved: boolean };

export type Service = {
  slug: string;
  order: number;
  /** Name in the menus and on the services hub. */
  name: string;
  group: string;
  heading: string;
  headingSuffix: string;
  sub: string;
  heroImage: Img;
  whatItIs: string[];
  rightForYou: string[];
  faqs: Faq[];
  offer?: { amount: string; title: string };
  seo: Seo;
};

/** Labels shared by every service page (set once in /cms under Services hub). */
export type ServiceTemplate = {
  badge: string;
  primaryButton: string;
  whatItIsHeading: string;
  rightForYouHeading: string;
  faqHeading: string;
  offerLabel: string;
  offerButton: string;
  stepsHeading: string;
  steps: Feature[];
  ctaHeading: string;
  ctaButton: string;
};

/**
 * Extras for one section of a post, matched to its heading (the H2 text, written exactly as in the article): a photo
 * with a caption shown above the heading, its paragraphs drawn as numbered steps, or a one-line call to action band
 * shown right above it. The article text itself never changes; these only dress it.
 */
export type PostSection = { heading: string; image?: Img; caption?: string; steps?: boolean; cta?: string };

export type Post = {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  /** Who wrote it, as shown in the byline. Empty means the practice's dentist, Dr. Akram Nikpour (lib/author.ts). */
  author?: string;
  /** Topic shown next to the date, e.g. "Implants & Restorative". */
  category?: string;
  /** Path of the page the post supports, e.g. /services/dental-implants/ (shown as the Related box). */
  service?: string;
  excerpt: string;
  image: Img;
  body: RichBlock[];
  /** Section photos, step timelines and the mid-article call to action (optional, see PostSection). */
  sections?: PostSection[];
  cta: { heading?: string; text: string; buttonLabel: string; buttonHref: string };
  disclaimer: string;
  seo: Seo;
};
