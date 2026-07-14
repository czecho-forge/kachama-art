import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kachama Perez",
  jobTitle: "Textile Artist",
  url: "https://kachama.art/artist",
  image: "https://kachama.art/images/artist/hero.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chiang Mai",
    addressCountry: "TH",
  },
  description:
    "Chiang Mai-based textile artist renewing traditional Thai hill-tribe weaving into contemporary handwoven wall hangings.",
};

export default function Artist() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <Seo
        title="Kachama Perez — Textile Artist in Chiang Mai, Thailand | Kachama Art"
        description="Meet Kachama Perez, a Chiang Mai-based weaving artist renewing traditional Thai hill-tribe textile craft into contemporary handwoven wall hangings, exhibited internationally from Lyon to Hong Kong."
        path="/artist"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Reveal className="overflow-hidden rounded-lg border border-border">
        <img
          src="/images/artist/hero.jpg"
          alt="Kachama Perez, textile artist, in her weaving studio in Chiang Mai, Thailand"
          loading="lazy"
          className="aspect-[3/2] w-full object-cover"
        />
      </Reveal>

      <h1 className="mt-12 text-3xl font-semibold tracking-[0.2em] sm:text-4xl">
        ARTIST
      </h1>
      <p className="mt-4 text-xl tracking-widest text-muted-foreground">
        KACHAMA PEREZ
      </p>
      <div className="mt-12 space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>
          Kachama Perez is a Chiang Mai based weaving artist in Thailand. She was
          born in Bangkok to a mother who sewed many of her own clothes and
          passed on to her daughter a deep and lasting love for the charm of
          handcrafted textiles. Once she was old enough, Kachama accompanied her
          father, who was a doctor, on his professional travels through many of
          the provinces of northern and northeastern Thailand. By meeting and
          talking with local villagers, she became acquainted with the
          distinctive traditional textiles of each region.
        </p>
        <p>
          In the early 1990s, she went on to study at Tokyo Mode College and
          spent an additional three years in Japan working for a leading design
          company. Upon returning to Thailand, she settled in Chiang Mai where
          she came across the traditional fabrics made by the hill-tribe people.
          The beauty and richness of these fabrics resonated so deeply with
          Kachama that she took up weaving as the preferred medium for expressing
          her art.
        </p>
        <blockquote className="border-l-2 border-border pl-6 italic">
          "Weaving is one of the oldest surviving crafts. The technique traces
          back to the Stone Age. In civilizations all over the world, people have
          woven using materials they could find in their environment. As an
          artist living in the 21st century, I might use industrial materials,
          but what I do is the same as the ancestors; I create decorative
          textiles for homes and public spaces, and evoke positive emotions in
          viewers' hearts. In this regard, I identify myself as an inheritor of a
          tradition that carries the wisdom of the ancestors. When I see
          traditional textiles, I feel the weavers' hands and hearts, and I want
          to master everything about the techniques and approaches they use in
          their craft. They are an inexhaustible source of inspiration to my
          work."
        </blockquote>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { src: "/images/artist/hemp-cotton.jpg", label: "Hemp & Cotton" },
          { src: "/images/artist/yellow-cocoon.jpg", label: "Yellow Cocoon" },
          {
            src: "/images/artist/silk-thread-on-bar.png",
            label: "Silk Thread",
          },
          { src: "/images/artist/raw-silk.jpg", label: "Raw Silk" },
        ].map((mat, i) => (
          <Reveal key={mat.src} delay={i * 100}>
            <figure className="text-center">
              <div className="overflow-hidden rounded-lg border border-border">
                <img
                  src={mat.src}
                  alt={mat.label}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <figcaption className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {mat.label}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
