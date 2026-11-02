# Opektra frontend design QA — mandatory protocol

This root file is both the permanent frontend QA rule set and the latest run report. Follow it for **every frontend change**, including small CSS fixes, copy/layout changes, animation changes and dependency updates. Root `AGENTS.md` and `frontend/AGENTS.md` enforce this gate. Preserve the rules when replacing the latest run results.

## 1. What a screen-size check means

Test **CSS viewport width AND height**, not just device names or physical inches. Physical monitor size alone does not determine browser layout: resolution, OS scaling, browser chrome, zoom and orientation change the usable viewport.

The cases below represent phones, tablets, laptops, MacBook-class scaled workspaces, common 24–32 inch monitor resolutions, and larger/ultrawide displays. They are **representative logical viewports**, not claims about any particular device’s factory default. QHD/4K/5K cases include large unscaled browser areas; scaled 4K displays are also represented by smaller logical viewports. Do not stretch the content column to the full width of a 4K/ultrawide monitor.

## 2. Required screen × route matrix

Run every route below at every required viewport after the final code change. New public routes must be added here when introduced. A current full run contains 23 viewports × 16 routes = 368 page/viewport checks.

| Representative case | CSS viewport |
| --- | --- |
| mobile-320 | 320 × 568 |
| mobile-360 | 360 × 800 |
| mobile-375 | 375 × 667 |
| mobile-390 | 390 × 844 |
| mobile-430 | 430 × 932 |
| mobile-landscape | 844 × 390 |
| tablet-portrait | 768 × 1024 |
| tablet-air | 820 × 1180 |
| tablet-landscape | 1024 × 768 |
| tablet-large | 1024 × 1366 |
| laptop-small | 1280 × 720 |
| laptop-common | 1366 × 768 |
| laptop-macbook-small | 1280 × 800 |
| laptop-macbook-medium | 1440 × 900 |
| laptop-macbook-14-class | 1512 × 982 |
| laptop-macbook-16-class | 1728 × 1117 |
| desktop-fhd | 1920 × 1080 |
| desktop-16-10 | 1920 × 1200 |
| desktop-qhd | 2560 × 1440 |
| desktop-ultrawide | 3440 × 1440 |
| desktop-4k | 3840 × 2160 |
| desktop-superwide | 5120 × 1440 |
| desktop-5k | 5120 × 2880 |

Required public routes:

- `/`
- `/about`
- `/products`
- `/products/conektra`
- `/blog`
- `/blog/simpler-tools-for-growing-businesses`
- `/blog/designing-for-real-human-workflows`
- `/blog/from-enquiry-to-confirmed-booking`
- `/blog/ai-workflows-and-human-handoff`
- `/blog/reliable-integrations-and-retries`
- `/blog/one-product-different-workflows`
- `/blog/motion-that-explains-a-product`
- `/blog/what-makes-a-product-ready-for-delivery`
- `/contact`
- `/legal/privacy`
- `/legal/terms`

Also test **one pixel below/at/above each affected media-query boundary**. Current principal widths are 650, 767, 900, 1150 and 1550px; product-story height boundaries are 820 and 1400px. Check portrait ↔ landscape changes and small browser heights, not just maximized windows.

## 3. Checks on every page/viewport

1. Navigate to the actual running page and confirm the expected route, title and primary heading. Build success, HTTP 200 and a DOM-only check do not replace visual inspection.
2. Check horizontal overflow, offscreen/truncated primary text, broken wrapping, distorted or missing images and console errors. Ignore intentional decorative perspective only when it does not hide meaningful copy or controls.
3. Inspect header/nav, hero/content, product panels, company approach, blog cards/articles, contact band and footer. Scroll through the entire page. Reveal animations must finish before taking evidence; a full-page capture of unrevealed sections is not a valid blank-section finding or a passing screenshot.
4. Verify the footer reaches at least the viewport bottom on short pages and follows content on long pages. Allow <=1 CSS px rounding. No fixed-position footer over content, overlaps, cropped content or empty area below the final footer.
5. Check type hierarchy, readable body copy, line length, contrast, spacing rhythm, transparent logo edges, image sharpness/crop and software engineering brand character. Only the logo uses liquid-crystal material; no decorative watery artwork.
6. A pinned story must fit between the sticky header and viewport bottom. Check all three workflow states. Short screens, very tall screens and reduced-motion mode use normal-flow content with accessible stage controls. Never hide an inaccessible panel to suppress overflow.
7. Verify mobile menu, links, CTAs, internal product/article navigation, and the confirmed `mailto:` action. Do not send an email during tests. Future products must render from the product collection, not invented placeholders.
8. Check keyboard navigation, visible focus, menu state, accessible control names/pressed states and image alt text. Aim for 44px touch targets for primary controls; isolated controls must have a usable target area.

## 4. Zoom, motion and browser settings

