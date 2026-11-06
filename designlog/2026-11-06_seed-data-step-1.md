## Design log — 2026-11-06 — FreshPath prototype 2, step 1: extend the seed data
**Session goal:** Build step 1 of plan.md: add the content the screens need (substitutes with reasons, problems, decisions, intro), without changing existing values.

### Key moments
**Scope fixed before building** · started by designer
- What happened: The designer set the rules in the prompt: the data plan is approved as written, only add fields to displays/products/store, never change an existing value, basil must have no usable substitute, ask before any product or number choice that changes what the user sees.
- Decision: Built exactly to those rules; checked "no existing value changed" against `git HEAD` for all 7 existing files.
- Why: "This was a followup discussion from the planning, that we sorted out."
- 🖼️ No screen changed this session (data only), so no screenshots.

**Avocado substitutes #3–5** · started by AI (asked), designer chose
- What happened: AI asked which 3 products to add after mangoes and gold kiwis.
- Decision: Accepted "Papayas, pineapples, ripe pears". The other option was pineapples, nectarines, passion fruit.
- Why: "they are tropical or ripe and easy to place"
- 🖼️ Visible later on the Alternatives screen for display C (step 6).

**Strawberry substitutes #3–5** · started by AI (asked), designer chose
- What happened: AI asked which 3 products to add after raspberries and blueberries.
- Decision: Accepted "Blackberries, cherries, red grapes". The other option included red currants and cherry tomatoes.
- Why: "they are cooled fruit that sits next to berries"
- 🖼️ Visible later on the Alternatives screen for display E (step 6).

**How many substitutes are in stock** · started by AI (asked), designer chose
- What happened: AI asked whether the 5 substitutes for C and E should all be available or 4 of 5.
- Decision: Accepted 4 of 5 each (papayas and red grapes are short on stock), so the Alternatives list shows 4 cards and the 5th appears after a stock correction in step 11.
- Why: "so the Alternatives list tests the stock filter"
- 🖼️ Visible later on the Alternatives screen (step 6) and Correct stock (step 11).

**Files beyond the prompt's list** · started by AI
- What happened: The prompt named displays, products, store, and the three new files. AI also added fields to `reasons.json`, `tasks.json` and `users.json`, because plan.md step 1 lists them and its "done when" needs Mia's notes.
- Decision: Designer approved the commit and push without comment on this.
- Why: "They are in plan.md step 1"

### AI suggestions not used
- Starting the static server to fetch each file over HTTP: blocked by the permission check (it tried to stop all node processes), so the files were only parsed, not loaded through the server.

### Who did what
- **AI:** wrote the seed content (15 substitutes with summaries, Good/Risk factors, placement steps; 9 new products; notes, tasks, decisions, problems, intro), wrote the merge and check scripts, ticked step 1. Gave papayas a 1-day shelf life so Storage gets a "Sell today" product, and wrote "12 pcs fill display C" instead of the plan's "fills".
- **Designer:** set the scope and rules, chose the avocado and strawberry extras and the 4-of-5 stock pattern, approved the commit and push.
