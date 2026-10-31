import type { Metadata } from "next";
import { Container, Section } from "@/components/layout/section";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Licensing Terms",
  path: "/legal/licensing",
});

export default function LicensingPage() {
  return (
    <Section>
      <Container>
        <article className="prose prose-invert mx-auto max-w-3xl">
          <h1>Software Licensing Terms</h1>
          <p className="text-muted-foreground">Last updated: June 2025</p>

          <h2>License Grant</h2>
          <p className="text-muted-foreground">
            Upon execution of a licensing agreement, the Licensor grants the Licensee a non-exclusive,
            non-transferable license to use the specified software product subject to the terms
            outlined in the individual agreement.
          </p>

          <h2>License Types</h2>
          <ul className="text-muted-foreground">
            <li><strong>Per-Seat License:</strong> Licensed per named user with defined seat limits.</li>
            <li><strong>Enterprise License:</strong> Organization-wide deployment with unlimited internal users.</li>
            <li><strong>White-Label License:</strong> Rebrand and resell under Licensee&apos;s brand.</li>
            <li><strong>OEM License:</strong> Embed within Licensee&apos;s own product offering.</li>
          </ul>

          <h2>Restrictions</h2>
          <p className="text-muted-foreground">
            Licensees may not reverse engineer, decompile, sublicense (unless permitted), or redistribute
            the software outside the scope of their license agreement.
          </p>

          <h2>Support & Maintenance</h2>
          <p className="text-muted-foreground">
            Support and maintenance terms are defined per agreement. Standard packages include
            bug fixes, security patches, and email support with defined SLAs.
          </p>

          <h2>Intellectual Property</h2>
          <p className="text-muted-foreground">
            All intellectual property rights remain with Soumen Karmakar unless explicitly transferred
            through an acquisition agreement.
          </p>

          <h2>Contact</h2>
          <p className="text-muted-foreground">
            For licensing inquiries, contact hello@soumenkarmakar.com or use our
            licensing inquiry form.
          </p>
        </article>
      </Container>
    </Section>
  );
}
