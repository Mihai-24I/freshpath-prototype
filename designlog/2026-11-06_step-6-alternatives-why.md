## Design log — 6 Nov 2026 — FreshPath prototype 2, step 6: Alternatives and Why this suggestion
**Session goal:** Build plan.md step 6: screen 6 (Alternatives), screen 7 (Why this suggestion) and the no-substitute state with Report to manager.

### Key moments
**"Use" and "See other options" stay on screen on the Why screen** · started by designer (DESIGN.md), applied by AI
- What happened: with 7 factor rows, "Use mangoes" ended up far below the fold. The AI put both buttons in a bar that stays at the bottom of the screen while the factors scroll. At 412 × 780 the bar is fully visible.
- Decision: kept.
- Why: "The main action has to always be visible, even when the page is long." (DESIGN.md 2)
- 🖼️ [top of the screen](screenshots/2026-11-06_why-mango_after-2.png) · [with a row expanded](screenshots/2026-11-06_why-mango-open_after-2.png) · [a risk-heavy one](screenshots/2026-11-06_why-pineapple_after-2.png)

**Risks as tags, not blockers, on the substitute cards** · started by designer (DESIGN.md), applied by AI
- What happened: waste risk ("Sell within 2 days") and "Not in promo" show as accent-coloured tags on the card, and every card stays tappable. The AI left these risks out of the reason lines so they aren't said twice. Pineapples (not in the promo) stay in the list.
- Decision: kept.
- Why: "A waste risk is a warning, not a mistake. I flag it early in the accent colour and never block the action." (DESIGN.md 2)
- 🖼️ before (placeholder): [Alternatives C](screenshots/2026-11-06_alternatives-c_before.png) · after: [C](screenshots/2026-11-06_alternatives-c_after.png) · [E](screenshots/2026-11-06_alternatives-e_after.png)

**Report to manager shows a confirmation with Undo** · started by designer (plan.md, DESIGN.md), applied by AI
- What happened: on H (no substitute in stock) "Report to manager" creates a task for Sam, returns to the Overview with H still Empty, and shows "Reported to manager" with Undo. Undo removes the task.
- Decision: kept.
- Why: "Every action has to end with a visible confirmation, because testers didn't know whether it had worked." (DESIGN.md 6.8)
- 🖼️ [no substitute on H](screenshots/2026-11-06_alternatives-h_after.png) · [Overview + snackbar](screenshots/2026-11-06_report-snackbar_after.png)

**"Room for 31 pcs" instead of "35 pcs space"** · started by AI
- What happened: plan.md says "Ranked for this afternoon · 35 pcs space". The AI showed the free room (capacity minus what is on display, 35 − 4 = 31) instead of the capacity.
- Decision: kept.
- Why: "because free room is what matters for a refill."

### AI suggestions not used
- None worth mentioning; the designer rejected nothing this session.

### Who did what
- **AI:** read plan.md and the data, added `availableSubstitutes()`, built the Alternatives and Why views and the Report to manager flow, chose the sticky action bar and the tag/reason split, ran the Playwright check (28 of 28 passed), took the screenshots, committed and pushed (`17bf6f2`).
- **Designer:** set the step, the screen content and the "done when" check in plan.md, and DESIGN.md rules the choices above follow; approved the commit message and asked for the push. They did not change direction during this step.
