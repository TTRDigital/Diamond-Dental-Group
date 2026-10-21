import type { Feature, Img, Offer, RichBlock, Seo, ServiceTemplate } from "@/lib/types";
import { images } from "./images.ts";

/*
 * Page copy, word for word from the live site. Titles and meta descriptions
 * are the live ones; where a live page had none (privacy, thank-you,
 * services) the new one is built from that page's own text. Editable in /cms.
 */

import type { iconNames } from "../../sanity/icons.ts";

export type IconName = (typeof iconNames)[number];

export type IconFeature = Feature & { icon: IconName };
export type ServiceCard = Feature & { icon: IconName; href: string };

export type HomeContent = {
  hero: { heading: string; text: string; button: string; note: string; image: Img };
  trust: { text: string; icon: IconName | "stars" }[];
  why: { heading: string; items: IconFeature[] };
  journey: { eyebrow: string; heading: string; items: IconFeature[] };
  featured: { heading: string; items: ServiceCard[]; button: string; buttonHref: string };
  offers: {
    heading: string;
    text: string;
    badge: string;
    main: { title: string; text: string; items: string[]; button: string };
    others: Offer[];
    otherButton: string;
    footer: string;
  };
  insurance: { heading: string; text: string; link: string };
  membership: { heading: string; text: string; price: string; textAfter: string; link: string };
  dentist: { eyebrow: string; heading: string; text: string; link: string; image: Img };
  reviews: { heading: string; rating: string };
  cta: { heading: string; text: string; button: string };
  seo: Seo;
};

