"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface MediaImage {
  url: string;
  alt_text: string;
  caption?: string;
}

export function MediaGallery({ images }: { images: MediaImage[] }) {
  const [active, setActive] = useState<MediaImage | null>(null);

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
            <img src={image.url} alt={image.alt_text} loading="lazy" className="aspect-square w-full object-cover" />
            {image.caption && <p className="p-3 text-xs text-muted-foreground">{image.caption}</p>}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-white"
            onClick={() => setActive(null)}
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-h-[90vh] max-w-5xl overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.url} alt={active.alt_text} className="max-h-[80vh] w-full object-contain" />
            <p className="bg-background px-4 py-3 text-sm text-muted-foreground">{active.alt_text}</p>
          </div>
        </div>
      )}
    </>
  );
}
