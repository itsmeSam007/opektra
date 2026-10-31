import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { api, type PortfolioItem } from "@/lib/api";

interface PortfolioGridBlockProps {
  category?: string;
  limit?: number;
}

export async function PortfolioGridBlock({ category, limit = 6 }: PortfolioGridBlockProps) {
  let items: PortfolioItem[] = [];
  try {
    const path = category ? `/portfolio?category=${encodeURIComponent(category)}` : "/portfolio";
    items = await api.portfolio.list(path);
  } catch {
    items = [];
  }

  const sliced = items.slice(0, limit);
  if (sliced.length === 0) return null;

  return (
    <Section>
      <Container>
        <SectionHeader
          label="Portfolio"
          title={category ? `${category} Projects` : "Selected Work"}
          description="Curated projects demonstrating technical breadth and delivery."
        />
        <PortfolioGrid items={sliced} />
        <div className="mt-10 text-center">
          <Link href="/portfolio" className="text-sm text-accent hover:underline">
            View full portfolio
          </Link>
        </div>
      </Container>
    </Section>
  );
}
