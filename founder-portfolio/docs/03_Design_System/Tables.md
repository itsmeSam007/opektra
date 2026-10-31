# Tables

| Field | Value |
|-------|-------|
| **Product** | Founder Portfolio Platform (FounderOS) |
| **Version** | 1.0 |
| **Document ID** | DS-TABLE-001 |
| **Status** | Approved for Implementation |
| **Last Updated** | 2026-06-29 |
| **Owner** | Design & Engineering |
| **Related** | [Cards](./Cards.md) · [Navigation Components](./Navigation_Components.md) · [07_Admin](../07_Admin/) |

---

## Purpose

Define data table patterns, styling, and interaction rules for FounderOS v1.0 admin panel content lists and any public-facing tabular data (technology stack, pricing comparisons).

---

## Scope

### In Scope

- Base Table component (shadcn/ui)
- Admin content list tables
- Table header, body, row, cell anatomy
- Sorting, pagination patterns
- Responsive table behavior
- Empty and loading states

### Out of Scope

- Complex data grids with inline editing (v1.1)
- Export functionality (v1.1)
- Virtual scrolling (not needed v1.0)

---

## Business Context

Tables are primarily an **admin panel** component for managing content (blog posts, products, case studies, contacts). Clean, scannable tables enable efficient content management — a core CMS requirement.

---

## Goals

| # | Goal | Metric |
|---|------|--------|
| G1 | Admin content manageable via tables | All CMS entities in tables |
| G2 | Tables readable on desktop | Full table at ≥ 1024px |
| G3 | Mobile-friendly fallback | Card list on < 768px |

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TABLE-01 | Tables SHALL use shadcn/ui `Table` component | P0 |
| FR-TABLE-02 | Table headers SHALL be sticky on scroll (admin) | P1 |
| FR-TABLE-03 | Rows SHALL be clickable to edit (admin) | P0 |
| FR-TABLE-04 | Tables SHALL support pagination | P1 |
| FR-TABLE-05 | Empty state SHALL display when no data | P0 |
| FR-TABLE-06 | Status column SHALL use badge component | P1 |

---

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-TABLE-01 | Row height | 48px minimum |
| NFR-TABLE-02 | Page size default | 20 rows |
| NFR-TABLE-03 | Sort response | < 500ms |

---

## User Stories

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| US-TABLE-01 | Admin | See all blog posts in a table | I can manage content efficiently |
| US-TABLE-02 | Admin | Sort by date or status | I find recent/draft content |
| US-TABLE-03 | Admin | Click a row to edit | I navigate quickly to content |
| US-TABLE-04 | Visitor | View technology stack in a table | I understand the tech used |

---

## UX Requirements

### Table Anatomy

```
┌──────────────────────────────────────────────────────┐
│  TableHeader (sticky)                                │
│  ┌────────┬──────────┬────────┬─────────┬────────┐  │
│  │ Title  │ Status   │ Date   │ Author  │ Actions│  │
│  ╞════════╪══════════╪════════╪═════════╪════════╡  │
│  TableBody                                           │
│  │ Post 1 │ Published│ Jun 29 │ Soumen  │ ⋯      │  │
│  │ Post 2 │ Draft    │ Jun 28 │ Soumen  │ ⋯      │  │
│  │ Post 3 │ Published│ Jun 27 │ Soumen  │ ⋯      │  │
│  └────────┴──────────┴────────┴─────────┴────────┘  │
├──────────────────────────────────────────────────────┤
│  Pagination: ← 1 2 3 ... 10 →                       │
└──────────────────────────────────────────────────────┘
```

### Base Table Styles

| Element | Style | Tailwind |
|---------|-------|----------|
| Table | Full width, border collapse | `w-full` |
| Header row | Muted background, semibold text | `bg-muted/50 text-sm font-medium` |
| Header cell | Left-aligned, padding | `h-12 px-4 text-left` |
| Body row | Border bottom, hover highlight | `border-b hover:bg-muted/50` |
| Body cell | Padding, muted text for secondary | `p-4 text-sm` |
| Row height | Minimum 48px | `h-12` or auto with `p-4` |

### Admin Content Tables

