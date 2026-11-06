## Design log — 2026-11-06 — FreshPath prototype 2: plan.md
**Session goal:** settle the open questions from HANDOVER.md and write `plan.md` (screens, flow, scope, build steps) for prototype 2, without building anything.

### Key moments
**Overview first, Profile last, "Storage" tab** · started by AI
- What happened: AI proposed changing breadboard V2's tabs (Profile · Tasks · Overview · Advanced) to Overview · Tasks · Storage · Profile, with the Overview as the start screen.
- Decision: accepted
- Why (the recommendation's reasons, confirmed by the designer): map first because it is the core task and shows status at a glance; Profile last (U2); "Storage" is the testers' own word; starting on the Overview answers test task 1, where U1 and U4 only scored 2 because they started in the task list.
- 🖼️ none: plan only, no screen yet

**Manager screens for Sam's account only, on a "Team" tab** · started by AI
- What happened: AI proposed manager mode for the manager account only, instead of V2's switch in Profile. Later AI proposed a "Team" tab in place of Tasks for Sam, with Sam starting there.
- Decision: accepted both
- Why (account only; the recommendation's reasons, confirmed by the designer): realistic, uses the fake auth, demo logins are on the login screen. Why (Team tab): "a manager's job is reviewing the team, not doing shift tasks."
- 🖼️ none: plan only

**Only story 4 joins; 1, 5 and 9 stay out** · started by designer
- What happened: AI offered stories 1, 4, 5 and 9 as candidates. The designer took only story 4 (correct stock amount).
- Decision: narrowed
- Why: "displays have tags that show the urgency in the display overview map." / "placement warning is sorted by alternatives, if the user/employee does it manually than there is a good reason for that." / "managers priority can be comunicated via text posted in notes section"
- 🖼️ none: plan only

**Story 13 out: disagreement between managers isn't the app's problem** · started by designer
- What happened: AI offered "out of scope (multi-manager)". The designer agreed and added their own argument.
- Decision: left out
- Why: "there is already the departments managers notes info, tasks that should be enough to explain to other managers. the problem of dissagrement between managers is not solved by the app direclty it is not the focus of the problem."
- 🖼️ none: plan only

**Rating squares replaced by Good / Risk with an icon** · started by AI
- What happened: AI proposed an icon + word per factor on "Why this suggestion", following U1's confusion about the squares. It also offered a 3-step scale and a labelled 5-dot meter.
- Decision: accepted icon + word
- Why (the recommendation's reasons, confirmed by the designer): same pattern as the OK/Low status; no scores, nothing to decode.
- 🖼️ none: plan only

**First-use help as a 3-card intro, replayable from Profile** · started by AI
- What happened: AI offered an intro, tips on screens, an FAQ, or intro + FAQ.
- Decision: accepted the 3-card intro
- Why (the recommendation's reasons, confirmed by the designer): short and skippable, answers U1 ("difficult to get used to") and U3 (asked for an FAQ or a short tutorial, "not many people like reading").
- 🖼️ none: plan only

**One-tester requests: Storage sorting in, tasks on the Overview out** · started by designer
- What happened: AI listed U2's and U1's single-tester requests. The designer kept only Storage sorting.
- Decision: Storage sorting in; tasks on the Overview and more colour/images out
- Why (tasks on the Overview): "it was suggested only by one tester and also as others hinted, less information is better. so no need to combine tabs". Why (colour/images): "it conflicts with DESIGN.md and the calm Herb Garden look."
- 🖼️ none: plan only

### AI suggestions not used
- Stories 1 (urgency list), 5 (placement warning) and 9 (priority setting) as features
- Anyone switching to manager mode via Profile (breadboard V2)
- 3-step or 5-dot rating scales; tips on screens or an FAQ instead of the intro
- Tasks on the Overview; more colour/images

### Who did what
- **AI:** read the tests, breadboards and stories; turned the open questions into choices with recommendations; wrote `plan.md` (flow, 19 screens, in/out tables, data plan, 14 build steps with checks)
- **Designer:** decided all open questions, cut the story scope to story 4, cut the one-tester requests to Storage sorting, gave the reasons for what was left out, approved the data plan for step 1, chose to put the repo on GitHub Pages now instead of at step 14
