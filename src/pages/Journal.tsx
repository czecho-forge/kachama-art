import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";
import { fetchJournalPosts, urlForImage, isSanityConfigured } from "@/lib/sanity";

export default function Journal() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["journal-posts"],
    queryFn: fetchJournalPosts,
    enabled: isSanityConfigured,
  });

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <Seo
        title="Journal — Notes from the Weaving Studio | Kachama Art"
        description="Editorial updates from Kachama Perez's Chiang Mai weaving studio — new handwoven wall hangings, materials, and exhibitions."
        path="/journal"
      />
      <h1 className="text-3xl font-semibold tracking-[0.2em] sm:text-4xl">
        JOURNAL
      </h1>

      {!isSanityConfigured && (
        <p className="mt-10 text-sm text-muted-foreground">
          The journal isn't connected yet — once the Sanity project is set up,
          posts will appear here.
        </p>
      )}

      {isSanityConfigured && isLoading && (
        <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
      )}

      {isSanityConfigured && !isLoading && posts?.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">
          No posts published yet — check back soon.
        </p>
      )}

      <div className="mt-16 space-y-16">
        {posts?.map((post, i) => (
          <Reveal key={post._id} delay={i * 100}>
            <Link to={`/journal/${post.slug}`} className="group block">
              {post.coverImage ? (
                <div className="overflow-hidden rounded-lg border border-border">
                  <img
                    src={urlForImage(post.coverImage)
                      ?.width(1200)
                      .height(675)
                      .fit("crop")
                      .url()}
                    alt={post.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : null}
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h2 className="mt-1 text-xl font-medium group-hover:underline">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
              )}
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
