import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import Seo from "@/components/Seo";
import StackCarousel from "@/components/StackCarousel";
import { cn } from "@/lib/utils";
import {
  COLOURS,
  SIZES,
  pieces,
  photoSrc,
  photoSrcSet,
  sizeBand,
  type ColourId,
  type Piece,
  type SizeId,
} from "@/data/showroom";

const colourById = Object.fromEntries(COLOURS.map((c) => [c.id, c]));
const anySized = pieces.some((p) => p.size);

function readList<T extends string>(params: URLSearchParams, key: string, valid: readonly T[]) {
  return (params.get(key) ?? "").split(",").filter((v): v is T => valid.includes(v as T));
}

function matches(piece: Piece, colours: ColourId[], sizes: SizeId[]) {
  if (colours.length && !colours.some((c) => piece.colours.includes(c))) return false;
  if (sizes.length) {
    const band = sizeBand(piece);
    if (!band || !sizes.includes(band)) return false;
  }
  return true;
}

export default function Showroom() {
  const [params, setParams] = useSearchParams();
  const colours = readList(params, "colour", COLOURS.map((c) => c.id));
  const sizes = readList(params, "size", SIZES.map((s) => s.id));
  const active = colours.length + sizes.length;
  // Filters only exist in the index, so a filtered link always opens there.
  const view = params.get("view") === "index" || active > 0 ? "index" : "exhibition";
  const shown = pieces.filter((p) => matches(p, colours, sizes));

  // Switching views starts the new one from the top; coming back via the
  // browser's back button remounts, which keeps the browser's own scroll restore.
  const lastView = useRef(view);
  useEffect(() => {
    if (lastView.current !== view) window.scrollTo({ top: 0 });
    lastView.current = view;
  }, [view]);

  return (
    <>
      <Seo
        title="Showroom: Handwoven Wall Hangings by Kachama | Kachama Art"
        description="Browse every handwoven wall hanging in Kachama's Chiang Mai showroom. Drag through the gallery one piece at a time, or see them all in a grid by colour, then inquire directly."
        path="/showroom"
      />

      <div className="sticky top-0 z-30 h-16 border-b border-border bg-background">
        <div className="mx-auto flex h-full max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <h1 className="whitespace-nowrap font-display text-xl font-medium tracking-tight min-[400px]:text-2xl sm:text-3xl">
            Showroom{" "}
            <span className="text-muted-foreground tabular-nums" aria-live="polite">
              ({view === "index" ? shown.length : pieces.length})
            </span>
          </h1>
          <nav aria-label="Showroom view" className="flex rounded-md border border-border p-0.5 text-sm">
            {(
              [
                ["exhibition", "Gallery", "/showroom"],
                ["index", "Grid", "/showroom?view=index"],
              ] as const
            ).map(([id, label, to]) => (
              <Link
                key={id}
                to={to}
                aria-current={view === id ? "page" : undefined}
                className={cn(
                  "rounded-[calc(var(--radius)-2px)] px-3 py-1.5 transition-colors sm:px-4",
                  view === id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {view === "exhibition" ? (
        <StackCarousel />
      ) : (
        <IndexView
          colours={colours}
          sizes={sizes}
          shown={shown}
          setParams={setParams}
          params={params}
        />
      )}
    </>
  );
}

/* ---------- Index: grid + filters ---------- */

function IndexView({
  colours,
  sizes,
  shown,
  params,
  setParams,
}: {
  colours: ColourId[];
  sizes: SizeId[];
  shown: Piece[];
  params: URLSearchParams;
  setParams: ReturnType<typeof useSearchParams>[1];
}) {
  const [showFilters, setShowFilters] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = colours.length + sizes.length;

  function toggle(key: "colour" | "size", value: string) {
    const current = key === "colour" ? (colours as string[]) : (sizes as string[]);
    const nextList = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    const next = new URLSearchParams(params);
    next.set("view", "index");
    if (nextList.length) next.set(key, nextList.join(","));
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  }

  function clearAll() {
    setParams(new URLSearchParams({ view: "index" }), { replace: true, preventScrollReset: true });
  }

  useEffect(() => {
    if (!sheetOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const filters = (
    <Filters
      colours={colours}
      sizes={sizes}
      counts={(key, value) =>
        pieces.filter((p) =>
          key === "colour"
            ? matches(p, [value as ColourId], sizes)
            : matches(p, colours, [value as SizeId])
        ).length
      }
      onToggle={toggle}
    />
  );

  return (
    <section className="mx-auto max-w-[90rem] px-4 pb-24 pt-6 sm:px-6 lg:px-10">
      <div className="flex min-h-9 flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filter{active > 0 && ` (${active})`}
        </button>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary lg:flex"
          aria-expanded={showFilters}
          aria-controls="showroom-filters"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          {showFilters ? "Hide filters" : "Show filters"}
        </button>
        {colours.map((c) => (
          <Chip key={c} label={colourById[c].label} onRemove={() => toggle("colour", c)} />
        ))}
        {sizes.map((s) => (
          <Chip key={s} label={SIZES.find((x) => x.id === s)!.label} onRemove={() => toggle("size", s)} />
        ))}
        {active > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="px-2 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-6 flex gap-10">
        {showFilters && (
          <aside
            id="showroom-filters"
            aria-label="Filters"
            className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-60 shrink-0 animate-fade-quick overflow-y-auto pr-2 lg:block"
          >
            {filters}
          </aside>
        )}

        <div className="min-w-0 flex-1">
          {shown.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-md bg-secondary px-6 py-24 text-center">
              <p className="font-display text-xl">No pieces match those filters.</p>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-md"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul
              className={cn(
                "grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5",
                showFilters ? "lg:grid-cols-3" : "lg:grid-cols-4"
              )}
            >
              {shown.map((p, i) => (
                <li key={p.id}>
                  <PieceCard piece={p} eager={i < 6} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] animate-fade-up flex-col rounded-t-2xl bg-background">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="font-display text-xl">Filter</p>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="rounded-md p-2 hover:bg-secondary"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-2">{filters}</div>
            <div className="flex gap-3 border-t border-border px-5 py-4">
              <button
                type="button"
                onClick={clearAll}
                className="flex-1 rounded-md border border-border py-3 text-sm"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="flex-[2] rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground"
              >
                Show {shown.length} {shown.length === 1 ? "piece" : "pieces"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Filters({
  colours,
  sizes,
  counts,
  onToggle,
}: {
  colours: ColourId[];
  sizes: SizeId[];
  counts: (key: "colour" | "size", value: string) => number;
  onToggle: (key: "colour" | "size", value: string) => void;
}) {
  return (
    <div className="divide-y divide-border">
      <div role="group" aria-labelledby="f-colour" className="py-5">
        <p id="f-colour" className="text-sm font-medium">Colour</p>
        <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-4">
          {COLOURS.map((c) => {
            const on = colours.includes(c.id);
            const n = counts("colour", c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onToggle("colour", c.id)}
                aria-pressed={on}
                disabled={n === 0 && !on}
                className="group flex flex-col items-center gap-1.5 text-xs disabled:opacity-35"
              >
                <span
                  className={cn(
                    "h-7 w-7 rounded-full border border-black/10 ring-offset-2 ring-offset-background transition-shadow",
                    on ? "ring-2 ring-foreground" : "group-hover:ring-1 group-hover:ring-foreground/40"
                  )}
                  style={{ background: c.swatch }}
                />
                <span className={cn(on ? "text-foreground" : "text-muted-foreground")}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size appears once at least one piece has been measured. */}
      {anySized && (
        <div role="group" aria-labelledby="f-size" className="py-5">
          <p id="f-size" className="text-sm font-medium">Size</p>
          <div className="mt-3 space-y-1">
            {SIZES.map((s) => {
              const on = sizes.includes(s.id);
              const n = counts("size", s.id);
              return (
                <label
                  key={s.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded py-1.5 text-sm",
                    n === 0 && !on && "cursor-not-allowed opacity-40"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    disabled={n === 0 && !on}
                    onChange={() => onToggle("size", s.id)}
                    className="h-4 w-4 accent-[hsl(var(--primary))]"
                  />
                  <span>{s.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{s.hint}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm transition-colors hover:bg-accent"
      aria-label={`Remove filter ${label}`}
    >
      {label}
      <X className="h-3.5 w-3.5" />
    </button>
  );
}

function PieceCard({ piece, eager }: { piece: Piece; eager: boolean }) {
  const [cover, alt] = piece.photos;
  // The second photo is only fetched once a mouse hovers or the keyboard
  // focuses the card, so phones (no hover) never download it.
  const [wantAlt, setWantAlt] = useState(false);
  return (
    <Link
      to={`/showroom/${piece.id}`}
      className="group block focus:outline-none"
      onPointerEnter={(e) => e.pointerType === "mouse" && setWantAlt(true)}
      onFocus={() => setWantAlt(true)}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary group-focus-visible:ring-2 group-focus-visible:ring-primary">
        <img
          src={photoSrc(piece.id, cover, 800)}
          srcSet={photoSrcSet(piece.id, cover)}
          sizes="(min-width: 1024px) 25vw, 50vw"
          alt={`${piece.title}, handwoven wall hanging by Kachama`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
        />
        {/* Second photo fades in on hover to preview another view of the piece. */}
        {alt && wantAlt && (
          <img
            src={photoSrc(piece.id, alt, 800)}
            srcSet={photoSrcSet(piece.id, alt)}
            sizes="(min-width: 1024px) 25vw, 50vw"
            alt=""
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="font-medium leading-snug">{piece.title}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex -space-x-1" aria-hidden>
            {piece.colours.map((c) => (
              <span
                key={c}
                className="h-3.5 w-3.5 rounded-full border border-background"
                style={{ background: colourById[c].swatch }}
              />
            ))}
          </span>
          <span className="sr-only">
            {piece.colours.map((c) => colourById[c].label).join(", ")}.
          </span>
          <span>
            {piece.photos.length} {piece.photos.length === 1 ? "photo" : "photos"}
          </span>
        </div>
      </div>
    </Link>
  );
}
