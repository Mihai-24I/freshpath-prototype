# DESIGN.md — FreshPath

How FreshPath must look, read and behave. Read together with `AGENTS.md`, which says how to build it, and `plan.md`, which says which screens to build.

**Which file wins:**
- `AGENTS.md` wins on technique.
- This file wins on look, components and tone.
- On **screens and flow**, `plan.md` decides. It is based on, in this order: (1) the user test analysis (`context/prototype-1/user-tests.md`), which overrules (2) breadboard V2 (`context/prototype-1/FreshPath_Breadboards.pdf`, page 2). Breadboard V2 is a starting point; it is updated to V3 after prototype 2 is built. Where this file names screens, tabs or flow steps, it gives examples only.

## 1. Product

**FreshPath** is a handheld app for new employees in the fruit and vegetable department of a supermarket. When a promo display is low or empty, it suggests a substitute product and explains why. It also says how much to place, where to place it, and warns about waste risk. The goal is that new staff refill displays correctly and grow confident in the role.

- **Device:** Android handheld in portrait. Reference screen: OnePlus 15, 1272 × 2772 px (about 412 dp wide). Compact window class only, no tablet or desktop layouts needed.
- **Context:** busy shop floor, bright light, often one-handed, sometimes with gloves, read at a glance.
- **Users:** new or inexperienced fresh-department employees (primary), experienced colleagues and managers (secondary).
- **Language:** English. All content (products, displays, stock, reasons, tasks, users) comes from `data/*.json` (see AGENTS.md: no hardcoded content). Only fixed UI labels such as button and tab names live in the markup.

## 2. Design principles

Use these to choose between valid options.

1. **Explain every suggestion.** Every substitute shows *why* it fits (ripeness, stock, price range), never just *what*.
2. **Readable at a glance.** One decision per screen, status visible without scrolling, the main action always visible.
3. **Build confidence, not dependence.** Show the reasoning ("Why this?") so staff learn the job, not just follow the app.
4. **Waste is a warning, not a mistake.** Flag risk early in the accent colour. Never block the action and never blame the user.

## 3. Accessibility (WCAG 2.2 AA)

- Text contrast at least 4.5:1, non-text UI (borders, icons) at least 3:1. All colour pairs in section 4 pass.
- Touch targets at least 48 × 48 dp.
- **Never colour alone.** Every status has a word and an icon: OK `check_circle`, Low `warning`, Empty `cancel`.
- Works with large system font and TalkBack: semantic HTML, labelled buttons, headings in order.
- Keyboard: Tab moves focus, arrow keys move between displays on the map, Enter opens or confirms, Esc closes a dialog or sheet. Focus is always visible (beer.css default focus ring).
- After each route change, move focus to the view heading (see AGENTS.md).

## 4. Tokens (CSS variables)

There are no YAML tokens. **All tokens are CSS variables.** Colours, font and motion use beer.css's own variables, so every beer.css component picks them up automatically. Views and components never use hex values. They use beer.css classes, or `var(--…)` where `app.css` needs a value.

### 4.0 Loading beer.css (pinned version)

Use **beer.css 5.0.3** (released 4 Aug 2026). Pin this exact version, never `@latest` or `@5`. The `<head>` of `index.html` loads, in this order:

```html
<!-- 1. Fonts (Google Fonts) -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@700&family=Roboto:wght@400;500;700&display=swap">
<!-- 2. beer.css 5.0.3: styles + script (Material Symbols Outlined are bundled with it) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/beercss@5.0.3/dist/cdn/beer.min.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/beercss@5.0.3/dist/cdn/beer.min.js"></script>
<!-- 3. Our overrides last, so the Herb Garden variables win -->
<link rel="stylesheet" href="css/app.css">
```

`<body class="light">`. Don't load any other CSS or UI library, and don't load `material-dynamic-colors` (not needed, see 4.1).

### 4.1 Colour: Herb Garden on beer.css (Material 3 roles)

Put this block once in `css/app.css`. It replaces beer.css's default purple theme. Do **not** call `ui("theme", …)`: it needs an extra library and would overwrite these values. Light mode only (`<body class="light">`).

