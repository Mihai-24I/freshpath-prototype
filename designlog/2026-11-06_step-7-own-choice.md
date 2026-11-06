## Design log — 6 Nov 2026 — FreshPath prototype 2, step 7: Own choice
**Session goal:** Build plan.md step 7: screen 11 (Own choice), the one route to place a product the employee picks, with search, fit tags and warnings.

### Key moments
**Selected product marked by border and icon, not colour alone** · started by designer (plan.md), applied by AI
- What happened: the chosen row gets a thick green border, a tinted fill and a filled check icon in place of the empty circle. The list is a native radio group, so arrow keys move the selection.
- Decision: kept.
- Why: "User 4 said the selected item must be clearly marked." (U4 04:08, plan.md)
- 🖼️ before: no screen yet · after: [list](screenshots/2026-11-06_own-c_after-2.png) · [search "ber" + Raspberries chosen](screenshots/2026-11-06_own-c-cooling_after-2.png)

**Cooling and promo warnings explain, never block** · started by designer (DESIGN.md), applied by AI
- What happened: on C (ambient, promo 2 for €3), Raspberries show "Needs cooling" and Cherries show "Needs cooling" and "Not in promo", as accent tags in the list. Under the chosen row an accent box says why. "Use this product" stays enabled.
- Decision: kept.
- Why: "A waste risk is a warning, not a mistake. I flag it early in the accent colour and never block the action." (DESIGN.md 2)
- 🖼️ [Cherries, both warnings](screenshots/2026-11-06_own-c-cooling-promo_after-2.png)

**Reason field sits under the chosen product** · started by AI
- What happened: plan.md only says "My reason (short, for the manager)". The AI put the field and the warnings directly below the selected row instead of at the bottom of a long list. The label says "optional".
- Decision: kept.
- Why: "The employee doesn't have to scroll past a long list to find it."
- 🖼️ [cooling + reason typed](screenshots/2026-11-06_own-c-cooling_after-2.png)

**"Use this product" disabled until a product is chosen, and always on screen** · started by AI (sticky bar follows DESIGN.md 2)
- What happened: the button sits in a bar fixed to the bottom, full width, and is greyed out until a row is selected. After the first screenshot review the AI also made it full width and tightened the tag spacing in the rows.
- Decision: kept.
- Why: sticky bar: "The main action has to always be visible, even when the page is long." (DESIGN.md 2). Disabled state: "It prevents an empty choice and tells the employee to pick a product."
- 🖼️ [disabled, top of list](screenshots/2026-11-06_own-c_after-2.png)

**Placeholder Amount screen added so the flow continues** · started by AI
- What happened: plan.md's check says "Use this product" continues to a placeholder Amount, but no route existed. The AI added a placeholder that shows the product and the kept reason. "Use mangoes" on the Why screen now lands there too, instead of silently going back to Overview.
- Decision: kept, replaced in the next amount step.
- Why: "To check that the product and reason arrive before the real screen exists."
- 🖼️ before: [Use mangoes lands on Overview](screenshots/2026-11-06_use-mango-lands_before.png) · after: [placeholder Amount](screenshots/2026-11-06_own-c-amount_after.png)

### AI suggestions not used
- Showing a "Sell within N days" waste warning on own-choice rows: not added, because plan.md lists only Fits, Needs cooling and Not in promo.
- Committing straight away: the designer answered "Not yet" first, to test at 412 × 898, then said "Commit".

### Who did what
- **AI:** built the Own choice screen, search, warning rules, placeholder Amount and route; took before/after screenshots; ran the done-when check (all items passed, no console errors, button visible at 412 × 780); committed and pushed (`1f6b220`).
- **Designer:** set the screens, flow and warning principle through plan.md and DESIGN.md; gave the reasons for the AI's layout choices; held the commit until ready, then approved it.
