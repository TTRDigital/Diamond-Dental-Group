// Lays Sanity values over the built-in content. An empty or missing Sanity field keeps the built-in value,
// so an unfinished document can never blank a page. Arrays replace the built-in array only when they have items.
export function overlay(base, top) {
  if (top === null || top === undefined || top === "") return base;
  if (Array.isArray(top)) return top.length ? top : base;
  if (typeof top === "object" && base && typeof base === "object" && !Array.isArray(base)) {
    const out = { ...base };
    for (const k of Object.keys(top)) if (!k.startsWith("_")) out[k] = overlay(base[k], top[k]);
    return out;
  }
  if (typeof top === "object") return top; // the built-in has no such object: take it as is
  return top;
}
