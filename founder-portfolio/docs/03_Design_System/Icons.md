# Icons

| Field | Value |
|-------|-------|
| **Product** | Founder Portfolio Platform (FounderOS) |
| **Version** | 1.0 |
| **Document ID** | DS-ICON-001 |
| **Status** | Approved for Implementation |
| **Last Updated** | 2026-06-29 |
| **Owner** | Design & Engineering |
| **Related** | [Design System](./Design_System.md) · [Buttons](./Buttons.md) · [Navigation Components](./Navigation_Components.md) |

---

## Purpose

Define the icon library, sizing standards, usage rules, and accessibility requirements for icons in FounderOS v1.0.

---

## Scope

### In Scope

- Icon library (Lucide React)
- Size scale
- Color and stroke rules
- Icon + text pairing
- Accessibility (decorative vs. semantic)
- Common icon mapping per context

### Out of Scope

- Custom SVG illustrations
- Animated icons (Lottie)
- Favicon/app icon design (see [01_Brand](../01_Brand/))
- Emoji as icons

---

## Business Context

Icons provide visual shorthand for actions and categories. FounderOS standardizes on **Lucide React** — a clean, consistent, open-source icon set with 1000+ icons that pairs well with the shadcn/ui ecosystem. Using a single icon library prevents visual inconsistency from mixed icon sets.

---

## Goals

| # | Goal | Metric |
|---|------|--------|
| G1 | Single icon library across all components | 100% Lucide |
| G2 | Consistent icon sizing per context | 3 size tiers |
| G3 | Accessible icon usage | All semantic icons have labels |

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ICON-01 | All icons SHALL use `lucide-react` package | P0 |
| FR-ICON-02 | Icon sizes SHALL use the defined scale (16, 20, 24px) | P0 |
| FR-ICON-03 | Decorative icons SHALL have `aria-hidden="true"` | P0 |
| FR-ICON-04 | Semantic icons SHALL have accessible labels | P0 |
| FR-ICON-05 | Icons in buttons SHALL not be standalone without text (except icon-only buttons with aria-label) | P0 |

---

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-ICON-01 | Icon render size | Exact pixel values via `h-* w-*` |
| NFR-ICON-02 | Stroke width | Default 2px (Lucide default) |
| NFR-ICON-03 | Tree shaking | Import individual icons, not entire library |

---

## User Stories

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| US-ICON-01 | Visitor | Recognize actions by icon shape | I navigate intuitively |
| US-ICON-02 | Screen reader user | Hear icon meaning when semantic | I understand icon-only buttons |
| US-ICON-03 | Engineer | Import icons consistently | Bundle size stays small |

---

## UX Requirements

### Icon Library

