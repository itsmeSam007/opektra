# Opektra workspace rules

## Frontend changes

- Before any frontend implementation, styling, content-layout, dependency or animation change, read `design-qa.md` and `frontend/AGENTS.md`.
- The responsive QA protocol in root `design-qa.md` is a required handoff gate for every frontend task. Run its screen/route matrix, inspect screenshots, exercise the affected interactions and record fresh evidence after the final code change. A previous task's passing report is not evidence for a new change.
- Check viewport height as well as width. In particular, test short laptop windows, phone/tablet landscape, tall monitors, ultrawide displays, zoom/reflow and the short-page footer.
- Fix material clipping, overlap, overflow, unreachable controls and broken navigation before handoff. Recheck the affected cases and rerun the required matrix after a layout fix.
- Save evidence under `output/responsive-qa/` with distinct run folders, and update the latest result section in root `design-qa.md`. Preserve the permanent rules when updating results.
- Report unavailable browser/device/preference checks explicitly. CSS viewport emulation is not physical-device, browser-engine or hardware-performance validation. Do not claim that unperformed checks passed.
- Restore temporary browser viewport, zoom, developer-tools and preference overrides after verification.