export const fallbackHome: HomeContent = {
  hero: {
    heading: "Your Trusted Roseville Dentist for All Your Smile Needs",
    text: "Implant, cosmetic, and family dentistry under one roof — with personalized care, advanced technology, and same-week appointments.",
    button: "Book My Appointment",
    note: "New patients welcome. All PPO insurance accepted.",
    image: images.storefront,
  },
  trust: [
    // "Hundreds of 5-Star Reviews" is hidden until the practice confirms the figure (see README).
    { text: "[PLACEHOLDER: confirmed review count] Hundreds of 5-Star Reviews", icon: "stars" },
    { text: "Implant & Cosmetic Experts", icon: "shieldCheck" },
    { text: "Same-Week Appointments", icon: "clock" },
    { text: "Roseville's Trusted Dentist", icon: "mapPin" },
  ],
  why: {
    heading: "Why Choose Diamond Dental",
    items: [
      {
        icon: "star",
        title: "Experienced Professionals",
        text: "Led by Dr. Akram Nikpour, DDS, our team brings 17 years of advanced clinical experience across implant, cosmetic, Invisalign, endodontics, and restorative dentistry.",
      },
      {
        icon: "shieldCheck",
        title: "State-of-the-Art Dentistry",
        text: "Digital X-rays, modern diagnostics, and advanced techniques mean more accurate treatment, more comfort, and better long-term results.",
      },
      {
        icon: "circleCheck",
        title: "Personalized Plans",
        text: "No cookie-cutter dentistry. Every plan is built around your health, your goals, and your budget — explained clearly before we begin.",
      },
    ],
  },
  journey: {
    eyebrow: "HOW IT WORKS",
    heading: "Your Journey to a Brighter Smile",
    items: [
      { icon: "calendar", title: "Book Visit", text: "Schedule your appointment easily online or by calling our Roseville office." },
      { icon: "clipboardList", title: "Consultation", text: "Comprehensive exam, digital X-rays, and a clear, honest discussion of your goals." },
      { icon: "shieldCheck", title: "Treatment", text: "Comfortable, state-of-the-art care tailored specifically to your needs and budget." },
      { icon: "smile", title: "New Smile", text: "Walk out with confidence, restored health, and a clear plan for lasting results." },
    ],
  },
  featured: {
    heading: "Featured Services",
    items: [
      { icon: "shield", title: "Dental Implants", text: "Permanent, natural-looking replacements for missing teeth.", href: "/services/dental-implants/" },
      { icon: "layers", title: "All-on-X & All-on-4", text: "Full-arch restoration in fewer visits — a fixed new smile.", href: "/services/all-on-x/" },
      { icon: "sparkles", title: "Porcelain Veneers", text: "Custom-crafted veneers for a flawless, natural smile.", href: "/services/porcelain-veneers/" },
      { icon: "smile", title: "Invisalign", text: "Straighten your teeth discreetly, without metal braces.", href: "/services/invisalign/" },
      { icon: "sun", title: "Teeth Whitening", text: "Professional whitening that's dramatically brighter, safely.", href: "/services/teeth-whitening/" },
      { icon: "activity", title: "Root Canal Therapy", text: "Gentle, modern root canals that save your natural tooth.", href: "/services/root-canal/" },
    ],
    button: "View All Services",
    // The live button went to /about; it now opens the services page.
    buttonHref: "/services/",
  },
  offers: {
    heading: "Grand Opening New Patient Offers",
    text: "Limited-time offers for new patients — part of our Grand Opening promotion.",
    badge: "Best Value",
    main: {
      title: "$49 New Patient Special",
      text: "New patients without insurance; regular value $325+",
      items: ["Comprehensive dental exam", "Digital X-rays", "Cleaning", "Oral cancer screening", "Doctor consultation & personalized treatment plan"],
      button: "Claim My Offer",
    },
    others: [
      { amount: "$300 OFF", title: "Teeth Whitening" },
      { amount: "$400 OFF", title: "Invisalign" },
      { amount: "$500 OFF", title: "Dental Implants" },
    ],
    otherButton: "Claim",
    footer: "Ready to claim your offer?",
  },
  insurance: {
    heading: "All PPO Insurance Accepted",
    text: "We're in-network with most major PPO plans. Our team will verify your benefits before your visit so there are no surprises.",
    link: "View Insurance Info",
  },
  membership: { heading: "No Insurance?", text: "Our in-house Membership Plan starts at just", price: "$399/year", textAfter: "and covers your preventive care.", link: "View Membership Plan" },
  dentist: {
    eyebrow: "MEET YOUR DENTIST",
    heading: "Dr. Akram Nikpour, DDS",
    text: "Dr. Akram Nikpour is a graduate of the University of Arizona and earned her Doctor of Dental Surgery degree from De La Salle dentistry school. A proud member of the American Dental Association (ADA), California Dental Association (CDA) and Sacramento District Dental Society (SDDS), she brought her 17 years of experience in advanced Implant, cosmetic, Invisalign, endodontics and restorative dentistry with truly personalized, patient-first care to Roseville — so you leave feeling healthier, more confident, and genuinely cared for at Diamond Dental Group.",
    link: "Learn More About Dr. Nikpour",
    image: images.drNikpour,
  },
  reviews: { heading: "What Roseville Patients Are Saying", rating: "[PLACEHOLDER: Google rating] 5.0" },
  cta: { heading: "Ready for a Healthier, Brighter Smile?", text: "Same-week appointments available. New patients welcome.", button: "Book My Appointment" },
  seo: {
    title: "Dentist in Roseville, CA | Diamond Dental Group — Implant & Cosmetic Dentistry",
    description:
      "Roseville's trusted dentist for implants, cosmetic dentistry & family care. $49 new patient special, all PPO insurance accepted, same-week appointments. Call (916) 755-4769.",
  },
};

export type AboutContent = {
  hero: { heading: string; text: string };
  dentist: { eyebrow: string; heading: string; text: string; quote: string; credentials: string[]; image: Img };
  practice: { heading: string; text: string; items: Feature[] };
  team: { heading: string; text: string; items: IconFeature[] };
  cta: { heading: string; button: string };
  seo: Seo;
};

