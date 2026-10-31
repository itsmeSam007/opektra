import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import type { PortfolioItem } from "@/lib/api";
import { api } from "@/lib/api";
import { createMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = createMetadata({
  title: "Portfolio",
  description: "A curated collection of enterprise software products and platforms.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];
  try {
    items = await api.portfolio.list();
  } catch {
    items = [];
  }

  return (
    <Section>
      <Container>
        <SectionHeader
          label="Portfolio"
          title="Software Products & Platforms"
          description="Enterprise-grade solutions built for real-world business challenges."
        />
        <PortfolioGrid items={items} />
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Deep outcome narratives available in{" "}
            <Link href="/case-studies" className="text-accent hover:underline">
              case studies
            </Link>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
}
