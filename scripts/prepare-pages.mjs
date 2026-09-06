import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
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
  "memento-public-home-20260906.png",
  "memento-value-triptych-master-v1.png",
  "paper-noise.png",
  "search-generic-ad.webp",
  "search-personalized-ad.webp",
  "yiyang-particle-portrait-cobalt-engraving-v1-transparent.webp",
  "yiyang-particle-portrait-transparent-v1.webp",
  "xiaohongshu-qr.jpg",
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
  "documents",
  "portrait-lab",
  "window.svg",
]) {
  await rm(resolve(siteRoot, relativePath), { recursive: true, force: true });
}

// Only rebuild the generated output. Legacy public/memento source stays untouched.
// Old portfolio bookmarks now reach the canonical product and public demo.
const legacyMementoRoot = resolve(siteRoot, "memento");
await rm(legacyMementoRoot, { recursive: true, force: true });
await mkdir(legacyMementoRoot, { recursive: true });
for (const [fileName, destination, label] of [
  ["Memento-4.0.html", "https://luke20001024.github.io/Memento/", "打开 Memento 产品主页"],
  ["Memento-Cognitive-Home-Standalone.html", "https://luke20001024.github.io/Memento/demo/dashboard.html", "打开 Memento 在线体验版"],
]) {
  await writeFile(resolve(legacyMementoRoot, fileName), `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=${destination}">
  <link rel="canonical" href="${destination}">
  <title>${label}</title>
</head>
<body><p><a href="${destination}">${label}</a></p></body>
</html>
`, "utf8");
}

await writeFile(resolve(siteRoot, ".nojekyll"), "", "utf8");
