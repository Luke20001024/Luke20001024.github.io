import { readdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const siteRoot = resolve("dist/client");
const assetsRoot = resolve(siteRoot, "assets");
const publicAssets = new Set([
  "ai-search-agentic.webp",
  "ai-search-standard.webp",
  "arcbti",
  "dark-noise.png",
  "memento-dashboard.png",
  "memento-cognitive-home.webp",
  "memento-cognitive-home-user-shot-20260823.png",
  "memento-value-triptych-master-v1.png",
  "paper-noise.png",
  "search-generic-ad.webp",
  "search-personalized-ad.webp",
  "yiyang-particle-portrait-cobalt-engraving-v1-transparent.webp",
  "yiyang-particle-portrait-transparent-v1.webp",
]);

for (const fileName of await readdir(assetsRoot)) {
  if (!publicAssets.has(fileName)) {
    await rm(resolve(assetsRoot, fileName), { recursive: true, force: true });
  }
}

for (const relativePath of [
  ".DS_Store",
  "file.svg",
  "globe.svg",
  "main-axis-demo.html",
  "memento/MEMENTO_PRODUCT_FINAL_STATE.md",
  "documents",
  "portrait-lab",
  "window.svg",
]) {
  await rm(resolve(siteRoot, relativePath), { recursive: true, force: true });
}

await writeFile(resolve(siteRoot, ".nojekyll"), "", "utf8");
