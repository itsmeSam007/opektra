import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseStudyGallery } from "@/components/case-studies/case-study-gallery";
import { Container, Section } from "@/components/layout/section";
import { api } from "@/lib/api";
import { caseStudyJsonLd, createMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const studies = await api.caseStudies.list();
    return studies.map((study) => ({ slug: study.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const study = await api.caseStudies.get(slug);
    return createMetadata({ title: study.title, description: study.summary, path: `/case-studies/${slug}` });
  } catch {
    return createMetadata({ title: "Case Study" });
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  let study;
  try {
    study = await api.caseStudies.get(slug);
  } catch {
    notFound();
  }

  let relatedProduct = null;
  if (study.related_product_slug) {
    try {
      relatedProduct = await api.products.get(study.related_product_slug);
    } catch {
      relatedProduct = null;
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd(study)) }}
      />
      <Section>
        <Container>
          <article className="mx-auto max-w-3xl">
            {study.cover_image && (
              <div className="mb-8 overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={study.cover_image}
                  alt={`${study.client} case study cover`}
                  className="aspect-[21/9] w-full object-cover"
                />
              </div>
            )}
            <span className="text-sm font-medium uppercase tracking-wider text-accent">{study.industry}</span>
            <h1 className="mt-2 text-4xl font-bold">{study.title}</h1>
            <p className="mt-2 text-muted-foreground">{study.client}</p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {study.metrics.map((m) => (
                <div key={m.label} className="rounded-lg border border-border p-4 text-center">
                  <p className="text-2xl font-bold text-accent">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="prose prose-invert mt-12 space-y-8">
              <div>
                <h2 className="text-xl font-semibold">Challenge</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{study.challenge}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Solution</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{study.solution}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Results</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{study.results}</p>
              </div>
            </div>

            {study.gallery_images.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-semibold">Gallery</h2>
                <CaseStudyGallery images={study.gallery_images} />
              </div>
            )}

            {relatedProduct && (
              <div className="mt-12 rounded-xl border border-border bg-muted/20 p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-accent">Related Product</p>
                <h3 className="mt-2 text-2xl font-bold">{relatedProduct.name}</h3>
                <p className="mt-2 text-muted-foreground">{relatedProduct.tagline}</p>
                <Button asChild className="mt-6">
                  <Link href={`/products/${relatedProduct.slug}`}>
                    Explore {relatedProduct.name} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </article>
        </Container>
      </Section>
    </>
  );
}
