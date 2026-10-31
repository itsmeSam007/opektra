import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  blogArticleJsonLd,
  breadcrumbJsonLd,
  caseStudyJsonLd,
  createMetadata,
  organizationJsonLd,
  productJsonLd,
  testimonialJsonLd,
  webSiteJsonLd,
} from "./seo";

describe("createMetadata", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_NOINDEX", "");
  });

  it("builds title and canonical URL", () => {
    const meta = createMetadata({ title: "Products", path: "/products" });
    expect(meta.title).toContain("Products");
    expect(meta.alternates?.canonical).toContain("/products");
    expect(meta.robots).toEqual({ index: true, follow: true });
  });

  it("respects NEXT_PUBLIC_NOINDEX", () => {
    vi.stubEnv("NEXT_PUBLIC_NOINDEX", "true");
    const meta = createMetadata({ title: "Staging" });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});

describe("JSON-LD helpers", () => {
  it("organizationJsonLd includes founder", () => {
    const ld = organizationJsonLd();
    expect(ld["@type"]).toBe("Organization");
    expect(ld.founder).toBeDefined();
  });

  it("productJsonLd includes slug URL", () => {
    const ld = productJsonLd({ name: "Test", description: "Desc", slug: "test-app" });
    expect(ld.url).toContain("/products/test-app");
  });

  it("breadcrumbJsonLd orders items", () => {
    const ld = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]);
    expect(ld.itemListElement).toHaveLength(2);
    expect(ld.itemListElement[0].position).toBe(1);
  });

  it("webSiteJsonLd includes SearchAction", () => {
    const ld = webSiteJsonLd();
    expect(ld.potentialAction["@type"]).toBe("SearchAction");
  });

  it("caseStudyJsonLd includes client and industry", () => {
    const ld = caseStudyJsonLd({
      title: "Case",
      summary: "Summary",
      slug: "case-1",
      client: "Acme",
      industry: "SaaS",
    });
    expect(ld.headline).toBe("Case");
    expect(ld.about.name).toBe("Acme");
  });

  it("blogArticleJsonLd includes published date", () => {
    const ld = blogArticleJsonLd({
      title: "Post",
      excerpt: "Excerpt",
      slug: "post-1",
      published_at: "2026-01-01T00:00:00Z",
    });
    expect(ld["@type"]).toBe("BlogPosting");
    expect(ld.datePublished).toBe("2026-01-01T00:00:00Z");
  });

  it("testimonialJsonLd maps reviews", () => {
    const reviews = testimonialJsonLd([
      { name: "Alice", company: "Co", content: "Great product" },
    ]);
    expect(reviews).toHaveLength(1);
    expect(reviews[0]["@type"]).toBe("Review");
  });
});
