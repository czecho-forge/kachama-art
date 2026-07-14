import { writeFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

const SITE_URL = "https://kachama.art";

const staticRoutes = ["/", "/concept", "/artist", "/projects", "/contact", "/journal"];

async function fetchJournalRoutes() {
  const projectId = process.env.VITE_SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET;
  if (!projectId || !dataset) return [];

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.VITE_SANITY_API_VERSION || "2024-01-01",
    useCdn: true,
  });
  const slugs = await client.fetch(
    `*[_type == "post" && defined(slug.current)].slug.current`
  );
  return slugs.map((slug) => `/journal/${slug}`);
}

const routes = [...staticRoutes, ...(await fetchJournalRoutes())];

const urls = routes
  .map((route) => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n  </url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await writeFile("dist/sitemap.xml", xml);
console.log(`sitemap.xml written with ${routes.length} routes`);
