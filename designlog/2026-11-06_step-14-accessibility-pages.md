## Design log — 2026-11-06 — Step 14: Accessibility pass and GitHub Pages
**Session goal:** Make every screen work with the keyboard, at 200% system font and with 48 dp touch targets, and check the refill flow on the GitHub Pages URL.

### Key moments
**Large system font: tabs and rows wrap** · started by the designer (DESIGN.md 3)
- What happened: At 200% font the four tabs pushed the page sideways, and chips, task rows and lists ran off the screen. The tabs now wrap two per row (first version: one per row), and rows and grids wrap instead of overflowing.
- Decision: Applied as written in DESIGN.md and plan.md (nothing cut off, main action still reachable).
- Why: "My app has to meet WCAG 2.2 AA, so it has to work with a large system font." (DESIGN.md 3)
- 🖼️ [before](screenshots/2026-11-06_overview-200pct_before.png) · [first version](screenshots/2026-11-06_overview-200pct_after.png) · [after](screenshots/2026-11-06_overview-200pct_after-2.png)

**Touch targets at least 48 dp** · started by the designer (DESIGN.md 3)
- What happened: The audit found one failure: the profile avatar in the top bar was 40 × 48 dp. It is now 48 × 48 dp. Every other button, link and field was already big enough.
- Decision: Applied as written in DESIGN.md.
- Why: "I want every target at least 48 dp because staff use it one-handed, sometimes with gloves, on a busy shop floor." (DESIGN.md 1 and 3)

**Map scrolls sideways at large font** · started by AI
- What happened: At 200% font the display tiles on the map overlapped and were clipped, because tile sizes are a percentage of a map that stays 380 px wide. I gave the map a minimum width so it scrolls sideways at large font instead of squeezing the tiles. At normal size nothing changes.
- Decision: The designer kept it. Alternatives such as a vertical list of displays at large font were not put to the designer.
- Why: "The map must match the real shop floor, so tiles keep their positions."
- 🖼️ [before](screenshots/2026-11-06_overview-200pct-selected_before.png) · [after](screenshots/2026-11-06_overview-200pct-selected_after-2.png)

**Keyboard and focus** · started by the designer (DESIGN.md 3)
- What happened: No code change needed. A Playwright check with real key presses passed: log in with Enter, Tab to the map, arrow keys move between displays, Enter selects, Tab to "Find alternatives", Enter opens the next screen, and focus lands on the heading after each route change. Esc doesn't break a screen (no dialogs exist, because confirmation is a screen).
- Decision: Applied as written in DESIGN.md.
- Why: "I want everything to work with Tab, Enter, Esc and arrow keys, and focus always visible, because my app has to meet WCAG 2.2 AA." (DESIGN.md 3)

**GitHub Pages check** · started by the designer (plan.md step 14)
- What happened: The repo and Pages were already set up with relative paths. The refill flow and the audits ran against https://mihai-24i.github.io/freshpath-prototype/ before and after the push, with the same results as locally.
- Decision: Applied as written in plan.md.
- Why: "The prototype has to run on a real URL for the final submission, a good practice."

### AI suggestions not used
- None this step. No options were put to the designer.

### Who did what
- **AI:** wrote the audit and keyboard check scripts, found the failures, fixed the CSS and map, took the screenshots, ran the checks locally and on Pages, committed after approval (`280a27f`).
- **Designer:** set the accessibility rules (DESIGN.md 3), the step's done-when check, the Pages setup, and approved the commit.
- **Not checked:** the refill flow on the designer's phone, real Android font scale, TalkBack.
