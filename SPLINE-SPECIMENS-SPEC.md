# Spline Scene Spec — Mineral Specimen Library

Companion to [`SPLINE-STONE-SPEC.md`](SPLINE-STONE-SPEC.md). That doc covers the **active timer stone** (rough → polished sphere). This doc covers the **specimens earned at the end of a session** that populate the user's cabinet.

> One Spline scene per specimen. Same rig, same lighting, same camera, same background. Only the geometry and material change. Build them in tier batches — Tier I first, ship those, then move down the list.

---

## 1. Scope

23 distinct mineral specimens, organized in 5 rarity tiers. Each renders as its own `.splinecode` URL, embedded in a small `<spline-viewer>` slot inside the user's cabinet UI.

| Tier | Rarity | Unlock gate | Specimens | Count |
|------|--------|-------------|-----------|-------|
| I | very common | sessions 1 – 7 | Clear Quartz · Rose Quartz · Smoky Quartz · Calcite | 4 |
| II | common | sessions 8 – 30 | Pyrite · Agate · Amethyst · Fluorite | 4 |
| III | uncommon | sessions 31 – 100 | Malachite · Azurite · Tourmaline · Garnet | 4 |
| IV | rare | sessions 101 – 300 | Aquamarine · Morganite · Heliodor · Rhodochrosite · Smithsonite | 5 |
| V | very rare | milestone unlocks | Emerald · Red Beryl · Native Gold · Native Silver · Cavansite (on Stilbite) · Azurite+Malachite | 6 |

> **Build order:** Tier I → Tier II → Tier III → Tier IV → Tier V. Ship each tier as a batch so dev can wire them in waves.

---

## 2. Shared scene scaffold

Use this as a template scene; duplicate and swap geometry / material per specimen. Everything below applies to *all* 23 scenes.

### Camera
- Perspective, FOV 32°
- Position `(0, 1.2, 4.6)` looking at origin
- Specimen sits centered, fits ~70% of frame height

### Lighting (wabi-sabi / tea-room — match `SPLINE-STONE-SPEC.md`)
| Light | Settings |
|---|---|
| Hemisphere | top `#FFF5E0`, bottom `#33302A`, intensity 0.55 |
| Key directional | from upper-left `(-3, 4, 2)`, color `#FFE9C2`, intensity 1.3 |
| Fill directional | opposite side, intensity 0.35 |
| Rim (subtle) | from behind upper-right, intensity 0.4 — picks out crystal edges |
| Soft AO | enabled |
| Bloom / chromatic aberration | **OFF** |

### Background
- Transparent (alpha). Paper grain comes from the app's CSS layer.

### Motion (idle, always-on)
- Slow Y-rotation, 1 revolution / 24s (faster than the timer stone — these are *display objects* in a cabinet, they should turn enough to read all faces in a glance)
- No tilt, no breathing

### Variables (exposed to runtime)

| Name | Type | Range | Purpose |
|---|---|---|---|
| `reveal` | Number | 0 .. 1 | Cinematic entrance — at 0 specimen is half-buried in dust + matte; at 1 it's clean, lit, displayed. Used for the *just-earned* animation. Default 1 in cabinet view. |
| `theme` | String | `"light"` \| `"dark"` | Adjust env lighting + matrix color per app theme |

> All specimens share the same variable contract so the JS bridge can drive them identically.

---

## 3. Per-specimen geometry & material

Build each in this order. Colors are **starting points** — match the article's reference photos at [rockngem.com/minerals-for-collectors-must-have-specimens](https://www.rockngem.com/minerals-for-collectors-must-have-specimens/) once you have the scene open.

### Tier I — very common

#### Clear Quartz
- **Form:** Cluster of 3–5 hexagonal prisms, terminated with pyramidal points, varied heights, sharing a matrix base
- **Material:** PBR · transparent · IOR 1.54 · roughness 0.05 · slight internal blur · color `#F4F1E8` with tint toward `#C8C2B0` at edges
- **Notes:** Catch one specular highlight per face. Don't over-glass it — these are natural, not faceted gems.

#### Rose Quartz
- **Form:** Single rounded massive piece, no clean crystal faces (rose quartz almost never grows in distinct crystals — render as a soft tumbled cluster)
- **Material:** PBR · semi-transparent · roughness 0.4 · subsurface scattering on · base `#F2C5C2`, deep `#9C5E68`

