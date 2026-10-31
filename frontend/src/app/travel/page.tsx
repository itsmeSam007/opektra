import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { TravelGrid } from "@/components/travel/travel-grid";
import { api } from "@/lib/api";
import { createMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = createMetadata({
  title: "Travel",
  description: "Travel logs and destinations from around the world.",
  path: "/travel",
});

export default async function TravelPage() {
  let settings;
  try {
    settings = await api.settings.public();
  } catch {
    settings = { module_travel_enabled: true, module_media_enabled: true };
  }

  if (!settings.module_travel_enabled) {
    notFound();
  }

  let entries: import("@/lib/api").TravelEntry[] = [];
  try {
    entries = await api.travel.list();
  } catch {
    entries = [];
  }

  return (
    <Section>
      <Container>
        <SectionHeader
          label="Travel"
          title="Journeys & Destinations"
          description="Documenting places, cultures, and stories from around the world."
        />
        <TravelGrid entries={entries} />
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Watch travel videos on the{" "}
            <Link href="/media" className="text-accent hover:underline">
              media page
            </Link>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
}
