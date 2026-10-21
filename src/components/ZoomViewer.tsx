import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ZoomPhoto = { src: string; alt: string; w: number; h: number };

const MIN = 1;
const MAX = 4;
const STEP = 1.6;

type View = { s: number; x: number; y: number };
const REST: View = { s: 1, x: 0, y: 0 };

/**
 * Full-screen photo viewer for looking at a weave up close.
 * Wheel / trackpad pinch / touch pinch zoom toward the pointer, drag pans,
 * double-click or double-tap toggles 2.5×, + − 0 and arrow keys work too.
 */
export default function ZoomViewer({
  photos,
  index,
  onIndex,
  onClose,
  title,
}: {
  photos: ZoomPhoto[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  title: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(REST);
  const [smooth, setSmooth] = useState(false);
  const [hint, setHint] = useState(true);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; view: View; mid: { x: number; y: number } } | null>(null);
  const lastTap = useRef({ t: 0, x: 0, y: 0 });
  const viewRef = useRef(view);
  viewRef.current = view;
  const boxRef = useRef(box);
  boxRef.current = box;
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const photo = photos[index];
  const count = photos.length;

  // Size the photo to fit the stage at 1×.
  useEffect(() => {
    const measure = () => {
      const el = stage.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const fit = Math.min((r.width * 0.94) / photo.w, (r.height * 0.9) / photo.h);
      setBox({ w: photo.w * fit, h: photo.h * fit });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [photo]);

  const clamp = useCallback(
    (v: View): View => {
      const el = stage.current;
      const s = Math.min(MAX, Math.max(MIN, v.s));
      if (!el || s === 1) return { s, x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      const { w, h } = boxRef.current;
      const mx = Math.max(0, (w * s - r.width) / 2);
      const my = Math.max(0, (h * s - r.height) / 2);
      return { s, x: Math.min(mx, Math.max(-mx, v.x)), y: Math.min(my, Math.max(-my, v.y)) };
    },
    []
  );

  /** Zoom to scale `s` keeping the stage point (cx, cy) fixed under the pointer. */
  const zoomAt = useCallback(
    (s: number, cx: number, cy: number, from: View = viewRef.current) => {
      const el = stage.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = cx - (r.left + r.width / 2);
      const py = cy - (r.top + r.height / 2);
      const next = Math.min(MAX, Math.max(MIN, s));
      const k = next / from.s;
      setView(clamp({ s: next, x: px - (px - from.x) * k, y: py - (py - from.y) * k }));
    },
    [clamp]
  );

  const centre = () => {
    const r = stage.current!.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  const animateTo = (fn: () => void) => {
    setSmooth(true);
    fn();
    window.setTimeout(() => setSmooth(false), 420);
  };
  const zoomIn = () => animateTo(() => { const c = centre(); zoomAt(viewRef.current.s * STEP, c.x, c.y); });
  const zoomOut = () => animateTo(() => { const c = centre(); zoomAt(viewRef.current.s / STEP, c.x, c.y); });
  const reset = () => animateTo(() => setView(REST));
  const go = useCallback(
    (d: number) => {
      setView(REST);
      onIndex((index + d + count) % count);
    },
    [index, count, onIndex]
  );

  // Wheel needs a non-passive listener to stop the page behind from scrolling.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setHint(false);
      // Trackpad pinch arrives as ctrl+wheel with small deltas.
      const k = Math.exp(-e.deltaY * (e.ctrlKey ? 0.012 : 0.0025));
      zoomAt(viewRef.current.s * k, e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // The key handler is bound once and always calls the latest actions.
  const keys = useRef({ onClose, go, zoomIn, zoomOut, reset, count });
  keys.current = { onClose, go, zoomIn, zoomOut, reset, count };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      const k = keys.current;
      if (e.key === "Escape") k.onClose();
      else if (e.key === "ArrowLeft" && k.count > 1) k.go(-1);
      else if (e.key === "ArrowRight" && k.count > 1) k.go(1);
      else if (e.key === "+" || e.key === "=") k.zoomIn();
      else if (e.key === "-" || e.key === "_") k.zoomOut();
      else if (e.key === "0") k.reset();
      else return;
      e.preventDefault();
      setHint(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function onPointerDown(e: ReactPointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setHint(false);
    swipe.current = pointers.current.size === 1 ? { x: e.clientX, y: e.clientY } : null;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        view: viewRef.current,
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
    }
  }

  function onPointerMove(e: ReactPointerEvent) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()];
      const g = gesture.current;
      const s = g.view.s * (Math.hypot(a.x - b.x, a.y - b.y) / g.dist);
      zoomAt(s, g.mid.x, g.mid.y, g.view);
    } else if (pointers.current.size === 1 && viewRef.current.s > 1) {
      const v = viewRef.current;
      setView(clamp({ s: v.s, x: v.x + e.clientX - prev.x, y: v.y + e.clientY - prev.y }));
    }
  }

  function onPointerUp(e: ReactPointerEvent) {
    // Ignore releases that didn't start on the photo (e.g. the arrow buttons).
    if (!pointers.current.has(e.pointerId)) return;
    const wasPinch = pointers.current.size === 2;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current = null;
    if (wasPinch) return;
    // At 1×, a sideways swipe moves to the next photo.
    const start = swipe.current;
    swipe.current = null;
    if (start && viewRef.current.s <= 1.01 && count > 1) {
      const dx = e.clientX - start.x;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - start.y) * 1.5) {
        go(dx < 0 ? 1 : -1);
        return;
      }
    }
    // Double tap / double click toggles a close look at that spot.
    const now = performance.now();
    const t = lastTap.current;
    if (now - t.t < 300 && Math.hypot(e.clientX - t.x, e.clientY - t.y) < 24) {
      animateTo(() =>
        viewRef.current.s > 1 ? setView(REST) : zoomAt(2.5, e.clientX, e.clientY)
      );
      lastTap.current = { t: 0, x: 0, y: 0 };
    } else {
      lastTap.current = { t: now, x: e.clientX, y: e.clientY };
    }
  }

  const zoomed = view.s > 1.01;

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-quick flex-col bg-[hsl(214_40%_8%)] text-white"
      role="dialog"
      aria-modal="true"
      aria-label={`${title}, photo ${index + 1} of ${count}, zoom view`}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="truncate text-sm text-white/70">
          {title}
          {count > 1 && <span className="tabular-nums"> · {index + 1} / {count}</span>}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close zoom view"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div
        ref={stage}
        className={cn(
          "relative flex flex-1 touch-none select-none items-center justify-center overflow-hidden",
          zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {box.w > 0 && (
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            draggable={false}
            style={{
              width: box.w,
              height: box.h,
              transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})`,
              transition: smooth ? "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
            }}
            className="max-w-none animate-fade-quick will-change-transform"
          />
        )}

        {count > 1 && !zoomed && (
          <>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => go(-1)}
              className="absolute left-2 rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:left-4"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => go(1)}
              className="absolute right-2 rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-4"
              aria-label="Next photo"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}

        <p
          className={cn(
            "pointer-events-none absolute bottom-4 mx-4 max-w-[calc(100%-2rem)] rounded-md bg-black/60 px-3 py-1.5 text-center text-xs text-white/85 transition-opacity duration-500",
            hint ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="hidden sm:inline">Scroll or pinch to zoom, drag to look around, double-click to reset</span>
          <span className="sm:hidden">Pinch to zoom, drag to move, double-tap to reset</span>
        </p>
      </div>

      <div className="flex items-center justify-center gap-1 px-4 pb-5 pt-3">
        <button
          type="button"
          onClick={zoomOut}
          disabled={view.s <= MIN}
          className="rounded-md p-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
          aria-label="Zoom out"
        >
          <Minus className="h-5 w-5" />
        </button>
        <span className="w-14 text-center text-sm tabular-nums text-white/70" aria-live="polite">
          {view.s.toFixed(1)}×
        </span>
        <button
          type="button"
          onClick={zoomIn}
          disabled={view.s >= MAX}
          className="rounded-md p-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
          aria-label="Zoom in"
        >
          <Plus className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={!zoomed}
          className="ml-2 rounded-md p-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
          aria-label="Reset zoom"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
