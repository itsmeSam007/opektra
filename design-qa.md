# Opektra frontend design QA — scope and protocol

This root file contains the frontend QA rules and latest run report. **Scale verification to the change.** The user does not want the complete screen-size matrix repeatedly run for small edits. A copy/link removal needs a focused check of the affected component/page and fresh evidence. Use the full matrix for substantial layout, styling, animation or dependency changes, or an explicit user request. Root `AGENTS.md` and `frontend/AGENTS.md` follow this scope. Preserve the rules when replacing the latest run results.

## 1. What a screen-size check means

Test **CSS viewport width AND height**, not just device names or physical inches. Physical monitor size alone does not determine browser layout: resolution, OS scaling, browser chrome, zoom and orientation change the usable viewport.

The cases below represent phones, tablets, laptops, MacBook-class scaled workspaces, common 24–32 inch monitor resolutions, and larger/ultrawide displays. They are **representative logical viewports**, not claims about any particular device’s factory default. QHD/4K/5K cases include large unscaled browser areas; scaled 4K displays are also represented by smaller logical viewports. Do not stretch the content column to the full width of a 4K/ultrawide monitor.

## 2. Required screen × route matrix

When a full run is warranted, run every route below at every required viewport after the final code change. Small copy/link edits do not require a full run. New public routes must be added here when introduced. A current full run contains 23 viewports × 16 routes = 368 page/viewport checks.

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

## 3. Checks within the selected scope

1. Navigate to the actual running page and confirm the expected route, title and primary heading. Build success, HTTP 200 and a DOM-only check do not replace visual inspection.
2. Check horizontal overflow, offscreen/truncated primary text, broken wrapping, distorted or missing images and console errors. Ignore intentional decorative perspective only when it does not hide meaningful copy or controls.
3. Inspect header/nav, hero/content, product panels, company approach, blog cards/articles, contact band and footer. Scroll through the entire page. Reveal animations must finish before taking evidence; a full-page capture of unrevealed sections is not a valid blank-section finding or a passing screenshot.
4. Verify the footer reaches at least the viewport bottom on short pages and follows content on long pages. Allow <=1 CSS px rounding. No fixed-position footer over content, overlaps, cropped content or empty area below the final footer.
5. Check type hierarchy, readable body copy, line length, contrast, spacing rhythm, transparent logo edges, image sharpness/crop and software engineering brand character. Only the logo uses liquid-crystal material; no decorative watery artwork.
6. A pinned story must fit between the sticky header and viewport bottom. Check all three workflow states. Short screens, very tall screens and reduced-motion mode use normal-flow content with accessible stage controls. Never hide an inaccessible panel to suppress overflow.
7. Verify mobile menu, links, CTAs, internal product/article navigation, and the confirmed `mailto:` action. Do not send an email during tests. Future products must render from the product collection, not invented placeholders.
8. Check keyboard navigation, visible focus, menu state, accessible control names/pressed states and image alt text. Aim for 44px touch targets for primary controls; isolated controls must have a usable target area.

## 4. Zoom, motion and browser settings

Apply these checks during a full run or when the changed behaviour makes them relevant; do not repeat the full zoom/motion suite for an unrelated copy/link removal.

- In a real browser, test 80%, 100%, 125%, 150% and 200% zoom. At minimum check home/product story, Contact/footer and an article. Confirm reflow, navigation access and no footer gap. Record actual CSS dimensions, because zoom changes the viewport.
- Exercise `prefers-reduced-motion: reduce` using browser emulation or a real preference when available. Continuous movement/pinning must stop; all content and stage controls must remain accessible. Record the preference used and restore it. If preference emulation is unavailable, clearly mark it untested instead of claiming a simulated pass.
- Check the pinned workflow with real scroll plus manual stage selection. Verify normal-flow/mobile stage selection does not reset on incidental scrolling.
- Test around all affected breakpoints and resize between portrait/landscape without reloading at least once.
- Record browser engine, OS and device-pixel ratio. Use additional available engines for release validation where possible; a Chrome viewport test does not prove Safari/Firefox or actual iPhone/iPad behaviour.
- If browser controls, real devices, another engine, touch hardware or preferences are unavailable, document the exact limit. Never present emulation as physical hardware/performance testing.
- Restore browser viewport, zoom, DevTools/media settings and any other temporary preferences after the run.