**Library:** [Lucide React](https://lucide.dev) v1.22+

**Import pattern:**
```tsx
import { Menu, X, ArrowRight, ExternalLink } from "lucide-react";
```

**Never import from:**
- react-icons
- heroicons
- font-awesome
- Custom inline SVGs (except logo)

### Size Scale

| Size | Pixels | Tailwind | Usage |
|------|--------|----------|-------|
| XS | 14px | `h-3.5 w-3.5` | Inline with caption text |
| SM | 16px | `h-4 w-4` | Buttons, form inputs, badges |
| MD | 20px | `h-5 w-5` | Nav items, card actions |
| LG | 24px | `h-6 w-6` | Mobile menu toggle, section icons |
| XL | 32px | `h-8 w-8` | Feature icons, empty states |

### Color Rules

| Context | Color | Tailwind |
|---------|-------|----------|
| Default | Inherit from parent text color | `currentColor` |
| Muted | Secondary/muted text | `text-muted-foreground` |
| Accent | Brand actions | `text-accent` |
| Success | Positive states | `text-green-500` |
| Error | Destructive states | `text-red-500` |
| On accent bg | White | `text-accent-foreground` |

### Icon + Text Pairing

| Pattern | Gap | Alignment | Example |
|---------|-----|-----------|---------|
| Icon before text | `gap-2` (8px) | `items-center` | `<ArrowRight /> View Product` |
| Icon after text | `gap-1` (4px) | `items-center` | `External link <ExternalLink />` |
| Icon only (button) | — | Centered | Hamburger menu (with aria-label) |
| Stacked (feature) | `gap-3` (12px) | `flex-col items-center` | Feature grid icons |

### Context Icon Mapping

| Context | Icon | Lucide Name |
|---------|------|-------------|
| Mobile menu open | ☰ | `Menu` |
| Mobile menu close | ✕ | `X` |
| External link | ↗ | `ExternalLink` |
| Arrow / navigate | → | `ArrowRight` |
| Back | ← | `ArrowLeft` |
| Search | 🔍 | `Search` |
| Close dialog | ✕ | `X` |
| Success | ✓ | `Check` |
| Error | ✕ | `XCircle` |
| Warning | ⚠ | `AlertTriangle` |
| Info | ℹ | `Info` |
| Loading | ⟳ | `Loader2` (with `animate-spin`) |
| Delete | 🗑 | `Trash2` |
| Edit | ✏ | `Pencil` |
| Settings | ⚙ | `Settings` |
| User | 👤 | `User` |
| Email | ✉ | `Mail` |
| Calendar | 📅 | `Calendar` |
| Chevron down | ˅ | `ChevronDown` |
| Chevron right | ˃ | `ChevronRight` |
| GitHub | | `Github` |
| LinkedIn | | `Linkedin` |
| Twitter/X | | `Twitter` |

### Accessibility Rules

| Icon Type | ARIA | Example |
|-----------|------|---------|
| Decorative (accompanying text) | `aria-hidden="true"` | `<ArrowRight aria-hidden="true" /> View All` |
| Semantic (icon-only button) | `aria-label="Description"` | `<button aria-label="Open menu"><Menu /></button>` |
| Status indicator | `role="img"` + `aria-label` | `<Check aria-label="Success" />` |

### Animation

| Icon | Animation | Class |
|------|-----------|-------|
| Loading spinner | Continuous rotation | `animate-spin` |
| Chevron (accordion) | Rotate 180° on expand | `transition-transform` + `rotate-180` |
| Arrow (hover) | Translate right 2px | `group-hover:translate-x-0.5` |

---

## Technical Considerations

| Topic | Implementation |
|-------|----------------|
| **Package** | `lucide-react` in `package.json` |
| **Tree shaking** | Named imports only: `import { Menu } from "lucide-react"` |
| **Custom icons** | Logo mark is custom div (initials), not Lucide |
| **SVG props** | Pass `className` for size/color; Lucide accepts standard SVG props |
| **Dynamic icons** | Avoid dynamic icon names; use explicit mapping object |

---

## Security Considerations

No security implications for icons.

---

## Acceptance Criteria

- [ ] 100% of icons imported from `lucide-react`
- [ ] No mixed icon libraries in codebase
- [ ] Icon sizes use defined scale (no arbitrary sizes)
- [ ] Icon-only buttons have `aria-label`
- [ ] Decorative icons have `aria-hidden="true"`
- [ ] Loading spinner uses `Loader2` with `animate-spin`
- [ ] External links show `ExternalLink` icon

---

## Future Enhancements

| Enhancement | Impact |
|-------------|--------|
| Custom icon set | Tenant-specific icons for white-label |
| Animated icons | Lottie for hero illustrations |
| Icon search tool | Storybook icon gallery |

---

## Open Questions

| # | Question | Owner |
|---|----------|-------|
| OQ-ICON-01 | Use Lucide brand icons (Github, Linkedin) or custom SVGs? | Design — Lucide |
| OQ-ICON-02 | Icon stroke width: 1.5 or 2? | Design — 2 (default) |

---

## Related Documents

- [Buttons](./Buttons.md)
- [Navigation Components](./Navigation_Components.md)
- [Feedback Components](./Feedback_Components.md)
- [Loading States](./Loading_States.md)
- [Accessibility](../02_UX/Accessibility.md)
