# plan.md: FreshPath prototype 2

Made 6 Nov 2026 from, in this order: the user test analysis (`context/prototype-1/user-tests.md`), breadboard V2 (`FreshPath_Breadboards.pdf` p. 2) and the user stories (`user-stories.md`). Look and components: `DESIGN.md`. Technique: `AGENTS.md`.

Screen numbers follow breadboard V2 so the V3 update can trace them. New screens get new numbers (0, 18, 19). Screen 5 (loading) and the Edit route on 3 are gone.

## Decisions taken in this session (open questions from HANDOVER.md)

| # | Question | Decision | Reason |
|---|---|---|---|
| 1 | Tab labels and order | **Overview · Tasks · Storage · Profile** | Map first (core task), Profile last (U2 08:35), "Storage" is the testers' own word for Advanced |
| 2 | Start screen after login | **Overview** | U1 and U4 scored 2 on "Find a display" because they started in the task list and had to be pointed to the map |
| 3 | Manager mode | **Manager account only** (log in as Sam). Mia never sees manager screens | Realistic, uses the fake auth; demo logins are on the login screen |
| 4 | Uncovered user stories | **Story 4 in.** Stories 1, 5, 9, 13 out | See "Left out" below, in the designer's words |
| 5 | Rating style on "Why this suggestion" | **Icon + word per factor: `check_circle` Good / `warning` Risk.** No squares, no scores | Same pattern as the OK/Low status; U1: "the squares kind of confuse me" |
| 6 | First-use guide | **3-card intro after first login, skippable, replay from Profile** | U1 09:04, U3 08:19 / 09:17 |
| 7 | One-tester requests | **Storage sorting (U2) in.** Tasks on Overview and more colour/images out | See "Left out" below |

## Flow

```
0 Login ──(first login)──> 19 Intro ──> 2 Overview
0 Login ──(later logins)──────────────> 2 Overview

Tabs:  2 Overview · 1 Tasks · 12 Storage · 13 Profile

Refill (core flow):
2 Overview ── tap Low/Empty tile ──> display card
   ├─ Open details (text link) ──> 3 Display detail ── Find alternatives ─┐
   ├─ Find alternatives ──────────────────────────────────────────────────┴─> 4 Report problem (optional reason)
   └─ Change product ──> 11 Change product (amount inline) ── Next: how to place ──> 9 Placement
4 ── Find replacement (no loading) ──> 6 Alternatives
   ├─ tap card ──> 7 Why this suggestion ── Use [product] ──> 8 Amount
   │                                     └─ See other options ──> 6
   ├─ Choose my own product ──> 11 Change product ── Next: how to place ──> 9 Placement
   └─ (none in stock) "Report to manager" ──> 2 Overview + snackbar
8 Amount ── Next: how to place ──> 9 Placement ── All placed ──> 10 Confirm
10 Confirm ── Confirm ──> 2 Overview + snackbar "Display C updated · Undo" + updated tile
                          (decision saved to 14 My decisions, task done)

Tasks:   1 Tasks ── open refill task ──> 2 Overview (display selected)
         1 Tasks ── My decisions ──> 14 My decisions
Storage: 12 Storage ── Suggest display ──> 2 Overview (display highlighted)
         12 Storage ── tap product ──> 18 Correct stock ── Save ──> 12 + snackbar
Profile: 13 Profile ── Replay intro ──> 19 · Reset demo data · Log out ──> 0

Manager (Sam):
0 Login ──> 15 Manager home (replaces Tasks for the manager)
15 ── New note or task ──> 16 ── Save ──> 15 + snackbar  (shows in Mia's Tasks)
15 ── Review decisions ──> 17 ── Send feedback ──> 17 + snackbar  (shows in Mia's My decisions)
```

**Manager tabs (decided):** for Sam the second tab reads **Team** and opens 15 Manager home, and Sam starts there after login; Overview, Storage and Profile stay the same. Four tabs for both roles. Designer: "a manager's job is reviewing the team, not doing shift tasks."

