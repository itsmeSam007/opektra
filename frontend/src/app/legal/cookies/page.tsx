import type { Metadata } from "next";
import { Container, Section } from "@/components/layout/section";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  path: "/legal/cookies",
});

export default function CookiesPage() {
  return (
    <Section>
      <Container>
        <article className="prose prose-invert mx-auto max-w-3xl">
          <h1>Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: June 2025</p>

          <h2>What Are Cookies</h2>
          <p className="text-muted-foreground">
            Cookies are small text files stored on your device when you visit our website.
            They help us provide a better experience and understand how our site is used.
          </p>

          <h2>Cookies We Use</h2>
          <ul className="text-muted-foreground">
            <li><strong>Essential cookies:</strong> Required for basic site functionality.</li>
            <li><strong>Analytics cookies:</strong> Google Analytics for anonymized usage statistics.</li>
            <li><strong>Preference cookies:</strong> Remember your settings and preferences.</li>
          </ul>

          <h2>Managing Cookies</h2>
          <p className="text-muted-foreground">
            You can control cookies through your browser settings. Disabling cookies may affect
            some site functionality.
          </p>

          <h2>Contact</h2>
          <p className="text-muted-foreground">
            Questions about our cookie policy? Contact hello@soumenkarmakar.com.
          </p>
        </article>
      </Container>
    </Section>
  );
}
