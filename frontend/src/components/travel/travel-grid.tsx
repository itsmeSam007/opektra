"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TravelEntry } from "@/lib/api";

const CATEGORY_LABELS: Record<string, string> = {
  adventure: "Adventure",
  food: "Food",
  culture: "Culture",
  nature: "Nature",
  urban: "Urban",
  other: "Other",
};

interface TravelGridProps {
  entries: TravelEntry[];
}

export function TravelGrid({ entries }: TravelGridProps) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(entries.map((e) => e.category))).sort()],
    [entries],
  );
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All" ? entries : entries.filter((e) => e.category === activeCategory);

  if (entries.length === 0) {
    return (
      <div className="mt-16 rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
        <p className="text-muted-foreground">No travel entries are published yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
          >
            {category === "All" ? "All" : CATEGORY_LABELS[category] || category}
          </Button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((entry) => (
          <Link key={entry.id} href={`/travel/${entry.slug}`}>
            <Card className="group h-full overflow-hidden transition-all hover:border-accent/50">
              {entry.cover_image_url && (
                <div className="aspect-video overflow-hidden border-b border-border bg-muted/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.cover_image_url}
                    alt={entry.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-accent">
                  {CATEGORY_LABELS[entry.category] || entry.category}
                </span>
                <h2 className="mt-2 text-lg font-semibold group-hover:text-accent">{entry.title}</h2>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {entry.location_name}
                </p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{entry.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
