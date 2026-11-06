# Course requirements for prototype 2 (from the Workshop 6 and 7 slides)

Only what the slides say. The rubric for the build phase was not shared in this session; check it yourself.

- **HiFi prototype with beer.css** (Workshop 6, "HiFi Prototyping"): Material design via beer.css, plain HTML / CSS / JS (slide "Single Page Frameworks → HTML CSS JS").
- **AGENTS.md** is the course file and is used unchanged (checked: identical to the original).
- **DESIGN.md** is made from your own style guide. Teacher's prompt: "We don't use tokens in YAML, design tokens should come from CSS variables directly."
- **Design system layers** (Workshop 7): Principles & Standards, Foundations, Components & Layout, Patterns. All four are in DESIGN.md.
- **Designlog skill** (Workshop 7): load it with `/designlog` in each prototype 2 and 3 build session; ask for the log at the end.
- **10 usability heuristics** (Workshop 7): heuristic analysis of the built prototype.
- **Save tokens** (Workshop 7 tips):
  - Write the plan in an `.md` file with steps, then do each step in a new chat.
  - Wrap up a chat before a break: "Please wrap up this conversation. What was done, what is still open and what I can continue with."
  - Don't switch model or thinking effort inside a chat.

## Known, approved deviation from AGENTS.md
AGENTS.md says "Theme/mode via `ui("theme", …)`". That function needs the extra library `material-dynamic-colors`, which generates its own colours. The designer chose to set the exact Herb Garden colours as beer.css CSS variables in `app.css` instead (DESIGN.md 4.0–4.1). Still beer.css theme tokens, no custom colours in views.
