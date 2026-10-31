"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface GalleryImage {
  url: string;
  alt: string;
}

export function CaseStudyGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<GalleryImage | null>(null);

  if (!images.length) return null;

  return (
    <>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <button
            key={image.url}
            type="button"
            onClick={() => setActive(image)}
            className="overflow-hidden rounded-xl border border-border text-left transition-all hover:border-accent/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.alt} loading="lazy" className="aspect-video w-full object-cover" />
            <p className="p-3 text-xs text-muted-foreground">{image.alt}</p>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setActive(null)}
          onKeyDown={(e) => e.key === "Escape" && setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-white"
            onClick={() => setActive(null)}
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-h-[90vh] max-w-5xl overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.url} alt={active.alt} className="max-h-[80vh] w-full object-contain" />
            <p className="bg-background px-4 py-3 text-sm text-muted-foreground">{active.alt}</p>
          </div>
        </div>
      )}
    </>
  );
}
