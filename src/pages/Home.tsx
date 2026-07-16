import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";
import WeaveDivider from "@/components/WeaveDivider";

const collections = [
  "Textile Museum, Lyon",
  "Hong Kong Museum Textiles Society",
  "National Handicrafts & Hill Tribes Center, Taiwan",
  "WOHA, Singapore",
  "Crowne Plaza, Changi Airport",
];

const artwork = [
  {
    src: "/images/work/indigo-hanging-800.webp",
    srcSet:
      "/images/work/indigo-hanging-800.webp 800w, /images/work/indigo-hanging-1600.webp 1600w",
    alt: "Translucent indigo and white handwoven hanging with bamboo rods, suspended in Kachama's open-air studio",
    caption: "Indigo hanging — silk, cotton and bamboo",
    width: 800,
    height: 1000,
  },
  {
    src: "/images/work/heritage-silks-800.webp",
    srcSet:
      "/images/work/heritage-silks-800.webp 800w, /images/work/heritage-silks-1600.webp 1600w",
    alt: "Antique Thai hill-tribe silks in gold and madder red with gilded hanging bars, wall installation",
    caption: "Heritage silks — antique cloth and gilded bars",
    width: 800,
    height: 1000,
  },
];

const studio = [
  {
    src: "/images/home/opt/loom-portrait-600.webp",
    srcSet:
      "/images/home/opt/loom-portrait-600.webp 600w, /images/home/opt/loom-portrait-1200.webp 1200w",
    alt: "Kachama Perez at her traditional loom, backlit in golden hour light, Chiang Mai, Thailand",
    caption: "At the loom",
    width: 600,
    height: 800,
    wide: false,
  },
  {
    src: "/images/home/opt/loom-working-600.webp",
    srcSet:
      "/images/home/opt/loom-working-600.webp 600w, /images/home/opt/loom-working-1200.webp 1200w",
    alt: "Kachama Perez working the shuttle at her wooden loom, Chiang Mai, Thailand",
    caption: "Working the shuttle",
    width: 600,
    height: 800,
    wide: false,
  },
  {
    src: "/images/home/opt/threading-600.webp",
    srcSet:
      "/images/home/opt/threading-600.webp 600w, /images/home/opt/threading-1200.webp 1200w",
    alt: "Kachama Perez threading silk cocoons onto the loom in her open-air workshop",
    caption: "Threading silk cocoons",
    width: 600,
    height: 800,
    wide: false,
  },
  {
    src: "/images/home/opt/studio-book-900.webp",
    srcSet:
      "/images/home/opt/studio-book-900.webp 900w, /images/home/opt/studio-book-1800.webp 1800w",
    alt: "Kachama Perez reviewing a reference book of traditional textile designs in her studio",
    caption: "In the studio",
    width: 900,
    height: 600,
    wide: true,
  },
  {
    src: "/images/home/opt/sketches-900.webp",
    srcSet:
      "/images/home/opt/sketches-900.webp 900w, /images/home/opt/sketches-1800.webp 1800w",
    alt: "Detail of textile design sketches and reference imagery in Kachama's studio",
    caption: "Sketches and references",
    width: 900,
    height: 600,
    wide: true,
  },
];

