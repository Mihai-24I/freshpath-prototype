## Design log — 2026-11-06 — FreshPath prototype 2, step 4: Overview
**Session goal:** Build the Overview screen from `plan.md` step 4: store map, display tiles, count chips, display card, selection marker, all-OK state.

### Key moments
**Plan followed as written** · started by designer
- What happened: The designer gave the build instruction (`plan.md` step 4 with its "done when" check). The screen, the status colours, the selection marker and the chips all come from `plan.md` and `DESIGN.md`. No direction changed during the session.
- Decision: Built as specified; designer approved the commit and push.
- Why: n/a (no change of direction)
- 🖼️ [before](screenshots/2026-11-06_overview_before.png) · [after](screenshots/2026-11-06_overview_after-2.png) · [C selected](screenshots/2026-11-06_overview-selected_after.png) · [deep link to E](screenshots/2026-11-06_overview-deeplink_after.png) · [Empty filter](screenshots/2026-11-06_overview-filter_after.png)

**Buttons made 8 dp instead of pills (all screens)** · started by AI
- What happened: The first render showed pill buttons. beer.css 5.0.3 forces the pill shape, so `small-round` did nothing. I added one global rule in `app.css` that sets buttons and chips to 8 dp, as DESIGN 4.3 asks. This also changes the Login and Profile buttons from step 3.
- Decision: Kept. The designer did not comment on it before approving the commit.
- Why: Designer chose: "8 dp buttons because DESIGN.md says so."
- 🖼️ [Overview after](screenshots/2026-11-06_overview_after-2.png) (the Profile and Login shots from step 3 show the old pills)

**Empty state before a display is tapped** · started by AI
- What happened: `plan.md` doesn't say what the card area shows when nothing is selected. I chose a plain card saying "Tap a display to see its stock." instead of preselecting the Low display.
- Decision: Kept; the designer did not comment.
- Why: Designer chose: "hint kept because it is calm and clear."
- 🖼️ [after](screenshots/2026-11-06_overview_after-2.png)

### AI suggestions not used
- Preselecting display C on load: skipped, because the marker would pulse before the user did anything.
- Dimming non-matching tiles when a chip is tapped: skipped for low contrast, so those tiles are hidden instead.

### Who did what
- **AI:** Built the tile and map components, the Overview view, the status rule and the route. Took the before and after screenshots, ran the "done when" check in Playwright, and worked around the beer.css bugs (pill buttons, card padding).
- **Designer:** Set the step, the visual rules (Herb Garden status colours, selection marker, touch targets) and the screens in `plan.md` and `DESIGN.md`. Approved the commit and push.