## Screens

Routes are hash routes (AGENTS.md). The refill in progress (chosen display, problem reason, product, amount, own reason, photo flag) lives in the one `state` object in `app.js`; if it is missing after a reload, the view sends the user back to the display on the Overview.

### 0 · Login `#/login`
- **Purpose:** get into the demo as employee or manager.
- **Content:** logo lockup (symbol + "FreshPath"), email, password, demo credentials (Mia, Sam, `demo1234`).
- **Actions:** filled "Log in". Wrong login: field error, no dialog.
- **Answers:** AGENTS.md auth; Q3 (manager via account).

### 19 · Intro `#/intro` (new)
- **Purpose:** first-use guide.
- **Content:** 3 cards, one at a time, very short text, one icon each: (1) the map shows which display needs you, (2) Find alternatives gives you a ranked substitute, (3) "Why this?" tells you what to say to the manager. Dots show 1/2/3. Text from `data/intro.json`.
- **Actions:** filled "Next" / "Start" on the last card; text "Skip".
- **Answers:** "Add a short first-use guide" (U1 09:04, U3 08:19, 09:17; U3 05:41 "not many people like reading", hence 3 short cards).

### 2 · Overview `#/` and `#/overview/:displayId` (start screen)
- **Purpose:** see at a glance which display needs attention and act on it.
- **Content:** title "Overview" + "Updated 13:42" (`store.json`); store map with display tiles A–I (status word + icon, gondolas touching); count chips "6 OK · 1 Low · 2 Empty" below the map; display card for the selected display (overline, product, status tag, stock bar, "4 of 35 pcs on display", promo). With `:displayId` the tile is selected and pulses (selection marker). All OK: "All displays are full. Nice work."
- **Actions:** tap tile (select); tap chip (filter map); text link "Open details" next to the stock line; outlined "Change product" + filled "Find alternatives" (only for Low/Empty; for OK the card shows only "Open details"); arrow keys move between tiles.
- **After an action:** snackbar ("Display C updated" / "Reported to manager") with Undo where the action can be undone; the tile shows its new status at the same time.
- **Answers:** test task 1; "confirmation states + updated overview after every action" (all five); "screen that highlights the suggested display" (U2 07:16); one primary + one secondary button (U2 05:23, U4 06:09); U2 09:54 yellow for low, red for empty (status colours). Stories 1 (urgency via status tags, see Left out), 2.

### 3 · Display detail `#/displays/:id`
- **Purpose:** understand the situation before acting.
- **Content:** back; overline "DISPLAY C · promo table"; planned product + promo tag; in storage / on display / capacity; fill bar with status word and %; expected sales rest of today, last refill (time, who), note (e.g. "Avocados in storage still hard, not ripe until Fri").
- **Actions:** filled "Find alternatives" (Low/Empty only). No Edit button.
- **Answers:** story 2; "one clear route to change a product" (Edit removed; U2 05:23).

### 4 · Report problem `#/displays/:id/problem`
- **Purpose:** optional, short: why is the display low. Kept short because the decision log uses it.
- **Content:** back; title "What's wrong at C?"; "Avocados · 4 of 35 on display"; reason as 4 chips (from `data/problems.json`), none selected; note field (optional). Both visibly marked "optional".
- **Actions:** filled "Find replacement" works with nothing filled in; goes straight to 6 (no loading screen).
- **Answers:** "remove or shorten the reason screen and auto-skip the loading screen" (U1, U2; U4 01:31 "It's not an important step"); story 8 (reason in the log).

