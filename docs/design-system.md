# Neurosync Design System

*A calm-screen design language for focus and wellness.*

This document is the source of truth for the Neurosync visual system, extracted from the calm-screen redesign (`index.html`, `mockup-calm.html`). It is written for designers and front-end engineers building new screens or extending existing ones. The intent: any new surface should feel like it belongs to the same quiet room.

The aesthetic sits with **Headspace, One Sec, Calm, Oak** — not with developer tools, not with neuro-feedback dashboards, not with crypto.

---

## 1. Foundations

### 1.1 Color

Color is doing three jobs here: **paper** (the surface you read on), **ink** (the type and primary action), **wash** (atmosphere — soft chromatic drift in the background). One accent only. No semantic rainbow.

#### Surface & ink

| Token | Role | Light | Dark |
|---|---|---|---|
| `--paper` | Base canvas | `#F4EFE6` | `#15110D` |
| `--paper-elev` | Raised surface (drawer, modal, card hover) | `#FBF7EE` | `#1D1814` |
| `--ink` | Primary text, primary button fill | `#2B2620` | `#ECE6D8` |
| `--ink-soft` | Body text, secondary | `#5A5147` | `#B8AE9C` |
| `--ink-muted` | Meta, labels, icon-button rest state | `#8A7F70` | `#786F60` |
| `--ink-faint` | Placeholder, grab handles, disabled | `#B8AE9C` | `#4A443A` |
| `--line` | Default 1px borders | `rgba(43,38,32,.10)` | `rgba(236,230,216,.08)` |
| `--line-strong` | Hover borders, separators | `rgba(43,38,32,.18)` | `rgba(236,230,216,.14)` |

#### Atmospheric wash

These are *never used as fills on components*. They drive the drifting background blobs only.

| Token | Mood | Light | Dark |
|---|---|---|---|
| `--wash-a` | Dawn peach | `#F3D9C0` | `#3A2A28` |
| `--wash-b` | Dusty rose | `#E4C8C2` | `#2E2A38` |
| `--wash-c` | Sage haze | `#C9D2C4` | `#25302C` |
| `--wash-d` | Sand (reserved) | `#E8DCC0` | `#2A2418` |

#### Accent + status

One accent — a desaturated matcha green. Used **only** for: active states, focus rings on form inputs, completed timeline nodes, the success/end-early control.

| Token | Role | Light | Dark |
|---|---|---|---|
| `--accent` | Active border, slider thumb ring | `#6E7F6A` | `#9DB098` |
| `--accent-deep` | Active text on accent backgrounds | `#4E5C4B` | `#B6C6B0` |
| `--accent-soft` | Active background tint | `rgba(110,127,106,.10)` | `rgba(157,176,152,.10)` |
| `--accent-glow` | Reserved (focus halo) | `rgba(110,127,106,.20)` | `rgba(157,176,152,.22)` |
| `--success` | Same intent as accent-deep | `#4E5C4B` | `#B6C6B0` |
| `--danger` | Destructive (delete, crumple-over-trash) | `#B85C4C` | inherits |

#### Brainwave band tokens (system-internal)

These exist because JS may set `--accent` at runtime when the user selects a band. **They are not exposed as user-visible color coding** (no rainbow band pills — see anti-patterns). Treat them as a single-channel accent override.

| Token | Hex | Glow |
|---|---|---|
| `--delta` | `#6F7CA8` | `rgba(111,124,168,.18)` |
| `--theta` | `#8C7BAE` | `rgba(140,123,174,.18)` |
| `--alpha` | `#6E7F6A` | `rgba(110,127,106,.18)` |
| `--beta`  | `#B59065` | `rgba(181,144,101,.18)` |
| `--gamma` | `#B85C4C` | `rgba(184,92,76,.18)` |

