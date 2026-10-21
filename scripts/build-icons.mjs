// Builds the browser icons and the link-share card from the Kachama monogram.
//
//   node scripts/build-icons.mjs
//
// public/favicon.svg is the monogram redrawn as vectors (from public/images/logo.png)
// with a heavier stroke so it stays legible at 16–32px. Larger icons and the
// share card use the original logo.png line weight.
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

const RED = "#EE3750";
const CREAM = "#FBF8F1";
const LOGO = "public/images/logo.png";

// Geometry measured from the 500×500 logo: circle, vertical stem, chevron.
function monogram(stroke) {
  const r = 232 - stroke / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
  <g fill="none" stroke="${RED}" stroke-width="${stroke}" stroke-linejoin="miter">
    <circle cx="250" cy="250" r="${r}"/>
    <line x1="250" y1="${250 - r - stroke / 2}" x2="250" y2="${250 + r + stroke / 2}"/>
    <polyline points="342,78 176,247 342,416"/>
  </g>
</svg>
`;
}

const favicon = monogram(34);
await writeFile("public/favicon.svg", favicon);
await sharp(Buffer.from(favicon)).resize(48, 48).png().toFile("public/favicon-48.png");

// Home-screen icons sit on cream: iOS fills transparency with black.
async function padded(size, file) {
  const inner = Math.round(size * 0.72);
  const logo = await sharp(LOGO).resize(inner, inner).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: CREAM } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(file);
}
await padded(180, "public/apple-touch-icon.png");
await padded(192, "public/icon-192.png");
await padded(512, "public/icon-512.png");

// Link-share card (1200×630): portrait of Kachama at the loom left, monogram on cream right.
await mkdir("public/images/share", { recursive: true });
const photo = await sharp("public/images/home/home-6.jpg")
  .resize(600, 630, { fit: "cover", position: "centre" })
  .toBuffer();
const mark = await sharp(LOGO).resize(300, 300).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: CREAM } })
  .composite([
    { input: photo, left: 0, top: 0 },
    { input: mark, left: 750, top: 165 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("public/images/share/kachama-share.jpg");

console.log("favicon.svg, favicon-48.png, apple-touch-icon.png, icon-192/512.png, images/share/kachama-share.jpg");
