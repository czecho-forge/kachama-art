import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLOURS, pieces, photoSrc, photoSrcSet } from "@/data/showroom";

const colourById = Object.fromEntries(COLOURS.map((c) => [c.id, c]));
const pad = (n: number) => String(n).padStart(2, "0");
const VISIBLE = 4; // pieces drawn on each side of the front one
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Horizontal stack: the front hanging sits centre; neighbours tuck in behind
 * it, smaller, and fade back into the page like textiles further down a rack.
 * Positions are a continuous function of distance from the front, so a drag
 * moves the whole rack live and release settles it.
 */
export default function StackCarousel() {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [size, setSize] = useState({ w: 1200, h: 640 });
  const stage = useRef<HTMLDivElement>(null);
  // `card` is read at press time: pointer capture retargets the release to the stage.
  const start = useRef<{ x: number; moved: boolean; card: number | null } | null>(null);
  const wheelLock = useRef(0);
  const n = pieces.length;

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = useCallback((d: number) => setIndex((i) => Math.min(n - 1, Math.max(0, i + d))), [n]);

  // Card geometry from the stage size.
  const cardH = size.h * 0.88;
  const nominalW = cardH * (2 / 3);
  const near = Math.min(nominalW * 0.62, size.w * 0.27); // offset of the first neighbour
  const far = near * 0.34; // each further neighbour

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, select")) return;
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Sideways trackpad swipes step the rack; vertical wheel still scrolls the page.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const dx = e.shiftKey ? e.deltaY : e.deltaX;
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.shiftKey ? 0 : e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLock.current < 380) return;
      wheelLock.current = now;
      go(dx > 0 ? 1 : -1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go]);

  function onPointerDown(e: ReactPointerEvent) {
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
    start.current = { x: e.clientX, moved: false, card: card ? Number(card.dataset.card) : null };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: ReactPointerEvent) {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    if (Math.abs(dx) > 6) start.current.moved = true;
    // Resist past the ends of the rack.
    const atEdge = (index === 0 && dx > 0) || (index === n - 1 && dx < 0);
    setDrag(atEdge ? dx * 0.3 : dx);
  }
  function onPointerUp(e: ReactPointerEvent) {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    setDrag(0);
    if (!s.moved) {
      // A tap brings a side piece forward. Opening a piece is only ever the
      // "View piece" button, so a press while dragging can't leave the page.
      if (s.card !== null && s.card !== index) setIndex(s.card);
      return;
    }
    if (Math.abs(dx) > 40) {
      const steps = Math.max(1, Math.min(3, Math.round(Math.abs(dx) / near)));
      go(dx < 0 ? steps : -steps);
    }
  }

  const piece = pieces[index];
  const dragOffset = drag / near; // in "pieces"
  const progress = (index + 1) / n;
  const settle = drag ? "none" : `transform 700ms ${EASE}, opacity 500ms ease-out`;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Gallery, one piece at a time"
      className="flex h-[calc(100svh-4rem)] min-h-[36rem] flex-col"
    >
      <div
        ref={stage}
        className="relative flex-1 cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          start.current = null;
          setDrag(0);
        }}
      >
        {pieces.map((p, i) => {
          if (Math.abs(i - index) > VISIBLE + 1) return null;
          const d = i - index + dragOffset;
          const a = Math.abs(d);
          const x = Math.sign(d) * (a <= 1 ? a * near : near + (a - 1) * far);
          const scale = Math.max(0.55, 1 - 0.15 * a);
          const opacity = a <= VISIBLE ? 1 : Math.max(0, VISIBLE + 1 - a);
          const front = i === index;
          const cover = p.photos[0];
          return (
            <div
              key={p.id}
              data-card={i}
              aria-hidden={!front}
              className="absolute left-1/2 top-1/2 overflow-hidden rounded-sm bg-secondary shadow-[0_28px_50px_-24px_hsl(215_28%_17%/0.45)]"
              style={{
                height: cardH,
                aspectRatio: `${cover.w} / ${cover.h}`,
                transform: `translate(-50%, -50%) translateX(${x}px) scale(${scale})`,
                zIndex: 100 - Math.round(a * 10),
                opacity,
                transition: settle,
              }}
            >
              <img
                src={photoSrc(p.id, cover, 800)}
                srcSet={photoSrcSet(p.id, cover)}
                sizes={`${Math.round(nominalW)}px`}
                alt={front ? `${p.title}, handwoven wall hanging by Kachama` : ""}
                draggable={false}
                loading={Math.abs(i - index) <= 2 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
              {/* Pieces further down the rack fade back into the page colour, not grey. */}
              <div
                className="pointer-events-none absolute inset-0 bg-background"
                style={{ opacity: Math.min(a, 3) * 0.17, transition: drag ? "none" : `opacity 600ms ${EASE}` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mx-auto grid w-full max-w-[90rem] gap-x-10 gap-y-4 px-4 pb-5 pt-5 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end lg:px-10">
        {/* Caption for the front piece */}
        <div key={index} className="animate-caption-in" aria-live="polite">
          <h2 className="font-display text-[clamp(1.875rem,3.4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            {piece.title}
          </h2>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {piece.colours.map((c) => (
              <li key={c} className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-full border border-black/10"
                  style={{ background: colourById[c].swatch }}
                  aria-hidden
                />
                {colourById[c].label}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3 md:flex">
          <Link
            to={`/contact?piece=${piece.id}`}
            className={`rounded-md border border-border px-6 py-3 text-center text-sm font-medium transition-colors hover:border-primary/60 hover:text-primary ${focusRing}`}
          >
            Inquire
          </Link>
          <Link
            to={`/showroom/${piece.id}`}
            className={`rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 ${focusRing}`}
          >
            View piece
          </Link>
        </div>

        {/* Where you are on the rack, and the controls to move along it */}
        <div className="flex items-center gap-4 md:col-span-2">
          <div className="relative h-px flex-1 bg-border" aria-hidden>
            <div
              className="absolute inset-0 origin-left bg-primary"
              style={{ transform: `scaleX(${progress})`, transition: `transform 700ms ${EASE}` }}
            />
            {/* Full-width track, so translateX(%) moves the marker by % of the thread. */}
            <div
              className="absolute inset-0"
              style={{ transform: `translateX(${progress * 100}%)`, transition: `transform 700ms ${EASE}` }}
            >
              <div className="absolute -left-1 -top-[3px] h-[7px] w-[7px] rotate-45 bg-primary" />
            </div>
          </div>
          <p className="text-sm tabular-nums text-muted-foreground">
            <span className="sr-only">Piece </span>
            {pad(index + 1)} / {pad(n)}
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className={`rounded-md border border-border p-2 transition-colors hover:border-primary/60 hover:text-primary disabled:pointer-events-none disabled:opacity-30 ${focusRing}`}
              aria-label="Previous piece"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index === n - 1}
              className={`rounded-md border border-border p-2 transition-colors hover:border-primary/60 hover:text-primary disabled:pointer-events-none disabled:opacity-30 ${focusRing}`}
              aria-label="Next piece"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