## 5. Evidence, fixes and handoff gate

- Save a distinct run folder under `output/responsive-qa/`, with configuration, measurements and screenshots. Preserve earlier evidence when recording a regression fix.
- For a full run, collect matrix measurements and inspect galleries covering **each screen family and each route**, plus focused/native-resolution screenshots for risky states. For a small edit, inspect the changed component/page and save focused evidence. Screen captures must have the expected CSS dimensions; use full-page capture and aligned crops if the browser’s viewport-capture pipeline mis-scales a large emulated canvas. Do not treat capture padding as site whitespace.
- Put target/current or before/after evidence together for material visual findings. Fix P0/P1/P2 issues, recapture them and recheck the affected scope; rerun the full matrix only when the scope warrants it. Do not endlessly iterate on P3 polish.
- Run the production build/type check for implementation changes, existing unit checks when relevant, and lint for changed code. Do not add tests that merely mirror CSS declarations. Browser layout/interaction checks are the evidence for visual CSS changes.
- Record the final result as `passed`, `partial` or `blocked`, with route/screen counts, findings, fixes, tests and limitations. A previous task’s result is never a pass for a new change. Do not claim every physical device/browser is supported based on this matrix.
- Before completing a frontend task, update the latest report below and include a concise user-facing result with visible screenshot evidence. Required unavailable checks remain named limitations. Material unresolved layout or interaction defects block a passing handoff.

---

## Latest run — 2026-11-03 About page CEO Vision

**Status: passed for focused About page layout/build checks; native preference emulation remains unverified.**

- Implemented the approved CEO Vision section after the company introduction and before engineering principles. Added the approved statement, Soumen Karmakar attribution and Founder & CEO designation.
- Used the supplied original portrait, unchanged, in a rounded 4:5 frame with a CSS crop. Desktop places the photo beside the statement; mobile/tablet stack the portrait above the copy. Image optimization, responsive sizes, lazy loading and descriptive alt text are provided through Next Image.
- Kept styling scoped to the new section. Subtle paragraph/portrait reveals reuse the existing shared Reveal component, including its reduced-motion branch; there is no new continuous animation or scroll pinning.
- Focused on `/about`, following the user's request not to repeat the complete site-wide matrix. Checked 1440×900, 1280×720, 390×844, 320×568, 844×390, 820×1180 and the 899/900/901px stacking boundary at 900px height. All nine cases loaded the portrait and all three paragraphs without horizontal overflow, clipped copy or a footer gap.
- Inspected fresh desktop and mobile screenshots for face crop, name/designation, readable copy, spacing and image/text order. Scrolled the complete About page, including the sections following the new content. Browser console errors: 0.
- Production build and TypeScript compilation passed. ESLint for the changed About page and CEO component passed. Git whitespace checks passed. No new unit tests were added for presentational content.
- Evidence: `output/responsive-qa/2026-11-03-ceo-vision/` includes `desktop.png`, `mobile.png`, `checks.json`, `console-errors.json`, `restored.json` and this run's previous report.
- Chrome on macOS; focused viewport emulation used DPR 1. Restored natural viewport: 2504×1232 CSS pixels, DPR 2. Temporary viewport overrides were reset; the About preview was left open for review.
- Limits: full-site matrix, other browser engines, physical devices and native zoom checks were not run for this localized section. Native control was interrupted while attempting preference emulation, so no reduced-motion preference pass is claimed. No motion preference override was applied and no DevTools panel was left open.
