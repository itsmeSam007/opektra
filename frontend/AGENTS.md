<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Opektra public website

- Opektra is a software engineering company. Keep product thinking, interface design and engineering visible in the design and copy.
- Preserve the selected pearl / ink navy / deep petrol direction. Use frosted glass UI surfaces, restrained spatial interface layers and purposeful scroll motion.
- Only the brand logo has a liquid-crystal material. Do not add watery ribbons, glass blobs, crystal sculptures or decorative liquid objects elsewhere.
- Conektra is one independently branded product. Keep the homepage company-first, the spotlight product-specific, and the product catalogue driven by the `products` collection in `src/lib/opektra.ts`.
- Public company pages are frontend-only. Do not introduce a customer portal, contact forms, CMS dependencies or new backend calls without a user request. Legacy backend/admin source is retained separately.
- Confirmed domain: https://www.opektra.com. Confirmed contact email: admin@opektra.com. No phone number has been supplied; do not invent one.
- Preserve responsive stage controls and the reduced-motion fallback. Do not turn the interactive product story into a flattened image.
- Current implementation notes: `OPEKTRA.md`. Visual target and QA evidence: repository-root `output/opektra/` and `design-qa.md`.

## Mandatory responsive QA

- Read the root `../design-qa.md` protocol and scale verification to the change. The user does not want the complete screen-size matrix repeatedly run for small edits; copy/link removals need a focused component/page check.
- Use every public route and the full viewport/breakpoint/zoom matrix for substantial layout, styling, animation or dependency changes, or when explicitly requested. For small edits, check only the affected content, layout and interactions.
- Verify the entire page and all product-story states, not just the first viewport. Inspect header, hero, panels, typography, articles, contact band and footer.
- A pinned section must fit the available viewport height. Short/tall fallback layouts and reduced-motion mode must preserve access to all content and stage controls.
- Record screenshots, numerical checks, fixed findings, limitations and a fresh final result in root `design-qa.md`. Do not replace this gate with build success or old screenshots.
