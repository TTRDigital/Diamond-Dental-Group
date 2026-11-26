import type { Img } from "@/lib/types";

/*
 * Licensed stock photos (Pexels / Unsplash: free for commercial use; sources in docs/photo-credits.md).
 * They show treatments, technology and smiling patients where the practice has no photo of its own.
 * None is presented as Dr. Nikpour, her team, the office or a patient's result.
 */
const img = (file: string, alt: string, width: number, height: number): Img => ({ src: `/images/stock/${file}.jpg`, alt, width, height });

export const STOCK = {
  veneerPlacement: img("veneer-placement", "Porcelain veneer being placed on a smiling patient's front teeth", 1920, 1280),
  veneerShadeSamples: img("veneer-shade-samples", "Porcelain veneer samples in a range of natural shades", 1920, 1282),
  whiteningLight: img("whitening-light", "In-office teeth whitening with a whitening light", 1920, 1280),
  shadeGuideHands: img("shade-guide-hands", "Tooth shade guide used to choose a natural colour", 1920, 1280),
  clearAlignerSmile: img("clear-aligner-smile", "Smiling patient holding a clear aligner", 1920, 1528),
  alignersInHands: img("aligners-in-hands", "Clear aligners held in the hands", 1920, 1280),
  implantModel: img("implant-model", "Dental implant model: titanium post, abutment and crown", 1920, 1280),
  implantModelCloseup: img("implant-model-closeup", "Dental implant model beside natural teeth", 1600, 2400),
  implantModelCrown: img("implant-model-crown", "Implant model with the crown that fits on top", 1920, 1280),
  transparentImplantModel: img("transparent-implant-model", "Transparent jaw model showing implants under a full arch", 1602, 2400),
  fullArchImplantBridge: img("full-arch-implant-bridge", "Full-arch implant bridge for All-on-X treatment", 1920, 1280),
  crownCrafting: img("crown-crafting", "Dental crown being crafted and checked against a model", 1920, 1280),
  crownHandFinishing: img("crown-hand-finishing", "Ceramic crown being finished by hand", 1920, 1280),
  denturePolishing: img("denture-polishing", "Denture being polished for a smooth, comfortable fit", 1600, 2400),
  seniorPatientMirror: img("senior-patient-mirror", "Senior patient checking his smile in a mirror at the dentist", 1920, 1280),
  bridgeCloseup: img("bridge-closeup", "Dental bridge replacing missing teeth", 1920, 1920),
  prostheticArrangement: img("prosthetic-arrangement", "Dental bridge and model on a dark background", 1800, 2400),
  restorativeModels: img("restorative-models", "Dental models used to plan crowns, inlays and fillings", 1920, 1280),
  fillingModel: img("filling-model", "Dental model showing a filling in a back tooth", 1920, 1280),
  fillingCuringLight: img("filling-curing-light", "Tooth-coloured filling being set with a curing light", 1920, 1280),
  toothacheMan: img("toothache-man", "Man with a toothache holding his cheek", 1920, 1282),
  panoramicXrayOnScreen: img("panoramic-xray-on-screen", "Digital panoramic dental X-ray reviewed on a monitor", 1920, 1280),
  panoramicXrayDetail: img("panoramic-xray-detail", "Digital X-ray showing the teeth and jaw", 1920, 1280),
  jawboneXrayScreen: img("jawbone-xray-screen", "Digital scan of the jawbone reviewed on screen before treatment", 1600, 2400),
  extractionInstruments: img("extraction-instruments", "Sterile instruments on a tray for a gentle tooth extraction", 1920, 1280),
  calmPatientChair: img("calm-patient-chair", "Relaxed patient resting comfortably in the dental chair", 1920, 1280),
  dentalCleaning: img("dental-cleaning", "Hygienist cleaning a patient's teeth", 1600, 2400),
  brushingTeethRoutine: img("brushing-teeth-routine", "Patient brushing her teeth as part of a daily routine", 1920, 1280),
  naturalToothpasteLeaf: img("natural-toothpaste-leaf", "Toothpaste and toothbrush for daily care at home", 1920, 1280),
  nightGuard: img("night-guard", "Clear mouthguard that protects the teeth", 1920, 1280),
  jawPainCompress: img("jaw-pain-compress", "Woman holding a cold compress to her aching jaw", 1920, 1280),
  happyPatientMirror: img("happy-patient-mirror", "Happy patient checking her smile in a mirror in the dental chair", 1920, 1280),
  happyPatientPortrait: img("happy-patient-portrait", "Smiling patient in the dental chair", 1920, 1280),
  smilingPatientChair: img("smiling-patient-chair", "Smiling patient relaxing in the dental chair", 1920, 1280),
  smilingManChair: img("smiling-man-chair", "Smiling man in the dental chair", 1920, 1280),
  relaxedWomanChair: img("relaxed-woman-chair", "Relaxed patient sitting comfortably in the dental chair", 1920, 1280),
  smilingWomanChair: img("smiling-woman-chair", "Patient smiling in the dental chair before her visit", 1600, 2400),
} as const;

