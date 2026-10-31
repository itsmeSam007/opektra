# Licensing Page

| Field | Value |
|-------|-------|
| **Route** | `/legal/licensing` |
| **Document ID** | PAGE-LIC-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Status** | Approved for Implementation |
| **Last Updated** | 2026-06-29 |
| **Owner** | Legal & Product |
| **Related** | [Privacy](./Privacy.md) · [Terms](./Terms.md) · [Enterprise](./Enterprise.md) · [Products](./Products.md) |

---

## Purpose

Specify the Licensing page — disclosure of software licensing terms, open-source attributions, and commercial licensing inquiry pathways for FounderOS tenant products.

---

## Scope

### In Scope

| Section | Priority |
|---------|----------|
| Product licensing overview | P0 |
| Open-source license attributions | P1 |
| Commercial licensing CTA | P0 |
| Link to contact/enterprise | P0 |
| Last updated date | P0 |

### Out of Scope

| Area | Rationale |
|------|-----------|
| License key generation | v2.0 |
| Self-serve checkout | v2.0 |

---

## Business Context

Founders licensing SaaS products need a dedicated legal surface for enterprise buyers evaluating IP ownership and usage rights. This page complements [Enterprise](./Enterprise.md) and [Products](./Products.md) conversion flows.

---

## Goals

| # | Goal | Metric |
|---|------|--------|
| G1 | Licensing terms CMS-editable | Admin can update without deploy |
| G2 | CTA to enterprise contact | Present on page |
| G3 | Footer link from all pages | Per Navigation spec |

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-LIC-01 | Page SHALL render CMS-managed rich text | P0 |
| FR-LIC-02 | CTA SHALL link to `/contact?type=licensing` | P0 |
| FR-LIC-03 | Open-source attributions MAY list third-party licenses | P1 |
| FR-LIC-04 | Page SHALL appear in footer Legal group | P0 |

---

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-LIC-01 | LCP | < 2.5 s |
| NFR-LIC-02 | Accessibility | WCAG 2.1 AA |

---

## User Stories

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| US-LIC-01 | Enterprise buyer | Read licensing terms | I assess commercial fit |
| US-LIC-02 | Admin | Edit licensing copy | Legal updates go live quickly |
| US-LIC-03 | Visitor | Find licensing from footer | I discover licensing options |

---

## UX Requirements

- Prose layout matching Privacy/Terms legal pages.
- H1: "Licensing" or tenant-custom title.
- Secondary CTA: "Contact for licensing" → contact form.
- Optional table of third-party OSS components with license type.

---

## Technical Considerations

| Topic | Implementation |
|-------|----------------|
| **Route** | `app/legal/licensing/page.tsx` |
| **Content** | CMS page slug `legal-licensing` |
| **SEO** | `changefreq: yearly`, priority 0.5 |
| **Canonical** | `/legal/licensing` |

---

## Security Considerations

- CMS content sanitized against XSS.
- No sensitive contract terms in public CMS without tenant review.

---

## Acceptance Criteria

- [ ] Page live at `/legal/licensing`
- [ ] Footer Legal link works
- [ ] CMS edit reflects on publish
- [ ] Canonical and meta tags correct
- [ ] Included in `sitemap.xml`

---

## Future Enhancements

- Downloadable license PDF (v1.1)
- Per-product license terms (v1.5)

---

## Open Questions

| ID | Question | Owner |
|----|----------|-------|
| OQ-LIC-01 | Separate page vs section on Terms? | Product — separate page |

---

## Dependencies

- [URL_AUTHORITY.md](../../URL_AUTHORITY.md)
- [CMS](../06_Modules/CMS.md)
- [Navigation](../02_UX/Navigation.md)

## Glossary

| Term | Definition |
|------|------------|
| OSS | Open Source Software |
