## Design log — 6 Nov 2026 — FreshPath prototype 2, step 5: Display detail and Report problem
**Session goal:** Build plan.md step 5: screen 3 (Display detail) and screen 4 (Report problem), up to a placeholder Alternatives screen.

### Key moments
**Detail screen cut down to keep the main button on screen** · started by designer (DESIGN.md), applied by AI
- What happened: the first build listed on display, in storage and capacity as three stacked rows. At 412 × 780 the "Find alternatives" button sat below the fold. The AI put the three numbers side by side, did the same for expected sales and last refill, and tightened the header block. The button now ends at about 778 dp.
- Decision: kept.
- Why: "The main action has to always be visible. If the button is below the fold, the screen isn't readable at a glance." (DESIGN.md 2)
- 🖼️ [after](screenshots/2026-11-06_detail-low_after-4.png) · also [Empty](screenshots/2026-11-06_detail-empty_after-4.png) and [OK, no button](screenshots/2026-11-06_detail-ok_after-4.png). No "before" shot: the screen is new.

**Selected reason chip: different look** · started by designer (DESIGN.md), applied by AI
- What happened: with beer.css `fill`, a selected reason chip looked greyed out, like a disabled button. The AI changed a selected chip to the `secondary-container` fill with a `check` icon, so selection never relies on colour alone.
- Decision: kept.
- Why: "I never want colour to be the only signal. A selected state needs an icon too, like every status has a word and an icon." (DESIGN.md 3)
- 🖼️ [reason selected](screenshots/2026-11-06_problem-selected_after-3.png) · [nothing selected](screenshots/2026-11-06_problem_after-3.png)

**Back link was untappable** · started by AI
- What happened: the automated check could not click "Back". The class `back` that the AI used already exists in beer.css with `z-index:-10`, which hid the link behind its container. The AI renamed it `go-back`. This was found by testing, not by looking at screenshots.
- Decision: fixed; no design change.
- Why: not a design decision.

### AI suggestions not used
- None worth mentioning; the designer rejected nothing this session.

### Who did what
- **AI:** read plan.md and the code, built screens 3 and 4 and the placeholder route, applied the DESIGN.md rules in a compact detail layout and a selected-chip style, ran the Playwright check (27 of 27 passed), took the screenshots, committed and pushed (`7b6eec7`).
- **Designer:** decided the step and its "done when" check beforehand (plan.md), started the session with step 5, approved the commit message, and asked for the push. They did not change direction during this session.
