# Opektra company frontend

The selected visual target is the final Pearl / Petrol mock with a crystal logo, frosted interface hero and engineering-led product story. No watery sculptures or liquid decorations are used.

## Local preview

From the project root:

```sh
docker compose up -d --build frontend
```

Open http://localhost:13000. When rebuilding a previously started production frontend, renew its anonymous generated-build volumes so that the image build is used:

```sh
docker compose up -d --no-deps --force-recreate --renew-anon-volumes frontend
```

For frontend-only development:

```sh
cd frontend
npm install
npm run dev
```

The company homepage and all primary company pages are frontend-only. They do not request CMS data or depend on the FastAPI service. Existing backend/admin source has been retained, with no new company portal introduced or linked from the public site.

## Content and structure

- `src/lib/opektra.ts`: company domain/contact, independently listed products and local editorial articles.
- `src/components/opektra/`: original studio blueprint, capability map, catalogue field notes, lifecycle rail, workflow diagrams, product scrollytelling and reveal components.
- `src/app/opektra.css`: base company design system.
- `src/app/craft.css`: distinct original visual compositions and nested-route active navigation.
- `src/app/studio.css`: engineering-studio backgrounds, original studio and product diagrams, page layouts and responsive refinements.
- `src/lib/engineering-articles.ts`: six new journal articles with takeaways and further-reading sources.
- Main routes: `/`, `/about`, `/products`, `/products/conektra`, `/blog`, `/blog/[slug]`, `/contact`.
- Website information: `/legal/privacy`, `/legal/terms`.
- Domain: https://www.opektra.com; email: admin@opektra.com.
- No phone number was supplied. Contact actions use the confirmed email rather than a fictional number.
- Add future real products to the `products` collection. Conektra is a product spotlight, not the company identity.
- The eight local journal articles are original editorial content, including six new product, interface and engineering essays. They are not customer case studies or independently verified delivery claims. Review copy and website policy text before public launch.

## Motion

The company hero uses a layered product-building blueprint with selectable Understand, Shape and Build phases. The product spotlight uses an original capability map; the catalogue uses field notes; the product hero uses a lifecycle rail. Conversation routing, booking confirmation and operations handoff each have a distinct diagram. These are illustrative compositions, not a live Conektra application or a full WebGL scene. On desktop, the product scene pins while scrolling through Conversation → Booking → Operations, changing panel depth, emphasis and connecting lines. Stage buttons can also be selected. Pinning runs only above 900px width and between 821px and 1399px viewport height. Mobile, short and very tall windows use a naturally flowing layout with tappable stages. Reduced-motion mode removes continuous movement and pinning, leaving all information accessible through the stage controls.

## Assets

Generated with built-in Image Gen, then saved in `public/opektra/`:

- `brand-mark.png`: transparent silver / ice-blue crystal O, no wordmark. Prompt: tightly composed single ribbon ring with navy edges and subtle refraction, readable at favicon size.
- `engineering-editorial.png`: restrained close-up of a code editor in a pearl / navy software studio.
- `workflow-editorial.png`: matte conversation, calendar and operations panels connected by precise technical lines.
- `studio-environment.webp`: original conceptual software-studio environment, used softly behind readable content.
- `systems-editorial.webp`: original conceptual computing-system editorial illustration.
- `icon-32.png`, `icon-180.png`, `icon-192.png`, plus `src/app/favicon.ico`: derivatives of the original mark.

The latest asset prompts and provenance are recorded in `../output/opektra-studio-build/assets.md`. Studio imagery is conceptual, not a claim about Opektra offices or hardware.

All interface panels are real responsive HTML components. Only identity and editorial images are raster assets; the page is not a flattened mock image.

## Page experience

The product catalogue and detail page share the capability storytelling. Detail chapters use distinct routing, scheduling and handoff compositions to explain enquiry, booking and operations, with selectable restaurant/salon/hotel examples and a link to Conektra’s published security information. Contact topics prepare an editable email brief using the confirmed address; nothing is submitted by the site. The journal has category filters, article contents, takeaways and related reading. A shared deep-petrol footer closes all public pages.

## Validation

See the root `design-qa.md` for browser evidence, responsive checks, motion stages and intentional differences from the mock.

### Contact footer fix

The shared page shell uses a `100vh` / `100dvh` minimum-height flex column. Main content grows on short pages and the footer stays in normal flow on long pages. Verified in Chrome at desktop, tall, small and mobile viewport sizes and actual 80–200% browser zoom. See `../output/contact-fix/checks.json` and the Contact regression section in `../design-qa.md`.

## Active navigation

`src/lib/navigation.ts` marks exact pages with `aria-current="page"` and parent sections on nested routes with `aria-current="location"`. Header desktop/mobile navigation and all internal footer navigation use visible current-state styling. Matching requires a slash boundary, so similarly prefixed routes do not appear active.
