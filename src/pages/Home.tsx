import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";

const featured = [
  {
    src: "/images/home/home-3.jpg",
    alt: "Handwoven silk wall hanging by textile artist Kachama Perez, Chiang Mai, Thailand",
  },
  {
    src: "/images/home/home-4.jpg",
    alt: "Detail of a handwoven wall hanging combining silk and natural fibers by Kachama Perez",
  },
  {
    src: "/images/projects/project-5.jpg",
    alt: "Songs of My Soul (2016) handwoven wall hanging, Rayavadee Resort, Krabi",
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
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center">
        <p className="animate-fade-in text-sm uppercase tracking-[0.3em] text-muted-foreground [animation-delay:100ms] [animation-fill-mode:backwards]">
          Textile Artist · Chiang Mai, Thailand
        </p>
        <h1 className="mt-6 animate-fade-up text-5xl font-semibold tracking-tight [animation-delay:200ms] [animation-fill-mode:backwards] sm:text-7xl">
          Kachama
        </h1>
        <p className="mt-6 max-w-2xl animate-fade-up text-lg text-muted-foreground [animation-delay:350ms] [animation-fill-mode:backwards]">
          Weaving of art — renewing an ancient craft into a contemporary art
          form that honours disappearing traditional culture while celebrating
          the modern world.
        </p>
        <div className="mt-10 flex animate-fade-up gap-4 [animation-delay:500ms] [animation-fill-mode:backwards]">
          <Link
            to="/projects"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            View Projects
          </Link>
          <Link
            to="/concept"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            The Concept
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featured.map((item, i) => (
            <Reveal
              key={item.src}
              delay={i * 120}
              className="overflow-hidden rounded-lg border border-border"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