```css
/* FreshPath theme: Herb Garden. Values from the style guide; (d) = derived to complete the M3 set */
body.light {
  --primary: #24583B;                  /* main actions, active tab, selection */
  --on-primary: #FFFFFF;
  --primary-container: #BFEBCB;        /* (d) */
  --on-primary-container: #00210F;     /* (d) */
  --secondary: #4F6354;                /* (d) */
  --on-secondary: #FFFFFF;
  --secondary-container: #CFE3C2;      /* OK displays, tonal buttons, selected chip */
  --on-secondary-container: #1E2420;
  --tertiary: #F59E0B;                 /* accent: Low, waste risk (10%) */
  --on-tertiary: #1E2420;              /* dark text on accent, never white */
  --tertiary-container: #FFDDB3;       /* (d) soft warning background */
  --on-tertiary-container: #2A1800;    /* (d) */
  --error: #BA1A1A;                    /* Empty display */
  --on-error: #FFFFFF;
  --error-container: #FFDAD6;          /* Empty tile fill */
  --on-error-container: #93000A;
  --background: #F6F4EE;               /* 60% base */
  --on-background: #1E2420;
  --surface: #F6F4EE;                  /* screen background */
  --on-surface: #1E2420;               /* main text */
  --surface-variant: #E1E4DC;          /* (d) */
  --on-surface-variant: #555B57;       /* secondary text */
  --outline: #8A918C;                  /* borders, dashed map frame */
  --outline-variant: #C4C8C0;          /* (d) dividers */
  --shadow: #000000;
  --scrim: #000000;
  --inverse-surface: #2F3330;          /* (d) snackbar */
  --inverse-on-surface: #EFF1EA;       /* (d) */
  --inverse-primary: #A4D3B1;          /* (d) snackbar action */
  --surface-dim: #D9D7D0;              /* (d) */
  --surface-bright: #FBF9F4;           /* (d) */
  --surface-container-lowest: #FFFFFF;
  --surface-container-low: #FFFFFF;    /* article (cards) = white on cream */
  --surface-container: #FFFFFF;        /* map, chips */
  --surface-container-high: #EEEDE6;   /* (d) */
  --surface-container-highest: #E7E6DF;/* (d) */
}
```

**60-30-10:** about 60% background (`--surface`), 30% brand greens (`--secondary-container` for fills, `--primary` for actions), 10% accent (`--tertiary`, only for Low and waste risk).

**Status colours** (the core of the app; use them the same everywhere):

| Status | Fill | Text / icon | Word | Material Symbol |
|---|---|---|---|---|
| OK | `--secondary-container` | `--on-secondary-container` | OK | `check_circle` |
| Low | `--tertiary` | `--on-tertiary` | Low | `warning` |
| Empty | `--error-container` + 2px `--error` border | `--on-error-container` | Empty | `cancel` |
| Selected | keeps its status fill, plus selection marker (see 6.4) | — | — | — |

Contrast checked: `--on-primary` on `--primary` 8.3:1, `--on-tertiary` on `--tertiary` 7.4:1, `--on-surface-variant` on `--surface` 7.0:1, `--on-error-container` on `--error-container` 7.2:1, `--error` on white 6.5:1.

### 4.2 Typography: Roboto Serif + Roboto

One superfamily. **Roboto** for everything (Material 3 default, native on Android). **Roboto Serif Bold** only for screen titles, card titles and display letters.

Both load from Google Fonts in `index.html` (see 4.0).

In `css/app.css` (the one documented exception to "layout only", approved in the style guide):

```css
body { --font: Roboto, "Noto Sans", Arial, sans-serif; }   /* beer.css font token */
:is(h1, h2, h3, h4, h5, h6), .display-letter { font-family: "Roboto Serif", serif; font-weight: 700; }
```