```css
:root {
  --paper: #F4EFE6;
  --paper-elev: #FBF7EE;
  --ink: #2B2620;
  --ink-soft: #5A5147;
  --ink-muted: #8A7F70;
  --ink-faint: #B8AE9C;
  --line: rgba(43,38,32,.10);
  --line-strong: rgba(43,38,32,.18);

  --wash-a: #F3D9C0;
  --wash-b: #E4C8C2;
  --wash-c: #C9D2C4;
  --wash-d: #E8DCC0;

  --accent: #6E7F6A;
  --accent-deep: #4E5C4B;
  --accent-soft: rgba(110,127,106,.10);
  --accent-glow: rgba(110,127,106,.20);
  --success: #4E5C4B;
  --danger:  #B85C4C;
}
```

---

### 1.2 Typography

Two families. **Fraunces** is the voice; **Manrope** is the system. No monospace, ever.

```css
--serif: 'Fraunces', Georgia, serif;
--sans:  'Manrope', system-ui, -apple-system, sans-serif;
```

#### Fraunces — when to use

Fraunces carries every moment the product wants to feel human: the time numeral, panel titles, labels on pills and cards, the brand mark, the phase line. Use it italic for soft, declarative copy ("begin where you are", "Atmosphere", "Sprint"). Use it upright **only** for the large time display.

| Weight | Style | Use |
|---|---|---|
| 300 | upright | The 168px time display (only) |
| 400 | italic | Phase line, session label, drawer label, panel titles, card labels, fader labels, pill names |
| 500 | italic | Modal H2 / H3, section titles |

**Optical size matters.** Fraunces is a variable opsz font; the spec ships `9..144`. The time display **must** set `font-variation-settings: 'opsz' 144` so the numerals read as display type, not as inflated body type.

```css
.time-display {
  font-family: var(--serif);
  font-weight: 300;
  font-variation-settings: 'opsz' 144;
  font-size: 168px;
  line-height: .95;
  letter-spacing: -.025em;
  font-feature-settings: 'tnum'; /* tabular numerals so :05 → :06 doesn't jitter */
}
```

#### Manrope — when to use

Manrope handles structural / functional copy: meta-strip, fader values, drawer tab labels, body paragraphs in modals, settings labels, input fields (except the thought-parking input, which is italic Fraunces for journaling tone).

| Weight | Use |
|---|---|
| 400 | Body paragraphs, drawer tabs, settings rows |
| 500 | Emphasized inline meta (`<strong>` inside meta strip) |

#### Type scale (extracted)

| Token | Size | Family | Where |
|---|---|---|---|
| display | 168px / lh .95 / -.025em | Fraunces 300 upright | Time display |
| h2 | 32px | Fraunces 500 italic | Modal title |
| panel-title | 22px | Fraunces 400 italic | Drawer panel title, section title |
| brand | 20px | Fraunces 400 italic | Top-bar brand mini |
| h3 | 18px | Fraunces 500 italic | Modal subhead |
| phase-line | 18px | Fraunces 400 italic | Phase line under time |
| session-label | 17px | Fraunces 400 italic | Above time |
| entrain-name | 17px | Fraunces 400 italic | List item primary |
| card-label | 16px | Fraunces 400 italic | Pill / fader / sound-row label |
| dump-input | 15px | Fraunces 400 italic | Thought parking input |
| band-name | 15px | Fraunces 400 italic | Band pill label |
| body | 14px | Manrope 400 | Modal paragraph, dump item |
| timeline-label | 13px | Fraunces 400 italic | Journey timeline |
| settings-row | 13px | Manrope 400 | Settings label |
| pill-tab | 12px | Manrope 400 | Drawer tab, interval val |
| meta | 12px | Manrope 400, .06em tracking | Meta strip, fader value |
| caption | 11px | Manrope 400, .04em tracking | Band Hz, micro-meta |
| micro | 10px | Manrope 400, .04em tracking | Bounds in settings, timeline-hz |
| trash-label | 8px / .1em / uppercase | Manrope 400 | Trash zone |

#### Italic rule

