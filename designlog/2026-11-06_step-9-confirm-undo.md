## Design log — 6 Nov 2026 — FreshPath prototype 2, step 9: Confirm, snackbar, undo
**Session goal:** Build plan.md step 9: screen 10 (Confirm), the confirm rules in `data.js`, and the snackbar with Undo.

### Key moments
**Confirm ends on the Overview with a snackbar and Undo** · started by designer (DESIGN.md), applied by AI
- What happened: Confirm saves the refill and returns to the Overview with C selected and showing its new status (Mangoes, OK, 16 of 35). "Display C updated" with Undo stays for 5 s. Undo puts the display, the storage, the task and the decision back, and the Overview redraws at once.
- Decision: kept.
- Why: "Every save has to end with a visible confirmation, because testers didn't know whether an action had worked." (DESIGN.md 6.8)
- 🖼️ before: [Overview, C Low](screenshots/2026-11-06_overview-after-confirm_before.png) · after: [Confirmed, snackbar](screenshots/2026-11-06_overview-after-confirm_after.png) · [after Undo](screenshots/2026-11-06_overview-after-undo_after.png)

**Confirm is a screen, not a dialog** · started by designer (DESIGN.md), applied by AI
- What happened: the placeholder became a full screen: ~~Avocados~~ → Mangoes, amount, fill after, where it comes from and the promo, with one filled "Confirm" button fixed at the bottom.
- Decision: kept.
- Why: "The confirm step is a screen, never a pop-up dialog." (DESIGN.md 6.8, 10)
- 🖼️ before: [placeholder](screenshots/2026-11-06_confirm-mango_before.png) · after: [Confirm](screenshots/2026-11-06_confirm-mango_after.png) · [own choice](screenshots/2026-11-06_confirm-own_after.png)

**Photo is optional and says why** · started by designer (plan.md), applied by AI
- What happened: the block is titled "Photo (optional)" with the line "Helps your manager see how the display looks." Only "Photo added" is saved, not the file.
- Decision: kept.
- Why: "Testers asked why the photo is needed, so it's optional and says that it helps the manager." (U2 04:02, U3 03:32, U4 03:30, plan.md)
- 🖼️ [photo added](screenshots/2026-11-06_confirm-photo_after.png)

**Display fill adds the placed amount to what is already there** · started by designer (DESIGN.md 7.3), applied by AI
- What happened: C had 4 avocados, so after placing 12 mangoes it shows 16 of 35. The AI followed the rule "onDisplay += amount" literally; it matches the "after" figure on the Amount screen.
- Decision: kept.
- Why: "The 4 avocados are still on the display, so they count to the total." (rule: DESIGN.md 7.3)

**"Remove" next to "Photo added"** · started by AI
- What happened: plan.md only asks for an optional photo. The AI added a small text button so an accidental photo can be cleared again.
- Decision: kept (designer didn't change it).
- Why: "An easy way to undo an accidental photo."
- 🖼️ [photo added, with Remove](screenshots/2026-11-06_confirm-photo_after.png)

**Time stamp of a saved decision** · started by AI
- What happened: a decision gets the store's demo date and the real clock time, never earlier than the 13:42 sync. That way it sorts as the newest in My decisions.
- Decision: kept.
- Why: "It should show first in My decisions, above the seeded ones."

### AI suggestions not used
- None worth mentioning; the designer rejected nothing this step and no pop-up question was needed.

### Who did what
- **AI:** built Confirm, `confirmRefill` / `undoRefill`, the router refresh after Undo and the photo block; took before/after screenshots; ran the done-when check (all items passed, no console errors, Confirm visible at 412 × 780); committed and pushed (`4efd9cf`).
- **Designer:** set the confirm rules, the screen-not-dialog rule, the snackbar with Undo and the optional photo through plan.md and DESIGN.md; held the commit until ready, then approved it.
