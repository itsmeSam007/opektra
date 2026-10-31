# Typography System

| Field | Value |
|-------|-------|
| **Product** | Founder Portfolio Platform (FounderOS) |
| **Version** | 1.0 |
| **Document ID** | DS-TYPE-001 |
| **Status** | Approved for Implementation |
| **Last Updated** | 2026-06-29 |
| **Owner** | Design & Engineering |
| **Related** | [Design Tokens](./Design_Tokens.md) · [Color System](./Color_System.md) · [Content Strategy](../02_UX/Content_Strategy.md) |

---

## Purpose

Define the typography scale, font families, text styles, and usage rules for FounderOS v1.0 to ensure readable, hierarchical, and brand-consistent text across all surfaces.

---

## Scope

### In Scope

- Font families (Geist Sans, Geist Mono)
- Type scale (sizes, weights, line heights)
- Text style presets (headings, body, labels, captions)
- Prose/article typography
- Gradient text utility
- Responsive type scaling

### Out of Scope

- Web font licensing (Geist is open source via Vercel)
- Email typography

---

## Business Context

Typography is the primary content delivery mechanism. FounderOS targets a **modern developer/founder aesthetic** — clean sans-serif body text with monospace for code/technical content. Geist (by Vercel) aligns with the Next.js stack and conveys technical credibility.

---

## Goals

| # | Goal | Metric |
|---|------|--------|
| G1 | Clear visual hierarchy on every page | Distinct H1–H4 styles |
| G2 | Body text readable at all sizes | ≥ 16px base, 1.5+ line height |
| G3 | Consistent type scale across components | 0 arbitrary font sizes |

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TYPE-01 | Body font SHALL be Geist Sans via `next/font` | P0 |
| FR-TYPE-02 | Code font SHALL be Geist Mono | P0 |
| FR-TYPE-03 | Base font size SHALL be 16px (`text-base`) | P0 |
| FR-TYPE-04 | Heading hierarchy SHALL use semantic HTML (h1–h4) | P0 |
| FR-TYPE-05 | Muted text SHALL use `text-muted-foreground` | P0 |
| FR-TYPE-06 | Article body SHALL use prose typography styles | P1 |

---

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-TYPE-01 | Font loading strategy | `next/font` with `display: swap` |
| NFR-TYPE-02 | FOUT/FOIT | Zero invisible text (swap) |
| NFR-TYPE-03 | Body line height | 1.5 (leading-normal) |
| NFR-TYPE-04 | Heading line height | 1.25 (leading-tight) |

---

## User Stories

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| US-TYPE-01 | Reader | Scan headings quickly | I find relevant sections |
| US-TYPE-02 | Mobile user | Read body text without zooming | Content is legible |
| US-TYPE-03 | Engineer | Apply type styles via Tailwind classes | Typography is consistent |

---

## UX Requirements

### Font Families

| Family | CSS Variable | Tailwind | Usage |
|--------|-------------|----------|-------|
| Geist Sans | `--font-geist-sans` | `font-sans` | All body text, headings, UI |
| Geist Mono | `--font-geist-mono` | `font-mono` | Code blocks, technical labels, slugs |

### Type Scale

| Style | Size | Weight | Line Height | Tailwind Classes | Usage |
|-------|------|--------|-------------|------------------|-------|
| Display | 48px / 3rem | 700 | 1.1 | `text-5xl font-bold tracking-tight` | Hero headlines (desktop) |
| H1 | 36px / 2.25rem | 700 | 1.2 | `text-4xl font-bold tracking-tight` | Page titles |
| H2 | 30px / 1.875rem | 600 | 1.25 | `text-3xl font-semibold tracking-tight` | Section headings |
| H3 | 24px / 1.5rem | 600 | 1.3 | `text-2xl font-semibold` | Sub-section headings |
| H4 | 20px / 1.25rem | 600 | 1.4 | `text-xl font-semibold` | Card titles |
| Body Large | 18px / 1.125rem | 400 | 1.6 | `text-lg` | Hero subheadlines |
| Body | 16px / 1rem | 400 | 1.5 | `text-base` | Default body text |
| Body Small | 14px / 0.875rem | 400 | 1.5 | `text-sm` | Secondary text, nav links |
| Caption | 12px / 0.75rem | 400 | 1.5 | `text-xs` | Footer, metadata, legal |
| Label | 14px / 0.875rem | 500 | 1.5 | `text-sm font-medium` | Form labels, badges |

