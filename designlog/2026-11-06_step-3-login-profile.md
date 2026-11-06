## Design log — 6 Nov 2026 — FreshPath prototype 2, step 3 (Login, auth guard, Profile)
**Session goal:** Build step 3 of plan.md: Login (screen 0), fake auth, route guard, Profile (screen 13, without Replay intro), then check the GitHub Pages build.

### Key moments
**Reset demo data keeps you logged in** · started by AI
- What happened: AGENTS.md says `reset()` clears every `app:*` key, but that also wipes `app:session` and logs Mia out on the Profile screen where she tapped Reset. The AI changed `reset()` to keep the session key and flagged the difference in its Notes.
- Decision: kept as built and committed (designer approved the commit; the deviation itself was not discussed).
- Why: Stay logged in on Profile: Reset demo data shouldn't log the demo user out. (designer's pick from options)
- 🖼️ [profile before](screenshots/2026-11-06_profile_before.png) · [profile after](screenshots/2026-11-06_profile_after.png)

**Login screen layout fixed after screenshots** · started by AI
- What happened: The first screenshots showed the "Log in" button running off the right edge and the Profile name/role not lining up with the avatar. The AI fixed both (button sizing, `nav` row, no margins on the name block) and retook the shots.
- Decision: accepted as built.
- Why: Match DESIGN.md: the layout should follow the style guide. (designer's pick from options)
- 🖼️ [login after](screenshots/2026-11-06_login_after.png) · [profile after](screenshots/2026-11-06_profile_after.png)

**Manager lands on Team, not Overview** · started by designer (earlier plan decision, applied here)
- What happened: Per plan.md, Sam's second tab reads "Team" and he starts there after login; Mia going to `#/manager` is sent to Overview, and Sam going to `#/tasks` is sent to Team.
- Decision: built as planned.
- Why: "a manager's job is reviewing the team, not doing shift tasks." (plan.md)
- 🖼️ [team after](screenshots/2026-11-06_team_after.png)

**Verified on GitHub Pages** · started by designer
- What happened: After the commit and push, the designer asked to confirm the live build works for Mia and Sam and that paths are relative. Both logins, reload, role redirects and logout worked live; no absolute paths, no 4xx.
- Decision: step 3 counts as working on Pages.
- Why: Test on my phone: the same build is used for phone testing. (designer's pick from options)

### AI suggestions not used
- None offered this session. No suggestion was rejected or changed by the designer.

### Who did what
- **AI:** read plan.md, built auth.js, router guard, Login and Profile views, snackbar helper, Team placeholder; took before/after screenshots; ran the "done when" check locally and on Pages; fixed layout issues found in the screenshots; proposed the commit message.
- **Designer:** chose the step and its decisions earlier in plan.md (tab order, manager via account, Team tab), approved commit and push, asked for the Pages check.

### Process note
- The first "before" screenshot was of the wrong screen because Git Bash rewrote `#/profile` into a Windows path. It was retaken from a checkout of the previous commit so the before/after pair is correct.
