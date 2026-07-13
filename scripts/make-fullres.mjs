import sharp from "sharp";
import { readdir, mkdir, rm, stat } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import path from "node:path";

// Generate max-quality JPEG versions (native resolution) from the backed-up
// originals, for the click-to-zoom lightbox. Photos as JPEG q92 = tiny + sharp.
const SRC_DIRS = ["projects", "artist"];
const BACKUP = ".image-originals";
const OUT = "public/images";

const kb = (n) => (n / 1024).toFixed(0) + "KB";

for (const sub of SRC_DIRS) {
  const srcDir = path.join(BACKUP, sub);
  const outDir = path.join(OUT, sub, "full");
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  for (const file of await readdir(srcDir)) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const src = path.join(srcDir, file);
    const base = file.replace(/\.(jpe?g|png)$/i, ".jpg");
    const out = path.join(outDir, base);

    const buf = await sharp(src)
      .flatten({ background: "#ffffff" }) // drop any alpha onto white
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();

    await writeFile(out, buf);
    const orig = (await stat(src)).size;
    console.log(`${(sub + "/full/" + base).padEnd(40)} ${kb(orig).padStart(8)} -> ${kb(buf.length).padStart(8)}`);
  }
}
console.log("\nFull-quality JPEGs ready in public/images/*/full/");