Fraunces in this system is **default-italic**. Upright Fraunces only appears in the display numeral. If you find yourself reaching for upright Fraunces for a label, you want Manrope instead.

---

### 1.3 Spacing

No explicit spacing token set exists yet — values are inlined. The pattern observed:

| Step | px | Used for |
|---|---|---|
| 1 | 2 | Tight gap inside compact stacks (info column) |
| 2 | 4 | Pip separators, micro-gaps inside buttons |
| 3 | 6 | Tab gap, journey-btn internal stack |
| 4 | 8 | Drawer-handle inner gap, band-pill gap, dump-list gap |
| 5 | 10 | Top-actions gap, interval-grid gap, dump-row gap |
| 6 | 12 | Run-controls gap, sound-row vertical padding, dump-item padding-y |
| 7 | 14 | Drawer grab margin-bottom, entrain-item gap, dump-item padding-x |
| 8 | 16 | Sound-row gap, interval-card padding-x, fader-channel gap |
| 9 | 18 | Drawer padding-top, modal margin-bottom blocks |
| 10 | 22 | Drawer tabs margin-bottom, meta-strip gap, panel-title margin-bottom |
| 11 | 24 | Modal overlay padding, trash-zone offset |
| 12 | 28 | Stage padding, calm gap, drawer padding-x |
| 13 | 32 | Drawer-handle margin-top, modal padding-x/y |
| 14 | 40 | Calm padding-top |

**When formalizing**: collapse to a base-4 scale (4, 8, 12, 16, 20, 24, 28, 32, 40). Treat 28 as the canonical "outer gutter" and 16 as the canonical "card padding".

---

### 1.4 Radius

```css
--r-sm: 12px;   /* inputs, dump items, dump ghost */
--r:    20px;   /* cards: interval, entrain, journey, band-pill chip-radius via 999 */
--r-lg: 28px;   /* modal */
--r-xl: 36px;   /* drawer top corners */
```

Plus two unnamed radii used directly:

| Value | Use |
|---|---|
| `50%` | Play button, icon buttons, slider thumbs, dots, side-controls, dump-add, modal-close |
| `999px` | Pills: drawer tabs, band-pill, settings-link, fader track |

**Rule of thumb:** the larger the surface, the larger the radius. Drawer (huge) is 36px. Modal (medium) is 28px. Card (small) is 20px. Inline input (smaller still) is 12px. Anything circular or pill-shaped is 50% / 999px.

---

### 1.5 Motion

Motion in this system is **slow, ambient, and never demands attention**. The active animations are atmospheric drift and a single breathe pulse on the primary action.

#### Keyframes

```css
@keyframes driftA { from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(8vmin,6vmin) scale(1.1); } }
@keyframes driftB { from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(-10vmin,-4vmin) scale(1.08); } }
@keyframes driftC { from { transform: translate(-50%,0) scale(1); }
                    to   { transform: translate(-46%,4vmin) scale(1.12); } }
@keyframes breathe {
  0%, 100% { transform: scale(1);    opacity: .8; }
  50%      { transform: scale(1.06); opacity: .35; }
}
```

#### Durations & easing

| Use | Duration | Easing |
|---|---|---|
| Drift A (background wash, top-left) | 28s | `ease-in-out infinite alternate` |
| Drift B (background wash, bottom-right) | 36s | `ease-in-out infinite alternate` |
| Drift C (background wash, center) | 44s | `ease-in-out infinite alternate` |
| Breathe (play-btn halo) | 5s | `ease-in-out infinite` |
| Drawer open/close | 380ms | `cubic-bezier(.2,.7,.2,1)` |
| Hover state (color, border, bg) | 180ms | `ease` |
| Play-btn lift on hover | 220ms | `ease` |
| Run-controls fade-in | 220ms | `ease` |
| Crumple (trash) | 540ms | forwards, custom |

