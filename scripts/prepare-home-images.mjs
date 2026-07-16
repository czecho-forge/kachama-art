import sharp from "sharp";
import { mkdir } from "node:fs/promises";

/**
 * Art-directed crops for the Home page, generated at exact display aspect
 * ratios in two responsive sizes (1x/2x), as WebP.
 *
 * - `attention` crop = sharp's saliency-based smart crop (faces/subjects),
 *   used for photos of Kachama so she is never cut out of frame.
 * - `.rotate()` (no args) applies EXIF orientation — the artwork camera
 *   originals carry orientation=8 (portrait) and would render sideways
 *   without it.
 */
const jobs = [
  // Hero — moody cocoon portrait, 4:5
  { src: ".image-originals/home/home-6.jpg", out: "public/images/home/opt/hero", widths: [720, 1440], ar: [4, 5], position: "attention" },

  // The Work — real artwork camera originals, 4:5
  { src: ".image-originals/concept/DSCF0966.JPG", out: "public/images/work/indigo-hanging", widths: [800, 1600], ar: [4, 5], position: "attention" },
  { src: ".image-originals/concept/DSCF9913.JPG", out: "public/images/work/heritage-silks", widths: [800, 1600], ar: [4, 5], position: "south" },

  // Studio portraits, 3:4 — attention keeps her in frame (she sits off-center)
  { src: ".image-originals/home/home-7.jpg", out: "public/images/home/opt/loom-portrait", widths: [600, 1200], ar: [3, 4], position: "attention" },
  { src: ".image-originals/home/home-8.jpg", out: "public/images/home/opt/loom-working", widths: [600, 1200], ar: [3, 4], position: "attention" },
  { src: ".image-originals/home/home-9.jpg", out: "public/images/home/opt/threading", widths: [600, 1200], ar: [3, 4], position: "attention" },

  // Studio wides, 3:2 — near-native aspect, center crop
  { src: ".image-originals/home/home-10.jpg", out: "public/images/home/opt/studio-book", widths: [900, 1800], ar: [3, 2], position: "centre" },
  { src: ".image-originals/home/home-11.jpg", out: "public/images/home/opt/sketches", widths: [900, 1800], ar: [3, 2], position: "centre" },
];

const kb = (n) => (n / 1024).toFixed(0) + "KB";

for (const job of jobs) {
  await mkdir(job.out.substring(0, job.out.lastIndexOf("/")), { recursive: true });
  for (const w of job.widths) {
    const h = Math.round((w * job.ar[1]) / job.ar[0]);
    const buf = await sharp(job.src)
      .rotate() // apply EXIF orientation before any crop
      .resize(w, h, { fit: "cover", position: job.position })
      .webp({ quality: 78 })
      .toBuffer();
    const file = `${job.out}-${w}.webp`;
    await sharp(buf).toFile(file);
    console.log(`${file.padEnd(52)} ${String(w + "x" + h).padStart(9)}  ${kb(buf.length).padStart(7)}`);
  }
}
console.log("\nDone.");
