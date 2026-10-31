import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { YouTubeVideo } from "@/lib/api";

export function YouTubeGrid({ videos }: { videos: YouTubeVideo[] }) {
  if (!videos.length) {
    return (
      <div className="mt-12 rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
        <p className="text-muted-foreground">No videos available.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <Card key={video.id} className="group overflow-hidden">
          <div className="relative aspect-video overflow-hidden bg-muted">
            <iframe
              title={video.title}
              src={`https://www.youtube.com/embed/${video.id}`}
              className="h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium line-clamp-2">{video.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{video.description}</p>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center text-xs text-accent"
            >
              Watch on YouTube <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
