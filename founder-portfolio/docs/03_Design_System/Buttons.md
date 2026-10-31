# Buttons

| Field | Value |
|-------|-------|
| **Product** | Founder Portfolio Platform (FounderOS) |
| **Version** | 1.0 |
| **Document ID** | DS-BTN-001 |
| **Status** | Approved for Implementation |
| **Last Updated** | 2026-06-29 |
| **Owner** | Design & Engineering |
| **Related** | [Color System](./Color_System.md) · [Icons](./Icons.md) · [Interaction Principles](../02_UX/Interaction_Principles.md) |

---

## Purpose

Define button variants, sizes, states, and usage rules for FounderOS v1.0 — the primary interactive element for user actions and conversions.

---

## Scope

### In Scope

- Button variants (default, ghost, outline, destructive, link)
- Size scale (sm, default, lg, icon)
- States (default, hover, active, focus, disabled, loading)
- CTA hierarchy rules
- Button as Link pattern (`asChild`)
- Accessibility requirements

### Out of Scope

- Toggle buttons (use Switch component)
- Button groups (v1.1)
- Floating action buttons

---

## Business Context

Buttons are the primary conversion mechanism. "Request Demo" and "Start a Conversation" buttons directly drive revenue. Button design must be prominent enough to attract clicks without overwhelming content — following the primary/secondary/tertiary hierarchy defined in [Interaction Principles](../02_UX/Interaction_Principles.md).

---

## Goals

| # | Goal | Metric |
|---|------|--------|
| G1 | Clear visual hierarchy between button variants | 5 distinct variants |
| G2 | All buttons accessible via keyboard | Tab + Enter/Space |
| G3 | Loading state prevents double-submit | Disabled during async |

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-BTN-01 | Buttons SHALL use shadcn/ui `Button` component | P0 |
| FR-BTN-02 | Variants SHALL be defined via CVA | P0 |
| FR-BTN-03 | Buttons as links SHALL use `asChild` with Next.js `Link` | P0 |
| FR-BTN-04 | Loading state SHALL show spinner and disable button | P0 |
| FR-BTN-05 | Focus ring SHALL be visible (WCAG) | P0 |
| FR-BTN-06 | Touch targets SHALL be ≥ 44px on mobile | P0 |

---

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-BTN-01 | Hover transition | 150ms |
| NFR-BTN-02 | Active scale | `scale-[0.98]` optional |
| NFR-BTN-03 | Focus ring width | 2px |

---

## User Stories

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| US-BTN-01 | Visitor | Clearly see the primary action | I know what to click |
| US-BTN-02 | Form user | See loading state on submit | I know my action is processing |
| US-BTN-03 | Keyboard user | Focus and activate buttons | I can navigate without mouse |

---

## UX Requirements

### Variants

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| **default** | `bg-accent` | `text-accent-foreground` | — | Primary CTAs: "Request Demo" |
| **ghost** | transparent | `text-muted-foreground` → `text-foreground` | — | Secondary: "Enterprise" |
| **outline** | transparent | `text-foreground` | `border-border` | Tertiary actions |
| **destructive** | `bg-red-500` | `text-white` | — | Delete, remove actions |
| **link** | transparent | `text-accent` underline | — | Inline text actions |
| **secondary** | `bg-muted` | `text-foreground` | — | Alternative solid |

### Sizes

| Size | Height | Padding | Font | Tailwind | Usage |
|------|--------|---------|------|----------|-------|
| `sm` | 32px | `px-3 py-1.5` | `text-sm` | `h-8` | Header CTAs, compact UI |
| `default` | 36px | `px-4 py-2` | `text-sm` | `h-9` | Standard buttons |
| `lg` | 44px | `px-6 py-3` | `text-base` | `h-11` | Hero CTAs |
| `icon` | 36px | `p-2` | — | `h-9 w-9` | Icon-only buttons |

### States

```mermaid
stateDiagram-v2
    [*] --> Default
    Default --> Hover: Mouse enter
    Hover --> Active: Mouse down
    Active --> Hover: Mouse up
    Default --> Focus: Tab key
    Focus --> Default: Tab away
    Default --> Disabled: disabled prop
    Default --> Loading: async action
    Loading --> Default: action complete
    Loading --> Disabled: prevent interaction
```

| State | Visual Change |
|-------|---------------|
| **Default** | Base variant styles |
| **Hover** | Background lightens/darkens (150ms transition) |
| **Active** | Slight scale down (optional) |
| **Focus** | `ring-2 ring-ring ring-offset-2 ring-offset-background` |
| **Disabled** | `opacity-50 pointer-events-none` |
| **Loading** | Spinner icon + disabled + "Loading..." or original text |

### CTA Hierarchy on Page

| Position | Variant | Size | Example |
|----------|---------|------|---------|
| Hero primary | `default` | `lg` | "Request Demo" |
| Hero secondary | `outline` or `ghost` | `lg` | "Explore Products" |
| Header CTA | `default` | `sm` | "Request Demo" |
| Header secondary | `ghost` | `sm` | "Enterprise" |
| Section CTA | `default` | `default` | "View All Case Studies" |
| Inline link | `link` | — | "Learn more →" |
| Destructive | `destructive` | `default` | "Delete Post" |

### Button as Link

Navigation buttons use `asChild` to render as Next.js `Link`:

```tsx
<Button size="sm" asChild>
  <Link href="/contact?type=demo">Request Demo</Link>
</Button>
```

This ensures client-side navigation with button styling.

### Icon Buttons

| Pattern | Implementation |
|---------|----------------|
| Icon + text | `<Button><Mail className="mr-2 h-4 w-4" /> Send</Button>` |
| Icon only | `<Button size="icon" aria-label="Open menu"><Menu /></Button>` |
| Loading | `<Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</Button>` |

### Component API

```tsx
interface ButtonProps {
  variant?: "default" | "ghost" | "outline" | "destructive" | "link" | "secondary";
  size?: "sm" | "default" | "lg" | "icon";
  asChild?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

---

## Technical Considerations

| Topic | Implementation |
|-------|----------------|
| **Component** | `frontend/src/components/ui/button.tsx` |
| **CVA** | `buttonVariants` with `class-variance-authority` |
| **Radix** | `@radix-ui/react-slot` for `asChild` |
| **Base styles** | `inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2` |

---

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| Double submit | Disable button during loading |
| Destructive without confirm | Require dialog confirmation |

---

## Acceptance Criteria

- [ ] All 6 variants render correctly
- [ ] All 4 sizes render correctly
- [ ] Focus ring visible on keyboard navigation
- [ ] Loading state shows spinner and disables button
- [ ] `asChild` pattern works with Next.js Link
- [ ] Header CTAs use `sm` size
- [ ] Hero CTAs use `lg` size
- [ ] Icon-only buttons have `aria-label`
- [ ] Touch targets ≥ 44px on mobile (lg size or padding)

---

## Future Enhancements

| Enhancement | Impact |
|-------------|--------|
| Button groups | Segmented controls |
| Split button | Action + dropdown |
| Full-width mobile | `w-full sm:w-auto` responsive |

---

## Open Questions

| # | Question | Owner |
|---|----------|-------|
| OQ-BTN-01 | Active scale animation on click? | UX — Subtle yes |
| OQ-BTN-02 | Full-width buttons on mobile for CTAs? | Design — Hero only |

---

## Related Documents

- [Color System](./Color_System.md)
- [Icons](./Icons.md)
- [Interaction Principles](../02_UX/Interaction_Principles.md)
- [Forms](./Forms.md)
- [Loading States](./Loading_States.md)