### Responsive Type Scaling

| Style | Mobile | Desktop (md+) |
|-------|--------|---------------|
| Display / Hero H1 | `text-3xl` (30px) | `md:text-5xl` (48px) |
| Page H1 | `text-3xl` (30px) | `md:text-4xl` (36px) |
| Section H2 | `text-2xl` (24px) | `md:text-3xl` (30px) |
| Body Large | `text-base` (16px) | `md:text-lg` (18px) |

### Text Color Hierarchy

| Level | Token | Tailwind | Usage |
|-------|-------|----------|-------|
| Primary | `--foreground` | `text-foreground` | Headings, body text |
| Secondary | `--muted-foreground` | `text-muted-foreground` | Descriptions, nav links |
| Accent | `--accent` | `text-accent` | Links, highlights |
| On accent | `--accent-foreground` | `text-accent-foreground` | Text on accent backgrounds |

### Special Text Styles

#### Gradient Text

Used for hero headlines and 404 pages:

```css
.gradient-text {
  background: linear-gradient(135deg, #fafafa 0%, #a1a1aa 50%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

Tailwind usage: `className="gradient-text"`

#### Prose (Article Body)

Blog posts and case studies use prose styles:

| Element | Style |
|---------|-------|
| Paragraphs | `text-base leading-7 text-muted-foreground` |
| H2 in prose | `text-2xl font-semibold text-foreground mt-8 mb-4` |
| H3 in prose | `text-xl font-semibold text-foreground mt-6 mb-3` |
| Links | `text-accent underline-offset-4 hover:underline` |
| Code inline | `font-mono text-sm bg-muted px-1.5 py-0.5 rounded` |
| Code block | `font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto` |
| Blockquote | `border-l-4 border-accent pl-4 italic text-muted-foreground` |
| Lists | `list-disc pl-6 space-y-2` |

### Typography Hierarchy Example

```
Home Page:
├── H1 (Display): "Enterprise AI Products Built for Scale"     [gradient-text]
├── Body Large: "Available for licensing, purchase..."          [text-lg text-muted-foreground]
├── H2: "Featured Products"                                     [text-3xl font-semibold]
│   ├── H4: "AI Customer Operations"                            [text-xl font-semibold]
│   └── Body Small: "Automate 80% of support tickets"         [text-sm text-muted-foreground]
├── H2: "Case Studies"
└── Body Small (Caption): "© 2026 Soumen Karmakar"             [text-xs text-muted-foreground]
```

---

## Technical Considerations

| Topic | Implementation |
|-------|----------------|
| **Font loading** | `next/font/google` or local Geist via `next/font/local` |
| **Layout shift** | `next/font` auto-injects size-adjust |
| **Tailwind config** | Font families mapped via `@theme inline` |
| **Prose plugin** | `@tailwindcss/typography` for article content (v1.1) |
| **Font subsetting** | Latin subset only for v1.0 |

---

## Security Considerations

No security implications for typography.

---

## Acceptance Criteria

- [ ] Geist Sans loads via `next/font` with no FOUT
- [ ] All headings use semantic HTML elements (h1–h4)
- [ ] Body text is 16px minimum
- [ ] Muted text uses `text-muted-foreground` consistently
- [ ] Hero headlines use gradient-text on Home
- [ ] Blog/case study prose styles applied
- [ ] Responsive type scaling works at sm and md breakpoints
- [ ] No arbitrary font-size values in components

---

## Future Enhancements

| Enhancement | Impact |
|-------------|--------|
| Custom tenant fonts | White-label font override |
| `@tailwindcss/typography` | Prose plugin for richer article styles |
| Variable font weights | Fine-grained weight control |
| i18n font fallbacks | CJK font stacks for Asian languages |

---

## Open Questions

| # | Question | Owner |
|---|----------|-------|
| OQ-TYPE-01 | Add `@tailwindcss/typography` in v1.0? | Engineering — Recommended |
| OQ-TYPE-02 | Display font size on mobile: 30px or 36px? | Design — 30px |

---

## Related Documents

- [Design Tokens](./Design_Tokens.md)
- [Color System](./Color_System.md)
- [Content Strategy](../02_UX/Content_Strategy.md)
- [Accessibility](../02_UX/Accessibility.md)
