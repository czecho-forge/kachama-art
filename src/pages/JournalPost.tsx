import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PortableText } from "@portabletext/react";
import Seo from "@/components/Seo";
import { fetchJournalPost, urlForImage } from "@/lib/sanity";

export default function JournalPost() {
  const { slug = "" } = useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["journal-post", slug],
    queryFn: () => fetchJournalPost(slug),
    enabled: Boolean(slug),
  });

  const jsonLd = post && {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: "Kachama Perez" },
    ...(post.excerpt && { description: post.excerpt }),
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      {post && (
        <>
          <Seo
            title={`${post.title} | Kachama Art Journal`}
            description={post.excerpt || post.title}
            path={`/journal/${post.slug}`}
            image={urlForImage(post.coverImage)?.width(1200).url()}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </>
      )}

      <Link
        to="/journal"
        className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        ← Journal
      </Link>

      {isLoading && (
        <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
      )}

      {!isLoading && !post && (
        <p className="mt-10 text-sm text-muted-foreground">
          This post couldn't be found.
        </p>
      )}

      {post && (
        <article className="mt-8">
          {post.coverImage ? (
            <img
              src={urlForImage(post.coverImage)?.width(1600).url()}
              alt={post.title}
              className="w-full rounded-md border border-border"
            />
          ) : null}
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="prose prose-stone mt-10 max-w-none dark:prose-invert">
            <PortableText value={post.body} />
          </div>
        </article>
      )}
    </section>
  );
}
