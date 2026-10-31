#!/usr/bin/env python3
"""Generate missing FounderOS documentation files with enterprise-grade content."""

import os
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

STANDARD_DEPS = """## Dependencies

- [PRODUCT_REQUIREMENTS.md](../../PRODUCT_REQUIREMENTS.md)
- [SOFTWARE_REQUIREMENTS_SPECIFICATION.md](../../SOFTWARE_REQUIREMENTS_SPECIFICATION.md)
- [PROJECT_SCOPE.md](../../PROJECT_SCOPE.md)

## Glossary

| Term | Definition |
|------|------------|
| FounderOS | Codename for Founder Portfolio Platform v1.0 |
| Tenant | A white-label deployment instance |
| CMS | Content Management System |

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | High | Enforce PROJECT_SCOPE.md boundaries |
| Inconsistent branding | Medium | Follow docs/01_Brand/ guidelines |
| Performance regression | Medium | CI Lighthouse and k6 gates |
"""


def doc(title, purpose, scope_in, scope_out, business, goals, fr, nfr, stories, ux, tech, security, ac, future, oq, extra=""):
    goals_md = "\n".join(f"| G{i+1} | {g} | {m} |" for i, (g, m) in enumerate(goals))
    fr_md = "\n".join(f"- **FR-{i+1}:** {r}" for i, r in enumerate(fr))
    nfr_md = "\n".join(f"| NFR-{i+1} | {c} | {r} | {t} |" for i, (c, r, t) in enumerate(nfr))
    stories_md = "\n".join(f"| US-{i+1} | {p} | {s} | {pr} |" for i, (p, s, pr) in enumerate(stories))
    ac_md = "\n".join(f"- [ ] {a}" for a in ac)
    oq_md = "\n".join(f"| OQ-{i+1} | {q} | {o} | Sprint planning |" for i, (q, o) in enumerate(oq))
    return f"""# {title}

## Purpose

{purpose}

## Scope

### In Scope

{scope_in}

### Out of Scope

{scope_out}

## Business Context

{business}

## Goals

| # | Goal | Success Measure |
|---|------|-----------------|
{goals_md}

## Functional Requirements

{fr_md}

## Non-Functional Requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
{nfr_md}

## User Stories

| ID | Persona | Story | Priority |
|----|---------|-------|----------|
{stories_md}

## UX Requirements

{ux}

## Technical Considerations

{tech}

## Security Considerations

{security}

## Acceptance Criteria

{ac_md}

## Future Enhancements

{future}

## Open Questions

| ID | Question | Owner | Due |
|----|----------|-------|-----|
{oq_md}

{STANDARD_DEPS}

{extra}
"""


def write_if_missing(rel_path, content):
    full = BASE / rel_path
    if full.exists():
        return False
    full.parent.mkdir(parents=True, exist_ok=True)
    full.write_text(content, encoding="utf-8")
    return True


# ─── 00_Project remaining ───────────────────────────────────────────────────

PROJECT_DOCS = {
    "docs/00_Project/04_User_Journey.md": doc(
        "User Journey — FounderOS v1.0",
        "Map end-to-end journeys for primary personas across discovery, engagement, conversion, and administration.",
        "Visitor discovery journey, enterprise buyer journey, founder admin journey, content editor journey.",
        "Internal engineering workflows, vendor onboarding, multi-tenant provisioning (v2.0).",
        "Founders need visitors to discover credibility quickly, enterprise buyers to submit confidential inquiries, and admins to publish content without engineering support.",
        [("Map critical paths", "100% of P0 flows documented"), ("Identify friction", "≤3 clicks to conversion CTAs"), ("Enable QA", "Journey-based test scenarios defined")],
        ["Document 4 primary journeys with touchpoints and emotions", "Define conversion events per journey stage", "Link each touchpoint to page/module documentation", "Specify analytics events at each conversion point", "Define error/recovery paths for form failures"],
        [("UX", "Clear path to contact/acquisition", "≤3 clicks"), ("Performance", "No journey step LCP >2.5s", "Lighthouse"), ("Accessibility", "Keyboard-complete journeys", "WCAG AA")],
        [("Visitor", "As a visitor I discover products and read blog within 2 minutes", "P0"), ("Enterprise Buyer", "As a buyer I submit acquisition inquiry with confidence", "P0"), ("Admin", "As admin I publish blog post in <10 minutes", "P0"), ("Editor", "As editor I upload media and reuse across pages", "P1")],
        "Journeys must respect [Interaction_Principles.md](../02_UX/Interaction_Principles.md). Mobile journeys are primary. Dark mode consistent across steps.",
        """```mermaid
journey
    title Visitor Discovery Journey
    section Awareness
      Land on Home: 5: Visitor
      View Products: 4: Visitor
    section Consideration
      Read Case Study: 4: Visitor
      View Testimonials: 3: Visitor
    section Conversion
      Submit Contact: 5: Visitor
```""",
        "Acquisition journey forms require rate limiting. Admin journey requires MFA-ready auth architecture.",
        ["4 journey maps approved by PM and Design", "Analytics events defined per stage", "E2E tests cover P0 journeys"],
        "v1.5: Creator journey for travel content. v2.0: Tenant onboarding journey.",
        [("Should acquisition journey require email verification?", "PM"), ("Multi-step vs single-page contact form?", "Design")],
        extra="## Related Documents\n- [03_User_Personas.md](03_User_Personas.md)\n- [02_UX/User_Flows.md](../02_UX/User_Flows.md)\n",
    ),
}

created = 0
for path, content in PROJECT_DOCS.items():
    if write_if_missing(path, content):
        created += 1

print(f"Created {created} project docs (partial - run full generator)")
