import sharp from "sharp";
import { readdir, mkdir, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const IMG_DIR = "public/images";
const BACKUP_DIR = ".image-originals";
const MAX_DIM = 1600; // longest side, plenty for web + retina
const JPEG_Q = 80;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(e.name)) files.push(full);
  }
  return files;
}

const kb = (n) => (n / 1024).toFixed(0) + "KB";

const files = await walk(IMG_DIR);
let before = 0;
let after = 0;

for (const file of files) {
  const rel = path.relative(IMG_DIR, file);
  const backup = path.join(BACKUP_DIR, rel);
  await mkdir(path.dirname(backup), { recursive: true });
  if (!existsSync(backup)) await copyFile(file, backup);

  const origSize = (await stat(backup)).size;
  before += origSize;

  const isPng = /\.png$/i.test(file);
  const img = sharp(backup).resize(MAX_DIM, MAX_DIM, {
    fit: "inside",
    withoutEnlargement: true,
  });

  const buf = isPng
    ? await img.png({ compressionLevel: 9, palette: true }).toBuffer()
    : await img.jpeg({ quality: JPEG_Q, mozjpeg: true }).toBuffer();

  const { writeFile } = await import("node:fs/promises");
  await writeFile(file, buf);
  after += buf.length;

  const pct = (100 - (buf.length / origSize) * 100).toFixed(0);
  console.log(`${rel.padEnd(40)} ${kb(origSize).padStart(8)} -> ${kb(buf.length).padStart(8)}  (-${pct}%)`);
}

console.log("\n" + "=".repeat(60));
console.log(`TOTAL  ${kb(before)} -> ${kb(after)}  (saved ${(100 - (after / before) * 100).toFixed(0)}%)`);
console.log(`Originals backed up in ${BACKUP_DIR}/ (not shipped)`);
