# Spline Scene Spec — Stone & Tide Timer

Handoff to 3D designer. Build the scene in [spline.design](https://spline.design), export the `.splinecode` URL, send it back. Dev plugs it into `<spline-viewer url="...">`.

---

## 1. Scene goal

A 3D stone that **morphs from a rough river rock → a perfectly polished sphere** as a `polish` variable goes from `0 → 1`. The scene must run with a transparent background (no skybox) so the app's paper texture shows through.

---

## 2. Geometry

| Property | Value |
|---|---|
| Base mesh | Icosphere |
| Subdivision | 5–6 (smooth morph, ~10k verts) |
| Scale | fits ~80% width inside a 380×380 viewport |
| Asymmetry | slightly squashed on one axis — river-stone character, not a perfect sphere of clay |

---

## 3. States

Build two states and morph the geometry between them via the `polish` variable.

### State A — **rough** (polish = 0)
- Apply a **Displacement** modifier driven by Simplex / Perlin noise
- Multi-octave:
  - Low-freq lumps: frequency 1.2, amplitude 0.25
  - Mid: frequency 2.6, amplitude 0.10
  - High surface grain: frequency 5.0, amplitude 0.04

### State B — **sphere** (polish = 1)
- Displacement disabled / amplitude 0
- Clean icosphere

Interpolation should be **smooth**, not stepped. Vertices ease from displaced positions back to the spherical base.

---

## 4. Variables (exposed to runtime)

| Name | Type | Range | Purpose |
|---|---|---|---|
| **`polish`** | Number | 0 .. 1 | Drives the rough → sphere morph. Required. |
| `theme` *(optional v2)* | String | `"light"` \| `"dark"` | Swap stone material color per app theme |
| `lightTone` *(optional v2)* | Number | 0 .. 1 | Shift key light color warm → cool |

Expose `polish` via Spline's Variables panel so JS can call `viewer.setVariable('polish', v)`.

---

## 5. Material

| Property | Value |
|---|---|
| Type | PBR / Standard |
| Color (light theme) | `#B5A98E` |
| Color (dark theme) | `#6F6859` |
| Roughness | 0.92 (matte — **not** shiny) |
| Metalness | 0 |
| Normal map (optional) | Subtle micro-grain, strength ≈ 0.15 |

---

## 6. Lighting — wabi-sabi / tea-room mood

| Light | Settings |
|---|---|
| Hemisphere | top `#FFF5E0`, bottom `#33302A`, intensity 0.5 |
| Key directional | from upper-left `(-3, 4, 2)`, color `#FFE9C2`, intensity 1.2 |
| Fill directional | opposite side, intensity 0.3 |
| Soft AO | enabled |
| Bloom / chromatic aberration / god rays | **OFF** |

The light should feel like paper light through shoji — warm, soft, single source.

---

## 7. Animation (always-on, idle behavior)

- **Slow Y rotation** — 1 full revolution every 60s
- **Breathing tilt** — X-axis ±0.05 rad on a 4.2s sine cycle
- Both should respect `prefers-reduced-motion` (pause when user has reduced-motion enabled — Spline supports this natively; otherwise leave it as the default and we'll gate it from the page-level CSS)

---

## 8. Camera

- **Perspective**, FOV 35°
- Position `(0, 1.4, 5)`, looking at origin
- Orthographic acceptable if it reads cleaner — designer's call

---

## 9. Background

- **Transparent (alpha)** — no skybox, no solid color
- The mockup applies a paper-grain CSS layer behind the canvas

---

## 10. Export & handoff

1. In Spline: **File → Export → Web Code**
2. Copy the `.splinecode` URL (format: `https://prod.spline.design/XXXXXXXX/scene.splinecode`)
3. Send the URL to dev
4. Dev plugs it into: `<spline-viewer url="...">` in `mockup-stone-tide.html` line ~792

---

## 11. Test checklist before delivery

- [ ] Drag `polish` 0 → 1 in Spline preview: morph is smooth, no popping or flickering
- [ ] In Spline preview's runtime test, call `viewer.setVariable('polish', 0.5)` from the browser console — stone morphs to half-polished
- [ ] Background is fully transparent (no white/black fill behind stone)
- [ ] No bloom, no chromatic aberration, no overly shiny highlights
- [ ] Reads clearly at 380×380 and 760×760 (retina)

---

## 12. References

- **Heath Ceramics** — glaze tones, matte surface feel
- **Ryōan-ji rock garden** — composition, asymmetry, restraint
- **Hiroshi Sugimoto · Seascapes** — lighting mood, contemplative tone
- **Existing moodboard:** `Neurosync/moodboard.html`, Chapter III (Stone & Tide)

---

## 13. Status

| Item | Status |
|---|---|
| Mockup shell with `<spline-viewer>` embed | ✅ Done — `mockup-stone-tide.html` |
| JS bridge: scrub slider → `polish` variable | ✅ Done |
| Fallback SVG while scene URL is empty | ✅ Done |
| **Spline scene built & exported** | ⏳ **Pending — this spec** |
| Real-timer → `polish` wiring (replaces scrub) | ⏳ Next round, after scene lands |