**The three drift cycles are intentionally prime-ish (28 / 36 / 44s) so the composition never repeats exactly.** When adding a new ambient element, pick a duration that doesn't divide evenly into the others.

#### Reduced motion

All ambient animation respects `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  .atmosphere::before, .atmosphere::after, .wash-c { animation: none; }
  .play-btn-calm::before { animation: none; }
}
```

Hover/state transitions remain — only the *infinite* loops are suspended. This is non-negotiable for any new ambient effect.

---

### 1.6 Elevation

**Depth here is not box-shadow.** It is three layers stacked back-to-front:

1. **Paper** — the flat base.
2. **Wash** — chromatic drift painted in via `mix-blend-mode: multiply` (light) / `screen` (dark). This is the only thing that gives the page a sense of "weather".
3. **Paper-elev + 1px line** — raised surfaces (drawer, modal, hover state on cards) shift from `--paper` to `--paper-elev` (a hair lighter/warmer in light mode, a hair lighter in dark) and gain a `1px solid var(--line)` border.

Box-shadow exists in exactly four places and only ever to soften — never to "pop":

| Component | Shadow |
|---|---|
| Play button (rest) | `0 16px 40px -16px rgba(43,38,32,.45)` |
| Play button (hover) | `0 22px 48px -18px rgba(43,38,32,.55)` |
| Drawer (above) | `0 -24px 60px -28px rgba(43,38,32,.22)` |
| Modal | `0 40px 80px -30px rgba(0,0,0,.4)` |
| Slider thumb | `0 2px 6px rgba(43,38,32,.18)` |
| Dump-ghost (drag) | `0 12px 30px -10px rgba(43,38,32,.3)` |

All shadows use warm-ink rgba — never neutral grey, never blue-tinted. All use a large negative spread to keep them long, soft, and low-contrast.

---

## 2. Components

### 2.1 Primary action — Play button (`.play-btn-calm`)

**Purpose.** The one verb on the calm screen: begin.

**Anatomy.** 88px dark ink circle, paper-colored glyph (play triangle, 30px, offset 4px left for optical centering; pause replaces on play). A `::before` pseudo-element draws a 1px line-on-line halo, breathing on a 5s loop.

**States.**
- Rest: ink fill, paper glyph, soft warm drop-shadow, halo breathing at .8→.35 opacity.
- Hover: lifts 2px, shadow deepens.
- Active: returns to baseline (no press-darken).
- Playing: glyph swaps to pause (no left offset).

**Use.** Exactly one per screen. The only thing on the calm screen that asks to be tapped.

**Don't.** Don't add a second 88px button anywhere. Don't recolor it (no accent green, no gradient). Don't put it inside a card.

---

### 2.2 Icon button — quiet circle (`.icon-btn-quiet`, `.side-control`)

**Purpose.** Top-bar utilities (theme, settings) and in-context secondary controls (skip, end early, phase switcher).

**Anatomy.** 38px circle, transparent fill, `1px solid var(--line)`, 16px stroke icon at 1.4 stroke-width in `--ink-muted`.

**States.**
- Rest: muted ink, faint line.
- Hover: ink darkens to `--ink`, line firms to `--line-strong`, background fills with `--paper-elev`.
- Success variant (`.side-control.success`): `--accent` border, `--accent-deep` icon. Used for "end early / good enough".

**Use.** Anything secondary. Group with 10–12px gap. Stick to 38px — don't size up.

**Don't.** Don't fill them with `--ink` (that's the play button's job). Don't add labels next to them — the icon must read alone. Don't use stroke-width above 1.6.

---

### 2.3 Drawer (`.drawer`)

**Purpose.** The single home for all the machinery — sound mix, presets, journey, notes. Anything that isn't "begin" lives here.

**Anatomy.** Fixed bottom sheet, full width, `--r-xl` (36px) top corners only, `--paper-elev` background, 1px top line, long warm shadow above. Peek state shows 56px of header at rest (`translateY(calc(100% - 56px))`); open state slides fully up. Max 80vh, scrolls internally.

