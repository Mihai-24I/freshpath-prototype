## Design log — 6 Nov 2026 — FreshPath prototype 2, step 10: Tasks and My decisions
**Session goal:** Build plan.md step 10: screen 1 (Tasks) and screen 14 (My decisions).

### Key moments
**Manager notes on top of Tasks, with the priority of the day as a note** · started by designer (plan.md), applied by AI
- What happened: Tasks opens with "Manager notes for today" (Priority of the day, Strawberry delivery is late), then today's tasks, then "Coming up". There is no separate priority setting.
- Decision: kept.
- Why: "A manager's priority can be communicated via text posted in the notes section." (plan.md, user story 9)
- 🖼️ before: [placeholder](screenshots/2026-11-06_tasks_before.png) · after: [Tasks](screenshots/2026-11-06_tasks_after-2.png)

**Ticking a task gives a snackbar with Undo** · started by designer (DESIGN.md), applied by AI
- What happened: ticking "Check bananas on display B" shows "Task done" with Undo, and the row moves to the bottom, struck through. Undo brings it back at once.
- Decision: kept.
- Why: "Every save has to end with a visible confirmation, because testers didn't know whether an action had worked." (DESIGN.md 6.8)
- 🖼️ [ticked, snackbar](screenshots/2026-11-06_tasks-ticked_after-2.png)

**"Open" on a refill task goes to the Overview with the display selected** · started by designer (plan.md), applied by AI
- What happened: "Open" on Refill display C lands on the map with C selected and its card showing. It shows only on open refill tasks (C, E, H).
- Decision: kept.
- Why: "Testers who started in the task list had to be pointed to the map, so a task takes you to it." (U1, U4, plan.md decision 2)
- 🖼️ [Open buttons on the C, E and H tasks](screenshots/2026-11-06_tasks_after-2.png)

**Feedback shown on each decision, or "No feedback yet"** · started by designer (plan.md), applied by AI
- What happened: each card shows the old → new product, amount, problem, reasons (or my own reason), note, a "Photo added" flag and a green feedback box from Sam Bakker. A decision without feedback says "No feedback yet". The decision from step 9 sits on top.
- Decision: kept.
- Why: "It builds confidence: I don't have to fear their reaction." (plan.md, story 12, principle 3)
- 🖼️ [seeded decisions](screenshots/2026-11-06_decisions_after.png) · [new decision on top](screenshots/2026-11-06_decisions-new_after-2.png)

**Unticking a done task is allowed, with Undo** · started by AI
- What happened: plan.md only describes ticking. The AI let a done task be unticked (snackbar "Task reopened" with Undo).
- Decision: kept (designer didn't change it).
- Why: "I think you must be able to fix a mistaken tick."

**"Coming up" items have no checkbox** · started by AI
- What happened: later tasks and notes are plain lines with an icon and the date. Plan.md doesn't say whether they can be ticked.
- Decision: kept.
- Why: "The daily routines and tasks are organized by days for this exact reason. Everything should go as planned."
- 🖼️ [Coming up](screenshots/2026-11-06_tasks_after-2.png)

**"Problem:" line on each decision card** · started by AI
- What happened: the problem chosen on the Report problem screen (e.g. "Sold faster than expected") is saved with the decision. The AI shows it as a small line, though plan.md's card list doesn't name it.
- Decision: kept.
- Why: "The problem is there to explain why the product was swapped, next to the reasons. It is part of the explanation."
- 🖼️ [decision cards](screenshots/2026-11-06_decisions_after.png)

### AI suggestions not used
- None worth mentioning; the designer rejected nothing this step.

### Who did what
- **AI:** built both screens, the `/decisions` route (Employee only) and the date helpers; fixed task titles and details sitting side by side; took the screenshots; ran the done-when check (all items passed, no console errors, tap targets at least 48 dp); committed and pushed (`61b668c`).
- **Designer:** set the screens, the notes-as-priority rule, the Open flow and the feedback idea through plan.md and DESIGN.md; approved the commit from the pop-up question.