| Role (M3) | Use | Element / beer.css | Size |
|---|---|---|---|
| Title Large | Screen title ("Overview") | `<h1 class="h5 small">` | 20 dp |
| Title Medium | Card title ("Avocados, ready to eat") | `<h2 class="h6 small">` | 16 dp |
| Body Large | Suggestion reasons | `<p>` | 16 dp |
| Body Medium | Stock line, secondary info | `<p class="small-text">` | 14 dp |
| Label Large | Buttons, tabs | beer.css default | 14 dp, 500 |
| Label Small | Overline ("DISPLAY C") | `<span class="small-text upper">` | 11 dp, 500 |

Keep the heading hierarchy semantic (one `h1` per view) and set the visual size with beer.css's `h5`/`h6` + `small` classes. Check the beer.css docs for exact helper names before using one (AGENTS.md: don't invent classes).

### 4.3 Shape, spacing, elevation, motion

| Token | Value | How |
|---|---|---|
| Corner radius | 8 dp on buttons, cards, chips, fields, tiles | beer.css `small-round` on every `button`, `article`, `.chip`, `.field`. No pills, no 12 dp cards. Status tags may use `no-round`. |
| Spacing | 4 dp grid: 4, 8, 12, 16, 24, 32 | beer.css spacing helpers (`small-space`, `space`, `medium-space`, `padding`, `small-padding`). Gaps between stacked blocks: 12 dp. |
| Elevation | Flat by default | `no-elevate` on every `article`. Shadows only for dialogs and the snackbar (beer.css defaults). |
| Motion | beer.css default speeds | Don't add custom animations, except the selection-marker pulse (6.4). State changes 150 ms, sheets 300 ms, screens 400 ms (beer.css `--speed1..4`). Respect `prefers-reduced-motion`. |
| Haptics (described, not built) | Select display: 1 light tick · Confirm refill: 1 firm tap · Empty or waste risk: 2 short pulses | Optional: `navigator.vibrate()` behind a feature check. |

## 5. Layout

- **Grid:** Material 3 compact: 4 columns, 16 dp margins, 12 dp gutters. Use beer.css `grid` with `s12` / `s6` / `s3`, inside `main.responsive`.
- **App shell** (`index.html`), top to bottom:
  1. Top bar (`<header>` or `nav.top`): logo + screen title, user avatar on the right.
  2. **Tabs** (`<div class="tabs">` with `<a>`; active tab has `active`): four tabs. Labels, order and start screen follow `plan.md` (breadboard V2 has Profile · Tasks · Overview · Advanced).
  3. `<main id="app">`: the view.
- **Stack:** vertical, 12 dp gaps. One primary action per view, placed in the lower half (reachable with the thumb).
- No bottom navigation, no floating action button, no drawer.

## 6. Components

Use beer.css components first. Build web components (`app-` prefix, light DOM) only for things reused across views.

### 6.1 Buttons
- **Filled** (`button` + `small-round`): the **one** main action per view ("Find alternatives", "Next: how to place", "Confirm").
- **Outlined** (`button border small-round`): secondary action ("Open details", "See other options").
- **Text** (`button transparent` or a link): tertiary ("Back to overview").
- Primary and secondary must never look the same (user test feedback: "have a primary button and a secondary button").
- States: default, pressed, focus, disabled (beer.css). Min height 48 dp. Button labels are verbs.

### 6.2 Count chips
`.chip small-round` with a status icon and a count: "6 OK · 1 Low · 2 Empty". Tapping a chip filters the map to that status; the active chip uses `fill`.

### 6.3 Tabs
beer.css `tabs`, four items, active = `--primary` text with a 3 dp underline (beer.css default).

### 6.4 Display tile (`<app-display-tile>`), the core component
One tile per promo display on the store map.
- Shows the **display letter** (Roboto Serif, `.display-letter`) and the **status word** below it, inside the tile.
- Fill and text follow the status table in 4.1.
- Tiles of one gondola (e.g. D-E-F) touch each other as one unit, with no gap.
- **Selected:** keeps its status fill and gets four tiny diagonal lines at the corners pointing outward (4 dp long, 0.5 dp thick, `--primary`). This is drawn in `app.css` with pseudo-elements or an inline SVG; it is the designer's signature marker, keep it subtle.
- **Selected, animated:** the four marks move back and forth along their diagonal (out 1 dp and back, ease-in-out, about 1 s per cycle) to show which display is in focus. They pulse **3 times when a display is selected**, then stay still in the outward position. The 3-cycle limit keeps the motion under 5 s, which meets WCAG 2.2.2 (Pause, Stop, Hide). With `prefers-reduced-motion: reduce`, the marks are still, with no pulse. One `@keyframes` rule in `app.css` is the only custom animation in the app.
- **Keyboard focus:** beer.css focus ring.
- It is a `button` with `aria-label`, e.g. "Display C, avocados, low, 4 of 35".

