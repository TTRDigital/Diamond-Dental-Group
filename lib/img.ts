import imageLoader from "@/lib/image-loader";

/** URL of a resized copy for CSS backgrounds (next/image is not used there). */
export const bgSrc = (src: string, width = 1200) => imageLoader({ src, width, quality: 75 });
