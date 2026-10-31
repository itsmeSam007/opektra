import type { Metadata } from "next";
import Link from "next/link";
import { Building2, FileText, Handshake, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Enterprise Acquisition",
  description: "Acquire enterprise AI software products. Licensing, white-labeling, and full product acquisition available.",
  path: "/enterprise",
});

export default function EnterprisePage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">Enterprise</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Acquire Production-Ready AI Software
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Skip 18+ months of development. License or acquire battle-tested enterprise AI products
              with proven architecture, documentation, and deployment playbooks.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, title: "Full Acquisition", desc: "Complete IP transfer, codebase, documentation, and transition support." },
              { icon: FileText, title: "Licensing", desc: "Per-seat or enterprise-wide licensing with white-label options." },
              { icon: Handshake, title: "Partnership", desc: "Co-development and revenue-sharing partnership models." },
              { icon: Shield, title: "Due Diligence Ready", desc: "Clean IP, documented architecture, and audit-ready codebase." },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6">
                  <item.icon className="h-8 w-8 text-accent" />
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-card/50">
        <Container>
          <SectionHeader title="Acquisition Process" description="A transparent, structured process designed for enterprise buyers." />
          <div className="mt-12 space-y-6">
            {[
              { step: "01", title: "Initial Consultation", desc: "Discuss your requirements, timeline, and acquisition goals." },
              { step: "02", title: "Product Evaluation", desc: "Technical deep-dive, architecture review, and live demo." },
              { step: "03", title: "Due Diligence", desc: "Code audit, IP review, security assessment, and documentation." },
              { step: "04", title: "Term Sheet & Agreement", desc: "Negotiate terms, licensing model, and transition plan." },
              { step: "05", title: "Transition & Support", desc: "Knowledge transfer, deployment support, and ongoing maintenance." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 rounded-xl border border-border bg-card p-6">
                <span className="text-2xl font-bold text-accent">{item.step}</span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-8">
              <InquiryForm type="acquisition" title="Acquisition Inquiry" />
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <InquiryForm type="licensing" title="Licensing Inquiry" />
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/acquisition">Confidential Acquisition Portal</Link>
            </Button>
            <Button variant="ghost" className="ml-2" asChild>
              <Link href="/legal/licensing">View Licensing Terms</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
