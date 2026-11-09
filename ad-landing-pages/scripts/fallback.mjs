// Built-in content (content/*.json): the fallback when Sanity has nothing or cannot be reached.
import { readFileSync } from "node:fs";
export const SLUGS = ["offer", "implant"];
const read = (n) => JSON.parse(readFileSync(new URL(`../content/${n}.json`, import.meta.url), "utf8"));
import { overlay } from "./merge.mjs";
export const fallbackFor = (slug) => {
  const page = read(slug);
  const base = overlay(read("common"), page);
  return page.membership === null ? { ...base, membership: null } : base;
};
