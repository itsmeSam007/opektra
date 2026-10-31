"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PortfolioItem } from "@/lib/api";

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export function PortfolioGrid({ items }: PortfolioGridProps) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category))).sort()],
    [items],
  );
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All" ? items : items.filter((item) => item.category === activeCategory);

  if (items.length === 0) {
    return (
      <div className="mt-16 rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
        <p className="text-muted-foreground">No portfolio items are published yet.</p>
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
            {category}
          </Button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id} className="group h-full overflow-hidden transition-all hover:border-accent/50">
            {item.image_url && (
              <div className="aspect-video overflow-hidden border-b border-border bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <CardContent className="p-6">
              <span className="text-xs font-medium uppercase tracking-wider text-accent">{item.category}</span>
              <h2 className="mt-2 text-lg font-semibold group-hover:text-accent">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{item.description}</p>
              {item.technologies && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.technologies.split(",").map((tech) => (
                    <span key={tech} className="rounded-md bg-muted px-2 py-0.5 text-xs">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              )}
              {item.project_url && (
                <Link
                  href={item.project_url}
                  className="mt-4 inline-flex items-center text-sm text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View project <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