### 6.5 Store map (`<app-store-map>`)
- A white container (`--surface-container`) with a **1.5 dp dashed `--outline` border**, about 200 dp tall.
- Tiles are placed with the `map` coordinates from `data/displays.json` (percent of the map), so the map matches the real store layout.
- "Entrance ↓" label at the bottom edge.
- The count chips sit directly **below** the map.

### 6.6 Display card
`article no-elevate small-round` under the chips, for the selected display:
- Overline "DISPLAY C", title (product name), status tag (`no-round`, status colours).
- Stock bar: `<progress>` showing on display / capacity, coloured with the status colour.
- "4 of 35 pcs on display" and the promo text.
- Actions: outlined "Open details" + filled "Find alternatives".

### 6.7 Substitute card
`article no-elevate small-round`, one per suggestion, best match first:
- Title (product), "Best match" tag in `--secondary-container` on the first one.
- 2–3 **reason lines**, each with `check_circle` (fit) or `warning` (risk). Text from `data/substitutes.json`.
- Stock and capacity, and the warning tags (cooling, promo, waste risk).
- The whole card is tappable and opens the "Why this suggestion" screen. That screen shows a short summary on top (fixed template, not AI-written), then one row per factor with **one consistent rating style**, and explanations from `data/reasons.json` (principle 3).

