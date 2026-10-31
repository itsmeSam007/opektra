import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { CaseStudyGallery } from "@/components/case-studies/case-study-gallery";
import { Container, Section } from "@/components/layout/section";
import { api } from "@/lib/api";
import { createMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const entries = await api.travel.list();
    return entries.map((entry) => ({ slug: entry.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const entry = await api.travel.get(slug);
    return createMetadata({ title: entry.title, description: entry.excerpt, path: `/travel/${slug}` });
  } catch {
    return createMetadata({ title: "Travel" });
  }
}

export default async function TravelDetailPage({ params }: Props) {
  const { slug } = await params;
  let entry;
  try {
    entry = await api.travel.get(slug);
  } catch {
    notFound();
  }

  const galleryImages = entry.gallery_images.map((img) => ({
    url: img.url,
    alt: img.alt || entry.title,
  }));

  return (
    <Section>
      <Container>
        <article className="mx-auto max-w-3xl">
          {entry.cover_image_url && (
            <div className="mb-8 overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.cover_image_url}
                alt={entry.title}
                className="aspect-[21/9] w-full object-cover"
              />
            </div>
          )}
          <span className="text-sm font-medium uppercase tracking-wider text-accent">{entry.category}</span>
          <h1 className="mt-2 text-4xl font-bold">{entry.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {entry.location_name}
            {entry.visited_at && (
              <span className="text-sm">· {new Date(entry.visited_at).toLocaleDateString()}</span>
            )}
          </p>

          <p className="mt-8 text-lg text-muted-foreground leading-relaxed">{entry.excerpt}</p>
          <div className="prose prose-invert mt-8">
            <p className="text-muted-foreground leading-relaxed">{entry.content}</p>
          </div>

          {entry.latitude != null && entry.longitude != null && (
            <div className="mt-10 overflow-hidden rounded-xl border border-border">
              <iframe
                title={`Map of ${entry.location_name}`}
                className="h-64 w-full"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${entry.longitude - 0.05}%2C${entry.latitude - 0.05}%2C${entry.longitude + 0.05}%2C${entry.latitude + 0.05}&layer=mapnik&marker=${entry.latitude}%2C${entry.longitude}`}
              />
            </div>
          )}

          {galleryImages.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold">Photo Gallery</h2>
              <CaseStudyGallery images={galleryImages} />
            </div>
          )}
        </article>
      </Container>
    </Section>
  );
}
