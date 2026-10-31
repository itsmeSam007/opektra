# Schema.org Reference

| Field | Value |
|-------|-------|
| **Document ID** | SEO-009 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Status** | Approved |
| **Last Updated** | 2026-06-29 |
| **Related** | [Structured_Data](./Structured_Data.md) · [Metadata](./Metadata.md) |

---

## Purpose

Provide the authoritative Schema.org property reference for FounderOS v1.0 — required fields, recommended fields, data sources, and examples for each schema type used across the platform.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| Schema type definitions used in v1.0 | Full Schema.org vocabulary |
| Property-to-database field mapping | Custom schema.org extensions |
| JSON-LD examples per page type | Microdata implementation |

## Business Context

This document is the **implementation reference** for developers building JSON-LD generators. Consistent schema implementation across white-label deployments ensures every FounderOS tenant benefits from the same rich result eligibility without per-deployment customization.

## Goals

| # | Goal | Success Metric |
|---|------|----------------|
| G1 | Document every schema type used in v1.0 | 100% coverage |
| G2 | Map API fields to schema properties | Zero ambiguous mappings |
| G3 | Provide copy-paste JSON-LD examples | Dev-ready reference |
| G4 | Align with Google rich result guidelines | No deprecated types |

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SCH-001 | Organization schema on all pages | P0 |
| FR-SCH-002 | WebSite + SearchAction on home (optional SearchAction) | P1 |
| FR-SCH-003 | Product schema on product detail pages | P0 |
| FR-SCH-004 | BlogPosting on blog detail pages | P0 |
| FR-SCH-005 | BreadcrumbList on nested pages | P0 |
| FR-SCH-006 | Person on about page | P1 |
| FR-SCH-007 | SoftwareApplication for SaaS-type products | P1 |
| FR-SCH-008 | VideoObject for YouTube media entries | P1 |
| FR-SCH-009 | ItemList for list pages (products, blog, portfolio) | P1 |
| FR-SCH-010 | ContactPage on contact route | P2 |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SCH-001 | Schema payload per page | < 10KB |
| NFR-SCH-002 | Use HTTPS absolute URLs for all `@id` and `url` | 100% |
| NFR-SCH-003 | Valid JSON (no trailing commas, proper escaping) | 100% |

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-SCH-001 | Frontend engineer | exact property list per schema type | I implement JSON-LD correctly |
| US-SCH-002 | Admin | schema preview from my CMS data | I verify before publish |
| US-SCH-003 | SEO specialist | Google-compliant schema | rich results appear |

## UX Requirements

- Schema invisible to end users.
- Admin shows validation warnings for missing required properties.
- Breadcrumb UI positions must match BreadcrumbList `position` values.

## Technical Considerations

### Entity ID Convention

| Entity | `@id` Pattern |
|--------|---------------|
| Organization | `https://{domain}/#organization` |
| WebSite | `https://{domain}/#website` |
| Product | `https://{domain}/products/{slug}/#product` |
| BlogPost | `https://{domain}/blog/{slug}/#article` |
| Person | `https://{domain}/about/#person` |

### Organization

| Property | Required | Source | Example |
|----------|----------|--------|---------|
| `@type` | Yes | Static | `Organization` |
| `name` | Yes | Site Settings `site_name` | `Acme SaaS` |
| `url` | Yes | `SITE_URL` | `https://acme.com` |
| `logo` | Yes | Site Settings `logo_url` | ImageObject URL |
| `sameAs` | Recommended | Site Settings social URLs | LinkedIn, GitHub, X |
| `contactPoint` | Optional | Contact settings | Customer service |

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://example.com/#organization",
  "name": "FounderOS Inc",
  "url": "https://example.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://example.com/media/logo.png"
  },
  "sameAs": [
    "https://linkedin.com/company/founderos",
    "https://github.com/founderos"
  ]
}
```

### Product

| Property | Required | Source |
|----------|----------|--------|
| `name` | Yes | `products.title` |
| `description` | Yes | `products.description` |
| `image` | Yes | `products.hero_image` |
| `url` | Yes | Canonical product URL |
| `brand` | Recommended | Organization reference |
| `offers` | Optional | Omit in v1.0 (no e-commerce) |

### BlogPosting

| Property | Required | Source |
|----------|----------|--------|
| `headline` | Yes | `posts.title` |
| `datePublished` | Yes | `posts.published_at` |
| `dateModified` | Yes | `posts.updated_at` |
| `author` | Yes | Person or Organization |
| `publisher` | Yes | Organization reference |
| `image` | Recommended | `posts.featured_image` |
| `description` | Recommended | `posts.excerpt` |

### BreadcrumbList

```mermaid
flowchart LR
    P1[Position 1: Home] --> P2[Position 2: Section]
    P2 --> P3[Position 3: Current Page]
```

| Property | Required | Source |
|----------|----------|--------|
| `itemListElement` | Yes | Generated from route |
| `position` | Yes | 1-indexed integer |
| `name` | Yes | Breadcrumb label |
| `item` | Yes | Absolute URL |

### SoftwareApplication (SaaS Products)

| Property | Required | Source |
|----------|----------|--------|
| `name` | Yes | Product title |
| `applicationCategory` | Yes | `BusinessApplication` or mapped |
| `operatingSystem` | Yes | `Web` |
| `offers` | Optional | Omit or `price: 0` for free tier |

### Schema Graph Pattern

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://example.com/#organization", "...": "..." },
    { "@type": "Product", "@id": "https://example.com/products/foo/#product", "brand": { "@id": "https://example.com/#organization" } },
    { "@type": "BreadcrumbList", "itemListElement": [] }
  ]
}
```

## Security Considerations

- Escape user content in JSON-LD string values.
- No internal IDs or database UUIDs in public schema.
- Staging data must not appear in production schema.

## Acceptance Criteria

- [ ] Every schema type in this doc implemented per [Structured_Data](./Structured_Data.md)
- [ ] Rich Results Test passes for each type
- [ ] Field mapping table matches database schema in [../09_Database/](../09_Database/)
- [ ] `@id` URLs are stable across deploys
- [ ] BreadcrumbList matches UI on product and blog pages

## Future Enhancements

| Version | Enhancement |
|---------|-------------|
| v1.5 | FAQPage, Review schemas |
| v2.0 | LocalBusiness for agencies with offices |
| v2.5 | Course schema for educational content |

## Open Questions

| ID | Question | Impact | Decision By |
|----|----------|--------|-------------|
| OQ-SCH-001 | `author` as Person vs Organization for team blogs? | Medium | Week 2 |
| OQ-SCH-002 | Include `aggregateRating` from testimonials? | Medium | v1.5 |

## Related Documents

- [Structured_Data](./Structured_Data.md)
- [Metadata](./Metadata.md)
- [Products Module](../06_Modules/Product_Manager.md)
- [Blog Module](../06_Modules/Blog_Manager.md)