export default function Home() {
  return (
    <>
      <Seo
        title="Handwoven Wall Hangings from Chiang Mai, Thailand | Kachama Art"
        description="Kachama Perez creates one-of-a-kind handwoven wall hangings and textile art in Chiang Mai, Thailand — blending silk, natural fibers, and hill-tribe weaving traditions into contemporary art for homes, hotels, and galleries."
        path="/"
      />

      {/* Hero — vat indigo band, her red on every action */}
      <section className="weave-texture overflow-hidden bg-indigo text-indigo-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_1fr]">
          <div className="text-center lg:text-left">
            <p className="animate-fade-in text-sm uppercase tracking-[0.3em] text-indigo-foreground/60 [animation-delay:100ms] [animation-fill-mode:backwards]">
              Textile Artist · Chiang Mai, Thailand
            </p>
            <h1 className="mt-6 animate-fade-up font-display text-5xl font-medium tracking-tight [animation-delay:200ms] [animation-fill-mode:backwards] sm:text-7xl">
              Kachama
            </h1>
            <p className="mx-auto mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-indigo-foreground/80 [animation-delay:350ms] [animation-fill-mode:backwards] lg:mx-0">
              Weaving of art — renewing an ancient craft into a contemporary
              art form that honours disappearing traditional culture while
              celebrating the modern world.
            </p>
            <div className="mt-10 flex animate-fade-up flex-wrap justify-center gap-4 [animation-delay:500ms] [animation-fill-mode:backwards] lg:justify-start">
              <Link
                to="/projects"
                className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                View the Work
              </Link>
              <Link
                to="/contact"
                className="rounded-md border border-indigo-foreground/30 px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-foreground/60"
              >
                Gallery & Collector Inquiries
              </Link>
            </div>
          </div>
          <Reveal className="mx-auto w-full max-w-md lg:max-w-none">
            <img
              src="/images/home/opt/hero-720.webp"
              srcSet="/images/home/opt/hero-720.webp 720w, /images/home/opt/hero-1440.webp 1440w"
              sizes="(min-width: 1024px) 480px, (min-width: 640px) 448px, 90vw"
              alt="Kachama Perez pouring silk cocoons into a wooden bowl in her dimly lit studio, Chiang Mai, Thailand"
              width={720}
              height={900}
              decoding="async"
              fetchPriority="high"
              className="animate-hero-in aspect-[4/5] w-full rounded-md object-cover shadow-2xl ring-1 ring-indigo-foreground/10"
            />
          </Reveal>
        </div>
      </section>

      {/* Credibility strip — collections & commissions */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Collections & Commissions
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
            {collections.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* The work */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center font-display text-3xl font-medium sm:text-4xl">
          The Work
        </h2>
        <WeaveDivider className="mt-6" />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {artwork.map((item, i) => (
            <Reveal key={item.src} delay={i * 120}>
              <figure className="group">
                <div className="overflow-hidden rounded-md border border-border">
                  <img
                    src={item.src}
                    srcSet={item.srcSet}
                    sizes="(min-width: 640px) 45vw, 92vw"
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {item.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/projects"
            className="text-sm font-medium tracking-widest text-primary underline-offset-4 transition-colors hover:underline"
          >
            EXPLORE PROJECTS & EXHIBITIONS →
          </Link>
        </div>
      </section>

      {/* Quote band */}
      <section className="weave-texture bg-indigo text-indigo-foreground">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <WeaveDivider onIndigo />
          <blockquote className="mt-8 font-display text-2xl font-normal italic leading-relaxed sm:text-3xl">
            "When I see traditional textiles, I feel the weavers' hands and
            hearts."
          </blockquote>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-indigo-foreground/60">
            Kachama Perez
          </p>
          <Link
            to="/artist"
            className="mt-8 inline-block text-sm font-medium tracking-widest underline decoration-primary decoration-2 underline-offset-8 transition-colors hover:text-indigo-foreground/70"
          >
            READ HER STORY
          </Link>
        </div>
      </section>

      {/* From the studio */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center font-display text-3xl font-medium sm:text-4xl">
          From the Studio
        </h2>
        <WeaveDivider className="mt-6" />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {studio
            .filter((s) => !s.wide)
            .map((item, i) => (
              <Reveal key={item.src} delay={i * 120}>
                <figure className="group">
                  <div className="overflow-hidden rounded-md border border-border">
                    <img
                      src={item.src}
                      srcSet={item.srcSet}
                      sizes="(min-width: 640px) 30vw, 92vw"
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                    {item.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {studio
            .filter((s) => s.wide)
            .map((item, i) => (
              <Reveal key={item.src} delay={i * 120}>
                <figure className="group">
                  <div className="overflow-hidden rounded-md border border-border">
                    <img
                      src={item.src}
                      srcSet={item.srcSet}
                      sizes="(min-width: 640px) 45vw, 92vw"
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                    {item.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
        </div>
      </section>

      {/* Inquiry CTA */}
      <section className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-medium sm:text-4xl">
            For Galleries, Curators & Collectors
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Kachama's work is held in museum collections in France, Hong Kong,
            and Taiwan, and commissioned for spaces from Bangkok to Singapore.
            For exhibitions, representation, or acquiring a piece, the studio
            responds to every serious inquiry.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-block rounded-md bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Start an Inquiry
          </Link>
        </div>
      </section>
    </>
  );
}