export const fallbackAbout: AboutContent = {
  hero: { heading: "Meet Diamond Dental Group", text: "Expert, compassionate dentistry — built around you." },
  dentist: {
    eyebrow: "MEET YOUR DENTIST",
    heading: "Dr. Akram Nikpour, DDS",
    text: fallbackHome.dentist.text,
    quote: "Every patient deserves care that's precise, comfortable, and built around them. Education and gentle, advanced dentistry — that's what we're about.",
    credentials: [
      "Doctor of Dental Surgery (DDS)",
      "University of Arizona graduate",
      "Member, American Dental Association (ADA)",
      "Member, California Dental Association (CDA)",
      "Member, Sacramento District Dental Society (SDDS)",
      "17 years of advanced implant, cosmetic & restorative experience",
    ],
    image: images.drNikpour,
  },
  practice: {
    heading: "A Full-Service Dental Practice in Roseville",
    text: "Diamond Dental Group is a full-service implant and cosmetic dentistry practice serving Roseville and the greater Sacramento area. From routine cleanings and checkups to complete smile transformations with implants, veneers, and Invisalign, we deliver every level of care under one roof — with state-of-the-art technology and treatment plans focused on both function and aesthetics.",
    items: [
      { title: "Advanced Technology", text: "Digital X-rays & modern diagnostics for precise, minimally invasive treatments." },
      { title: "Comfort-First Care", text: "Gentle, unhurried appointments designed to keep you relaxed and pain-free." },
      { title: "Honest Treatment Planning", text: "Clear options and transparent pricing discussed with you before we ever begin." },
    ],
  },
  team: {
    heading: "A Team That Treats You Like Family",
    text: "From your first phone call to your final follow-up, our front office and clinical team are here to make every visit smooth, comfortable, and stress-free. We take the time to answer your questions, work with your insurance, and make dental care something you actually look forward to.",
    items: [
      { icon: "users", title: "Welcoming Front Office", text: "Warm welcomes, seamless scheduling, and a team that knows you by name from the moment you walk in." },
      { icon: "shieldCheck", title: "Insurance Assistance", text: "We handle the paperwork, verify your benefits, and explain your coverage clearly so there are no surprises." },
      { icon: "sparkles", title: "Clinical Excellence", text: "Gentle, experienced hygienists and assistants dedicated to providing precise, comfortable care." },
      { icon: "smile", title: "Stress-Free Environment", text: "A calming atmosphere and unhurried appointments designed to make every dental visit truly relaxing." },
    ],
  },
  cta: { heading: "Come Experience the Diamond Dental Difference", button: "Book My Appointment" },
  seo: {
    title: "About Us | Dr. Akram Nikpour, DDS | Diamond Dental Group Roseville",
    description:
      "Meet Dr. Akram Nikpour and the Diamond Dental Group team. Implant, cosmetic & family dentistry in Roseville, CA, with 17 years of advanced clinical experience.",
  },
};

export type PatientCareContent = {
  hero: { heading: string; text: string };
  special: { badge: string; heading: string; text: string; regular: string; price: string; savings: string; items: string[]; button: string };
  offers: { heading: string; text: string; items: Offer[]; button: string };
  insurance: { heading: string; text: string; plans: string[]; notePrefix: string; noteLink: string; noteSuffix: string };
  membership: { heading: string; text: string; priceLabel: string; price: string; per: string; includesHeading: string; items: string[]; button: string };
  payment: { heading: string; text: string };
  cta: { heading: string; button: string };
  seo: Seo;
};

