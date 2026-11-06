## Design log — 2026-11-06 — Step 11: Storage and Correct stock
**Session goal:** Build screens 12 (Storage) and 18 (Correct stock), with "Suggest display" linking to the Overview and a stock correction that changes which substitutes are available.

### Key moments
**Sell-by tags: where the colours switch** · started by AI
- What happened: Plan.md only said "most urgent tag in error colours". I asked where "Sell today" ends and "Sell within 2 days" starts. Options were 1 day red + 2 days accent, or red for 2 days or less.
- Decision: 1 day or less is red "Sell today", exactly 2 days is accent "Sell within 2 days", 3 or more is a plain tag.
- Why: "It matches the waste-risk rule: the accent colour is for waste risk, and red is only for the real emergency."
- 🖼️ [after](screenshots/2026-11-06_storage_after-2.png)

**What "Promo" sort means** · started by AI
- What happened: The Promo chip had no rule in plan.md. I offered "products that fit a promo display now" or a promo flag per product.
- Decision: Promo sort puts products that are an available substitute for a Low or Empty display with a promo (C, E) first, then by sell-by.
- Why: "Promo displays matter most. An empty promo display loses sales fastest, so those products come first."
- 🖼️ [after](screenshots/2026-11-06_storage-promo_after.png)

**Tags never rely on colour alone** · started by the designer (DESIGN.md 3)
- What happened: Every sell-by tag has an icon and a word next to its colour: `cancel` "Sell today", `warning` "Sell within 2 days", `schedule` for longer. I only applied the rule.
- Decision: Applied as written in DESIGN.md.
- Why: "My app has to meet WCAG 2.2 AA, so a status is never shown by colour alone." (DESIGN.md 3)
- 🖼️ [after](screenshots/2026-11-06_storage_after-2.png)

**Every save ends with a visible confirmation** · started by the designer (DESIGN.md 6.8)
- What happened: Save on Correct stock returns to Storage with the snackbar "Mangoes stock set to 40" and Undo. Undo puts the old number back and the list updates.
- Decision: Applied as written in DESIGN.md.
- Why: "I want every save to end with a visible confirmation, because testers didn't know whether an action had worked." (DESIGN.md 6.8)
- 🖼️ [before](screenshots/2026-11-06_storage_before.png) · [after](screenshots/2026-11-06_storage-saved_after.png)

**Storage cards restyled after the first screenshot** · started by AI
- What happened: In the first screenshot the product names were plain weight with a big gap above the amount line. I changed the name to the same serif card title as the Overview display card.
- Decision: Done by AI without being asked. The designer has not commented on it.
- Why: AI's reason: card titles are Title Medium in DESIGN.md 4.2, and the cards should read like the Overview card.
- 🖼️ [first version](screenshots/2026-11-06_storage_after.png) · [after](screenshots/2026-11-06_storage_after-2.png)

**Hint on the Overview after "Suggest display"** · started by AI
- What happened: Tapping "Suggest display" on mangoes opens the Overview with C selected and the line "Mangoes from storage fit here" on the display card. The line goes away when another display is selected.
- Decision: The designer kept it. The hint is passed through app state, not the URL, so the display card shows it only for that visit.
- Why: "It says why this display opened, and it keeps the link to Storage."
- 🖼️ [before](screenshots/2026-11-06_overview-suggest_before.png) · [after](screenshots/2026-11-06_overview-suggest_after.png)

### AI suggestions not used
- Red for 2 days or less (option offered for the sell-by tags).
- A promo flag per product (option offered for Promo sort).

### Who did what
- **AI:** built both screens and `displaySuggestions()`, offered the two options, restyled the cards, ran the done-when check with Playwright (all items pass), took the screenshots.
- **Designer:** picked the sell-by thresholds and the Promo sort meaning; set the rules in DESIGN.md that shaped the tags and the snackbar with Undo; approved the commit.
