// Builds the Showroom photo set from a photographer's export.
//
//   node scripts/build-showroom.mjs "<path to 'Kachama update' folder>"
//
// Each numbered sub-folder is one art piece. Loose photos at the top level are
// single-photo pieces, numbered after the last folder in filename order.
// The narrowest (full-length) shot becomes the cover; the rest follow by name.
// Writes public/images/showroom/<id>/<name>-{800,1600}.webp and
// src/data/showroom-photos.json. Piece details live in src/data/showroom.ts.
import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = process.argv[2];
if (!SRC) {
  console.error("Usage: node scripts/build-showroom.mjs <source folder>");
  process.exit(1);
}

const OUT_DIR = "public/images/showroom";
const MANIFEST = "src/data/showroom-photos.json";
const WIDTHS = [800, 1600];
const WEBP_Q = 76;
// Pieces where a tall close-up beats the full shot on narrowness.
const COVER = { "01": "127a8712", "45": "127a9104", "49": "127a9133" };

const isJpg = (n) => /\.jpe?g$/i.test(n);
const pad = (n) => String(n).padStart(2, "0");
const slug = (n) => n.replace(/\.jpe?g$/i, "").trim().replace(/\s+/g, "-").toLowerCase();

const entries = await readdir(SRC, { withFileTypes: true });
const folders = entries
  .filter((e) => e.isDirectory() && /^\d+$/.test(e.name))
  .map((e) => Number(e.name))
  .sort((a, b) => a - b);

const pieces = [];
for (const n of folders) {
  const dir = path.join(SRC, String(n));
  const files = (await readdir(dir)).filter(isJpg).sort();
  pieces.push({ id: pad(n), files: files.map((f) => path.join(dir, f)) });
}
const loose = entries.filter((e) => e.isFile() && isJpg(e.name)).map((e) => e.name).sort();
let next = (folders.at(-1) ?? 0) + 1;
for (const f of loose) pieces.push({ id: pad(next++), files: [path.join(SRC, f)] });

const manifest = {};
let total = 0;

for (const piece of pieces) {
  const photos = [];
  for (const file of piece.files) {
    const meta = await sharp(file).rotate().metadata();
    // .rotate() applies EXIF orientation, so swap when the camera was turned.
    const turned = (meta.orientation ?? 1) >= 5;
    const w = turned ? meta.height : meta.width;
    const h = turned ? meta.width : meta.height;
    photos.push({ file, name: slug(path.basename(file)), w, h });
  }
  photos.sort((a, b) => a.w / a.h - b.w / b.h || a.name.localeCompare(b.name));
  const pinned = photos.findIndex((p) => p.name === COVER[piece.id]);
  if (pinned > 0) photos.unshift(...photos.splice(pinned, 1));

  const dir = path.join(OUT_DIR, piece.id);
  await mkdir(dir, { recursive: true });
  manifest[piece.id] = [];

  for (const p of photos) {
    for (const width of WIDTHS) {
      const buf = await sharp(p.file)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: WEBP_Q })
        .toBuffer();
      await writeFile(path.join(dir, `${p.name}-${width}.webp`), buf);
      total += buf.length;
    }
    manifest[piece.id].push({ name: p.name, w: p.w, h: p.h });
  }
  console.log(`piece ${piece.id}: ${photos.length} photo(s), cover ${photos[0].name}`);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${pieces.length} pieces, ${(total / 1024 / 1024).toFixed(1)}MB of webp in ${OUT_DIR}`);