export const fallbackPatientCare: PatientCareContent = {
  hero: { heading: "Patient Care, Insurance & Payment Options", text: "Quality dental care that's simple, transparent, and affordable." },
  special: {
    badge: "Limited Time Offer",
    heading: "New Patient Special — Everything You Need in One Visit",
    text: "A complete dental checkup that typically costs over $325 — now just $49 for new patients without insurance. This is a limited-time Grand Opening offer.",
    regular: "Regular Value: $325+",
    price: "$49",
    savings: "Save Over $276",
    items: fallbackHome.offers.main.items,
    button: "Claim My $49 Special",
  },
  offers: {
    heading: "More Grand Opening Offers",
    text: "All offers are part of our Grand Opening promotion for new patients — limited time only.",
    items: [
      {
        amount: "$300 OFF",
        title: "Teeth Whitening",
        text: "Professional-strength whitening that's dramatically brighter than store kits.",
        image: images.treatmentRoom,
      },
      {
        amount: "$400 OFF",
        title: "Invisalign",
        text: "Straighten your smile discreetly — no metal, no brackets, no interruptions.",
        image: images.treatmentRoom,
      },
      {
        amount: "$500 OFF",
        title: "Dental Implants",
        text: "Permanent, natural-looking tooth replacement — eat, smile, and speak with confidence.",
        image: images.treatmentRoom,
      },
    ],
    button: "Claim Offer",
  },
  insurance: {
    heading: "All PPO Insurance Accepted",
    text: "We're in-network with most major PPO plans and our team handles the paperwork for you — we'll verify your benefits before your visit so there are no surprises.",
    plans: [
      "Delta Dental",
      "MetLife",
      "Blue Cross Blue Shield",
      "Aetna",
      "Ameritas",
      "Anthem",
      "Cigna",
      "GEHA",
      "Guardian",
      "Humana",
      "Lincoln Financial",
      "Premier Access",
      "Principal",
      "Sun Life (DHA)",
      "United Concordia (UCCI)",
      "UnitedHealthcare",
    ],
    notePrefix: "Don't see your plan?",
    noteLink: "Call us",
    noteSuffix: "— we'll check your coverage for free.",
  },
  membership: {
    heading: "No Insurance? Join the Diamond Dental Membership Plan",
    text: "One flat annual fee covers your preventive care for the year — no deductibles, no claim forms, no waiting periods.",
    priceLabel: "Starts at",
    price: "$399",
    per: "/Year",
    includesHeading: "Plan Includes:",
    items: ["2 Periodic Exams", "1 Emergency Exam", "2 Dental Cleanings", "2 Fluoride Treatments", "2 Oral Cancer Screenings", "1 Periodontal Screening", "10–20% Off All Other Treatments"],
    button: "Ask About Membership",
  },
  payment: {
    heading: "Payment Options",
    text: "We accept cash, personal checks, Visa, Mastercard, American Express, and Discover. Flexible financing options available — ask our team.",
  },
  cta: { heading: "Ready to Get Started?", button: "Book My Appointment" },
  seo: {
    title: "New Patients, Insurance & Membership Plan | Diamond Dental Group Roseville",
    description:
      "$49 new patient special, all PPO insurance accepted, and an in-house membership plan from $399/year. Affordable dental care in Roseville, CA.",
  },
};

export type ContactContent = {
  badge: string;
  heading: string;
  headingAccent: string;
  text: string;
  bookingTitle: string;
  directHeading: string;
  callLabel: string;
  hoursHeading: string;
  seo: Seo;
};

export const fallbackContact: ContactContent = {
  badge: "GET IN TOUCH",
  heading: "Let's build your",
  headingAccent: "dream smile.",
  text: "Same-week appointments available. New patients welcome. Drop us a line or call directly to secure your spot.",
  bookingTitle: "Book an appointment online with Diamond Dental Group",
  directHeading: "Direct Contact",
  callLabel: "Call us directly",
  hoursHeading: "Office Hours",
  seo: {
    title: "Contact Us | Book an Appointment | Diamond Dental Group Roseville, CA",
    description:
      "Book your appointment at Diamond Dental Group. 1950 Douglas Blvd B-1, Roseville, CA 95661, (916) 755-4769. Same-week appointments, new patients welcome.",
  },
};

export type BlogIndexContent = { eyebrow: string; heading: string; text: string; readMore: string; backLink: string; cta: { heading: string; text: string; button: string }; seo: Seo };

export const fallbackBlogIndex: BlogIndexContent = {
  eyebrow: "Diamond Dental Group",
  heading: "Patient Education",
  text: "Clear, honest answers to the questions patients ask us most — from sensitive teeth and bleeding gums to implants, veneers and nervous first visits.",
  readMore: "Read more",
  backLink: "← Back to Patient Education",
  cta: {
    heading: "Considering treatment in Roseville?",
    text: "Diamond Dental Group offers implant, cosmetic and family dentistry with a clear treatment plan explained before anything begins.",
    button: "Book a Consultation",
  },
  seo: {
    title: "Patient Education | Diamond Dental Group Roseville",
    description:
      "Clear, honest answers to the questions patients ask us most — from sensitive teeth and bleeding gums to implants, veneers and nervous first visits.",
  },
};

export type ServicesHubContent = { heading: string; text: string; cardLink: string; template: ServiceTemplate; seo: Seo };

