# Neurosync — Calm Screen Critique

*A candid review of the path-B redesign shipped in `index.html`, measured against the brief in `Neurosync-Refresh-Pitch.html` and the reference in `mockup-calm.html`.*

---

## 1. Does it actually deliver the brief?

Mostly, on the surface. Not yet, in the bones.

**Where it succeeds.** The shipped screen genuinely *does* look like the Headspace / One Sec lineage when you screenshot the top of the viewport. The five-band rainbow is gone. The Discord-navy is gone. The mono is gone. The 168px Fraunces numeral over warm paper with drifting peach/sage washes is a credible answer to the chairman's note. That's not nothing — v1 was a Datadog clone, and this is unambiguously a wellness app at first glance. The play-button-as-only-required-action is the right move and was executed cleanly.

**Where it's still v1-with-makeup.** The file itself tells the story. `mockup-calm.html` is 510 lines. The shipped `index.html` is 3,305 lines. Six times the surface area for the same screen. That delta is the legacy DOM — band engines, journey timeline, mixer faders, nature/radio panels, hidden ring SVG, two hidden theme toggles — *all still in the document*, just visually suppressed:

- `index.html:85` `#bg-wave, #bg-wave-svg { display: none !important; }`
- `index.html:164` `header.legacy { display: none !important; }`
- `index.html:687–691` an entire kill-list: `.bg-wave, .timer-card, .ring-wrap, .metrics-strip, .mode-label-spacer, .ring-svg, .ring-center, .time-group, .play-row, .ring-reset, .play-btn:not(.play-btn-calm), .mode-switcher, footer.legacy { display: none !important; }`
- `index.html:692–698` `.hidden-keep` — the explicit "ghost DOM" class for elements JS still talks to
- `index.html:791–808` a literal hidden div holding `entrainment-btn`, `nature-btn`, `radio-btn`, `mixer-btn`, `mixer-close`, `reset-btn`, `back-to-settings`, `open-about`, plus a hidden 280×280 ring SVG

I counted **29 `!important` declarations** in the stylesheet. That's the signature of a re-skin fighting the previous build, not a rethink. A user will never see this — but it tells you the team didn't get to *decide* what the calm screen is; they were forced to accommodate what it used to be. That's why item (6) below has so much to say.

**Verdict.** Path B was sold as "restructure to the Headspace model." What shipped is path A (visual refresh) wearing path B's clothes. The clothes fit well. The skeleton hasn't moved.

---

## 2. Hierarchy & focal flow

The eye lands first on the **168px Fraunces "25:00"** — correct, and the single best decision in the build. That numeral is the product. Good.

Where things start to compete:

- **The dark play button is too heavy.** At 88×88 with `background: var(--ink)` (`index.html:209`) it's a near-black puck on cream paper, with a `0 16px 40px -16px rgba(43,38,32,.45)` drop shadow (`index.html:213`) and a breathing 1px ring on top. The contrast is the highest on the page — higher than the numeral itself, because the numeral is rendered in `--ink` which is the same value but stroked thin in serif at weight 300 (`index.html:182–183`). The button has more *visual weight* than the timer. In a calm screen, the time should be the loudest thing in the room. Right now the eye does: numeral → button → numeral → button. That's a competition, not a hierarchy.
  - **Fix:** drop the play button to a softer fill (`--ink-soft` #5A5147, or a deep matcha) and halve the shadow. Or shrink it to 72px. Headspace's primary CTA is *softer* than the numeral, not harder.
- **The breathing ring (`::before`, `index.html:220–225`) is doing two jobs.** It signals "tap me" *and* "I'm alive." With reduced motion off, it pulses at 5s — fine — but visually it reads as a secondary halo on the already-loudest element. Move the breath to the *whole screen* (the wash drift already does this; lean into it) and let the button just sit there.
- **Meta-strip is chattering, not whispering.** `index.html:762–768` renders `round 1/4 · alpha · soft · 0 sits today`. Three data points separated by pips. "alpha" is the exact jargon the pitch deck calls out at `Neurosync-Refresh-Pitch.html:486` as the nerd tell. It is now in 12px caps directly under the play button. The chairman is going to read "alpha" and feel his point was ignored. "0 sits today" is also a streak-anxiety vector — wellness apps that survive long-term hide the zero. Show "first sit" or hide the row until count ≥ 1.
  - **Fix:** kill the band readout entirely from the meta-strip. If it must live somewhere, it lives in the drawer's sound tab as small print. The strip should be **one line maximum**, ideally just the phase ("focus 1 of 4") with nothing else.

There's also a **third row of mode-switcher buttons** at `index.html:771–782` (focus / short / long break circles) directly under the meta-strip. The pitch said "one visible action." There are now four button-shaped objects below the play button (skip, end-early, focus, short, long). That's not calm; that's a control panel pretending to be calm.

---

## 3. Type pairing — Fraunces + Manrope

The pairing is correct in principle and *almost* correct in execution.

**Fraunces at 168px / weight 300 / opsz 144** (`index.html:180–187`) is genuinely beautiful at display size — the optical-size axis is doing real work here and the team set it correctly. `font-feature-settings: 'tnum'` was the right call for the timer (numerals don't dance frame-to-frame). The `-0.025em` tracking is tight enough to feel intentional without crunching.

**Problems:**

- **Italic Fraunces is being used as garnish everywhere.** Brand mini (`index.html:149`), session label (`index.html:176`), phase line (`index.html:193`), drawer handle label (`index.html:274`), panel titles (`index.html:316`), sound labels (`index.html:330`), interval card labels (`index.html:435`), entrain item names (`index.html:470`), journey button labels (`index.html:493`), band pill names (`index.html:517`), timeline labels (`index.html:542`)… italic-serif is the default label style across the entire app. When *everything* is italic-serif, italic stops meaning "this is special" and starts meaning "this is the visual texture of the brand." It tips toward bridal-stationery, away from focus-app. **Italic should be used twice on the page at most.** Reserve it for the brand mark and the phase-line. Everything else — sound labels, tab names, button labels — should be Manrope, regular, sentence case.
- **The colon at `index.html:182` in the mockup uses `font-style: italic` for the colon glyph.** In the shipped build the colon is just a regular `:` inside the time display because `time-display` is text-content driven by JS. So the lovely italic-colon detail from the mockup didn't survive the port. Restore it — that single character was carrying the "humanist clock" feeling.
- **`font-variation-settings: 'opsz' 144` is being applied at the variable level but the `font-feature-settings: 'tnum'` is requested without verifying Fraunces ships those numerals as proper tabular at the opsz 144 master.** Inspect at 168px — if you see colon-shift on tick from "25:00" to "24:59", you've lost the calm. (Easy to QA in 30 seconds.)
- **Manrope is barely earning its keep.** It only shows in: meta-strip caps, tab pills, fader values, dump items. Everything emotional is Fraunces, everything functional is Manrope. That's the *correct* split in theory but the functional surfaces are so small that you almost never see Manrope. Result: the app feels like a one-font app (Fraunces) with metadata. Either commit to that — drop Manrope, use Fraunces 400 roman for utility — or give Manrope more body text to do. The current 70/30 Fraunces/Manrope split is awkward.

---

## 4. Color & atmosphere

The palette is the boldest move and the most successful one. It is also the one most at risk of being **too sentimental**.

**The washes** — `#F3D9C0` (dawn peach), `#E4C8C2` (dusty rose), `#C9D2C4` (sage), `#E8DCC0` (sand) — are well-chosen *individually*. They're the right register: warm, low-chroma, atmospheric. The problem is the **combination**: peach + rose + sage with `mix-blend-mode: multiply` at `opacity: .55` and `.35` (`index.html:97–98, 119`) lands on a palette that reads as **spa retreat / wedding florist / Aesop store**, not focus app. There's no edge.

Compare the references in `Neurosync-Refresh-Pitch.html:532–578`:
- Opal: peach-to-coral, but with a *real* color saturation jump
- One Sec: warm off-white with **a single dark dot** — almost monochrome
- Headspace: orange + coral with no third hue
- Calm: dusk-blue → light blue, **one hue family**
- Endel: purple-to-black, **one hue family with depth**

Notice the pattern: the leaders pick **one hue family + ink**, not three pastels. Neurosync is currently three pastels and that's why it tips spa-ward. The chairman won't say "spa" — he'll say "it looks like a yoga studio website." Same problem, opposite quadrant from v1.

**Fix (cheap):** drop the sage wash, keep peach + rose, push contrast on the ink (`#2B2620` is already good; consider pushing one notch warmer to `#2A1F15`). Now you have *one* color story — dawn — and the timer reads as the dark anchor in it.

**Fix (better):** make the wash respond to phase. Focus → cool sage. Break → warm peach. Today they all run at all times, which means the color never *says* anything. Color that doesn't communicate state is decoration.

The matcha accent `#6E7F6A` (`index.html:32`) is the right green — muted, earthy, not mint-neon — and the pitch's instinct to call it matcha is correct. But it currently only appears inside the drawer (slider fills, knob borders, active states). On the calm screen itself the accent is invisible. That's fine as long as the drawer is part of the brand experience — but right now there's a visible hue disjoint when you open the drawer (peach/rose/sage outside, matcha-green inside). Pick one accent and use it sparingly across both surfaces.

---

## 5. The drawer pattern

The discrete bottom handle (`index.html:786–789`) is the right affordance in principle. Three problems in practice.

1. **The label "sound · presets · journey · notes" is doing the drawer's job for it.** That's a contents list of the closed drawer. The pitch slide 8 principle "iv" (`Neurosync-Refresh-Pitch.html:618–623`) was "Big calm numerals, almost no labels." Hide-bands-hertz-entrainment-behind-a-settings-sheet was principle "iv." The shipped drawer-handle reveals four tabs of complexity *before you've opened it*. That's anti-disclosure. It tells the user "there's a lot here," which is precisely the message the redesign was supposed to mute. **Fix:** just the grab bar, no label — or one word: "more." The drawer's own tabs reveal the structure once it's open.
2. **The peek state at 56px tall is too visible.** `transform: translateY(calc(100% - 56px))` (`index.html:285`) means the drawer is always *almost* there. Combined with the `paper-elev` fill and the box-shadow, the bottom of the calm screen has a constant "there's a panel below me" visual weight. The mockup uses 64px (`mockup-calm.html:258`) — the live build trimmed to 56 but kept the shadow. **Fix:** either go fully invisible at rest (just a 4px grab bar floating, no panel chrome) or commit to the peek and use it as a deliberate shelf. Half-measure now.
3. **Four tabs is one too many.** "Sound, presets, journey, notes" — notes is a different mental model (capture, not configure). The pitch deck called this out as "brain-dump" and bundled it with the rest, but it doesn't belong with sound/presets/journey. Either pull notes out to a separate gesture (long-press on the handle? swipe-from-edge?) or accept that the drawer is now a four-mode utility panel — in which case stop calling it calm. Also: "presets" and "journey" overlap conceptually (both are session shapes). Consider collapsing to **sound / session / notes** (3 tabs) and putting journeys under session-as-an-advanced-tier.

The drawer also has a real implementation tell: opening it doesn't dim the calm screen behind. Modal-style backdrop blur (`backdrop-filter: blur(8px)` exists for the modal at `index.html:632`) would help the focus shift. As-is, the drawer slides up over a fully-lit calm screen and the eye has to choose. The whole point of a drawer is to *remove* the rest from competition.

---

## 6. What's still leaky — residue of v1

Specific items, ranked roughly by how badly they break the calm:

1. **"alpha · soft" in the meta-strip** (`index.html:765`). The single most legible leak. The pitch deck literally has a slide titled "For nerds" that calls out band names as the problem. They are now under the play button.
2. **Three mode-switcher buttons** (`index.html:771–782`). Focus / short / long break icons rendered as 38px circles. This is the v1 mode toggle, restyled but structurally unchanged. Either remove (auto-cycle as Headspace does) or move into a settings sheet.
3. **`live-indicator` at `index.html:781`.** A status dot that lights up. Pure dashboard residue. The fact that "live" is even a concept in a focus timer is a v1 thought.
4. **Fader rows still labeled "Master / Wave / Nature / Radio"** (`index.html:866–899`). The pitch deck said: *"Windows-style volume mixer with per-channel sliders → DJ console, not a focus timer."* (`Neurosync-Refresh-Pitch.html:497–502`). The mixer was restyled — italic Fraunces labels, thin sliders — but it is still **four parallel volume faders**. That's a mixer. Wellness apps don't expose master + per-source volumes; they expose one "sound" slider and a sound *picker*. The Fraunces font doesn't change what the row *is*.
5. **"Binaural / Isochronic" toggle in the sound tab** (`index.html:832–860`). "Two tones, one per ear — needs headphones." Helpful technically. Reads like a Reddit post about brainwave entrainment. Hide in settings.
6. **Band selector pills in the journey tab** (`index.html:497–519` plus the JS at `:1336`). Renders delta/theta/alpha/beta/gamma as scrollable pills. Same nerd tell, just dressed up. If you must keep this, name them by *intent* (focus / wind-down / energize / dream) and put the Hz behind a tooltip or settings sheet.
7. **`#round-display` shows "1/4"** (`index.html:763`). "Round" is gym/Pomodoro jargon. Headspace says "session 1 of 4" or just "begin." Use the language the audience uses.
8. **Hidden ring SVG at `index.html:797`** with `stroke-dasharray="804.25"` — the old circular progress ring is *still in the DOM* with all its math. It's invisible. But its presence in source explains why the team will be tempted to bring it back. Delete the ring code path entirely or you will be debating its return in three weeks.
9. **`mode-switch-btn` uses `.side-control`** (`index.html:772, 775, 778`) — these inherit run-controls styling, so they appear/disappear with running state. Means once you press play, three break-mode icons appear under the timer. That is **maximum chatter at the moment the user wanted calm**. The running state in this app currently adds UI rather than removes it. Wrong direction.
10. **Settings icon top-right** (`index.html:730–732`) opens a modal that — based on the modal CSS at `index.html:637–684` — surfaces "modal-hz" (`index.html:667`). Hertz is in the modal copy. Still nerd-coded one layer down.

---

## 7. Dark mode

The dark inversion *technically* works — tokens swap cleanly at `index.html:55–73` — but it loses the soul.

**What works.** `#15110D` paper is warmer than v1's `#0A0E1A`, which is the whole point. The ink-to-paper inversion gives the play button a cream face on a dark paper — that's a nice flip and the breathing ring still reads.

**What doesn't.**

- The atmospheric washes are recolored to `#3A2A28 / #2E2A38 / #25302C / #2A2418` (`index.html:64–67`) with `mix-blend-mode: screen` and opacity `.35` (`index.html:101–104, 123`). Screen mode on those near-black tones produces *barely-visible smudges*. The dawn-peach / dusty-rose / sage personality of the light theme is the whole brand move — in dark mode it becomes a dark warm rectangle. Calm, yes; *Neurosync*, no. There's no warm paper to be warm against.
- Fraunces 300 at 168px on `#15110D` paper rendered in `#ECE6D8` cream is on the edge of being too high-contrast. Cream-on-near-black at display size starts to feel like a luxury invitation, not a clock. Either drop the time to `--ink-soft` (`#B8AE9C`) in dark mode, or lift the paper to `#1C1814` so the contrast isn't as harsh.
- The dark accent `#9DB098` (`index.html:68`) is suddenly *more* visible than the light-mode matcha. Sage on near-black pops more than sage on cream. That breaks the rule that the accent should always recede.

**Fix.** Don't invert. Build dark mode as a deliberate *evening* mode — deep aubergine paper, peach wash kept (not recolored), ink stays warm cream but desaturated. Endel-direction. The mechanical token-swap saves engineering time but throws away the brand.

---

## 8. What would a "10/10" version look like?

Five concrete moves, in order of leverage:

1. **Delete the legacy DOM, don't hide it.** The `!important`-overrides + `.hidden-keep` strategy is a tax on every future change. While the legacy `mode-switcher`, `ring-svg`, mixer panels, nature/radio panels and the two theme toggles exist in the document, every contributor will be tempted to use them. Fork the audio engine into a `lib/audio.js` that exposes a clean API; rebuild the markup from `mockup-calm.html` as the source of truth. This is the single highest-leverage move because it makes every other improvement on this list cheap.
2. **One color story, not three.** Drop sage. Run peach → rose as a single dawn gradient. Let the *time of day* (real clock time) shift the gradient's center hue — morning leans peach, evening leans plum. The wash becomes a clock you can't read but feel. This is what would actually push the app from "competent calm" to "quietly magical." Endel-level move with two CSS variables.
3. **Make the play button quieter than the time.** Today: button is the loudest element. Goal: numeral is the loudest, button is a soft invitation. Specifically: `background: var(--ink-soft)` or matcha-deep, halve the shadow, drop diameter to 72px, remove the breathing ring (move breath to the wash). The play button should disappear into the page until you look for it. A meditation app where the *strongest* element is the button is a contradiction.
4. **Strip the meta-strip to zero at rest, one line on tap.** At rest: nothing under the play button. The screen is `Neurosync` / `classic · 25 min` / `25:00` / `begin where you are` / play. That's it. On hover/tap on the time or session label, reveal "session 1 of 4 · focus" — *one* line, no bands, no Hz, no "sits today." Streak metrics live in the journey tab. The screen the user looks at for 25 minutes should not have any data on it.
5. **Replace the mode-switcher + run-controls cluster with a single contextual button.** While running, the only control should be: tap-anywhere-to-pause, plus a small "end early" affordance that appears after ~30s. Skip, focus/short/long mode toggles — gone from the running screen. The Headspace move is *fewer controls while in session, not more.*

Two bonus moves if you have appetite for the bigger swing (path C territory):

6. **Replace the numeric timer with a slow visual.** Endel doesn't show time. Calm doesn't always. A long bar that fills, a wash that thickens, a single mark that travels. Numerals are honest but they're also a watch face. The whole pitch was *not* a watch face.
7. **Reintroduce binaural / band logic as "moods" only.** The user picks "deep work / wind down / wake up / dream" — full stop. The hertz mapping happens in code, never in UI. The science slide at `Neurosync-Refresh-Pitch.html:478–518` already nailed this; the build re-exposed it.

---

## Summary

Path B was the right choice. What shipped is closer to path A in a path-B costume — the calm screen is real and works at first glance, but the v1 information architecture (modes, bands, mixer, ring, run-state controls) is still load-bearing underneath, hidden by 29 `!important` rules and a kill-list of legacy selectors. The palette is the most successful bet; the typographic restraint isn't quite there yet (too much italic-serif as garnish); the play button is fighting the timer; and the dark mode is a mechanical token-swap, not a designed evening state. Fix the architecture (#1) and the rest gets cheap.
