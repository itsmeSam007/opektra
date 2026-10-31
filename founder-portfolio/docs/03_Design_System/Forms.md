# Forms

| Field | Value |
|-------|-------|
| **Product** | Founder Portfolio Platform (FounderOS) |
| **Version** | 1.0 |
| **Document ID** | DS-FORM-001 |
| **Status** | Approved for Implementation |
| **Last Updated** | 2026-06-29 |
| **Owner** | Design & Engineering |
| **Related** | [Buttons](./Buttons.md) · [Feedback Components](./Feedback_Components.md) · [Accessibility](../02_UX/Accessibility.md) |

---

## Purpose

Define form input components, validation patterns, layout rules, and accessibility standards for FounderOS v1.0 contact forms, inquiry forms, and admin CMS forms.

---

## Scope

### In Scope

- Input, Textarea, Label, Select components
- Form validation (react-hook-form + zod)
- Error and success states
- Contact and inquiry form compositions
- Admin CMS form patterns
- Accessibility for all form elements

### Out of Scope

- File upload UI (v1.1 media library)
- Rich text editor (v1.1 CMS)
- Multi-step wizard forms (v1.1)

---

## Business Context

Forms are the primary conversion mechanism — contact, demo request, and enterprise acquisition forms directly generate leads. Form UX must be frictionless: clear labels, inline validation, accessible error messages, and confident submission feedback.

---

## Goals

| # | Goal | Metric |
|---|------|--------|
| G1 | Form completion rate maximized | Minimal required fields |
| G2 | Accessible form errors | aria-describedby on all errors |
| G3 | Consistent validation UX | Zod schema per form type |

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-FORM-01 | Forms SHALL use `react-hook-form` with `zod` validation | P0 |
| FR-FORM-02 | All inputs SHALL have associated `<Label>` elements | P0 |
| FR-FORM-03 | Errors SHALL display inline below the field | P0 |
| FR-FORM-04 | Submit button SHALL show loading state during API call | P0 |
| FR-FORM-05 | Success SHALL show confirmation message | P0 |
| FR-FORM-06 | Required fields SHALL be marked visually and semantically | P0 |
| FR-FORM-07 | Contact form SHALL pre-fill type from `?type=` query param | P0 |

---

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-FORM-01 | Validation feedback latency | Instant on blur/submit |
| NFR-FORM-02 | Form submission response | < 3s |
| NFR-FORM-03 | Field height | 40px (h-10) for inputs |

---

## User Stories

| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| US-FORM-01 | Visitor | Fill out a contact form quickly | I can reach the founder |
| US-FORM-02 | Form user | See what's wrong with my input | I can fix errors easily |
| US-FORM-03 | Screen reader user | Hear field labels and errors | I can complete the form |
| US-FORM-04 | Admin | Create content via structured forms | I publish accurate content |

---

## UX Requirements

### Form Components

| Component | Base | Height | Padding |
|-----------|------|--------|---------|
| Input | shadcn `Input` | 40px (`h-10`) | `px-3 py-2` |
| Textarea | shadcn `Textarea` | Auto (min 80px) | `px-3 py-2` |
| Label | shadcn `Label` | — | `text-sm font-medium` |
| Select | shadcn `Select` | 40px | `px-3 py-2` |
| Switch | shadcn `Switch` | 24px | — |

### Input States

| State | Border | Ring | Background |
|-------|--------|------|------------|
| Default | `border-border` | — | `bg-background` |
| Focus | `border-ring` | `ring-2 ring-ring` | `bg-background` |
| Error | `border-red-500` | `ring-2 ring-red-500` | `bg-background` |
| Disabled | `border-border` | — | `bg-muted opacity-50` |

### Contact Form Fields

| Field | Type | Required | Validation | Placeholder |
|-------|------|----------|------------|-------------|
| Type | Select | Yes | Enum: demo, acquisition, general, press | — |
| Name | Input | Yes | Min 2 chars | "Your name" |
| Email | Input | Yes | Valid email format | "you@company.com" |
| Company | Input | No | — | "Company name" |
| Message | Textarea | Yes | Min 10 chars | "How can we help?" |

### Validation Schema (Zod)

