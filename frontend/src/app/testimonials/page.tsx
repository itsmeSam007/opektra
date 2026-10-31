import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { JsonLd } from "@/components/seo/json-ld";
import { api, type Testimonial } from "@/lib/api";
import { createMetadata, testimonialJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Testimonials",
  description: "What enterprise leaders say about our AI software products.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  let testimonials: Testimonial[] = [];
  try {
    testimonials = await api.testimonials.list();
  } catch {
    testimonials = [];
  }

  return (
    <>
      {testimonials.length > 0 && <JsonLd data={testimonialJsonLd(testimonials)} />}
      <Section>
      <Container>
        <SectionHeader
          label="Testimonials"
          title="Trusted by Enterprise Leaders"
          description="Hear from the teams and leaders who have transformed their operations with our products."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id} className="h-full">
              <CardContent className="flex h-full flex-col p-8">
                <div className="flex-1">
                  <p className="text-lg leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                </div>
                <div className="mt-8 border-t border-border pt-6">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                  <p className="text-sm text-accent">{t.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
      </Section>
    </>
  );
}
