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

## Latest run — 2026-11-01 legal content and company disclosures

**Status: partial. The 368-case Chrome matrix completed without detected layout defects. Further checks were stopped at the user’s explicit request to finish faster; incomplete checks are listed below and are not claimed as passes.**

- Scope: revise `/legal/terms` and `/legal/privacy` for the actual public company/enquiry flow; publish user-supplied legal entity and owner, approved privacy grievance contact and company copyright; add shared-footer grievance/query links and structured legal name. The user deferred the full registered address. CIN and telephone remain unsupplied. See `frontend/LEGAL_REVIEW.md` for primary legal sources, phased DPDP applicability and remaining operational/disclosure requirements. This is not a certification of statutory compliance.
- Running implementation: http://localhost:13000, updated production build. No deployment or remote push was performed at the time of this report; the Git repository URL is still awaited.
- Fresh evidence: `output/responsive-qa/2026-10-31-legal/`. Earlier evidence is preserved; `previous-design-qa.md` retains the previous latest report.
- **368/368 page/viewport measurements completed:** all 23 required CSS viewports × all 16 public routes. Zero detected horizontal overflow, clipped primary text, missing/broken image, missing alt attribute, footer gap over 1px, over-height pinned shell or duplicate/missing H1. All three product stage controls were exercised for every home/detail viewport. These measurements complement screenshots; they do not alone establish a visual pass.
- **36 boundary cases completed:** home, Contact, Privacy and Terms at 649/650/651, 766/767/768 and 899/900/901px. No detected layout findings. The remaining 1150/1550 width and 820/1400 height cases were not run in this task.
- **68 fresh full-page screenshots collected.** Route galleries were inspected for all 16 routes at 390×844, 768×1024 and 1440×900. Captures for home at all 23 sizes were also generated; individual visual inspection of the remaining home-size boards was not completed. Full-page captures sometimes include raster padding or omit sticky layers; this was not interpreted as actual site whitespace. Focused final Terms, Privacy and grievance screenshots are saved separately.
- Confirmed live Terms → Privacy cross-link, footer grievance URL/contact content and company copyright. No email was sent. See `legal-interactions.json` and subsequent `legal-anchor-final.json`. This interaction check does not replace the unperformed full keyboard/menu/scroll regression suite.
- Final production build passed (58 generated application pages); TypeScript and changed-source lint passed. Existing frontend tests: **15 passed**. Full frontend lint: **0 errors, 11 pre-existing warnings**. Backend tests: **53 passed** using `python -m pytest tests/` in the existing container. Credential-pattern scan of 436 tracked source files found no matching credentials, local `.env`, dependencies or generated output; this is a scoped pattern scan, not a comprehensive security audit.
- Browser: Chrome/macOS. Matrix DPR 1 at exact requested CSS sizes. Viewport override reset and default 2560×1288, DPR 2 re-observed. No zoom, DevTools or media-preference override was introduced during this run. Earlier in-app-browser restoration limitations were not rechecked and remain unconfirmed.
- **Not completed in this run:** native 80/100/125/150/200% zoom matrix; reduced-motion preference emulation; remaining width/height boundaries; focused pinned-state captures/real-scroll regression; full keyboard/mobile-menu regression; every individual home-size gallery inspection. Previous-task passes are not reused as evidence.
- **Unavailable validation:** Safari/Firefox, physical phone/tablet/touch hardware, real external displays and GPU/performance checks. Chrome CSS viewport emulation is not hardware or browser-engine validation.
- Git preparation: whole project is now a root-level `main` repository; the original frontend commit remains in its ancestry and both a metadata copy and original metadata are preserved under ignored `output/git-backups/`. Source, backend, deploy configuration and environment examples are included; dependencies, local secrets and generated evidence are excluded.