export const fallbackServicesHub: ServicesHubContent = {
  // New page (the live site linked to /services but had no page there). Text reuses the site's own wording.
  heading: "Our Dental Services",
  text: "Implant, cosmetic, and family dentistry under one roof — with personalized care, advanced technology, and same-week appointments.",
  cardLink: "Learn More",
  template: {
    badge: "Expert Care",
    primaryButton: "Book My Consultation",
    whatItIsHeading: "Understanding the Treatment",
    rightForYouHeading: "Is This Right for You?",
    faqHeading: "Common Questions",
    offerLabel: "Grand Opening Offer",
    offerButton: "Claim Offer",
    stepsHeading: "What to Expect",
    steps: [
      { title: "Consultation", text: "Discuss goals & examine smile." },
      { title: "Custom Plan", text: "Build treatment & pricing plan." },
      { title: "Treatment", text: "Comfortable, expert care." },
      { title: "Results", text: "Enjoy your healthy new smile." },
    ],
    ctaHeading: "Ready to Get Started?",
    ctaButton: "Book My Appointment",
  },
  seo: {
    title: "Dental Services in Roseville, CA | Diamond Dental Group",
    description: "Implant, cosmetic, and family dentistry under one roof in Roseville, CA: implants, veneers, Invisalign, crowns, root canals, cleanings and more.",
  },
};

export type PrivacyContent = { badge: string; heading: string; updated: string; intro: string; body: RichBlock[]; contactIntro: string; seo: Seo };

export const fallbackPrivacy: PrivacyContent = {
  badge: "Legal & Compliance",
  heading: "Privacy Policy",
  // The live page printed the visitor's current date here; it is now a fixed date (the day this copy was taken).
  updated: "Last Updated: 10/20/2026",
  intro:
    'Diamond Dental Group ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.',
  body: [
    { style: "h2", text: "1. Information We Collect" },
    {
      style: "p",
      text: "We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our services, when you participate in activities on the website, or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the website, the choices you make, and the products and features you use. The personal information we collect may include the following:",
    },
    { style: "ul", items: ["Names", "Phone numbers", "Email addresses", "Health or medical information (as provided via forms)"] },
    { style: "h2", text: "2. How We Use Your Information" },
    {
      style: "p",
      text: "We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.",
    },
    {
      style: "ul",
      items: [
        "To facilitate appointment bookings and manage patient accounts.",
        "To send you administrative information, such as appointment reminders.",
        "To communicate with you regarding your inquiries or requests.",
        "To send you marketing and promotional communications (you can opt-out at any time).",
      ],
    },
    { style: "h2", text: "3. SMS and Phone Communication Consent" },
    {
      style: "p",
      text: 'By providing your phone number, you consent to receive text messages and phone calls from Diamond Dental Group regarding your appointments, treatment plans, and special offers. Standard message and data rates may apply. You may opt-out of receiving SMS messages at any time by replying "STOP" to any message you receive from us.',
    },
    { style: "h2", text: "4. Cookies and Tracking Technologies" },
    {
      style: "p",
      text: "We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice. We use analytics tools (such as Google Analytics) to help us measure traffic and usage trends for the website.",
    },
    { style: "h2", text: "5. HIPAA Compliance" },
    {
      style: "p",
      text: "As a dental practice, we are subject to the Health Insurance Portability and Accountability Act (HIPAA). We protect your Protected Health Information (PHI) in accordance with HIPAA regulations. A separate Notice of Privacy Practices detailing your rights under HIPAA is available at our office.",
    },
    { style: "h2", text: "6. Contact Us" },
  ],
  contactIntro: "If you have questions or comments about this notice, you may contact us at:",
  seo: {
    title: "Privacy Policy | Diamond Dental Group Roseville",
    description: "How Diamond Dental Group in Roseville, CA collects, uses and protects your information when you visit our website or use our services.",
  },
};

export type ThankYouContent = { heading: string; text: string; callButton: string; homeButton: string; seo: Seo };

export const fallbackThankYou: ThankYouContent = {
  heading: "Thank You — We've Received Your Request!",
  text: "Our team will call you within one business day to confirm your appointment. If you'd like to speak with us sooner, call (916) 755-4769.",
  callButton: "Call Us Now",
  homeButton: "Return Home",
  seo: {
    title: "Thank You | Diamond Dental Group Roseville",
    description: "Thank you for contacting Diamond Dental Group in Roseville, CA. Our team will call you within one business day to confirm your appointment.",
    noIndex: true,
  },
};