### 6.8 Snackbar
beer.css `.snackbar` on the Overview right after Confirm: "Display C updated" + **Undo** action, visible for 5 s. The updated tile shows its new status at the same time. Every save or replace action ends with this kind of visible confirmation (user test: testers didn't know whether an action had worked). The confirm step itself is a screen, never a pop-up dialog.

### 6.9 Empty and error states
Plain sentence + icon + one next step. See patterns 7.2.

## 7. Patterns

### 7.1 Refill with a substitute (core flow)
The screens and their order come from `plan.md`. In short:
1. **Overview:** tap a Low or Empty tile → it gets the selection marker, the display card updates.
2. **Find alternatives:** short problem step (reason optional, no loading screen), then the substitute list, best match first.
3. **Choose with reasons:** tap a card → the reasons screen, summary on top.
4. **Amount and placement:** suggested amount (adjustable), then where to get it and how to place it.
5. **Confirm:** summary, optional photo (say why it helps the manager) → back to the Overview with the snackbar and the updated tile, decision saved to My decisions.

### 7.2 Edge cases
| Case | Behaviour |
|---|---|
| No substitute in stock | Say so plainly ("No substitute in stock right now."). Keep the display marked Empty. Offer one action: "Report to manager" (creates a task). |
| Waste risk | Show it on the substitute card in accent colour with the reason ("Sell within 2 days"). Never blocks the action. |
| Offline / stale data | Show "Updated 13:40" under the title. Use the last saved data. |
| Wrong choice | Undo in the snackbar, or edit later from Tasks. |
| Nothing to do | Overview with all tiles OK: "All displays are full. Nice work." |

### 7.3 Status rules (used by the data layer)
- **Empty:** `onDisplay` = 0.
- **Low:** `onDisplay` ≤ 25% of `capacity`.
- **OK:** otherwise.
- A substitute is **available** only when its product's `storageQty` ≥ the suggested `amount`. Show available ones by `rank`. If none are available, show the "No substitute in stock" state (display H is seeded this way on purpose).
- Confirming a refill: set the display's `productId` to the substitute, `onDisplay` += amount (up to `capacity`), lower the product's `storageQty`, save the decision (for My decisions), mark the related task done.

### 7.4 Seed data (`data/*.json`)
| File | Contains |
|---|---|
| `store.json` | Store and department name, last sync time ("Updated 13:42") |
| `users.json` | Demo accounts: Mia (Employee) and Sam (Manager), password `demo1234` |
| `displays.json` | Displays A–I: product, on display, capacity, promo, gondola unit, map position in % |
| `products.json` | Products with price range, ripeness, storage quantity and location, sell-within days |
| `substitutes.json` | Ranked substitutes per product, reasons, amount, placement, waste risk |
| `reasons.json` | Explanations per reason (reasons screen) |
| `tasks.json` | The employee's tasks (Tasks tab) |

Seeded state matches the style guide screen: 6 OK, 1 Low (C, avocados 4 of 35, promo "2 for €3"), 2 Empty (E strawberries, H basil).

This seed covers the map and the substitute choice. Keep the displays, map positions, products and store as they are (they match the style guide boards). In the first step of `plan.md`, extend it in the same style: top 5 substitutes per Low/Empty display, problem reasons, factor ratings, amounts and placement steps, manager notes and tasks, decisions with manager feedback.

## 8. Content and tone

- Calm, short and helpful, like an experienced colleague. Sentences, not shouting.
  - ✓ "Avocados are low. Mango is ripe and in stock."
  - ✕ "ERROR: STOCK LOW. ACTION REQUIRED."
- Lead with the product, then the action. Numbers as digits ("4 of 35 pcs").
- No blame, no exclamation marks except in praise.

**Product terms** (use exactly these words):

| Term | Meaning |
|---|---|
| Display | A promo table or stand on the shop floor, named by a letter (A–I) |
| Low | Few items left (≤ 25% of capacity) |
| Empty | Nothing left on the display |
| Substitute | A product placed instead of a sold-out one |
| Waste risk | Likely to spoil before it sells |
| Refill | Restocking a display |
| Storage | The back room / cold room stock |

## 9. Assets

- **Logo:** "Refill Crate" (crate with an orange and a green apple) + wordmark "FreshPath" in Roboto Serif Bold. Green `--primary` on light, cream `--surface` on green. Minimum 24 dp symbol. Clear space = height of the orange. Never recolour, stretch or add effects. Use it in the top bar and on the login screen.
  - Files in `assets/`: `logo-symbol.svg` (for light backgrounds), `logo-symbol-on-green.svg` (for `--primary` backgrounds), `app-icon.svg` (rounded square; also the favicon: `<link rel="icon" href="assets/app-icon.svg" type="image/svg+xml">`).
  - The crate slats are real cut-outs, so the symbol works on any background.
  - **Lockup** = `<img src="assets/logo-symbol.svg" alt="" width="32" height="32">` + the text "FreshPath" in a heading (Roboto Serif Bold via the rule in 4.2). Don't put the wordmark inside the SVG: fonts don't load in `<img>` SVGs. The image has empty `alt` because the visible text already names the app.
- **Icons:** Material Symbols Outlined (bundled with beer.css), `<i>icon_name</i>`, 24 dp.

| Meaning | Icon |
|---|---|
| Refill | `shopping_basket` |
| Substitute | `swap_horiz` |
| Low / waste risk | `warning` |
| Empty | `cancel` |
| Confirmed / OK | `check_circle` |
| Overview map | `grid_view` |
| Location / placement | `location_on` |
| Storage | `warehouse` |
| Tasks | `checklist` |
| Profile | `person` |
| Why this? | `lightbulb` |
| Info / updated | `info` |
| Undo | `undo` |

- **Photography:** not used in the prototype UI. If an image is ever needed: real photos of real work, natural daylight, no text over photos. No illustrations.
- **Sound:** none (noisy shop floor).

## 10. Don'ts

- No custom hex colours in views or components: only the variables in 4.1.
- No pill buttons, no 12 dp cards, no shadows on cards.
- No status shown by colour alone.
- No pop-up confirmation dialogs; confirm on a screen and offer Undo.
- No text over images, no illustrations, no emoji in the UI.
- No new beer.css classes; check the docs.
