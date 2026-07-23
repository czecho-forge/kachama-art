import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";
import WeaveDivider from "@/components/WeaveDivider";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kachama Perez",
  jobTitle: "Textile Artist",
  url: "https://studiokachama.com/artist",
  image: "https://studiokachama.com/images/artist/hero.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chiang Mai",
    addressCountry: "TH",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Tokyo Mode College",
  },
  knowsAbout: [
    "Handweaving",
    "Textile art",
    "Thai hill-tribe textiles",
    "Contemporary tapestry",
  ],
  description:
    "Chiang Mai-based textile artist renewing traditional Thai hill-tribe weaving into contemporary handwoven wall hangings, with works held by the Textile Museum in Lyon, the Hong Kong Museum Textiles Society, and the National Handicrafts and Hill Tribes Center in Taiwan.",
};

const collections = [
  {
    place: "Textile Museum — Lyon, France",
    story:
      "After her 2008 exhibition in Lyon, the museum acquired her work for its collection — placing a Chiang Mai loom alongside centuries of the world's textile heritage.",
  },
  {
    place: "Hong Kong Museum Textiles Society",
    story:
      "Her weavings are held by the society, a mark of recognition from one of Asia's centers of textile scholarship.",
  },
  {
    place: "National Handicrafts & Hill Tribes Center — Taiwan",
    story:
      "The center holds her work — a fitting home, given that hill-tribe cloth is where her own weaving journey began.",
  },
];

const recognition = [
  {
    title: "Métissages — Jim Thompson Art Center, Bangkok",
    detail: "Part of the La Fête Festival exhibition, 2009",
  },
  {
    title: "Lanna Spirit — Toot Yung Art Center, Chiang Mai",
    detail:
      "Duo exhibition with ceramicist Somluk Pantiboon, Sep–Dec 2018",
  },
  {
    title: "ArtsWork podcast — Ep. 114",
    detail: "In-depth conversation on her life and weaving practice",
  },
];

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
      <Reveal className="overflow-hidden rounded-md border border-border">
        <img
          src="/images/artist/hero.jpg"
          alt="Kachama Perez, textile artist, in her weaving studio in Chiang Mai, Thailand"
          loading="lazy"
          className="aspect-[3/2] w-full object-cover"
        />
      </Reveal>

      <h1 className="mt-12 font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Kachama Perez
      </h1>
      <p className="mt-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
        Textile Artist · Chiang Mai, Thailand
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
        <blockquote className="border-l-2 border-primary pl-6 font-display text-xl italic leading-relaxed text-foreground/80">
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

      {/* In museum collections */}
      <div className="mt-20">
        <h2 className="text-center font-display text-3xl font-medium">
          In Museum Collections
        </h2>
        <WeaveDivider className="mt-6" />
        <div className="mt-12 space-y-10">
          {collections.map((c, i) => (
            <Reveal key={c.place} delay={i * 100}>
              <div className="border-l-2 border-indigo/30 pl-6">
                <h3 className="font-medium text-foreground">{c.place}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {c.story}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
              <div className="overflow-hidden rounded-md border border-border">
                <img
                  src={mat.src}
                  alt={mat.label}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out-expo hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {mat.label}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {/* Recognition */}
      <div className="mt-20">
        <h2 className="text-center font-display text-3xl font-medium">
          Selected Recognition
        </h2>
        <WeaveDivider className="mt-6" />
        <ul className="mt-12 space-y-6">
          {recognition.map((r) => (
            <li
              key={r.title}
              className="flex flex-col gap-1 border-b border-border pb-6 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className="font-medium text-foreground">{r.title}</span>
              <span className="text-sm text-muted-foreground">{r.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-20 rounded-md bg-secondary px-8 py-12 text-center">
        <h2 className="font-display text-2xl font-medium">
          Exhibit or Represent Kachama
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          For gallery representation, exhibitions, or museum inquiries, the
          studio welcomes your message.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-block rounded-md bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Start an Inquiry
        </Link>
      </div>
    </section>
  );
}
