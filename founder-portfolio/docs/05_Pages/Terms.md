# Terms of Service Page

| Field | Value |
|-------|-------|
| **Route** | `/legal/terms` |
| **Document ID** | PAGE-TERMS-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Status** | Approved for Implementation |
| **Last Updated** | 2026-06-29 |
| **Owner** | Legal & Product |
| **Related** | [Privacy](./Privacy.md) · [Cookie](./Cookie.md) · [CMS](../06_Modules/CMS.md) |

---

## Purpose

Specify the Terms of Service page — legal terms governing use of the founder's website, products, and services — CMS-editable with version tracking for tenant legal compliance.

---

## Scope

### In Scope

| Section | Priority |
|---------|----------|
| Acceptance of terms | P0 |
| Use license / restrictions | P0 |
| Intellectual property | P0 |
| Disclaimers | P0 |
| Limitation of liability | P0 |
| Governing law | P0 |
| Contact information | P0 |
| Last updated date | P0 |

### Out of Scope

| Area | Rationale |
|------|-----------|
| Product-specific EULAs | Linked from product pages |
| SaaS subscription terms | If billing added v2.0 |

---

## Business Context

Terms protect the **founder/company** from liability and set expectations for site visitors. Required footer link alongside [Privacy](./Privacy.md).

---

## Goals

| # | Goal | Metric |
|---|------|--------|
| G1 | Legal review before publish | Sign-off documented |
| G2 | Version date on every render | 100% |
| G3 | Cross-link to Privacy and Cookies | Present |

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TERMS-01 | Page SHALL render CMS legal entity `terms` | P0 |
| FR-TERMS-02 | Last updated date SHALL display | P0 |
| FR-TERMS-03 | Prose layout per [Typography System](../03_Design_System/Typography_System.md) | P0 |
| FR-TERMS-04 | Cross-links to Privacy and Cookie policies | P0 |
| FR-TERMS-05 | ISR on legal content update | P0 |
| FR-TERMS-06 | Sitemap inclusion `changefreq: yearly` | P1 |

---

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-TERMS-01 | Document length support | Long-form prose scroll |
| NFR-TERMS-02 | Anchor links to sections | P1 |

---

## User Stories

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| US-TERMS-01 | Visitor | know usage rules | I understand boundaries |
| US-TERMS-02 | Legal counsel | update terms in CMS | Changes deploy without code |

---

## UX Requirements

```mermaid
flowchart TD
    H[H1 Terms of Service]
    H --> D[Last Updated]
    D --> BODY[Numbered Prose Sections]
    BODY --> X[Links: Privacy | Cookies]
```

### Template Sections

| # | Section |
|---|---------|
| 1 | Agreement to Terms |
| 2 | Description of Service |
| 3 | User Obligations |
| 4 | Intellectual Property |
| 5 | Third-Party Links |
| 6 | Disclaimers |
| 7 | Limitation of Liability |
| 8 | Indemnification |
| 9 | Governing Law |
| 10 | Changes to Terms |
| 11 | Contact |

---

## SEO Requirements

| Field | Template |
|-------|----------|
| Title | `Terms of Service — {Site Name}` |
| Robots | index, follow |
| Canonical | `/legal/terms` |

---

## Technical Considerations

| Topic | Guidance |
|-------|----------|
| **CMS** | Shared legal content module with Privacy |
| **Route** | `app/legal/terms/page.tsx` |

---

## Security Considerations

CMS access restricted to admin; legal content sanitized.

---

## Acceptance Criteria

- [ ] Terms content renders from CMS
- [ ] Last updated visible
- [ ] Footer link present site-wide
- [ ] Cross-links to Privacy and Cookie
- [ ] Prose styling correct

---

## Future Enhancements

| Enhancement | Notes |
|-------------|-------|
| Version diff in admin | Legal audit trail |
| Accept terms on forms | Checkbox linkage |

---

## Open Questions

| ID | Question | Owner | Status |
|----|----------|-------|--------|
| OQ-TERMS-001 | Jurisdiction default in seed template? | Legal | Open |

---

## Related Documents

- [Privacy](./Privacy.md)
- [Cookie](./Cookie.md)
- [Enterprise](./Enterprise.md)
- [Sitemap](../10_SEO/Sitemap.md)
