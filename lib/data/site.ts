import type { MenuGroup, MenuItem, SiteSettings, Testimonial } from "@/lib/types";
import { images } from "./images.ts";
import { fallbackServices } from "./services.ts";

/* Practice details, menus and footer, as on the live site. Editable in /cms under Site settings. */

const groupOrder = ["Cosmetic", "Implants & Restorative", "General & Preventive"];

/** The Services mega menu: three columns, same names and order as the live site. */
export const servicesMenu: MenuGroup[] = groupOrder.map((heading) => ({
  heading,
  links: fallbackServices.filter((s) => s.group === heading).map((s) => ({ label: s.name, href: `/services/${s.slug}/` })),
}));

export const fallbackMenu: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Services", href: "/services/", groups: servicesMenu },
  { label: "Patient Care", href: "/patient-care/" },
  { label: "Patient Education", href: "/blog/" },
  { label: "Contact Us", href: "/contact/" },
];

export const fallbackSettings: SiteSettings = {
  name: "Diamond Dental Group",
  legalName: "Diamond Dental Group",
  phone: "(916) 755-4769",
  phoneHref: "tel:+19167554769",
  email: "info@diamonddentalgroups.com",
  street: "1950 Douglas Blvd B-1",
  city: "Roseville",
  region: "CA",
  postalCode: "95661",
  country: "United States",
  mapsUrl: "https://maps.app.goo.gl/PAhsdYe9n87Zf4r37",
  mapQuery: "1950 Douglas Blvd B-1, Roseville, CA 95661, United States (Diamond Dental Group)",
  bookingUrl: "https://schedule.jarvisanalytics.com/frame/diamonddental-dtxa?location_id=2721782410975854",
  logo: images.logo,
  tagline: "Your Smile, Our Passion — providing expert, compassionate dental care to keep Roseville smiling brighter every day.",
  hours: [
    { day: "Monday", value: "10:00 am – 7:00 pm", opens: "10:00", closes: "19:00" },
    { day: "Tuesday", value: "10:00 am – 7:00 pm", opens: "10:00", closes: "19:00" },
    { day: "Wednesday", value: "10:00 am – 7:00 pm", opens: "10:00", closes: "19:00" },
    { day: "Thursday", value: "10:00 am – 7:00 pm", opens: "10:00", closes: "19:00" },
    { day: "Friday", value: "8:30 am – 5:30 pm", opens: "08:30", closes: "17:30" },
    { day: "Saturday", value: "Closed" },
    { day: "Sunday", value: "Closed" },
  ],
  // The live footer's Facebook and Instagram icons link to "#". They are hidden until real profile links are added in /cms.
  social: [],
  headerCta: { label: "Book Appointment", href: "/contact/" },
  mobileBookLabel: "Book Online",
  menu: fallbackMenu,
  footerLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about/" },
    { label: "Patient Care", href: "/patient-care/" },
    { label: "Patient Education", href: "/blog/" },
    { label: "Contact", href: "/contact/" },
    { label: "Dental Implants", href: "/services/dental-implants/" },
    { label: "All-on-X", href: "/services/all-on-x/" },
    { label: "Veneers", href: "/services/porcelain-veneers/" },
  ],
  // "Terms & Conditions" and "Accessibility Statement" are left out until those pages exist (they pointed to the home page).
  legalLinks: [{ label: "Privacy Policy", href: "/privacy-policy/" }],
  copyright: "© 2026 Diamond Dental Group. All rights reserved.",
};

/**
 * The three reviews on the live home page could not be traced to a real
 * review source, so they are kept as unapproved placeholders: the reviews
 * section stays hidden until reviews with "approved" switched on exist in /cms.
 */
export const fallbackTestimonials: Testimonial[] = [
  {
    quote:
      "[PLACEHOLDER: real review] Dr. Nikpour is amazing! She took the time to explain my treatment plan and made sure I was comfortable the entire time. The office is beautiful and the staff is so welcoming.",
    name: "Sarah M.",
    rating: 5,
    approved: false,
  },
  {
    quote:
      "[PLACEHOLDER: real review] I came in for the $49 special and ended up finding my permanent dentist. They didn't try to upsell me, just gave honest advice. Highly recommend Diamond Dental!",
    name: "Michael T.",
    rating: 5,
    approved: false,
  },
  {
    quote:
      "[PLACEHOLDER: real review] Got my Invisalign here and the process was seamless. The flexible financing made it affordable, and my smile looks better than ever. Thank you Dr. Nikpour!",
    name: "Jessica R.",
    rating: 5,
    approved: false,
  },
];
