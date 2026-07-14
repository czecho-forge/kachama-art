import Lightbox, { type GalleryImage } from "@/components/Lightbox";
import Seo from "@/components/Seo";

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
    images: images("Songs of My Soul (2015), Tamarind Village Hotel, Chiang Mai", [1, 2, 9, 10, 11]),
  },
  {
    type: "Exhibition",
    title: "Songs of My Soul",
    year: "2016",
    venue: "Rayavadee Resort",
    location: "Krabi, Thailand",
    images: images("Songs of My Soul (2016), Rayavadee Resort, Krabi", [3, 4, 5]),
  },
  {
    type: "Exhibition",
    title: "Feathers and Souls",
    year: "2018",
    venue: "Residence of H.E. German Ambassador",
    location: "Bangkok, Thailand",
    images: images("Feathers and Souls (2018), Residence of H.E. German Ambassador, Bangkok", [12, 13, 14]),
  },
  {
    type: "Tapestries and Pillows",
    title: "Oasis Baan Sean Doi Spa and Resort",
    year: "",
    venue: "",
    location: "Chiang Mai, Thailand",
    images: images("Tapestries and Pillows, Oasis Baan Sean Doi Spa and Resort, Chiang Mai", [15]),
  },
  {
    type: "Presentation",
    title: "WOHA Architectural Practice",
    year: "",
    venue: "",
    location: "Singapore",
    images: images("WOHA Architectural Practice, Singapore", [6]),
  },
  {
    type: "Space Partitions",
    title: "Crowne Plaza Hotel",
    year: "",
    venue: "",
    location: "Changi Airport, Singapore",
    images: images("Space Partitions, Crowne Plaza Hotel, Changi Airport", [7, 8]),
  },
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
      <h1 className="text-3xl font-semibold tracking-[0.2em] sm:text-4xl">
        PROJECTS
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Click any piece to view it in full detail.
      </p>

      <div className="mt-16 space-y-20">
        {exhibitions.map((ex, i) => (
          <div key={i}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {ex.type}
                </p>
                <p className="mt-1 text-lg font-medium">
                  {ex.title}
                  {ex.year && (
                    <span className="text-muted-foreground"> ({ex.year})</span>
                  )}
                </p>
              </div>
              <div className="text-sm text-muted-foreground sm:text-right">
                {ex.venue && <p>{ex.venue}</p>}
                <p>{ex.location}</p>
              </div>
            </div>

            {ex.images.length > 0 && (
              <div className="mt-6">
                <Lightbox images={ex.images} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
