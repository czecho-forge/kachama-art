import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const BACKUP = ".image-originals/projects";
const THUMB_DIR = "public/images/projects";
const FULL_DIR = "public/images/projects/full";
const MAX_DIM = 1600;
const JPEG_Q = 80;

const jobs = [
  { src: "Tamarind_Display (1).png", num: 9 },
  { src: "Tamarind_Display (2).png", num: 10 },
  { src: "Tamarind_Display (3).png", num: 11 },
  { src: "Exhibition_feather_and_souls_2018_german_ambassador_thailand_1 (1).png", num: 12 },
  { src: "Exhibition_feather_and_souls_2018_german_ambassador_thailand_1 (2).png", num: 13 },
  { src: "Exhibition_feather_and_souls_2018_german_ambassador_thailand_1 (3).png", num: 14 },
  { src: "Baan Saen Doi 1.jpg", num: 15 },
];

const kb = (n) => (n / 1024).toFixed(0) + "KB";

for (const { src, num } of jobs) {
  const inPath = path.join(BACKUP, src);
  const isPng = /\.png$/i.test(src);
  const thumbExt = isPng ? "png" : "jpg";

  const thumbImg = sharp(inPath).resize(MAX_DIM, MAX_DIM, {
    fit: "inside",
    withoutEnlargement: true,
  });
  const thumbBuf = isPng
    ? await thumbImg.png({ compressionLevel: 9, palette: true }).toBuffer()
    : await thumbImg.jpeg({ quality: JPEG_Q, mozjpeg: true }).toBuffer();
  const thumbOut = path.join(THUMB_DIR, `project-${num}.${thumbExt}`);
  await writeFile(thumbOut, thumbBuf);

  const fullBuf = await sharp(inPath)
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
  const fullOut = path.join(FULL_DIR, `project-${num}.jpg`);
  await writeFile(fullOut, fullBuf);

  console.log(`project-${num}: ${src.padEnd(65)} thumb ${kb(thumbBuf.length).padStart(7)}  full ${kb(fullBuf.length).padStart(7)}`);
}