### 6 · Alternatives `#/displays/:id/alternatives`
- **Purpose:** choose a substitute quickly.
- **Content:** back; title "Alternatives for C"; "Ranked for this afternoon · 35 pcs space"; substitute cards, available ones only, best match first (title, "Best match" tag on #1, 2–3 reason lines with `check_circle` / `warning`, stock and amount, warning tags: cooling, promo, waste risk in accent with "Sell within 2 days").
- **Actions:** tap card → 7; outlined "Choose my own product" → 11 (below the list).
- **No substitute in stock** (display H): "No substitute in stock right now." + icon; display stays Empty; filled "Report to manager" (creates a task for Sam, back to Overview + snackbar); outlined "Choose my own product".
- **Answers:** story 3; test task 2; "Best match" trusted (all five); waste is a warning, never blocks (principle 4); DESIGN 7.2 edge case.

### 7 · Why this suggestion `#/displays/:id/alternatives/:substituteId`
- **Purpose:** show why it fits, so the employee can repeat it to the manager.
- **Content:** back; bold title "Why mangoes?" (Roboto Serif, U1 18:05); "#1 Best match for display C"; **summary on top** (one fixed-pattern sentence from `substitutes.json`, no AI); one row per factor: factor name, `check_circle` **Good** or `warning` **Risk**, one short line; tap a row (or `lightbulb` "Why does this matter?") to expand the explanation from `reasons.json`.
- **Actions:** filled "Use mangoes"; text "See other options" → 6.
- **Answers:** "summary on top, less text, clear title, consistent ratings" (U1 05:37, 18:05, 18:26; U3 02:19); test task 3; principle 3; story 3, 8.

### 11 · Change product `#/displays/:id/change` (from the display card) and `#/displays/:id/own` (from Alternatives)
- **Purpose:** the one route to place a product the employee picks, in as few taps as possible (design option A).
- **Content:** back (to the Overview from the card, to Alternatives from there); "Change product · H is cooled, no promo, 16 free spaces. Products that fit come first."; search field; product list (in storage only) with fit tag: `check_circle` Fits / `warning` Needs cooling / `warning` Not in promo; under the chosen product, as one card with it: the warning in accent with the reason (never blocks), "How many?" with – / + (suggested = expected sales, within what fits and is in storage) and "After placing: 10 of 16 on display, OK"; text button "Add a reason for the manager (optional)" opens the reason field.
- **Actions:** filled "Next: how to place" → 9 (own choices skip 8 Amount; Back on 9 returns here with product, amount and reason kept).
- **Answers:** "one clear route to change a product, search in the product list" (U2 04:30, 04:38; U3 04:38, 07:58; U4 04:08: selected item clearly marked); story 8 (own reason logged).

### 8 · Amount `#/refill/amount`
- **Purpose:** place the right amount, not too much.
- **Content:** back; "Mangoes → display C"; "Suggested: place 12 pcs" (big); – / + (48 dp, steps of 1, between 1 and what fits and is in storage); display after placing: stock bar with fill % and status word; expected sales + next top-up.
- **Actions:** filled "Next: how to place".
- **Answers:** story 6; U2 03:33 "I don't want it full" (amount can go down).

### 9 · Placement `#/refill/placement`
- **Purpose:** where to get it and how to place it.
- **Content:** back; "Get it from": storage location, rack, amount, oldest date first; step checklist (3–4 steps from `substitutes.json`, a default list for own choices); promo note in a `tertiary-container` box when the display has a promo.
- **Actions:** filled "All placed" (works without ticking every step).
- **Answers:** refill flow worked for U2 and U4; U1 and U3 needed the checklist explained, so steps are short and ticking is optional.

### 10 · Confirm `#/refill/confirm`
- **Purpose:** check and save. A screen, never a dialog.
- **Content:** back; "Display C · promo table"; ~~Avocados~~ → Mangoes; amount, fill after, from, promo; photo block labelled **"Photo (optional)"** with the line "Helps your manager see how the display looks." (fake: opens the camera / file picker via `<input type="file" capture>`, only "Photo added" is saved).
- **Actions:** filled "Confirm" → Overview with snackbar "Display C updated" + Undo (5 s), updated tile selected. Data: status rules DESIGN 7.3 (display product + amount, storage lowered, decision saved, related task done).
- **Answers:** "confirmation states" (all five: U1 07:33, U3 03:48, 07:20, U4 04:38); "explain why the photo is needed, or mark it optional" (U3 03:32, U4 03:30, U2 04:02); story 8.

### 1 · Tasks `#/tasks`
- **Purpose:** the shift's to-do list and what the manager wants today.
- **Content:** title + "Tue 27 Oct · shift 12:00–20:30"; **Manager notes for today** on top (including the priority of the day as a note, e.g. "Today: availability first"); today's tasks (own + from the manager) with checkboxes; done tasks struck through at the bottom; "Coming up" (notes and tasks for later dates); outlined "My decisions".
- **Actions:** tick a task (snackbar + Undo); "Open" on a refill task → Overview with the display selected; "My decisions" → 14.
- **Answers:** story 7, 9 (via notes, see Left out), 10, 11 (Mia's side).

### 14 · My decisions `#/decisions`
- **Purpose:** see what I placed and what the manager thinks.
- **Content:** back; one card per decision, newest first: time, display, old → new, amount, reasons (or my own reason), my note, photo flag, manager feedback (or "No feedback yet").
- **Actions:** none besides back.
- **Answers:** story 8, 12 (feedback appears here); principle 3 (builds confidence: "I don't have to fear their reaction").

### 12 · Storage `#/storage`
- **Purpose:** use stock before it spoils.
- **Content:** title "Storage" + "Updated 13:42"; sort chips **Date** · **Quantity** · **Promo** (default: opens on stock that has to go out and fits a promo display), active chip `fill`; one card per product in storage: name, qty + location, tag (`cancel` "Sell today" in error colours, `warning` "Sell within 2 days" in accent, plain "Sell within 6 days").
- **Actions:** outlined "Suggest display" on products that fit a Low/Empty display (found from `substitutes.json`) → Overview with that display selected and the card line "Mangoes from storage fit here"; tap a card → 18.
- **Answers:** test task 6 (worked; red cue kept, U1 13:19, U4 05:35); "screen after Suggest display" (U2 07:16, 08:14); U2 10:33 sorting; story 4 (entry).

### 18 · Correct stock `#/storage/:productId` (new)
- **Purpose:** fix the storage count so suggestions match reality.
- **Content:** back; product name; location; "In storage now: 48 pcs"; number field with – / +.
- **Actions:** filled "Save" → Storage + snackbar "Mangoes stock set to 40" + Undo. Availability of substitutes updates (DESIGN 7.3: available only when `storageQty` ≥ amount).
- **Answers:** story 4.

### 13 · Profile `#/profile`
- **Purpose:** who am I, demo controls.
- **Content:** avatar, name, role, store, shift, "Started 6 Oct 2026".
- **Actions:** outlined "Replay intro" → 19; outlined "Reset demo data" (AGENTS.md `reset()`, then snackbar); text "Log out" → 0.
- **Answers:** Q1 (Profile last), Q6 (replay), AGENTS.md reset.

### 15 · Manager home `#/manager` (Sam only)
- **Purpose:** what happened on the shift, what is open.
- **Content:** title "Team"; today's decisions (count + latest 3, short); open tasks, including "Report to manager" items from employees; today's notes.
- **Actions:** filled "New note or task" → 16; outlined "Review decisions" → 17.
- **Answers:** stories 10, 11, 12.

### 16 · New note or task `#/manager/new`
- **Content:** back; type (note / task, segmented chips); date (today or later, `type="date"`, min = today); for (Mia / everyone); text (required).
- **Actions:** filled "Save" → 15 + snackbar "Note saved for Tue 27 Oct". Shows in Mia's Tasks (today) or "Coming up" (later).
- **Answers:** stories 9 (priority as a note), 10, 11.

### 17 · Review decisions `#/manager/decisions`
- **Content:** back; shift's decisions with reasons, employee note, photo flag; per decision a feedback field.
- **Actions:** per decision filled-tonal "Send feedback" (one per card, the screen has no other primary) → snackbar "Feedback sent to Mia"; shows in Mia's 14.
- **Answers:** story 12.

## In and out of prototype 2

### Test findings ("What to change" + other feedback)

| Finding | In? | Where / reason |
|---|---|---|
| Confirmation states + updated overview after every action (all five) | In | Snackbar + Undo after Confirm, Report, task tick, stock save, note, feedback; tile updates (2, 10) |
| Remove/shorten reason screen, skip loading (U1, U2, U4) | In | 4 is optional and short; screen 5 removed |
| Summary on top, less text, clear title, consistent ratings (U1, U3) | In | 7: summary first, Good/Risk per factor, explanation on tap |
| One route to change a product, one primary button, search (U2, U3, U4) | In | Edit removed; 11 from Alternatives only, with search; one filled button per view |
| Screen after "Suggest display" (U2) | In | 12 → 2 with the display selected |
| Explain / mark photo optional (U2, U3, U4) | In | 10 |
| First-use guide or help (U1, U3) | In | 19 + replay in 13 |
| Profile last (U2) | In | Tab order |
| Storage sorting (U2) | In | 12 sort chips |
| Choose the amount, "I don't want it full" (U2) | In | 8 – / + |
| Big buttons, work phones break (U2) | In | 48 dp minimum (DESIGN 3) |
| Yellow for low, red for empty (U2) | In | Status colours (DESIGN 4.1) |
| Bolder reasons title (U1) | In | Roboto Serif title on 7 |
| Tasks on the Overview (U2) | Out | Designer: "it was suggested only by one tester and also as others hinted, less information is better. so no need to combine tabs" |
| More colour, images (U1) | Out | Designer: "it conflicts with DESIGN.md and the calm Herb Garden look." (DESIGN.md 9–10: no photos or illustrations in the UI) |

### User stories

| Story | In? | Where / reason |
|---|---|---|
| 1 Displays sorted by urgency | Out (as a list) | Designer: "displays have tags that show the urgency in the display overview map." Count chips filter by status |
| 2 Planned product and fill | In | 2 display card, 3 |
| 3 Top 5 substitutes with reasons | In | 6, 7 |
| 4 Correct stock amount | In | 12 → 18 |
| 5 Warning when a product shouldn't stand next to another | Out | Designer: "placement warning is sorted by alternatives, if the user/employee does it manually than there is a good reason for that." Cooling and promo warnings in 11 stay |
| 6 How much fits | In | 8 |
| 7 Manager's focus today | In | 1 manager notes |
| 8 Decision logged with reasons | In | 4, 7/11, 10 → 14 |
| 9 Manager's priority of the day | Out (as a setting) | Designer: "managers priority can be comunicated via text posted in notes section." Seeded as a note; 16 can post one |
| 10 Notes on dates | In | 16 → 1 |
| 11 Tasks for future dates | In | 16 → 1 "Coming up" |
| 12 Review decision log + feedback | In | 17 → 14 |
| 13 Shared placement rules between managers | Out | Designer: out of scope (multi-manager, agreement flows); "there is already the departments managers notes info, tasks that should be enough to explain to other managers. the problem of dissagrement between managers is not solved by the app direclty it is not the focus of the problem." |

## Data

Seed files are read-only; `data.js` copies a collection to `localStorage` on first write (AGENTS.md). Existing values in `displays.json`, `products.json` and `store.json` stay as they are (they match the style guide boards); fields are only added. Demo "today" = the date of `store.lastSync` (Tue 27 Oct 2026), so due times and "Sell within" make sense whatever the real date.

| File | Change in step 1 |
|---|---|
| `store.json` | Add `shift` ("12:00–20:30"), `defaultPlacementSteps` (for own choices) |
| `users.json` | Add `shift`; keep accounts and passwords |
| `displays.json` | Add `climate` (ambient / cooled), `expectedSales`, `lastRefill` {time, by}, `note`. No value changes |
| `products.json` | Add `needsCooling`, `promoEligible`, `rack`. Add the products needed for 5 substitutes per Low/Empty display (C avocados, E strawberries, H basil) and for own choice (some that need cooling or don't fit the promo). H's 5 substitutes all have `storageQty` below the amount (no-substitute case) |
| `substitutes.json` | 5 per avocado / strawberry / basil, ranks 1–5. Per entry add: `summary` (one sentence, fixed pattern: "[Product] is [best reason]. [Risk, if any]. [Amount] fills display [X]."), `factors` [{reasonId, rating: "good" / "risk", text}] (5–7 per entry), `tags` (cooling / promo / waste), `amountMax`, `placementSteps`, `getFrom`, `expectedSales`, `nextTopUp`. For C and E at least one available entry has a waste risk; for C one available entry is not in the promo |
| `reasons.json` | Add the factors the Why screen needs (demand today, cooling, promo rules) with an explanation each; keep existing ids |
| `problems.json` (new) | The 4 problem reasons for screen 4 |
| `tasks.json` | Add `createdBy`, `kind` (task / note), `date`. Add manager notes for today (incl. priority of the day), a manager task for Mia, a note and a task for a later date, Sam's open items |
| `decisions.json` (new) | 3 earlier decisions by Mia (one own choice), 2 with manager feedback, 1 without |
| `intro.json` (new) | The 3 intro cards (icon, title, text) |

Logic in `data.js` (not seed): status per display (DESIGN 7.3), available substitutes, "Suggest display" match (a product is suggested for a Low/Empty display when it is an available substitute there), confirm-refill and undo.

## Build steps

One step per chat. Start each chat with `/designlog`, read this file, build the step, tick it here. For every step that changes a screen, the agent takes before/after screenshots (CLAUDE.md). Test with `node ../freshpath-tools/serve.js` from the project folder, then open http://localhost:8000 (use your phone width or DevTools at 412 × 898). After each step, once you OK the commit and push, the same build is on GitHub Pages for testing on your phone.

- [x] **1 · Extend the seed data** (see Data).
  Done when: each file in `data/` opens in the browser (`localhost:8000/data/…json`) without a JSON error; avocados, strawberries and basil each have 5 substitutes ranked 1–5; every substitute has a summary, factors with Good/Risk, an amount and placement steps; for basil none has enough storage; Mia has today's manager notes, a "coming up" item and 3 decisions (2 with feedback). No existing value in displays/products/store changed.

- [x] **2 · App shell, theme, router, data layer.** `index.html` (head per DESIGN 4.0, top bar with logo, four tabs), `css/app.css` (Herb Garden + fonts), `js/app.js`, `js/router.js`, `js/data.js`, placeholder views per tab.
  Done when: the page shows the cream background, green tab underline, Roboto Serif title; tabs switch between four placeholder screens and the active tab is marked; an unknown hash (`#/xyz`) lands on Overview; in the console `localStorage` has no `app:` keys yet.

- [x] **3 · Login, auth guard, Profile.** Screen 0, `js/auth.js`, 13 (without Replay intro).
  Done when: opening `#/tasks` logged out goes to Login and back to Tasks after logging in as Mia; a wrong password shows a field error; reload keeps you logged in; Profile shows Mia's details; Reset demo data and Log out work; Sam lands on a placeholder Team screen and `#/manager` as Mia goes to Overview.

- [x] **4 · Overview: map, tiles, chips, display card.** 2, `<app-store-map>`, `<app-display-tile>`, selection marker, all-OK state.
  Done when: tiles A–I sit like the style guide (D-E-F and G-H-I touching), C says Low, E and H say Empty with icons; tapping C pulses the corner marks 3 times and fills the card ("4 of 35 pcs"); chips read "6 OK · 1 Low · 2 Empty" and filter the map; arrow keys move between tiles; `#/overview/d-e` opens with E selected; with reduced motion on, the marks don't move.

- [x] **5 · Display detail and Report problem.** 3, 4.
  Done when: "Open details" on C shows planned product, stock numbers, fill bar 11% Low, last refill and note; "Find alternatives" (from card or detail) opens "What's wrong at C?" with nothing selected; "Find replacement" works without picking a reason and goes to a placeholder Alternatives; there is no loading screen and no Edit button.

- [x] **6 · Alternatives and Why this suggestion.** 6, 7, no-substitute state with Report to manager.
  Done when: C and E show only available substitutes, best match first with the "Best match" tag; waste risk shows in accent and nothing is disabled; tapping a card opens "Why …?" with the summary on top and Good/Risk per factor, and a row expands to its explanation; H shows "No substitute in stock right now." and "Report to manager" returns to Overview with a snackbar and H still Empty.

- [x] **7 · Own choice.** 11.
  Done when: "Choose my own product" opens the list; typing "ber" filters it; a cooled product shows "Needs cooling" and its warning but can still be used; the selected product is clearly marked; "Use this product" continues (to a placeholder Amount) with the own reason kept.

- [x] **8 · Amount and Placement.** 8, 9.
  Done when: Amount shows the suggested number, – / + change it within the limits, and the fill bar + status word update live; Placement shows where to get it, the steps (default steps for an own choice) and the promo box on C; "All placed" works without ticking steps.

- [x] **9 · Confirm, snackbar, undo.** 10, confirm rules in `data.js`, snackbar.
  Done when: Confirm shows old → new, amount and "Photo (optional)" with its reason; Confirm returns to Overview with "Display C updated" + Undo for 5 s and C shows its new status; storage of the product went down; task "Refill display C" is done; Undo puts everything back; after Reset demo data the seed state is back.

- [x] **10 · Tasks and My decisions.** 1, 14.
  Done when: Tasks shows today's manager notes on top (incl. the priority of the day), open tasks, done tasks struck through and "Coming up"; ticking a task gives a snackbar with Undo; "Open" on the C task goes to Overview with C selected; My decisions shows the 3 seeded decisions plus the one from step 9, with feedback where there is some.

- [x] **11 · Storage and Correct stock.** 12, 18.
  Done when: Storage lists products in storage sorted by sell-by, the most urgent tag in error colours; the sort chips re-order by quantity and promo; "Suggest display" on mangoes opens Overview with C selected and the line "Mangoes from storage fit here"; setting mangoes to a number below their amount on C removes them from C's alternatives, with a snackbar + Undo after Save.

- [x] **12 · Manager screens.** 15, 16, 17.
  Done when: as Sam, Team shows today's decisions and open items (incl. a "Report to manager" from step 6); a note for today appears in Mia's Tasks after logging in as Mia, a task for a later date under "Coming up"; feedback sent in Review decisions appears in Mia's My decisions.

- [x] **13 · First-use intro.** 19, Replay intro in 13.
  Done when: Mia's first login after Reset shows the 3 cards; Skip and Start both go to Overview; the next login skips the intro; "Replay intro" in Profile shows it again.

- [x] **14 · Accessibility pass and GitHub Pages.**
  Done when: every screen works with Tab / Enter / Esc and arrow keys on the map, focus moves to the heading after each route change; at 200% system font nothing is cut off and the main action is still reachable; all touch targets are ≥ 48 dp; the full refill flow works on the GitHub Pages URL on your phone (repo and Pages are set up already; all paths are relative).

- [x] **15 · Change product shortcut (design option A).** 2 (card actions), 11 (amount inline), 9 (Back).
  Done when: on a Low/Empty display card "Change product" opens 11 with Back to the Overview; picking a product shows the amount under it; "Next: how to place" goes straight to Placement and Back keeps product and amount; Confirm updates the display with the snackbar; the suggestion flow still goes through Amount.

After step 14: heuristic analysis (10 heuristics) with screenshots, then breadboard V3 and updated user stories (HANDOVER "Still open").
