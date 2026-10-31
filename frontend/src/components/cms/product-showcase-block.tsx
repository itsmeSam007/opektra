import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import type { Product } from "@/lib/api";
import { api } from "@/lib/api";

interface ProductShowcaseBlockProps {
  productSlug: string;
  showFeatures?: boolean;
  showArchitecture?: boolean;
}

export async function ProductShowcaseBlock({
  productSlug,
  showFeatures = true,
  showArchitecture = true,
}: ProductShowcaseBlockProps) {
  let product: Product | null = null;
  try {
    product = await api.products.get(productSlug);
  } catch {
    return null;
  }

  if (!product) return null;

  return (
    <Section>
      <Container>
        <SectionHeader label="Product" title={product.name} description={product.tagline} />
        <Card className="mt-10">
          <CardContent className="p-8">
            <p className="text-muted-foreground line-clamp-3">{product.description}</p>
            {showFeatures && product.features.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {product.features.slice(0, 4).map((f) => (
                  <li key={f.title} className="rounded-lg border border-border bg-muted/20 p-4 text-sm">
                    <span className="font-medium">{f.title}</span>
                    <p className="mt-1 text-muted-foreground line-clamp-2">{f.description}</p>
                  </li>
                ))}
              </ul>
            )}
            {showArchitecture && product.architecture?.layers?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.architecture.layers.map((layer) => (
                  <span key={layer.name} className="rounded-full border border-border px-3 py-1 text-xs">
                    {layer.name}
                  </span>
                ))}
              </div>
            )}
            <Button asChild className="mt-8">
              <Link href={`/products/${product.slug}`}>
                View full product <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