```typescript
const contactSchema = z.object({
  type: z.enum(["demo", "acquisition", "general", "press"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
```

### Form Layout

```
┌─────────────────────────────────────┐
│  Label *                            │
│  ┌───────────────────────────────┐  │
│  │ Input value                   │  │
│  └───────────────────────────────┘  │
│  Error message (if invalid)         │
│                                     │
│  Label *                            │
│  ┌───────────────────────────────┐  │
│  │ Textarea value                  │  │
│  │                                 │  │
│  └───────────────────────────────┘  │
│                                     │
│              [Send Message]         │
└─────────────────────────────────────┘
```

| Layout Rule | Value |
|-------------|-------|
| Field spacing | `space-y-4` between fields |
| Label-to-input | `space-y-2` within field group |
| Form max-width | `max-w-2xl` on contact page |
| Submit alignment | Right-aligned or full-width on mobile |
| Required indicator | Asterisk (*) after label text |

### Error Display

| Element | Attribute | Content |
|---------|-----------|---------|
| Input (error) | `aria-invalid="true"` | — |
| Error message | `id="field-error"` | Human-readable message |
| Input (error) | `aria-describedby="field-error"` | Links to error |
| Error container | `role="alert"` on submit | Announces to screen readers |

### Success State

After successful submission:
1. Form replaced with success message card
2. Message: "Thanks! We'll get back to you within 24 hours."
3. Optional: reset form button or link to Home

### Admin CMS Form Pattern

| Field Type | Component | Notes |
|------------|-----------|-------|
| Title | Input | Auto-generates slug |
| Slug | Input | Editable, validated `^[a-z0-9-]+$` |
| Body | Textarea (v1.0) / MDX editor (v1.1) | — |
| Status | Select | draft, published |
| SEO Title | Input | 60 char counter |
| SEO Description | Textarea | 160 char counter |
| Featured Image | File input (v1.1) | Media library picker |
| Tags | Input (comma-separated) | — |

---

## Technical Considerations

| Topic | Implementation |
|-------|----------------|
| **Form library** | `react-hook-form` v7 |
| **Validation** | `zod` v4 + `@hookform/resolvers/zod` |
| **Components** | `frontend/src/components/ui/input.tsx`, `textarea.tsx`, `label.tsx` |
| **Compositions** | `frontend/src/components/forms/contact-form.tsx`, `inquiry-form.tsx` |
| **API** | POST `/api/v1/contact` via `frontend/src/lib/api.ts` |
| **Honeypot** | Hidden field for spam prevention |

---

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| XSS in form input | Sanitize server-side before storage |
| CSRF | Same-origin POST with CSRF token |
| Spam | Honeypot + Redis rate limit (5/hour/IP) |
| SQL injection | Parameterized queries in FastAPI |
| PII handling | Encrypt at rest; GDPR compliance |

---

## Acceptance Criteria

- [ ] Contact form validates all required fields with Zod
- [ ] Inline errors display below invalid fields
- [ ] `aria-describedby` links errors to inputs
- [ ] Submit button shows loading spinner during API call
- [ ] Success message displays after successful submit
- [ ] `?type=demo` pre-selects form type
- [ ] All inputs have visible labels
- [ ] Required fields marked with asterisk
- [ ] Form works on mobile (375px viewport)
- [ ] Honeypot field present and hidden

---

## Future Enhancements

| Enhancement | Form Impact |
|-------------|-------------|
| File upload | Media library integration |
| Rich text editor | MDX/TipTap for blog body |
| Multi-step wizard | Enterprise acquisition flow |
| Auto-save drafts | Admin CMS auto-save |
| Field-level async validation | Email domain check |

---

## Open Questions

| # | Question | Owner |
|---|----------|-------|
| OQ-FORM-01 | reCAPTCHA v3 on contact form? | Security — v1.1 |
| OQ-FORM-02 | Phone number field for enterprise? | Product |
| OQ-FORM-03 | Budget range dropdown for acquisition? | Product — Recommended |

---

## Related Documents

- [Buttons](./Buttons.md)
- [Feedback Components](./Feedback_Components.md)
- [Accessibility](../02_UX/Accessibility.md)
- [User Flows](../02_UX/User_Flows.md)
- [Contact Page](../05_Pages/Contact.md)
