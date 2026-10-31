import { SITE } from "./constants";

export function createMetadata({
  title,
  description,
  path = "",
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}) {
  const fullTitle = title ? `${title} | ${SITE.name}` : SITE.title;
  const desc = description || SITE.description;
  const url = `${SITE.url}${path}`;
  const ogImage = image || `${SITE.url}/og-image.png`;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE.name,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots:
      process.env.NEXT_PUBLIC_NOINDEX === "true"
        ? { index: false, follow: false }
        : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    founder: {
      "@type": "Person",
      name: SITE.founder.name,
      jobTitle: SITE.founder.title,
    },
  };
}

export function productJsonLd(product: { name: string; description: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    url: `${SITE.url}/products/${product.slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  };
}

export function caseStudyJsonLd(study: {
  title: string;
  summary: string;
  slug: string;
  client: string;
  industry: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    url: `${SITE.url}/case-studies/${study.slug}`,
    author: {
      "@type": "Organization",
      name: SITE.name,
    },
    about: {
      "@type": "Organization",
      name: study.client,
    },
    articleSection: study.industry,
  };
}

export function blogArticleJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  published_at: string | null;
  cover_image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE.url}/blog/${post.slug}`,
    datePublished: post.published_at || undefined,
    author: {
      "@type": "Person",
      name: SITE.founder.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    image: post.cover_image || `${SITE.url}/og-image.png`,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function testimonialJsonLd(testimonials: { name: string; company: string; content: string }[]) {
  return testimonials.slice(0, 5).map((t) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: t.name },
    reviewBody: t.content,
    itemReviewed: {
      "@type": "Organization",
      name: SITE.name,
    },
    publisher: { "@type": "Organization", name: t.company },
  }));
}