/** Each treatment's own photos: the page banner, and the photo beside "Is this right for you?". */
export const SERVICE_PHOTOS: Record<string, { hero: Img; benefit: Img }> = {
  "porcelain-veneers": { hero: STOCK.veneerPlacement, benefit: STOCK.veneerShadeSamples },
  "teeth-whitening": { hero: STOCK.whiteningLight, benefit: STOCK.shadeGuideHands },
  invisalign: { hero: STOCK.clearAlignerSmile, benefit: STOCK.alignersInHands },
  "dental-implants": { hero: STOCK.implantModel, benefit: STOCK.transparentImplantModel },
  "all-on-x": { hero: STOCK.fullArchImplantBridge, benefit: STOCK.transparentImplantModel },
  "porcelain-crowns": { hero: STOCK.crownCrafting, benefit: STOCK.crownHandFinishing },
  "implant-dentures": { hero: STOCK.transparentImplantModel, benefit: STOCK.implantModelCrown },
  "dental-bridges": { hero: STOCK.bridgeCloseup, benefit: STOCK.prostheticArrangement },
  dentures: { hero: STOCK.denturePolishing, benefit: STOCK.seniorPatientMirror },
  "inlays-onlays": { hero: STOCK.restorativeModels, benefit: STOCK.fillingModel },
  "root-canal": { hero: STOCK.toothacheMan, benefit: STOCK.panoramicXrayOnScreen },
  extractions: { hero: STOCK.extractionInstruments, benefit: STOCK.calmPatientChair },
  fillings: { hero: STOCK.fillingCuringLight, benefit: STOCK.fillingModel },
  cleanings: { hero: STOCK.dentalCleaning, benefit: STOCK.brushingTeethRoutine },
  sealants: { hero: STOCK.smilingPatientChair, benefit: STOCK.fillingCuringLight },
  fluoride: { hero: STOCK.brushingTeethRoutine, benefit: STOCK.naturalToothpasteLeaf },
  "deep-cleaning": { hero: STOCK.calmPatientChair, benefit: STOCK.dentalCleaning },
  mouthguards: { hero: STOCK.nightGuard, benefit: STOCK.jawPainCompress },
};

/** Smiling patients for "results" steps and tiles, taken in turn so neighbouring pages differ. */
export const RESULT_SMILES: Img[] = [STOCK.happyPatientMirror, STOCK.smilingManChair, STOCK.relaxedWomanChair, STOCK.smilingPatientChair, STOCK.smilingWomanChair, STOCK.happyPatientPortrait];

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

/** A service's banner photo: its own photo when one was chosen in /cms, otherwise the treatment's stock photo. */
export function serviceHero(slug: string, current: Img): Img {
  const own = SERVICE_PHOTOS[slug];
  return own && isDefaultRoomPhoto(current) ? { ...own.hero, alt: current.alt || own.hero.alt } : current;
}

/** The treatment photo for a service link ("/services/dental-implants/"). */
export function photoForHref(href: string): Img | undefined {
  const slug = href.split("/").filter(Boolean).pop() ?? "";
  return SERVICE_PHOTOS[slug]?.hero;
}
