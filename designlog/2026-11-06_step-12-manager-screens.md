## Design log — 2026-11-06 — Step 12: Manager screens
**Session goal:** Build screens 15 (Team), 16 (New note or task) and 17 (Review decisions), so the manager's notes, tasks and feedback show up for the employee.

### Key moments
**Team replaces Tasks for the manager** · started by the designer (plan.md)
- What happened: Sam's second tab reads "Team" and opens the manager home with today's decisions, open tasks (including "Report to manager" items) and today's notes. I only built what plan.md describes.
- Decision: Applied as written in plan.md.
- Why: "A manager's job is reviewing the team, not doing shift tasks." (plan.md, Flow)
- 🖼️ [before](screenshots/2026-11-06_team_before.png) · [after](screenshots/2026-11-06_team_after-2.png)

**One main action per screen, tonal "Send feedback"** · started by the designer (DESIGN.md 6.1)
- What happened: On Team, "New note or task" is the filled button and "Review decisions" is outlined. On Review decisions, each card has a filled-tonal "Send feedback" and the screen has no filled button.
- Decision: Applied as written in DESIGN.md and plan.md.
- Why: "I want one main action per view, and the primary and secondary buttons never look the same, because testers asked for a primary and a secondary button." (DESIGN.md 6.1)
- 🖼️ [after](screenshots/2026-11-06_manager-decisions_after-2.png)

**Every save ends with a snackbar and Undo** · started by the designer (DESIGN.md 6.8)
- What happened: Saving a note or task shows "Note saved for Tue 27 Oct" with Undo. Sending feedback shows "Feedback sent to Mia" with Undo. Plan.md named the messages but not Undo, so I added it to match the other saves.
- Decision: Applied DESIGN.md.
- Why: "I want every save to end with a visible confirmation, because testers didn't know whether an action had worked." (DESIGN.md 6.8)
- 🖼️ [after](screenshots/2026-11-06_manager-decisions_after-2.png)

**Feedback status has an icon and a word** · started by the designer (DESIGN.md 3)
- What happened: Decisions on Team carry "No feedback yet" (`schedule`) or "Feedback sent" (`check_circle`), never colour alone.
- Decision: Applied as written in DESIGN.md.
- Why: "My app has to meet WCAG 2.2 AA, so a status is never shown by colour alone." (DESIGN.md 3)
- 🖼️ [after](screenshots/2026-11-06_team_after-2.png)

**Defaults where plan.md was silent** · started by AI
- What happened: "For" starts on Everyone. A note's title is "Note from Sam" with the typed text as the body, a task's title is the text. Team's tasks are read-only. Review decisions lists today's decisions only. I chose these because plan.md didn't say; I then asked the designer for the reasons.
- Decision: The designer kept all four.
- Why:
  - Everyone as default: "The priority of the day is meant for everyone on shift."
  - Read-only tasks on Team: "Team is for reviewing."
  - Today's decisions only: "It's easier for the reviewer, and it motivates me to review the decisions the same day."
  - "Note from Sam" as title: "It shows who wrote it."
- 🖼️ [after](screenshots/2026-11-06_manager-new_after-2.png)

**Shared decision card** · started by AI
- What happened: My decisions and Review decisions use one decision card in `js/decision-card.js`, with the manager wording ("Mia's reason") switched on by a parameter.
- Decision: Done without being asked. Mia's My decisions looks the same as before.
- Why: AI's reason: two copies of the same markup would drift apart.

**Form fixes after the first screenshots** · started by AI
- What happened: In the first screenshots the text areas were one line tall and the "Send feedback" button ran past the card's right edge. I set the text areas to 4 rows and fixed the button width.
- Decision: Done by AI without being asked.
- Why: AI's reason: a feedback field should fit a sentence or two, and nothing may overflow at 412 dp.
- 🖼️ [first version](screenshots/2026-11-06_manager-decisions_after.png) · [after](screenshots/2026-11-06_manager-decisions_after-2.png)

### AI suggestions not used
- None this step. No options were put to the designer.

### Who did what
- **AI:** built the three screens, the shared decision card and the routes; chose the defaults above; ran the done-when check with Playwright (all items pass); took the screenshots.
- **Designer:** set the manager flow and tab (plan.md), the button hierarchy, the snackbar rule and the accessibility rule (DESIGN.md); approved the commit.
