"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { ImageOff, ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  name: string;
  className?: string;
}

export function PropertyGallery({ images, name, className }: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = images?.length ?? 0;
  const isOpen = lightboxIndex !== null;

  const open = useCallback((index: number) => setLightboxIndex(index), []);
  const close = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % total)),
    [total],
  );
  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + total) % total)),
    [total],
  );

  // Keyboard navigation + body scroll lock while the lightbox is open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, next, prev]);

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-[0.875rem]",
          "bg-[#E2EAF0] text-[#64748B] h-64 sm:h-80",
          className,
        )}
      >
        <ImageOff size={32} aria-hidden="true" />
        <span className="text-sm font-[family-name:var(--font-body)]">Sem fotos disponíveis</span>
      </div>
    );
  }

  const [primary, ...rest] = images;
  const sideImages = rest.slice(0, 2);
  const hiddenCount = images.length - (1 + sideImages.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) (delta < 0 ? next : prev)();
    touchStartX.current = null;
  };

  return (
    <div className={cn(className)} aria-label={`Galeria de fotos de ${name}`}>
      <div className="overflow-hidden rounded-[0.875rem]">
        {/* Mobile: single primary image */}
        <button
          type="button"
          onClick={() => open(0)}
          aria-label={`Ampliar fotos de ${name}`}
          className="group block sm:hidden relative w-full h-72 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#00143D]"
        >
          <Image src={primary} alt={`Foto principal de ${name}`} fill className="object-cover" priority sizes="100vw" />
          <ZoomHint />
          {images.length > 1 && <CountPill count={images.length} />}
        </button>

        {/* Desktop: primary + grid */}
        <div
          className="hidden sm:grid gap-2 h-[420px]"
          style={{ gridTemplateColumns: sideImages.length > 0 ? "2fr 1fr" : "1fr" }}
        >
          <button
            type="button"
            onClick={() => open(0)}
            aria-label={`Ampliar foto principal de ${name}`}
            className="group relative overflow-hidden rounded-l-[0.875rem] cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#00143D]"
          >
            <Image
              src={primary}
              alt={`Foto principal de ${name}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
              sizes="(min-width: 640px) 66vw"
            />
            <ZoomHint />
          </button>

          {sideImages.length > 0 && (
            <div className="flex flex-col gap-2">
              {sideImages.map((src, i) => {
                const isLast = i === sideImages.length - 1;
                const showOverlay = isLast && hiddenCount > 0;
                return (
                  <button
                    type="button"
                    key={src}
                    onClick={() => open(i + 1)}
                    aria-label={
                      showOverlay
                        ? `Ver todas as ${images.length} fotos de ${name}`
                        : `Ampliar foto ${i + 2} de ${name}`
                    }
                    className={cn(
                      "group relative flex-1 overflow-hidden cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#00143D]",
                      i === 0 && "rounded-tr-[0.875rem]",
                      isLast && "rounded-br-[0.875rem]",
                    )}
                  >
                    <Image
                      src={src}
                      alt={`Foto ${i + 2} de ${name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(min-width: 640px) 33vw"
                    />
                    {showOverlay ? (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-[family-name:var(--font-heading)] font-bold text-lg">
                        +{hiddenCount} fotos
                      </span>
                    ) : (
                      <ZoomHint />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos de ${name}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <span className="absolute top-5 left-5 z-10 rounded-full bg-white/10 px-3 py-1 text-sm font-[family-name:var(--font-body)] text-white">
            {lightboxIndex + 1} / {total}
          </span>

          {/* Prev */}
          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Foto anterior"
              className="absolute left-3 sm:left-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative h-[80vh] w-[92vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`Foto ${lightboxIndex + 1} de ${name}`}
              fill
              className="object-contain"
              sizes="92vw"
              priority
            />
          </div>

          {/* Next */}
          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Próxima foto"
              className="absolute right-3 sm:right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* Small "expand" hint shown on hover over a thumbnail */
function ZoomHint() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    >
      <Expand size={15} />
    </span>
  );
}

function CountPill({ count }: { count: number }) {
  return (
    <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-[family-name:var(--font-body)] text-white">
      {count} fotos
    </span>
  );
}