#### Blog Posts Table

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| Title | 40% | Post title (truncated) | Yes |
| Status | 12% | Badge: draft/published | Yes |
| Date | 15% | `updated_at` formatted | Yes |
| Author | 15% | Author name | No |
| Actions | 8% | Edit, Delete dropdown | No |

#### Products Table

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| Name | 30% | Product name | Yes |
| Status | 12% | Badge | Yes |
| Featured | 10% | Star icon or badge | Yes |
| Updated | 15% | Date | Yes |
| Actions | 8% | Edit, Delete | No |

#### Contacts Table

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| Name | 20% | Contact name | Yes |
| Email | 25% | Email address | No |
| Type | 15% | demo/acquisition/general | Yes |
| Date | 15% | Submitted date | Yes |
| Status | 12% | new/read/replied | Yes |

### Status Badges in Tables

| Status | Badge Color | Variant |
|--------|-------------|---------|
| Published | Green | `bg-green-500/10 text-green-500` |
| Draft | Yellow | `bg-yellow-500/10 text-yellow-500` |
| New | Blue | `bg-blue-500/10 text-blue-500` |
| Read | Muted | `bg-muted text-muted-foreground` |

### Row Actions

| Action | Icon | Behavior |
|--------|------|----------|
| Edit | `Pencil` | Navigate to edit page |
| Delete | `Trash2` | Open confirmation dialog |
| View | `ExternalLink` | Open public page in new tab |
| More | `MoreHorizontal` | Dropdown menu for additional actions |

### Pagination

| Element | Style |
|---------|-------|
| Container | Flex, centered, gap-2 |
| Page button | `Button` ghost variant, `sm` size |
| Active page | `Button` default variant, `sm` size |
| Items per page | 20 default, configurable |
| Info text | "Showing 1-20 of 45 results" |

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| `≥ md` (768px) | Full table layout |
| `< md` | Transform to card list (stacked rows) |

Mobile card list pattern:
```
┌─────────────────────────┐
│  Post Title             │
│  Published · Jun 29     │
│  [Edit] [Delete]        │
├─────────────────────────┤
│  Post Title 2           │
│  Draft · Jun 28         │
│  [Edit] [Delete]        │
└─────────────────────────┘
```

### Empty State

| Element | Content |
|---------|---------|
| Icon | `FileText` (large, muted) |
| Title | "No content yet" |
| Description | "Create your first blog post to get started." |
| CTA | "Create Post" button |

### Public Table (Technology Stack)

| Column | Content |
|--------|---------|
| Category | Frontend, Backend, AI/ML, etc. |
| Technologies | Comma-separated list |

Simple 2-column table, no pagination, no actions.

---

## Technical Considerations

| Topic | Implementation |
|-------|----------------|
| **Component** | shadcn/ui `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` |
| **Data fetching** | Server-side pagination via FastAPI query params `?page=1&limit=20` |
| **Sorting** | `?sort=updated_at&order=desc` |
| **Row click** | `onClick` navigates to `/admin/content/blog/[id]/edit` |

---

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| Data exposure in tables | Admin auth required; no public contact table |
| Delete without confirm | Confirmation dialog required |
| XSS in table cell content | Sanitize rendered content |

---

## Acceptance Criteria

- [ ] Admin blog, products, contacts tables implemented
- [ ] Row click navigates to edit page
- [ ] Status badges render correctly
- [ ] Pagination works with 20 items per page
- [ ] Empty state displays when no data
- [ ] Row hover highlight visible
- [ ] Delete action opens confirmation dialog
- [ ] Media page public table renders correctly

---

## Future Enhancements

| Enhancement | Table Impact |
|-------------|-------------|
| Column sorting UI | Click header to sort |
| Bulk actions | Checkbox selection + bulk delete |
| Inline editing | Edit title directly in table |
| Export CSV | Download table data |
| Advanced filters | Filter by status, date range |

---

## Open Questions

| # | Question | Owner |
|---|----------|-------|
| OQ-TABLE-01 | Mobile card list or horizontal scroll? | UX — Card list |
| OQ-TABLE-02 | Inline status toggle (draft ↔ published)? | Product — v1.1 |

---

## Related Documents

- [Cards](./Cards.md)
- [Dialogs](./Dialogs.md)
- [Feedback Components](./Feedback_Components.md)
- [Loading States](./Loading_States.md)
- [07_Admin](../07_Admin/) — Admin panel specs
