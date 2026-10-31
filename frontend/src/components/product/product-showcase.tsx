"use client";

import { useState } from "react";
import {
  Brain,
  ChartBar,
  Inbox,
  Route,
  Shield,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";
import { InquiryForm } from "@/components/forms/inquiry-form";
import type { Product } from "@/lib/api";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  route: Route,
  inbox: Inbox,
  brain: Brain,
  workflow: Workflow,
  chart: ChartBar,
  shield: Shield,
};

export function ProductShowcase({ product }: { product: Product }) {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]" />
        <Container className="relative py-20 md:py-28">
          <FadeIn className="mx-auto max-w-4xl text-center">
            {product.is_flagship && (
              <span className="mb-4 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                Flagship Product
              </span>
            )}
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{product.name}</h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">{product.tagline}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="#demo">Request Demo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#licensing">Licensing Inquiry</Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Overview */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <FadeIn>
              <h2 className="text-3xl font-bold">Platform Overview</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: "Resolution Time", value: "-60%" },
                  { label: "AI Accuracy", value: "94%" },
                  { label: "Channels", value: "12+" },
                  { label: "Uptime SLA", value: "99.9%" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-2xl font-bold text-accent">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              {product.screenshots[0] && (
                <div className="overflow-hidden rounded-xl border border-border glow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.screenshots[0]} alt="Platform dashboard" className="w-full" />
                </div>
              )}
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* Interactive Feature Showcase */}
      <Section className="bg-card/50">
        <Container>
          <SectionHeader label="Features" title="Interactive Feature Showcase" description="Explore the core capabilities that power enterprise customer operations." />
          <FadeIn className="mt-16">
            <div className="grid gap-8 lg:grid-cols-5">
              <div className="space-y-2 lg:col-span-2">
                {product.features.map((feature, i) => {
                  const Icon = ICON_MAP[feature.icon] || Brain;
                  return (
                    <button
                      key={feature.title}
                      onClick={() => setActiveFeature(i)}
                      className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                        activeFeature === i
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/30"
                      }`}
                    >
                      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${activeFeature === i ? "text-accent" : "text-muted-foreground"}`} />
                      <div>
                        <p className="text-sm font-medium">{feature.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{feature.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="lg:col-span-3">
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col justify-center p-8">
                    {(() => {
                      const f = product.features[activeFeature];
                      const Icon = ICON_MAP[f?.icon] || Brain;
                      return f ? (
                        <>
                          <Icon className="h-10 w-10 text-accent" />
                          <h3 className="mt-4 text-2xl font-bold">{f.title}</h3>
                          <p className="mt-3 text-muted-foreground leading-relaxed">{f.description}</p>
                          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-accent">Enterprise Ready</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              SOC 2 compliant, GDPR ready, with enterprise SSO and granular RBAC built in.
                            </p>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Architecture */}
      {product.architecture?.layers && (
        <Section>
          <Container>
            <SectionHeader label="Architecture" title="Enterprise Architecture" description="Built for scale, security, and extensibility." />
            <FadeIn className="mt-16">
              <div className="space-y-4">
                {product.architecture.layers.map((layer, i) => (
                  <div key={layer.name} className="flex items-stretch gap-4">
                    <div className="flex w-32 shrink-0 items-center justify-end">
                      <span className="text-sm font-medium text-accent">{layer.name}</span>
                    </div>
                    <div className="flex flex-1 flex-wrap gap-2 rounded-lg border border-border bg-muted/20 p-4">
                      {layer.components.map((comp) => (
                        <span key={comp} className="rounded-md bg-background px-3 py-1.5 text-xs font-medium border border-border">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </Container>
        </Section>
      )}

      {/* Screenshots */}
      {product.screenshots.length > 1 && (
        <Section className="bg-card/50">
          <Container>
            <SectionHeader label="Screenshots" title="Platform in Action" />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {product.screenshots.map((src, i) => (
                <FadeIn key={src} delay={i * 0.1}>
                  <div className="overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Screenshot ${i + 1}`} className="w-full object-cover" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Business Domains */}
      <Section>
        <Container>
          <SectionHeader label="Industries" title="Business Domains" />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {product.domains.map((d) => (
              <span key={d} className="rounded-full border border-border bg-muted/30 px-5 py-2 text-sm">
                {d}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* Inquiry Forms */}
      <Section id="demo" className="bg-card/50">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <div id="licensing" className="rounded-xl border border-border bg-card p-8">
              <InquiryForm type="demo" title="Request a Demo" />
            </div>
            <div id="acquisition" className="rounded-xl border border-border bg-card p-8">
              <InquiryForm type="licensing" title="Licensing Inquiry" />
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <InquiryForm type="acquisition" title="Acquisition Inquiry" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
