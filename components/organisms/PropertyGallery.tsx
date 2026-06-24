import Image from "next/image";
import { cn } from "@/lib/cn";
import { ImageOff } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  name: string;
  className?: string;
}

export function PropertyGallery({ images, name, className }: PropertyGalleryProps) {
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

  return (
    <div
      className={cn("overflow-hidden rounded-[0.875rem]", className)}
      aria-label={`Galeria de fotos de ${name}`}
    >
      {/* Mobile: single primary image */}
      <div className="block sm:hidden relative w-full h-72">
        <Image
          src={primary}
          alt={`Foto principal de ${name}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Desktop: primary + grid */}
      <div className="hidden sm:grid gap-2 h-[420px]"
        style={{ gridTemplateColumns: sideImages.length > 0 ? "2fr 1fr" : "1fr" }}
      >
        <div className="relative overflow-hidden rounded-l-[0.875rem]">
          <Image
            src={primary}
            alt={`Foto principal de ${name}`}
            fill
            className="object-cover hover:scale-[1.02] transition-transform duration-500"
            priority
            sizes="(min-width: 640px) 66vw"
          />
        </div>

        {sideImages.length > 0 && (
          <div className="flex flex-col gap-2">
            {sideImages.map((src, i) => (
              <div
                key={src}
                className={cn(
                  "relative flex-1 overflow-hidden",
                  i === 0 && "rounded-tr-[0.875rem]",
                  i === sideImages.length - 1 && "rounded-br-[0.875rem]",
                )}
              >
                <Image
                  src={src}
                  alt={`Foto ${i + 2} de ${name}`}
                  fill
                  className="object-cover hover:scale-[1.02] transition-transform duration-500"
                  sizes="(min-width: 640px) 33vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badge indicating more photos */}
      {images.length > 3 && (
        <p className="mt-2 text-right text-xs text-[#64748B] font-[family-name:var(--font-body)]">
          +{images.length - 3} fotos disponíveis
        </p>
      )}
    </div>
  );
}