A grab pill (44×5, `--ink-faint` at .5 opacity) sits centered at the top of the drawer; a second grab handle (`.drawer-handle`) lives on the main stage as a labeled tap target ("sound · presets · journey · notes" in Fraunces italic 13px).

**States.**
- Closed (peek): handle visible, label readable.
- Open: full body slides up over 380ms on `cubic-bezier(.2,.7,.2,1)`.

**Use.** All settings, mixers, presets. The drawer is the answer to "where does this go?" until proven otherwise.

**Don't.** Don't open the drawer programmatically without user action. Don't add a 5th tab without first asking whether one of the existing four can absorb it.

---

### 2.4 Pill chips (`.drawer-tab`, `.band-pill`)

**Purpose.** Categorical selection inside the drawer.

**Anatomy.** 999px radius, transparent background, 1px line border, Manrope (drawer-tab) or Fraunces italic (band-pill) label, optional 8px color dot (band-pill).

**States.**
- Rest: muted ink on transparent.
- Hover: ink darkens, line firms.
- Active (drawer-tab): inverts — `--ink` background, `--paper` text. High contrast says "this is selected".
- Active (band-pill / interval / journey / entrain): `--accent-soft` bg, `--accent` border, `--accent-deep` text. Low contrast says "this is the current choice but not a destination".

**Use.** Tab-row navigation (high contrast active) vs. multi-select-ish chip (low contrast active). The two active treatments are deliberate and different — don't mix them.

---

### 2.5 Fader row (`.fader-channel`, `.sound-row`)

**Purpose.** Continuous mix control.

**Anatomy.** Three-column grid: `96px 1fr 44px` (label · slider · value). Label is Fraunces italic 16px ink; slider is a 4px track in `--line` with a 16px paper-fill thumb ringed in `--accent` (1.5px) with a soft shadow; value is right-aligned Manrope 12px in `--ink-muted`. Rows divided by 1px lines, no divider on last child.

**Use.** Anywhere you need a 0–100 mix.

**Don't.** Don't show units. The value is a unitless number 0–100. Don't color-code the track based on the channel.

---

### 2.6 Card with hover (`.interval-card`, `.entrain-item`, `.journey-btn`)

**Purpose.** Selectable preset cards in a grid (interval, journey) or list (entrain-item).

**Anatomy.** `--r` (20px) radius, transparent background, 1px line border, Fraunces italic label + Manrope micro-meta beneath, all centered (grid cards) or left-aligned with leading icon (list cards).

**States.**
- Rest: transparent on paper.
- Hover: background → `--paper`, border → `--line-strong`. The card "lifts" by gaining a surface, not a shadow.
- Active: `--accent-soft` bg, `--accent` border, `--accent-deep` text — all sub-meta inherits the deep accent color too.

**Use.** Any "pick one" grid. 4 columns at default container width; the system has not yet committed to a mobile reflow (see gaps).

---

### 2.7 Time display (`.time-display`)

**Purpose.** The single most prominent element on the calm screen.

**Anatomy.** Fraunces 300 upright, `opsz 144`, 168px, line-height .95, -.025em tracking, `tnum` for tabular figures. Centered, non-selectable.

**Rule.** This is the *only* upright Fraunces in the system. Anywhere else, Fraunces is italic.

**Don't.** Don't bold it. Don't condense or stretch it. Don't add a unit suffix ("min"). Don't put a progress ring around it.

---

### 2.8 Meta strip (`.meta-strip`)

**Purpose.** Quiet, glanceable context under the play button: round, frequency-by-name, sits-today.

**Anatomy.** Horizontal flex, 22px gap, Manrope 12px in `--ink-muted` with .06em tracking. Inline `<strong>` (Manrope 500) for the value, in `--ink-soft`. Items separated by 4px `--ink-faint` pips (`.pip`).

**Use.** When you need to surface 2–4 pieces of context without giving any of them their own row.

