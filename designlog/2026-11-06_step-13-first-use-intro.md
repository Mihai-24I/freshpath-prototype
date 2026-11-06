## Design log — 2026-11-06 — Step 13: First-use intro
**Session goal:** Build screen 19 (the 3-card intro after a first login) and a "Replay intro" button in Profile.

### Key moments
**Three short cards, skippable, replay from Profile** · started by the designer (plan.md decision 6)
- What happened: After a first login the employee sees 3 cards, one at a time: "See what needs you", "Find a substitute", "Know why". Each has one icon and one or two sentences from `data/intro.json`. Profile gets an outlined "Replay intro" button.
- Decision: Applied as written in plan.md.
- Why: "Testers asked for a short first-use guide, and not many people like reading, so it's 3 short cards." (plan.md, decision 6 and screen 19)
- 🖼️ [before](screenshots/2026-11-06_profile_before-2.png) · [after](screenshots/2026-11-06_profile_after-2.png)

**One filled button, Skip as text** · started by the designer (DESIGN.md 6.1)
- What happened: "Next" (and "Start" on the last card) is the only filled button. "Skip" is a text button next to it.
- Decision: Applied as written in DESIGN.md and plan.md.
- Why: "I want one main action per view, and the primary and secondary buttons never look the same, because testers asked for a primary and a secondary button." (DESIGN.md 6.1)
- 🖼️ [after](screenshots/2026-11-06_intro-1_after-2.png)

**Progress shown by dots and words** · started by the designer (DESIGN.md 3)
- What happened: The step is shown by three dots (filled = current) and the text "1 of 3", so the dots are never the only signal.
- Decision: Applied as written in DESIGN.md.
- Why: "My app has to meet WCAG 2.2 AA, so something is never shown by colour alone." (DESIGN.md 3)
- 🖼️ [after](screenshots/2026-11-06_intro-3_after-2.png)

**Main button moved to the lower half** · started by the designer (DESIGN.md 5)
- What happened: In the first screenshot the card and the Next button sat at the top of the screen. I made the screen full height so the card is centred and the buttons are at the bottom.
- Decision: Applied as written in DESIGN.md.
- Why: "I want the one main action in the lower half of the screen, where my thumb can reach it." (DESIGN.md 5)
- 🖼️ [first version](screenshots/2026-11-06_intro-1_after.png) · [after](screenshots/2026-11-06_intro-1_after-2.png)

**Defaults where plan.md was silent** · started by AI
- What happened: Only employees get the intro automatically; Sam goes straight to Team, but can replay it from Profile. Skip counts as "seen". The cards have no Back button. The tabs are hidden while the intro shows. The "seen" state is stored per user and cleared by Reset demo data. I chose these because plan.md didn't say; I then asked the designer for the reasons.
- Decision: The designer kept all four.
- Why:
  - Employees only: "The cards explain the employee's job, not the manager's. The focus is on low-experienced fresh department employees."
  - Skip counts as seen: "They can always get it back from Profile. The skip was a choice."
  - No Back button: "Fewer buttons keeps it simpler for the user."
  - No tabs: "The intro is a guide, not a place where the user needs to navigate. A new user must focus on the guide itself."
- 🖼️ [after](screenshots/2026-11-06_intro-3_after-2.png)

### AI suggestions not used
- None this step. No options were put to the designer.

### Who did what
- **AI:** built the intro screen, the "seen" storage, the login redirect and the Replay button; chose the defaults above; ran the done-when check with Playwright (all items pass); took the screenshots.
- **Designer:** set the intro's size and content (plan.md), the button hierarchy, the accessibility rule and the thumb-reach rule (DESIGN.md); approved the commit.
