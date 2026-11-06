# FreshPath: handover from the design phase (updated 6 Nov 2026)

## Final design decisions
| Topic | Decision |
|---|---|
| Mood board | V4 (Herb Garden + Roboto Serif); V3 kept as previous round |
| Palette | 5 · Herb Garden (lower, softer contrast: calmer, supports instead of shouting) — bg `#F6F4EE`, secondary-container `#CFE3C2`, primary `#24583B`, accent `#F59E0B` |
| Logo | Refill Crate (crate with orange + green apple; shows the actual task) — `assets/*.svg` |
| Typography | 6 · Roboto Serif (titles) + Roboto (body, labels): native to Android, superfamily, fits the build instructions |
| Design system | Google Material 3 via beer.css 5.0.3 (pinned) |
| Icons | Material Symbols (bundled with beer.css) |
| Corners | 8 dp (`small-round`), flat cards (`no-elevate`) |
| Screen | OnePlus 15 (real handheld size, own test device) |
| Navigation | Top tabs, not bottom nav (system buttons are already at the bottom; two navigation levels on one side felt wrong; from the lo-fi sketch) |
| Selection marker | 4 corner diagonals, 4 × 0.5 dp, pulse back and forth 3× on select (subtle but clear focus), still with reduced motion |
| UI direction | A · Store map. B · Task list rejected: loses the store layout. C · Shelf signage rejected: too alarming |

## Files
See `CLAUDE.md` for the full folder map. In short: `AGENTS.md`, `DESIGN.md`, `data/` (8 seed files), `assets/` (logo, app icon), `context/` (prototype 1 material, user tests, user stories, course requirements), `.claude/skills/designlog/`, `designlog/` (logs and screenshots of the build sessions).

## Canvas (all boards)
https://claude.ai/artifact/RVDZYJvbxH8fhjZfBuaJoB
Mood board V3/V4 · Directions A/B/C · palette cards 1–5 · Overview in 5 palettes · typography 15 pairings + 6/15/3 comparison · logo concepts + logo.com results · design system boards 1, 2a, 2b, 2c, 3a, 3b, 4 (900 px wide, A4-ready)

Demo login: `mia@freshpath.demo` / `demo1234` (Employee), `sam@freshpath.demo` / `demo1234` (Manager).

## Consistency check (6 Nov 2026)
- `AGENTS.md` is identical to the course original.
- Prototype 1 (lo-fi) differs from DESIGN.md on purpose: prototype 2 is the hi-fi version.
- **Priority on screens and flow:** user test analysis > breadboard V2. Breadboard V2 is a starting point and gets updated (V3) after prototype 2 is built. DESIGN.md keeps the look and defers to `plan.md` on screens and flow.
- Seed data: displays, map, products and store stay (they match the canvas boards). Plan step 1 extends it: top 5 substitutes, data for the new screens.
- One approved deviation from AGENTS.md: colours set as beer.css CSS variables instead of `ui("theme", …)` (see `context/course-requirements.md`).

## Breadboard V2 vs. the user test "What to change" list
| Change from the tests | In breadboard V2? |
|---|---|
| Confirmation state + updated overview after every action | Yes: "C updated" banner, Confirm goes to Overview |
| Remove/shorten reason screen, skip loading | Yes: loading removed, reason optional |
| Short summary of reasons on top, consistent ratings | Summary yes (fixed template); ratings must be consistent, form still open |
| One route to change a product, one primary button, search | Yes: Edit removed, "Choose my own product" from Alternatives, search |
| Screen after "Suggest display" | Yes: opens Overview with the display highlighted |
| Explain or mark the photo as optional | Yes: "optional, for the manager" |
| Short first-use guide or help | **No**. The tests overrule the breadboard, so it goes into prototype 2; its form is open |

## User stories vs. breadboard V2
| Story | Covered by |
|---|---|
| 1 Displays sorted by urgency | Partly: map shows status; no sorted list. **Open** |
| 2 Planned product and fill | 3 Display detail |
| 3 Top 5 substitutes with reasons | 6 Alternatives, 7 Why this suggestion |
| 4 Correct stock amount | **Not covered. Open** |
| 5 Warning on wrong placement | Partly: cooling / promo warnings in 11 Own choice. **Open** whether "next to another product" is needed |
| 6 How much fits | 8 Recommended amount |
| 7 Manager's focus today | 1 Tasks: manager notes for today |
| 8 Decision logged with reasons | 10 Confirm, 14 My decisions |
| 9 Manager's priority of the day | **Not covered. Open** |
| 10 Notes on dates | 16 New note or task |
| 11 Tasks for future dates | 16 New note or task |
| 12 Review decision log + feedback | 17 Review decisions, 14 My decisions |
| 13 Shared placement rules between managers | **Not covered. Open** (likely out of scope) |

## Open questions for the plan.md session (designer decides)
1. Tab labels and order: breadboard V2 "Profile · Tasks · Overview · Advanced", but the tests point to Profile last (U2) and the label "Storage" (what testers called it).
2. Start screen after login: Tasks (as prototype 1) or Overview.
3. Manager mode: anyone can switch via Profile (demo), or only the manager account.
4. Which uncovered user stories go into prototype 2: 1, 4, 5, 9, 13.
5. Which consistent rating style on the "Why this suggestion" screen (the rating squares confused tester U1).
6. Form of the first-use guide or help (asked by U1 and U3): short tutorial, help/FAQ screen, or tips on the screens.
7. One-tester requests: Storage sorting (U2), tasks shown on the Overview (U2), more colour/images (U1).

## Still open outside the build
1. **Build prototype 2** per `plan.md`. Host on **GitHub Pages** (public repo, Settings → Pages → `main` / root). Relative paths only (`data/…`, `css/…`, `assets/…`, never a leading `/`); hash routing works there.
2. **After building:** heuristic analysis (10 usability heuristics template) with screenshots.
3. **After prototype 2:** update the breadboard to V3 and the user stories to match what was built (keep V1 and V2).
