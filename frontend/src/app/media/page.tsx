import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { MediaGallery } from "@/components/media/media-gallery";
import { YouTubeGrid } from "@/components/media/youtube-grid";
import { api } from "@/lib/api";
import { createMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = createMetadata({
  title: "Media",
  description: "Photos, videos, and press media from Soumen Karmakar.",
  path: "/media",
});

export default async function MediaPage() {
  let settings;
  try {
    settings = await api.settings.public();
  } catch {
    settings = { module_travel_enabled: true, module_media_enabled: true };
  }

  if (!settings.module_media_enabled) {
    notFound();
  }

  let albums: import("@/lib/api").GalleryAlbum[] = [];
  let videos: import("@/lib/api").YouTubeVideo[] = [];
  try {
    [albums, videos] = await Promise.all([api.galleries.list(), api.youtube.videos()]);
  } catch {
    albums = [];
    videos = [];
  }

  const allImages = albums.flatMap((album) =>
    album.items.map((item) => ({
      url: item.url,
      alt_text: item.alt_text || album.title,
      caption: item.caption || album.title,
    })),
  );

  return (
    <>
      <Section>
        <Container>
          <SectionHeader
            label="Media"
            title="Photos & Video"
            description="Press assets, event photography, and YouTube content."
          />
          {allImages.length > 0 ? (
            <MediaGallery images={allImages} />
          ) : (
            <div className="mt-16 rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
              <p className="text-muted-foreground">No gallery albums are published yet.</p>
            </div>
          )}
        </Container>
      </Section>

      <Section className="bg-card/50">
        <Container>
          <SectionHeader label="YouTube" title="Latest Videos" description="Travel and technology content." />
          <YouTubeGrid videos={videos} />
        </Container>
      </Section>
    </>
  );
}
