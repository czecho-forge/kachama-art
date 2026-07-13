import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type GalleryImage = {
  thumb: string;
  full: string;
  alt: string;
};

export default function Lightbox({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setOpenIndex(i)}
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
            className="group animate-fade-up overflow-hidden rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={`View ${img.alt} full size`}
          >
            <img
              src={img.thumb}
              alt={img.alt}
              loading="lazy"
              className="aspect-square w-full cursor-zoom-in object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute right-4 top-4 rounded-full p-2 text-white/80 transition-colors hover:text-white"
            aria-label="Close"
          >
            <X className="h-7 w-7" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 rounded-full p-2 text-white/80 transition-colors hover:text-white sm:left-6"
            aria-label="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <figure
            className="flex max-h-full max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[openIndex].full}
              alt={images[openIndex].alt}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-4 text-sm text-white/70">
              {images[openIndex].alt}
            </figcaption>
          </figure>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 rounded-full p-2 text-white/80 transition-colors hover:text-white sm:right-6"
            aria-label="Next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </>
  );
}
