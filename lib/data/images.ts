import type { Img } from "@/lib/types";

/*
 * Every photo the site uses, downloaded from the live site, re-encoded with
 * all metadata removed (the treatment-room photo carried the phone's GPS
 * position) and given alt text describing what it shows.
 * WebP copies at each width are made by scripts/optimize-images.mjs.
 */
export const images = {
  logo: { src: "/images/brand/logo.png", alt: "Diamond Dental Group logo", width: 270, height: 200 },
  storefront: {
    src: "/images/office/storefront.jpg",
    alt: "Diamond Dental storefront with the Implant & Cosmetic Dentistry sign above the office entrance",
    width: 862,
    height: 596,
  },
  treatmentRoom: {
    src: "/images/office/treatment-room.jpg",
    alt: "Treatment room at Diamond Dental Group with a dental chair and a wall-mounted monitor",
    width: 2000,
    height: 2667,
  },
  drNikpour: { src: "/images/team/dr-akram-nikpour.jpg", alt: "Dr. Akram Nikpour, DDS, in a white coat", width: 1320, height: 1319 },
  blogSoftFoods: {
    src: "/images/blog/soft-foods.jpg",
    alt: "Soft foods for the first days after dental implant surgery: a smoothie, yogurt with berries, scrambled eggs and applesauce",
    width: 1376,
    height: 768,
  },
  blogImplantRecovery: {
    src: "/images/blog/implant-recovery.jpg",
    alt: "Couch set up for recovery at home with a blanket, a glass of water, a cup of tea and an ice pack",
    width: 1376,
    height: 768,
  },
  blogVeneersSmile: { src: "/images/blog/veneers-smile.jpg", alt: "Close-up of a natural-looking smile after porcelain veneer treatment", width: 1376, height: 768 },
  blogImplantTimeline: {
    src: "/images/blog/implant-timeline.jpg",
    alt: "3D scan of a jaw on a monitor, marked up for planning a dental implant",
    width: 1376,
    height: 768,
  },
  blogToothSensitivity: {
    src: "/images/blog/tooth-sensitivity.jpg",
    alt: "Woman holding her cheek while drinking a glass of ice water because of tooth sensitivity",
    width: 1376,
    height: 768,
  },
  blogBleedingGums: { src: "/images/blog/bleeding-gums.jpg", alt: "Close-up of a person brushing their teeth and gums with a bamboo toothbrush", width: 1376, height: 768 },
  blogCalmTreatmentRoom: {
    src: "/images/blog/calm-treatment-room.jpg",
    alt: "Calm, welcoming dental treatment room with no instruments in view",
    width: 1376,
    height: 768,
  },
} satisfies Record<string, Img>;