- In a real browser, test 80%, 100%, 125%, 150% and 200% zoom. At minimum check home/product story, Contact/footer and an article. Confirm reflow, navigation access and no footer gap. Record actual CSS dimensions, because zoom changes the viewport.
- Exercise `prefers-reduced-motion: reduce` using browser emulation or a real preference when available. Continuous movement/pinning must stop; all content and stage controls must remain accessible. Record the preference used and restore it. If preference emulation is unavailable, clearly mark it untested instead of claiming a simulated pass.
- Check the pinned workflow with real scroll plus manual stage selection. Verify normal-flow/mobile stage selection does not reset on incidental scrolling.
- Test around all affected breakpoints and resize between portrait/landscape without reloading at least once.
- Record browser engine, OS and device-pixel ratio. Use additional available engines for release validation where possible; a Chrome viewport test does not prove Safari/Firefox or actual iPhone/iPad behaviour.
- If browser controls, real devices, another engine, touch hardware or preferences are unavailable, document the exact limit. Never present emulation as physical hardware/performance testing.
- Restore browser viewport, zoom, DevTools/media settings and any other temporary preferences after the run.

## 5. Evidence, fixes and handoff gate

- Save a distinct run folder under `output/responsive-qa/`, with configuration, measurements and screenshots. Preserve earlier evidence when recording a regression fix.
- Collect measurements for the full matrix. Inspect screenshot galleries covering **each screen family and each route**, plus focused/native-resolution screenshots for risky states. Screen captures must have the expected CSS dimensions; use full-page capture and aligned crops if the browser’s viewport-capture pipeline mis-scales a large emulated canvas. Do not treat capture padding as site whitespace.
- Put target/current or before/after evidence together for material visual findings. Fix P0/P1/P2 issues, recapture them and rerun the required matrix after layout changes. Do not endlessly iterate on P3 polish.
- Run the production build/type check for implementation changes, existing unit checks when relevant, and lint for changed code. Do not add tests that merely mirror CSS declarations. Browser layout/interaction checks are the evidence for visual CSS changes.
- Record the final result as `passed`, `partial` or `blocked`, with route/screen counts, findings, fixes, tests and limitations. A previous task’s result is never a pass for a new change. Do not claim every physical device/browser is supported based on this matrix.
- Before completing a frontend task, update the latest report below and include a concise user-facing result with visible screenshot evidence. Required unavailable checks remain named limitations. Material unresolved layout or interaction defects block a passing handoff.

---

## Latest run — 2026-11-02 dependency security and Docker release setup

**Status: passed for the required Chrome responsive, zoom, motion and interaction checks.** Other browser engines and physical-device performance remain unverified.

- Updated Next.js to 16.4.3, Zod to 4.6.7, matching Next ESLint tooling and Vitest/coverage to 5.0.5. Local Docker and CI use Node 22. No public layout, copy or animation source was changed in this task.
- Tested the final production frontend image on the isolated `opektra-release-check` stack at `http://localhost:13001`. The existing local stack at port 13000 and its data were retained.
- **368/368 required matrix cases:** 23 logical viewports × all 16 public routes, with full-page scrolling, titles/headings, images/alt text, horizontal clipping/overflow, footer placement, pinned-panel fit and all three workflow states. No material findings.
- **42/42 boundary cases:** Home and Conektra at one pixel below/at/above widths 650, 767, 900, 1150, 1550 and story heights 820, 1400. No material findings.
- Inspected fresh screenshot galleries covering every route and all screen families, including 4K/superwide/5K, plus focused Conektra hero and live-scrolled homepage content. Pinned-story reserved scroll space in a static full-page capture was assessed with focused scrolling and state checks, not treated as missing content.
- **20/20 actual Chrome zoom cases:** Home, Conektra, Contact/footer and an article at 80%, 100%, 125%, 150%, 200%. CSS dimensions were respectively 3200×1540, 2560×1232, 2048×985, 1706×821, 1280×616. No clipping/overflow or footer gap. Short-window normal-flow fallbacks remained accessible.
- **Reduced motion:** Chrome DevTools Rendering emulation confirmed `prefers-reduced-motion: reduce`; Home and Conektra retain accessible stage controls, the story uses normal flow, and no continuous CSS animations remained active. The override was restored to No emulation and DevTools closed.
- Verified real scroll advances Conversation → Booking → Operations; mobile manual selection survives incidental scrolling; keyboard Tab reaches mobile links; Escape closes the menu and restores focus. Portrait-to-landscape resizing without reload passed. Industry switching, service-domain disclosure, contact topic/mailto preparation and production admin browser login passed. No email was sent.
- Production build/TypeScript passed. Frontend: 19 unit checks passed; coverage thresholds passed (89.65% lines, 100% functions). ESLint passed with 0 errors (10 existing warnings). Backend: 54 checks passed in a disposable test database. Production image npm audit: 0 findings; complete frontend dependency tree: 0 high/critical, 16 moderate development-only findings. Fresh production bootstrap, private media-volume writes, secure cookies and authenticated API proxy checks passed.
- Evidence: `output/responsive-qa/2026-11-02-security-release/` (`results.json`, `boundaries/`, `zoom.json`, `reduced-motion.json`, `real-scroll.json`, `interactions.json`, screenshot galleries and focused captures). Deployment evidence: `output/deployment-qa/2026-11-02-security-release/`.
- Browser/OS: Google Chrome via extension on macOS. Matrix viewport emulation used DPR 1; native default was 2560×1232 CSS pixels at DPR 2. Native browser zoom, viewport override and reduced-motion preference were restored; the temporary QA tab was closed.
- Limits: Safari/Firefox, physical phones/tablets, touch hardware and hardware-performance validation were unavailable. The user will deploy on the live server; its DNS, firewall, HTTPS certificate issuance/renewal, integration credentials and off-server backup/restore remain server-side checks, not claims established by this local run.