#### Smoky Quartz
- **Form:** Same cluster habit as Clear Quartz, but darker and slightly more weathered
- **Material:** PBR · transparent · roughness 0.08 · base `#6B5C4E`, edges `#2A2018`

#### Calcite
- **Form:** Rhombohedron — a single chunky parallelepiped, slightly tilted, with one chipped corner
- **Material:** PBR · transparent · IOR 1.66 · roughness 0.1 · color `#F1E4C4` warm honey, edges `#C8A56A`
- **Notes:** If feasible, suggest *birefringence* (double-refraction) with a faint inner line — calcite's signature.

### Tier II — common

#### Pyrite
- **Form:** Two or three interpenetrating cubes, sharp 90° edges, slight striations on the largest face
- **Material:** PBR · metallic 1.0 · roughness 0.25 · color `#D9A93D` → highlights `#FBE38A`
- **Notes:** This is the only fully-metallic specimen in Tier II — let it pop.

#### Agate
- **Form:** Half-geode, sliced and polished — flat circular face showing concentric bands, rounded back
- **Material:** PBR · matte · roughness 0.3 · banded texture: alternating `#C8956B`, `#F2D8A8`, `#8A5C32`, `#E8C896`
- **Notes:** Use a procedural banded texture, not 3D-modeled layers. The bands should read clearly from camera.

#### Amethyst
- **Form:** Cluster of 4–6 hexagonal prisms, color-zoned (paler at base → deepest purple at tip)
- **Material:** PBR · transparent · IOR 1.54 · roughness 0.05 · gradient `#C9A3DF` → `#5E3E7A` along crystal length

#### Fluorite
- **Form:** Stepped cubic cluster — three interlocked cubes of varying sizes
- **Material:** PBR · semi-transparent · IOR 1.43 · roughness 0.15 · color-zoned: green `#8FCDA6` → purple `#7A5DBE` (one cube each color, plus a clear one)
- **Notes:** Fluorite is famously multi-colored. Bake the color zones into the geometry, not the material.

### Tier III — uncommon

#### Malachite
- **Form:** Botryoidal — clusters of small spheres growing into a larger mound, like grapes. Sliced face shows concentric green rings.
- **Material:** PBR · matte · roughness 0.5 · banded green: `#7CC080` light, `#2F6E3A` mid, `#143820` dark
- **Notes:** Use a 3D noise + ring-warp shader for the bands.

#### Azurite
- **Form:** Radial cluster of bladed crystals, deep blue, sharp edges, often associated with malachite (consider a small malachite patch at the base)
- **Material:** PBR · semi-translucent · roughness 0.2 · color `#1E3A8A` → highlights `#3D62D4`

#### Tourmaline
- **Form:** Single elongated prismatic crystal, doubly terminated (point at both ends), striated along its length
- **Material:** PBR · transparent · roughness 0.08 · color-zoned along length: pink `#E4768E` base → green `#5A9266` tip (watermelon tourmaline)

#### Garnet (Almandine)
- **Form:** Cluster of 3 dodecahedrons (12-sided crystals) of varying sizes, embedded in dark schist matrix
- **Material:** PBR · transparent · IOR 1.78 · roughness 0.1 · deep `#7A1F1F` → highlights `#C44848`

### Tier IV — rare

#### Aquamarine
- **Form:** Single tall hexagonal prism, doubly terminated, glassy faces
- **Material:** PBR · transparent · IOR 1.58 · roughness 0.04 · color `#A6D8DA` → deep `#4F8C90`

#### Morganite
- **Form:** Same hexagonal prism habit as aquamarine, slightly stouter
- **Material:** PBR · transparent · roughness 0.05 · soft pink `#F2C5B8` → `#C68078`

#### Heliodor
- **Form:** Hexagonal prism, golden yellow
- **Material:** PBR · transparent · roughness 0.05 · `#F4D55E` → `#A07A1A`

#### Rhodochrosite
- **Form:** Stalactitic — sliced cross-section of a rounded stalactite showing concentric pink/rose rings
- **Material:** PBR · matte · roughness 0.3 · banded `#F2A6B8`, `#D26878`, `#8E3A4A`

#### Smithsonite
- **Form:** Botryoidal crust on a small matrix base — like blue-green soap bubbles frozen in place
- **Material:** PBR · semi-translucent · roughness 0.4 · `#7BC8B4` → `#3E8678`

### Tier V — very rare

