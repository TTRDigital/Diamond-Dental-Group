import type { Img } from "@/lib/types";

/*
 * The practice's own photos of the Roseville office (agency shoot, June–July 2026; Google Drive "Diamond Dental /
 * Visuals"), resized for the web with all metadata removed (public/images/office). Photos that show a patient's face
 * or a child are not used. Dr. Nikpour appears only masked at work; the receptionist appears at the front desk.
 */
const img = (file: string, alt: string, width = 2000, height = 1500): Img => ({ src: `/images/office/${file}.jpg`, alt, width, height });

export const OFFICE = {
  waitingRoom: img("waiting-room", "Waiting room at Diamond Dental Group in Roseville with leather armchairs, a plant and tall windows"),
  waitingRoom2: img("waiting-room-2", "Bright waiting room at Diamond Dental Group with armchairs, a coffee table and a drinks fridge"),
  waitingChairs: img("waiting-chairs", "Armchairs and coffee table in the Diamond Dental Group waiting room", 1500, 2000),
  entrance: img("entrance", "Diamond Dental Group entrance door with the Accepting New Smiles decal", 1500, 2000),
  frontDesk: img("front-desk", "Front desk at Diamond Dental Group in Roseville with a team member ready to help"),
  frontDeskFlowers: img("front-desk-flowers", "Front desk counter with red flowers at Diamond Dental Group", 1500, 2000),
  drScanning: img("dr-nikpour-scanning", "Dr. Akram Nikpour and her assistant taking a digital scan of a patient's teeth"),
  scanReview: img("digital-scan-review", "Dr. Nikpour reviewing a 3D digital scan of the teeth on screen with her assistant"),
  intraoralScanner: img("intraoral-scanner", "Digital intraoral scanner showing a 3D scan of the teeth on a laptop"),
  scanPlanning: img("scan-planning", "Dr. Nikpour planning treatment from a 3D digital scan"),
  panoramicXray: img("panoramic-xray", "Digital panoramic X-ray machine at Diamond Dental Group", 1500, 2000),
  panoramicXray2: img("panoramic-xray-2", "Digital panoramic X-ray unit with its imaging screen"),
  treatmentRooms: img("treatment-rooms", "Treatment rooms at Diamond Dental Group, each with a chair-side monitor"),
  treatmentChair: img("treatment-chair", "Treatment chair with chair-side monitor at Diamond Dental Group"),
  treatmentRoom4: img("treatment-room-4", "Bright treatment room with a large window at Diamond Dental Group"),
  treatmentRoomWindow: img("treatment-room-window", "Calm, light-filled treatment room at Diamond Dental Group"),
  treatmentRoom3: img("treatment-room-3", "Treatment room with a modern dental chair at Diamond Dental Group"),
  treatmentRoom2: img("treatment-room-2", "Dental chair and equipment in a treatment room at Diamond Dental Group"),
  hallway: img("hallway-rooms", "Hallway leading to the numbered treatment rooms at Diamond Dental Group"),
  hallway2: img("hallway-rooms-2", "Treatment rooms 1 to 3 along the hallway at Diamond Dental Group"),
  operatory: img("operatory-portrait", "Treatment room with dental chair beside the window", 1500, 2000),
  operatory2: img("operatory-portrait-2", "Treatment room with dental chair and chair-side monitor", 1500, 2000),
  chair: img("chair-portrait", "Dental chair ready for the next patient at Diamond Dental Group", 1500, 2000),
} as const;

/** Each treatment's photos from the office: the page banner, and the photo beside "Is this right for you?". */
export const SERVICE_PHOTOS: Record<string, { hero: Img; benefit: Img }> = {
  "porcelain-veneers": { hero: OFFICE.treatmentChair, benefit: OFFICE.operatory },
  "teeth-whitening": { hero: OFFICE.treatmentRoomWindow, benefit: OFFICE.chair },
  invisalign: { hero: OFFICE.intraoralScanner, benefit: OFFICE.operatory2 },
  "dental-implants": { hero: OFFICE.scanPlanning, benefit: OFFICE.panoramicXray },
  "all-on-x": { hero: OFFICE.scanReview, benefit: OFFICE.panoramicXray },
  "porcelain-crowns": { hero: OFFICE.treatmentRoom3, benefit: OFFICE.operatory2 },
  "implant-dentures": { hero: OFFICE.treatmentRoom4, benefit: OFFICE.panoramicXray },
  "dental-bridges": { hero: OFFICE.treatmentRoom2, benefit: OFFICE.operatory },
  dentures: { hero: OFFICE.hallway, benefit: OFFICE.chair },
  "inlays-onlays": { hero: OFFICE.treatmentRoom3, benefit: OFFICE.operatory2 },
  "root-canal": { hero: OFFICE.panoramicXray2, benefit: OFFICE.operatory },
  extractions: { hero: OFFICE.treatmentRooms, benefit: OFFICE.chair },
  fillings: { hero: OFFICE.treatmentChair, benefit: OFFICE.operatory2 },
  cleanings: { hero: OFFICE.treatmentRoomWindow, benefit: OFFICE.operatory },
  sealants: { hero: OFFICE.hallway2, benefit: OFFICE.chair },
  fluoride: { hero: OFFICE.treatmentRoom4, benefit: OFFICE.operatory2 },
  "deep-cleaning": { hero: OFFICE.treatmentRoom2, benefit: OFFICE.operatory },
  mouthguards: { hero: OFFICE.treatmentRooms, benefit: OFFICE.chair },
};

/** Photos for the last ("results") step and tiles, taken in turn so neighbouring pages differ. */
export const RESULT_PHOTOS: Img[] = [OFFICE.waitingRoom2, OFFICE.frontDeskFlowers, OFFICE.waitingChairs, OFFICE.entrance];

/** Insurance company logos (only for plans the practice lists as accepted). */
export const INSURER_LOGOS: Record<string, Img> = {
  "Delta Dental": { src: "/images/insurance/delta-dental.png", alt: "Delta Dental", width: 426, height: 88 },
  MetLife: { src: "/images/insurance/metlife.png", alt: "MetLife", width: 293, height: 70 },
  "Blue Cross Blue Shield": { src: "/images/insurance/blue-cross-blue-shield.png", alt: "Blue Cross Blue Shield", width: 167, height: 98 },
  Aetna: { src: "/images/insurance/aetna.png", alt: "Aetna", width: 312, height: 60 },
  Cigna: { src: "/images/insurance/cigna.png", alt: "Cigna", width: 253, height: 96 },
  Humana: { src: "/images/insurance/humana.png", alt: "Humana", width: 378, height: 81 },
  Principal: { src: "/images/insurance/principal.png", alt: "Principal", width: 360, height: 105 },
  "United Concordia (UCCI)": { src: "/images/insurance/united-concordia.png", alt: "United Concordia", width: 380, height: 82 },
};

/**
 * True for the treatment-room photo every service and offer starts with, at its local address or as the copy the
 * seed uploaded to Sanity (Sanity names a file by its content, so the id stays the same).
 */
export function isDefaultRoomPhoto(img?: Img): boolean {
  return !!img && (img.src === "/images/office/treatment-room.jpg" || img.src.includes("a6c01a60869f8750c1b8dd72cb7582b0dff32ebc"));
}

/** A service's banner photo: its own photo when one was chosen in /cms, otherwise the treatment's office photo. */
export function serviceHero(slug: string, current: Img): Img {
  const own = SERVICE_PHOTOS[slug];
  return own && isDefaultRoomPhoto(current) ? { ...own.hero, alt: current.alt || own.hero.alt } : current;
}
