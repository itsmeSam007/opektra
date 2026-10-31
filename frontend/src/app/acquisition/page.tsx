import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AcquisitionForm } from "@/components/forms/acquisition-form";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Acquisition",
  description: "Confidential M&A and product acquisition inquiries for enterprise buyers.",
  path: "/acquisition",
});

export default function AcquisitionPage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">Acquisition</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Confidential Acquisition Portal</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              For qualified buyers exploring M&A, strategic acquisition, or full product purchase.
              All submissions are handled discreetly.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <Card>
                <CardContent className="flex gap-4 p-6">
                  <Shield className="h-6 w-6 shrink-0 text-accent" />
                  <div>
                    <h3 className="font-semibold">NDA Protected</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Acquisition inquiries require NDA acknowledgment before submission.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex gap-4 p-6">
                  <Lock className="h-6 w-6 shrink-0 text-accent" />
                  <div>
                    <h3 className="font-semibold">Confidential Handling</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Flagged separately in admin for priority review by the founder.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Button variant="outline" asChild className="w-full">
                <Link href="/enterprise">View Enterprise Overview</Link>
              </Button>
            </div>
            <div className="rounded-xl border border-border bg-card p-8 lg:col-span-2">
              <SectionHeader
                title="Acquisition Inquiry"
                description="Share your acquisition interest. We respond within 24 hours."
              />
              <div className="mt-8">
                <AcquisitionForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