#### Emerald
- **Form:** Hexagonal prism embedded in pale matrix (calcite or shale), only the top half exposed
- **Material:** PBR · transparent · IOR 1.58 · roughness 0.04 · deep `#0E7C4A` → highlights `#3FB872`
- **Notes:** Add a subtle internal jardin (the wispy inclusions emeralds are known for) via a low-opacity 3D texture.

#### Red Beryl
- **Form:** Single short hexagonal prism, intense red, rough matrix backing
- **Material:** PBR · transparent · IOR 1.58 · roughness 0.06 · `#B82A2A` → `#E86060`

#### Native Gold
- **Form:** Dendritic / wire-like gold growth on a quartz matrix — irregular, branching, organic
- **Material:** PBR · metallic 1.0 · roughness 0.18 · `#D9A21A` → highlights `#FCE08A`
- **Matrix:** Clear-quartz base material around the gold growth.

#### Native Silver
- **Form:** Wire silver — twisted threadlike branches
- **Material:** PBR · metallic 1.0 · roughness 0.3 · `#C8C8C8` with slight tarnish toward `#7A6F60`
- **Notes:** Silver tarnishes — let the wire's recesses show the older, darker color while the high points stay bright.

#### Cavansite on Stilbite
- **Form:** Sphere-cluster of bright blue cavansite blades, sitting on a white-cream stilbite matrix base
- **Material (cavansite):** PBR · matte · roughness 0.4 · saturated `#1B7DC8`
- **Material (stilbite):** PBR · pearly · roughness 0.5 · `#F0E8D8`
- **Notes:** This is the *visually most surprising* specimen — the contrast between matrix and crystal is the whole point.

#### Azurite + Malachite (combo)
- **Form:** Half azurite cluster (radial blue blades), half malachite botryoidal mound, growing together on a single matrix base
- **Material:** Two materials side-by-side — see Tier III entries above.
- **Notes:** Reward for the most dedicated users. Premium specimen.

---

## 4. Naming & export

For each specimen, in Spline:

1. Build the scene from the shared scaffold (camera, lighting, motion).
2. Swap in geometry + material per the spec above.
3. Confirm `reveal` and `theme` variables expose in the Variables panel.
4. **File → Export → Web Code**
5. Copy the `.splinecode` URL.
6. Name and tag exports as:

```
specimens/<tier>/<slug>.splinecode

e.g.
specimens/tier-1/clear-quartz.splinecode
specimens/tier-1/rose-quartz.splinecode
specimens/tier-2/pyrite.splinecode
...
specimens/tier-5/native-gold.splinecode
```

7. Send the batch's URLs to dev as a flat list keyed by slug.

---

## 5. Test checklist per specimen

- [ ] Specimen reads clearly at 56px (cabinet thumbnail) and 380px (detail view)
- [ ] In Spline preview, scrub `reveal` 0 → 1 — entrance animation is smooth, no popping
- [ ] In Spline preview, switch `theme` light ↔ dark — env light shifts, specimen still reads
- [ ] Background fully transparent (no skybox, no solid fill)
- [ ] Idle Y-rotation visible — specimen does a full turn in ~24s
- [ ] No bloom, no chromatic aberration, no over-bright highlights
- [ ] Crystal habit (hex / cubic / botryoidal / etc.) is *visually identifiable* — a geologist should be able to name the mineral from a still frame

---

## 6. Out of scope (future rounds)

- **Inspection mode** — user taps a specimen → opens fullscreen with drag-to-rotate (Spline supports this; design pass needed later)
- **Provenance card** — text panel beside each specimen with name, locality, the date earned
- **Trading / gifting** — sending a specimen to another user. Don't plan around it yet.

---

## 7. References

- [Rock & Gem · Minerals for Collectors](https://www.rockngem.com/minerals-for-collectors-must-have-specimens/) — primary source list
- `SPLINE-STONE-SPEC.md` — companion spec for the active timer stone
- `moodboard.html`, Chapter III (Stone & Tide) — lighting and material mood
- Heath Ceramics glaze tones — matte material reference
- Mindat.org — for any specimen photo cross-references during build

---

## 8. Status tracker

| Item | Status |
|---|---|
| Spec doc (this file) | ✅ Done |
| Shared scaffold template scene | ⏳ Designer to build first |
| Tier I batch (4 scenes) | ⏳ Pending |
| Tier II batch (4 scenes) | ⏳ Pending |
| Tier III batch (4 scenes) | ⏳ Pending |
| Tier IV batch (5 scenes) | ⏳ Pending |
| Tier V batch (6 scenes) | ⏳ Pending |
| Total | **23 scenes** |
