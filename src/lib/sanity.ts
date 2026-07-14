import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

export interface JournalPostSummary {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  coverImage: unknown;
}

export interface JournalPost extends JournalPostSummary {
  body: PortableTextBlock[];
}

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = import.meta.env.VITE_SANITY_DATASET as string | undefined;

export const isSanityConfigured = Boolean(projectId && dataset);

export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: (import.meta.env.VITE_SANITY_API_VERSION as string) || "2024-01-01",
      useCdn: true,
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source: unknown) {
  if (!builder || !source) return undefined;
  return builder.image(source as never);
}

const POST_SUMMARY_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  coverImage
`;

export async function fetchJournalPosts(): Promise<JournalPostSummary[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) { ${POST_SUMMARY_FIELDS} }`
  );
}

export async function fetchJournalPost(slug: string): Promise<JournalPost | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ ${POST_SUMMARY_FIELDS}, body }`,
    { slug }
  );
}
