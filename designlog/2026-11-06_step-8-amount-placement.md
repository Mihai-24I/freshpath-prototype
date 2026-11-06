## Design log — 6 Nov 2026 — FreshPath prototype 2, step 8: Amount and Placement
**Session goal:** Build plan.md step 8: screen 8 (Amount) and screen 9 (Placement), for suggested substitutes and for own choices.

### Key moments
**Suggested amount for an own choice** · started by AI (gap in plan.md), decided by designer
- What happened: a suggested substitute brings its own amount, but a product picked via Own choice has none. The AI asked with a pop-up: expected sales (capped), fill the display, or a fixed 10.
- Decision: the display's expected sales rest of today (C: 22), limited by room and storage.
- Why: "This avoids over-filling."
- 🖼️ before: [placeholder](screenshots/2026-11-06_amount-own_before.png) · after: [Raspberries 22 punnet](screenshots/2026-11-06_amount-own_after.png)

**No sales or top-up numbers for an own choice** · started by AI (gap in plan.md), decided by designer
- What happened: "Expected sales" and "Next top-up" exist in the seed only for suggested substitutes. The AI asked whether to hide them or reuse the display's numbers.
- Decision: hide that card for own choices. The stock bar still updates.
- Why: "No numbers we can't back up for a product with no data; the stock bar still updates."
- 🖼️ [own choice, no "Today" card](screenshots/2026-11-06_amount-own_after.png) · [suggestion, with it](screenshots/2026-11-06_amount-mango_after-2.png)

**Live stock bar and status word under the amount** · started by designer (plan.md), applied by AI
- What happened: moving – / + updates the fill bar, the percentage and the status word at once. Mangoes at 12 give "OK · 46%". Down at 4 it flips to "Low · 23%" in the accent colour.
- Decision: kept.
- Why: "I don't want it full." (U2 03:33, plan.md: the amount can go down)
- 🖼️ before: [placeholder](screenshots/2026-11-06_amount-mango_before.png) · after: [12 pcs](screenshots/2026-11-06_amount-mango_after-2.png) · [lowered to 4](screenshots/2026-11-06_amount-mango-adjusted_after.png)

**Ticking steps is optional on Placement** · started by designer (plan.md), applied by AI
- What happened: the 4 steps are checkboxes and "All placed" works with none ticked. Ticks and the chosen amount survive going back and forward.
- Decision: kept.
- Why: plan.md: testers U1 and U3 needed the checklist explained, so the steps are short and ticking is optional.
- 🖼️ [mangoes, one step ticked](screenshots/2026-11-06_placement-mango_after-3.png) · [own choice, default steps](screenshots/2026-11-06_placement-own_after-2.png)

**Touch targets raised to 48 dp** · started by designer (DESIGN.md), applied by AI
- What happened: the check found the – / + buttons 40 dp wide and the step rows 34 dp high. The AI made both 48 dp.
- Decision: kept.
- Why: "I work on a busy shop floor, often one-handed, sometimes with gloves, so touch targets have to be at least 48 dp." (DESIGN.md 1, 3)
- 🖼️ [Placement after the fix](screenshots/2026-11-06_placement-mango_after-3.png)

**Maximum amount also uses the seed's `amountMax`** · started by AI
- What happened: plan.md says the limit is what fits and is in storage. The AI also applied `amountMax` from `substitutes.json`, so mangoes stop at 20 although 31 would fit.
- Decision: kept (designer didn't change it).
- Why: "`amountMax` was added in step 1 for this reason, so I used it."
- 🖼️ [capped line on Amount](screenshots/2026-11-06_amount-mango_after-2.png)

**Promo box on every promo display, neutral text** · started by AI
- What happened: plan.md says a promo box when the display has a promo. The AI shows it for any promo display, also when the product isn't in the promo, with a text that only says to check the sign and price label.
- Decision: kept.
- Why: "A product outside the promo means the sign and price label must be checked, sign may need to change."
- 🖼️ [promo box on Placement](screenshots/2026-11-06_placement-mango_after-3.png)

**Placeholder Confirm screen** · started by AI
- What happened: "All placed" needed somewhere to go before the real Confirm screen (plan.md step 9) exists. The AI added a placeholder that shows the amount and product.
- Decision: kept, replaced in the next confirm step.
- Why: "It has to lead somewhere when I test it on my phone."

### AI suggestions not used
- None worth mentioning; the designer rejected nothing this step.

### Who did what
- **AI:** built Amount, Placement, the shared refill logic and the placeholder Confirm; found two gaps in plan.md and asked; fixed a wrapping bug on the first checklist step and the two touch-target misses; ran the done-when check (all items passed, no console errors, main action visible at 412 × 780); committed and pushed (`5ff2949`).
- **Designer:** decided the own-choice amount rule and hid the sales card; set the screens and optional ticking through plan.md; approved the commit after testing.
