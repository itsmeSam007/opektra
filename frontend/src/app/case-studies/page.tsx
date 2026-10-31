import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { api, type CaseStudy } from "@/lib/api";
import { createMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = createMetadata({
  title: "Case Studies",
  description: "Real-world results from enterprise AI software deployments.",
  path: "/case-studies",
});

export default async function CaseStudiesPage() {
  let studies: CaseStudy[] = [];
  try {
    studies = await api.caseStudies.list();
  } catch {
    studies = [];
  }

  return (
    <Section>
      <Container>
        <SectionHeader
          label="Case Studies"
          title="Proven Enterprise Results"
          description="How businesses transformed their operations with our AI software products."
        />
        {studies.length === 0 ? (
          <div className="mt-16 rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
            <p className="text-muted-foreground">No case studies are published yet.</p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-16 space-y-8">
            {studies.map((study) => (
              <Card key={study.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3">
                    <div className="bg-muted/30 p-8 md:col-span-1">
                      {study.cover_image && (
                        <div className="mb-6 overflow-hidden rounded-lg border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={study.cover_image}
                            alt={`${study.client} case study`}
                            loading="lazy"
                            className="aspect-video w-full object-cover"
                          />
                        </div>
                      )}
                      <span className="text-xs font-medium uppercase tracking-wider text-accent">{study.industry}</span>
                      <h2 className="mt-2 text-xl font-semibold">{study.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{study.client}</p>
                      <div className="mt-6 space-y-3">
                        {study.metrics.map((m) => (
                          <div key={m.label}>
                            <p className="text-2xl font-bold text-accent">{m.value}</p>
                            <p className="text-xs text-muted-foreground">{m.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-8 md:col-span-2">
                      <p className="text-muted-foreground">{study.summary}</p>
                      <Link href={`/case-studies/${study.slug}`} className="mt-4 inline-flex items-center text-sm text-accent">
                        Read full case study <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
