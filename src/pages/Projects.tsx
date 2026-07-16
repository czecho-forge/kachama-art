import { Link } from "react-router-dom";
import Lightbox, { type GalleryImage } from "@/components/Lightbox";
import Seo from "@/components/Seo";
import WeaveDivider from "@/components/WeaveDivider";

const THUMB_EXT: Record<number, string> = {
  1: "jpg",
  2: "png",
  3: "png",
  4: "png",
  5: "jpg",
  6: "png",
  7: "png",
  8: "png",
  9: "png",
  10: "png",
  11: "png",
  12: "png",
  13: "png",
  14: "png",
  15: "jpg",
};

function images(alt: string, nums: number[]): GalleryImage[] {
  return nums.map((n) => ({
    thumb: `/images/projects/project-${n}.${THUMB_EXT[n]}`,
    full: `/images/projects/full/project-${n}.jpg`,
    alt: `Handwoven wall hanging — ${alt}`,
  }));
}

const exhibitions = [
  {
    type: "Exhibition",
    title: "Songs of My Soul",
    year: "2015",
    venue: "Tamarind Village Hotel",
    location: "Chiang Mai, Thailand",
    story:
      "A solo exhibition of handwoven wall hangings shown at Tamarind Village, the Lanna-style boutique hotel in the old city of Chiang Mai — her weavings hung minutes from the hill-tribe textile traditions that inspired them.",
    images: images(
      "Songs of My Soul (2015), Tamarind Village Hotel, Chiang Mai",
      [1, 2, 9, 10, 11]
    ),
  },
  {
    type: "Exhibition",
    title: "Songs of My Soul",
    year: "2016",
    venue: "Rayavadee Resort",
    location: "Krabi, Thailand",
    story:
      "The exhibition travelled south to Rayavadee, the resort set among the limestone cliffs of Krabi, bringing her Northern Thai weaving to an international audience on the Andaman coast.",
    images: images(
      "Songs of My Soul (2016), Rayavadee Resort, Krabi",
      [3, 4, 5]
    ),
  },
  {
    type: "Exhibition",
    title: "Feathers and Souls",
    year: "2018",
    venue: "Residence of H.E. German Ambassador",
    location: "Bangkok, Thailand",
    story:
      "Shown at the residence of the German Ambassador in Bangkok — contemporary Thai weaving presented in one of the capital's diplomatic homes.",
    images: images(
      "Feathers and Souls (2018), Residence of H.E. German Ambassador, Bangkok",
      [12, 13, 14]
    ),
  },
  {
    type: "Commission",
    title: "Tapestries and Pillows",
    year: "",
    venue: "Oasis Baan Sean Doi Spa and Resort",
    location: "Chiang Mai, Thailand",
    story:
      "Commissioned tapestries and pillows woven for the resort's interiors — her work living day-to-day in the spaces it was made for.",
    images: images(
      "Tapestries and Pillows, Oasis Baan Sean Doi Spa and Resort, Chiang Mai",
      [15]
    ),
  },
  {
    type: "Presentation",
    title: "WOHA Architectural Practice",
    year: "",
    venue: "",
    location: "Singapore",
    story:
      "A presentation of her weaving to WOHA, the Singapore architectural practice — textile art in conversation with contemporary architecture.",
    images: images("WOHA Architectural Practice, Singapore", [6]),
  },
  {
    type: "Commission",
    title: "Space Partitions",
    year: "",
    venue: "Crowne Plaza Hotel",
    location: "Changi Airport, Singapore",
    story:
      "Woven space partitions commissioned for the Crowne Plaza at Changi Airport — handloom work meeting one of the world's busiest crossroads.",
    images: images(
      "Space Partitions, Crowne Plaza Hotel, Changi Airport",
      [7, 8]
    ),
  },
  {
    type: "Commission",
    title: "Woven Installation",
    year: "",
    venue: "Sindhorn Midtown Hotel",
    location: "Bangkok, Thailand",
    story:
      "Displayed in the hotel's front office, the piece weaves indigo threads with strands of recycled aluminum — a work on marine life and ocean conservation, carrying her environmental themes into the heart of Bangkok.",
    images: [],
  },
];

const heldIn = [
  "Textile Museum — Lyon, France (acquired after her 2008 exhibition)",
  "Hong Kong Museum Textiles Society",
  "National Handicrafts & Hill Tribes Center — Taiwan",
];

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: exhibitions.map((ex, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "VisualArtwork",
      name: ex.title,
      artform: "Handwoven textile wall hanging",
      creator: { "@type": "Person", name: "Kachama Perez" },
      description: ex.story,
      ...(ex.year && { dateCreated: ex.year }),
      locationCreated: ex.location,
    },
  })),
};

export default function Projects() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Seo
        title="Projects & Exhibitions — Handwoven Wall Hangings | Kachama Art"
        description="Browse Kachama's exhibitions and commissioned handwoven wall hangings and tapestries, shown at hotels, resorts, and galleries across Thailand, Singapore, and beyond."
        path="/projects"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      <h1 className="text-center font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Projects & Exhibitions
      </h1>
      <WeaveDivider className="mt-6" />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Click any piece to view it in full detail.
      </p>

      <div className="mt-20 space-y-24">
        {exhibitions.map((ex, i) => (
          <article key={i}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">
                  {ex.type}
                </p>
                <h2 className="mt-1 font-display text-2xl font-medium">
                  {ex.title}
                  {ex.year && (
                    <span className="text-muted-foreground"> ({ex.year})</span>
                  )}
                </h2>
              </div>
              <div className="text-sm text-muted-foreground sm:text-right">
                {ex.venue && <p>{ex.venue}</p>}
                <p>{ex.location}</p>
              </div>
            </div>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
              {ex.story}
            </p>

            {ex.images.length > 0 && (
              <div className="mt-8">
                <Lightbox images={ex.images} />
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Permanent collections */}
      <div className="weave-texture mt-24 rounded-md bg-indigo px-8 py-14 text-center text-indigo-foreground">
        <h2 className="font-display text-2xl font-medium sm:text-3xl">
          Held in Public Collections
        </h2>
        <WeaveDivider onIndigo className="mt-6" />
        <ul className="mx-auto mt-8 max-w-xl space-y-3 text-indigo-foreground/80">
          {heldIn.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <Link
          to="/contact"
          className="mt-10 inline-block rounded-md bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Inquire About Available Work
        </Link>
      </div>
    </section>
  );
}
