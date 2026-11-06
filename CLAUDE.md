# FreshPath: prototype 2 (start here)

FreshPath is a handheld app for new fruit and vegetable employees in a supermarket. It helps them refill a low or empty promo display with a good substitute, and explains why. This folder holds everything needed to plan and build **prototype 2** (hi-fi, beer.css).

## Read first
@AGENTS.md
@DESIGN.md

- `AGENTS.md`: how to build (course file, don't change it).
- `DESIGN.md`: how it looks and behaves.
- `HANDOVER.md`: design decisions with the designer's reasons, and open questions.
- `context/prototype-1/`:
  - `FreshPath_Breadboards.pdf`: page 1 is V1 (prototype 1 as tested), page 2 is V2 (after the user tests; the starting point for prototype 2, overruled by the user tests).
  - `user-tests.md`: analysis of the 5 user tests, with "What to change for the next prototype". **Highest priority for screens and flow.**
  - `user-stories.md`: 13 user stories (employee + manager).
  - `lo-fi_prototype.pdf`: the 12 lo-fi screens used in the tests.
- `context/course-requirements.md`: what the course slides ask for prototype 2.
- Canvas with all style guide boards: https://claude.ai/artifact/RVDZYJvbxH8fhjZfBuaJoB

**Which source wins:**
- Technique: `AGENTS.md`.
- Look, components and tone: `DESIGN.md`.
- Screens and flow: `plan.md`, built from the **user test analysis first**, which overrules **breadboard V2**. The breadboard is updated to V3 after prototype 2 is built, so don't treat it as fixed.
- Prototype 1 is the lo-fi starting point: prototype 2 is meant to look different.

## How to work in this folder
1. The designer starts each build session with `/designlog` (skill in `.claude/skills/designlog/`).
2. First session: make `plan.md` (screens, flow, data to add, build steps) from the user tests first, then breadboard V2 and the user stories. Resolve the open questions in `HANDOVER.md` with the designer first.
3. Then build one `plan.md` step per chat (course tip to save tokens). Tick off steps in `plan.md`.
4. **When something is unclear, ask with the pop-up question tool** (AskUserQuestion: up to 4 options + "Other"), never as an open question in chat and never by guessing. Put the recommended option first. Group up to 4 questions in one pop-up.
5. Test locally with the static server in the sibling folder `../freshpath-tools` (`node ../freshpath-tools/serve.js` → http://localhost:8000; Python is not installed), since `fetch()` doesn't work on `file://`.
6. Hosting: GitHub Pages. Use relative paths only (`data/…`, `css/…`, `assets/…`, never a leading `/`).

## Design log: the agent does the work, not the designer
The designer loads `/designlog` (skill in `.claude/skills/designlog/`). On top of that skill, in this project:
- **Screenshots, taken by the agent.** Whenever a screen visibly changes, take a screenshot of the running prototype **before** the change and **after** it, so the log never needs a "🖼️ add" line.
  - Use Playwright with Chromium, viewport **412 × 898** (OnePlus 15), `deviceScaleFactor: 2`, against the local static server. Both are installed in `../freshpath-tools` (kept outside this folder so the prototype stays npm-free): `node ../freshpath-tools/shot.js <route> <screen> <before|after|check> [options]`. Write the route without `#/` (`tasks`, `overview/d-c`, `""` for Overview): Git Bash rewrites `"#/tasks"` into a Windows path.
    - `--set key=value` puts a `localStorage` entry in place before the page loads (e.g. `--set app:session=u1` for Mia, `u2` for Sam).
    - For screens or states reached only by tapping (refill steps, snackbar, a selected tile, an open row), add actions; they run in order after the page loads: `--click <selector>`, `--fill <selector> <text>`, `--press <key>`, `--wait-for <selector>`. Use role selectors for buttons (`"role=button[name='Log in']"`): `text=` also matches words inside longer text.
    - `--height 780` (phone minus browser bars), `--reduced-motion`, `--wait <ms>`, `--full`. Kind `check` with `--out <path>` saves a test shot outside `designlog/` (e.g. the scratchpad) for checks that don't belong in the log.
  - Save to `designlog/screenshots/` as `YYYY-MM-DD_<screen>_<before|after>.png` (add `-2`, `-3` for more rounds). Never overwrite an older screenshot. `shot.js` does the naming and numbering.
  - In the log, link them as `🖼️ [before](screenshots/…png) · [after](screenshots/…png)`.
  - If `../freshpath-tools` is missing, ask once with the pop-up tool how to proceed (reinstall it, or skip screenshots this session).
- **Reasons, asked at the moment.** When the designer changes direction without saying why, ask right away with the pop-up tool (likely reasons as options + "Other"). Log exactly what they pick or write. Never invent a reason; only use `✍️` if they chose to skip.
- **Choices already in DESIGN.md are the designer's.** When a change follows something `DESIGN.md` states (a principle, token, component rule or don't), log it as started by the designer and don't mark it ✍️. The AI only applied it. If `DESIGN.md` gives the reason, write it in the "Why" line as the designer's own answer: first person, plain and short, as if typed in reply to the question "why?", in the present tense ("I want…", "it has to…"), not a quote. End with the section in brackets, e.g. `(DESIGN.md 3)`. Choices that `DESIGN.md` doesn't cover stay as they are: credit whoever started them and ask for the reason.
- **Saving the log.** When the designer asks for the log, also save it as `designlog/YYYY-MM-DD_<topic>.md`. One file per build step (or per session when no step is built); never edit an earlier log file.
  - **Next step in the same session** (a follow-up prompt such as "Step: 6"): when the designer asks for the log, log only what happened since the last saved log, and save it as a new file named after that step (e.g. `designlog/YYYY-MM-DD_step-6-<topic>.md`). Don't repeat moments from an earlier step's log.