**Don't.** Don't use it for action labels. Don't exceed 4 items. Don't put numbers without a word ("1/4" is okay because it's the value of "round"; "10 Hz" is not — surface as "alpha · soft" instead, see §3 Words not numbers).

---

### 2.9 Atmospheric wash (`.atmosphere`, `.wash-c`)

**Purpose.** The visual signature. The room.

**Anatomy.** Three large radial-gradient blobs:
- `::before` — wash-a, top-left, 110vmin square, blur 80px, opacity .55, `multiply` blend (light) / `screen` blend (dark, .35 opacity), drifting on `driftA` 28s.
- `::after` — wash-c, bottom-right, same dimensions, drifting on `driftB` 36s.
- `.wash-c` (element) — wash-b, center, 80vmin square, blur 90px, opacity .35, drifting on `driftC` 44s.

`z-index: 0`, `pointer-events: none`, `position: fixed inset:0`.

**Use.** Always on. The wash is the page; you don't paint it onto sections.

**Don't.** Don't animate it faster than 20s. Don't crop it inside a container — it's a fixed-viewport phenomenon. Don't substitute a static gradient image (the drift is the whole point).

---

### 2.10 Modal overlay (`.modal-overlay` + `.modal`)

**Purpose.** Settings, deep info, anything that needs full attention.

**Anatomy.** Overlay: `rgba(43,38,32,.36)` warm-ink scrim with `backdrop-filter: blur(8px)`. Modal: `--paper-elev`, `--r-lg` (28px) radius, 32px padding, max 560px wide, max 80vh tall, long soft shadow. Includes a grab handle (decorative, indicates dismissibility) and a 32px circle close button top-right.

**Use.** Deep settings, journey customization, about. Reach for the drawer first; reach for a modal only when context must be fully replaced.

---

## 3. Patterns & Principles

These are the rules behind every choice above. When in doubt, return here.

### One verb, one button
The calm screen has exactly one primary action: **begin**. Everything else is either ambient context (time, phase line, meta strip) or hidden one tap away (drawer). If a new screen has two primary verbs, you're designing two screens.

### Words, not numbers
Surface `alpha · soft`, not `10 Hz alpha`. Surface `Classic 25/5`, not `1500s focus / 300s break`. Surface `round 1/4`, not `cycle 1 of 4`. Frequency, milliseconds, dB — all of that lives in the developer console, not in the UI.

### Hide the machinery
Sliders, presets, frequency bands, audio engines — all live behind one drawer handle. The handle's label even names what's inside ("sound · presets · journey · notes") so opening it never surprises. A user who never opens the drawer should still get a complete experience.

### Warm paper, not glass
Depth = `paper → paper-elev + 1px line + ambient wash`. Never `frosted glass + drop shadow + glow`. The system has zero glassmorphism. The only blur is the wash and the modal scrim.

### One accent, used sparingly
The matcha green appears only on active states and the success control. It is never decorative. If a new component needs "a bit of color", the answer is almost always "use the wash to set mood, leave the component in ink".

### Optical, not mathematical
The play icon is offset 4px left because a triangle's visual centroid is right of its bounding-box center. The drawer-handle label sits 32px above the drawer because that's where it reads as connected; 24px reads as cramped, 40px reads as orphaned. Trust your eyes over your inspector.

### Quiet motion
Nothing animates faster than 180ms on hover, nothing loops shorter than 5s. The page should feel like it's breathing, not pulsing.

### Italic as voice
Italic Fraunces is how the product talks ("begin where you are", "Mind is clear.", "Capture, return to focus"). Upright body type is for system data. The voice and the data are visibly different.

---

## 4. Anti-patterns

Concrete don'ts. These are the v1 sins this redesign was built to remove.

- **No monospace anywhere.** No `Courier`, no `Fira`, no `JetBrains`. The product is not a terminal.
- **No neon glow shadows.** No `box-shadow: 0 0 24px var(--accent)`. Glow signals "tech" and breaks the warm-paper illusion.
- **No rainbow brainwave-band coding.** Bands have hex tokens internally (`--delta`, `--theta`, etc.) and JS may set `--accent` from them, but the UI never shows the five colors side-by-side as a legend or color-codes pills by band. One accent shows at a time.
- **No dark navy background.** Dark mode is `#15110D` — warm near-black, same ink hue as light mode. Never `#0A0E1A` or any blue-cast dark. Test the dark-mode `--paper` against `--paper` light: they should feel like the same room with the lights off, not two different apps.
- **No emoji buttons.** All icons are 1.4–1.6 stroke-width line SVGs in `--ink-muted`. No 🧠, no ⏱️, no 🌿.
- **No "Hz" or technical jargon in user-facing copy.** No `Hz`, `ms`, `dB`, `BPM`, `EEG`, `binaural beat carrier frequency`. The string `alpha · soft` is the entire surface vocabulary for a 10 Hz alpha entrainment tone.
- **No glassmorphism.** No `backdrop-filter` on resting components. The modal scrim is the only exception.
- **No gradient buttons.** Buttons are one of: solid ink (primary), transparent (icon/card), or accent-soft (active card). No gradient fills.
- **No drop-shadow on the time display.** It is type, not a logo.
- **No progress ring around the time.** The ring SVG is kept in the DOM for legacy JS but is `.hidden-keep` (visually hidden). Pomodoro progress is surfaced as `round 1/4` text, not a circle.
- **No system-blue links.** `--accent-deep` is the only colored text. Default to underlined ink for inline links if/when they appear.
- **No micro-bounce / spring overshoot.** Easing is `ease`, `ease-in-out`, or the drawer's `cubic-bezier(.2,.7,.2,1)` (smooth deceleration, no overshoot).
- **No second 88px circle.** The play button is unique on the screen.

---

## 5. Usage examples

### 5.1 How to build a new modal in this system

```html
<div class="modal-overlay show" role="dialog" aria-modal="true">
  <div class="modal">
    <button class="modal-close" aria-label="Close">×</button>
    <div class="modal-handle"></div>
    <h2>Begin a longer sit</h2>
    <p>A 50/10 cycle gives your attention more room to settle. Most people find it useful after a week of Classic.</p>

    <h3>How it feels</h3>
    <p>Two cycles take just under two hours. You can stop at any round.</p>

    <button class="settings-link">try deep mode</button>
  </div>
</div>
```

Rules:
- One `<h2>` per modal.
- Body uses Manrope 14px in `--ink-soft`, line-height 1.6.
- CTAs are pill-shaped (`--r` 999px) with `--accent-deep` text and transparent fill.
- Never put a primary 88px play button inside a modal.

---

### 5.2 How to add a new drawer tab

1. Add a `<button class="drawer-tab" data-tab="rituals">rituals</button>` to `.drawer-tabs`. Keep the label one word, lowercase, Manrope 12px (no change needed — the class handles it).
2. Add a matching panel:

```html
<section class="panel-section" data-tab-panel="rituals" style="display:none;">
  <div class="panel-title">Rituals</div>
  <!-- content -->
</section>
```

3. Open with `.interval-card` grid if the choices are equivalent, `.entrain-list` (`.entrain-item`) if each option has a description, or pill chips (`.band-pill`) if it's a quick filter.
4. **Before adding a 5th tab**, ask: can this live inside `presets`, `journey`, or `notes`? The drawer caps at 4 to keep the tab row from wrapping awkwardly on narrow viewports.

---

### 5.3 How to extend the wash palette for a new mood

The wash system has four slots (`--wash-a`/`-b`/`-c`/`-d`) — only three are wired into animation; `--wash-d` is reserved. To add a new mood (e.g. "dusk"):

```css
:root {
  --wash-dusk-a: #E8C9C4;   /* muted plum */
  --wash-dusk-b: #C7B8C9;   /* lavender haze */
  --wash-dusk-c: #A8A89C;   /* warm slate */
}

[data-mood="dusk"] {
  --wash-a: var(--wash-dusk-a);
  --wash-b: var(--wash-dusk-b);
  --wash-c: var(--wash-dusk-c);
}
```

Rules for new wash colors:
- **Desaturate first.** Use HSL saturation 15–35%, not 60%+. The wash is atmosphere, not a Pantone chip.
- **Stay in the warm half.** Hues from roughly 20° (peach) to 150° (sage) work. Pure blues (210°) read clinical; pure magentas (300°) read synthetic.
- **Test under multiply blend mode.** A wash color you'd never paint a wall is often perfect because `mix-blend-mode: multiply` darkens it against `--paper`. Test on `--paper` (#F4EFE6) and `--paper` dark (#15110D, where it switches to `screen`).
- **Three colors, not five.** Don't add wash-d / wash-e to crank up "richness". The point of the wash is restraint.

---

## 6. What is missing — gaps to formalize before scaling

This system is complete enough to ship the calm screen and extend the drawer, but the following are **not yet decided** and will need design + engineering attention before the product grows:

1. **Form inputs.** Only one text input exists today (`#dump-input`). There is no documented pattern for: label + helper text, required/optional indicators, multi-line textarea, select / dropdown, checkbox, radio. The current input uses italic Fraunces because it's journal-like; a settings input ("Your name") almost certainly should be Manrope. This needs a rule.
2. **Error states.** `--danger` (`#B85C4C`) exists but is used only for the trash-zone hover and the delete button. There is no pattern for: inline form error, toast/snackbar, destructive confirmation, network-failure empty state. Decide: do errors get a banner, a toast, or inline-with-input treatment?
3. **Data-viz palette.** The five band hexes (delta/theta/alpha/beta/gamma) exist but are explicitly *not* shown together. If the product later adds session history or charts, a real categorical palette has to be drawn that doesn't violate "no rainbow band coding". Likely answer: ink-shade ramp + accent, not five hues.
4. **Mobile sizing.** The stage is capped at `max-width: 760px` and the time-display is hard-coded at 168px. At 375px viewport, 168px overflows. No clamp() / responsive type scale is in place. The interval-grid is `repeat(4, 1fr)` with no breakpoint to drop to 2 columns. Define: breakpoints (likely 480 / 768), responsive type scale (`clamp(96px, 22vw, 168px)` for the display), grid reflow rules.
5. **Empty states.** Only `#dump-empty` ("Mind is clear.") is defined. No pattern for: first-launch onboarding, no-presets, no-history, offline.
6. **Notification / toast.** No pattern at all. When a round completes, the product currently relies on the time display itself + (presumably) audio. Decide whether silent state-change is sufficient or whether a quiet toast is needed.
7. **Iconography library.** Icons today are inlined SVGs with inconsistent viewBox (0 0 20 20 vs 0 0 24 24) and inconsistent stroke-width (1.4 / 1.6 / 2 / 2.5). Standardize: one viewBox (24×24), one stroke-width family (1.6 default, 2.5 only for the small success check), one corner-radius rule (round line-caps & joins everywhere).
8. **Focus visible.** No `:focus-visible` styling is defined for keyboard navigation. Required for accessibility before public release. Suggest: `--accent-glow` ring, 2px offset.
9. **Loading state.** Nothing in the system shows progress for a non-instant action (e.g. loading a radio station). Define a quiet pattern — likely an opacity dimming + the breathe keyframe reused on a small ring, not a spinner.
10. **Spacing tokens.** Spacing is inlined throughout. Promote to `--space-1` through `--space-10` on a base-4 scale before the codebase scales past one screen.

---

*Last updated: 2026-05-12. Maintained alongside `/index.html` and `/mockup-calm.html`. When this doc and the code disagree, fix one or the other in the same PR.*
