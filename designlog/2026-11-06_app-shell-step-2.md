## Design log — 2026-11-06 — FreshPath prototype 2, step 2: app shell
**Session goal:** Build plan.md step 2 (app shell, Herb Garden theme, router, data layer, four placeholder tabs) and check it against the step's "done when" list.

### Key moments
**Tabs moved into the header** · started by AI
- What happened: First build had the tab bar as a sibling of `<main>`. beer.css turns any element containing `<main>` into a 3-column grid, so the page collapsed into a 38 px column and only one tab showed. The AI moved the tabs inside `<header>` and switched them from `nav.tabs` to `div.tabs` (as DESIGN.md 5 describes). All four tabs now fit at 412 px.
- Decision: Technical fix to match DESIGN.md; the designer did not weigh in.
- Why: n/a (bug fix, no design direction change)
- 🖼️ [after](screenshots/2026-11-06_shell_after.png) · [Tasks tab](screenshots/2026-11-06_shell-tasks_after.png). No "before": the screen did not exist. The two broken screenshots from the first attempt were moved to the Recycle Bin so they don't mislead.

**Commit held back** · started by designer
- What happened: The AI offered to commit and push step 2. The designer answered "Not yet".
- Decision: Step 2 stays uncommitted in the working tree.
- Why: "wanted to explore for my self the things done."

### AI suggestions not used
- None.

### Who did what
- **AI:** Wrote `index.html`, `css/app.css`, `js/app.js`, `js/router.js`, `js/data.js` and four placeholder views; debugged the layout; ran the done-when check in Chromium; took the screenshots; ticked step 2 in plan.md.
- **Designer:** Set the step and its "done when" check through plan.md; held the commit.
