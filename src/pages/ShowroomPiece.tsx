import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Seo from "@/components/Seo";
import ZoomViewer from "@/components/ZoomViewer";
import { cn } from "@/lib/utils";
import { COLOURS, pieces, photoSrc, photoSrcSet, type Piece } from "@/data/showroom";

const colourById = Object.fromEntries(COLOURS.map((c) => [c.id, c]));

export default function ShowroomPiece() {
  const { id } = useParams();
  const index = pieces.findIndex((p) => p.id === id);
  const piece = pieces[index];

  if (!piece) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Piece not found</h1>
        <Link to="/showroom" className="mt-6 inline-block text-primary underline underline-offset-4">
          Back to the Showroom
        </Link>
      </section>
    );
  }

  const prev = pieces[(index - 1 + pieces.length) % pieces.length];
  const next = pieces[(index + 1) % pieces.length];
  const related = pieces
    .filter((p) => p.id !== piece.id && p.colours.includes(piece.colours[0]))
    .slice(0, 8);

  // key resets the gallery's state when moving between pieces.
  return <PieceView key={piece.id} piece={piece} prev={prev} next={next} related={related} />;
}

function PieceView({
  piece,
  prev,
  next,
  related,
}: {
  piece: Piece;
  prev: Piece;
  next: Piece;
  related: Piece[];
}) {
  const [active, setActive] = useState(0);
  const [zoomAt, setZoomAt] = useState<number | null>(null);
  const [armed, setArmed] = useState(false);
  const stack = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const photos = piece.photos;
  const count = photos.length;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Desktop: photos stack vertically; the one filling the frame is "on",
  // settles from a slight zoom, and lights up its thumbnail.
  useEffect(() => {
    const el = stack.current;
    if (!el) return;
    const root = document.documentElement;
    root.classList.add("snap-piece");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const fig = e.target as HTMLElement;
          if (e.intersectionRatio >= 0.3) fig.dataset.state = "on";
          else if (e.intersectionRatio === 0) fig.dataset.state = "off";
          if (e.intersectionRatio >= 0.5) setActive(Number(fig.dataset.photo));
        }
      },
      { threshold: [0, 0.3, 0.5] }
    );
    el.querySelectorAll("[data-photo]").forEach((f) => io.observe(f));
    setArmed(true);
    return () => {
      io.disconnect();
      root.classList.remove("snap-piece");
    };
  }, []);

  function showPhoto(i: number) {
    stack.current
      ?.querySelector(`[data-photo="${i}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Mobile swipe gallery: track which slide is centred.
  function onScroll() {
    const el = scroller.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  }

  const colourNames = piece.colours.map((c) => colourById[c].label).join(", ");
  const description = `${piece.title}: a handwoven wall hanging by Kachama, shown in the Chiang Mai showroom. Colours: ${colourNames}.`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: piece.title,
    artform: "Handwoven textile wall hanging",
    creator: { "@type": "Person", name: "Kachama Perez" },
    image: photos.map((p) => `https://studiokachama.com${photoSrc(piece.id, p, 1600)}`),
    ...(piece.size && { width: `${piece.size[0]} cm`, height: `${piece.size[1]} cm` }),
  };
  const alt = (i: number) => `${piece.title}, photo ${i + 1} of ${count}`;

  return (
    <section className="mx-auto max-w-[90rem] px-4 pb-24 pt-6 sm:px-6 lg:px-10">
      <Seo
        title={`${piece.title}, Handwoven Wall Hanging | Kachama Art`}
        description={description}
        path={`/showroom/${piece.id}`}
        image={photoSrc(piece.id, photos[0], 1600)}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/showroom" className="hover:text-foreground">
          Showroom
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{piece.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14">
        {/* Gallery */}
        <div>
          {/* Desktop: thumbnail rail + vertical stack of full-height photos */}
          <div className="hidden gap-4 lg:flex">
            {count > 1 && (
              <div className="sticky top-8 flex w-16 shrink-0 flex-col gap-2 self-start">
                {photos.map((p, i) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => showPhoto(i)}
                    aria-label={`Go to photo ${i + 1} of ${count}`}
                    aria-current={i === active}
                    className={cn(
                      "aspect-[2/3] overflow-hidden rounded bg-secondary transition-opacity duration-300",
                      i === active ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-55 hover:opacity-100"
                    )}
                  >
                    <img src={photoSrc(piece.id, p, 800)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div ref={stack} data-armed={armed || undefined} className="flex flex-1 flex-col gap-4">
              {photos.map((p, i) => (
                <figure
                  key={p.name}
                  data-photo={i}
                  className="group relative flex h-[calc(100svh-4rem)] min-h-[32rem] snap-start scroll-mt-8 items-center justify-center overflow-hidden rounded bg-secondary"
                >
                  <button
                    type="button"
                    onClick={() => setZoomAt(i)}
                    className="flex h-full w-full cursor-zoom-in items-center justify-center"
                    aria-label={`Zoom into photo ${i + 1} of ${count}`}
                  >
                    <img
                      src={photoSrc(piece.id, p, 1600)}
                      srcSet={photoSrcSet(piece.id, p)}
                      sizes="60vw"
                      alt={alt(i)}
                      width={p.w}
                      height={p.h}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="h-full max-h-full w-auto object-contain"
                    />
                  </button>
                  <span className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-md bg-background/90 px-3 py-1.5 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" aria-hidden />
                    Click to zoom
                  </span>
                </figure>
              ))}
            </div>
          </div>

          {/* Mobile: swipe between photos, tap to zoom */}
          <div className="lg:hidden">
            <div
              ref={scroller}
              onScroll={onScroll}
              className="-mx-4 flex snap-x snap-mandatory overflow-x-auto sm:-mx-6 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {photos.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setZoomAt(i)}
                  className="aspect-[4/5] w-full shrink-0 snap-center bg-secondary"
                  aria-label={`Zoom into photo ${i + 1} of ${count}`}
                >
                  <img
                    src={photoSrc(piece.id, p, 800)}
                    srcSet={photoSrcSet(piece.id, p)}
                    sizes="100vw"
                    alt={alt(i)}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
            {count > 1 && (
              <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
                {photos.map((p, i) => (
                  <span
                    key={p.name}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === active ? "w-5 bg-primary" : "w-1.5 bg-foreground/25"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">{piece.title}</h1>
          <p className="mt-3 text-muted-foreground">Handwoven wall hanging by Kachama, Chiang Mai</p>

          <dl className="mt-8 divide-y divide-border border-y border-border text-sm">
            <div className="flex items-start justify-between gap-6 py-4">
              <dt className="font-medium">Colour</dt>
              <dd className="flex flex-wrap justify-end gap-x-3 gap-y-1.5">
                {piece.colours.map((c) => (
                  <Link
                    key={c}
                    to={`/showroom?colour=${c}`}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/10"
                      style={{ background: colourById[c].swatch }}
                      aria-hidden
                    />
                    {colourById[c].label}
                  </Link>
                ))}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-6 py-4">
              <dt className="font-medium">Size</dt>
              <dd className="text-right text-muted-foreground">
                {piece.size ? `${piece.size[0]} × ${piece.size[1]} cm (W × H)` : "On request"}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-6 py-4">
              <dt className="font-medium">Reference</dt>
              <dd className="text-muted-foreground">KC-{piece.id}</dd>
            </div>
          </dl>

          <Link
            to={`/contact?piece=${piece.id}`}
            className="mt-8 flex w-full items-center justify-center rounded-md bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Inquire about this piece
          </Link>
          <Link
            to="/contact?intent=collector"
            className="mt-3 flex w-full items-center justify-center rounded-md border border-border px-6 py-3.5 text-sm font-medium transition-colors hover:border-primary/60 hover:text-primary"
          >
            Book a showroom visit
          </Link>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Each piece is handwoven in Chiang Mai and exists only once. See it in person at the
            showroom by appointment, or ask for more photos and details.
          </p>

          <div className="mt-10 flex justify-between border-t border-border pt-5 text-sm">
            <Link to={`/showroom/${prev.id}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" /> {prev.title}
            </Link>
            <Link to={`/showroom/${next.id}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              {next.title} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="font-display text-2xl font-medium">
            More in {colourById[piece.colours[0]].label.toLowerCase()}
          </h2>
          <ul className="-mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            {related.map((p) => (
              <li key={p.id} className="w-40 shrink-0 snap-start sm:w-52">
                <Link to={`/showroom/${p.id}`} className="group block">
                  <div className="aspect-[2/3] overflow-hidden bg-secondary">
                    <img
                      src={photoSrc(p.id, p.photos[0], 800)}
                      alt={`${p.title}, handwoven wall hanging`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium">{p.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {zoomAt !== null && (
        <ZoomViewer
          title={piece.title}
          index={zoomAt}
          onIndex={setZoomAt}
          onClose={() => setZoomAt(null)}
          photos={photos.map((p, i) => ({
            src: photoSrc(piece.id, p, 1600),
            alt: alt(i),
            w: p.w,
            h: p.h,
          }))}
        />
      )}
    </section>
  );
}
