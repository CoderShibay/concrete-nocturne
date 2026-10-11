# Districts — Batch 1 (detailed spec)

**Never Lived In · Field of Blocks · Office Park**

Written by the design agent for the build session, against commit `def4eeb` (2026-10-11).
Concepts and research sources: `DISTRICT_CONCEPTS.md` (#4, #3, #6). Rules: `LONELY_CITY_BRIEF.md`.

> **Status: APPROVED by Ali on 2026-10-12. Ready to build.** The wireframes (`wireframes/batch-1.html`) and the four decisions below are final.
>
> **Decisions:**
> 1. Built by the build session, from this file.
> 2. Field of Blocks slabs: **deep, 8.5 m**.
> 3. Never Lived In lamps: **sodium, all on**.
> 4. The saloon gets **one real headlight, always on at night**.

---

## 0. What every new zone must respect (current code)

| Fact | Value | Where |
|---|---|---|
| Block pitch | `C = 100` m | `:968` |
| Road | `R = 30` m wide (0→30 on each axis of the cell) | `:969` |
| Sidewalk | `SW = 4` m (30→34 and 96→100) | `:970` |
| Lot | 34→96 = **62 m** square, flush and drivable | `:971` |
| Building area | 41→89 = **48 m** square (`A`, `B` inside `genCell`), centre `mid = 65` | `:1293` |
| District | `DS = 12` blocks per side, 1.2 km | `:1251` |
| Ground collision | car radius 1.7 m; a solid blocks if `y0 ≤ 1.5` and `y1 ≥ 0.6`; the car slides along walls | `collide()` `:2770` |
| Windows going dark | shader uniform `NIGHT` = `director.litFraction` | `:1061`, `:2934` |
| Moments | one per zone via `MOMENT_FOR`, built in `buildMoment()` or as a global object like `makeTaillights` | `:1249`, `:1574` |

**To add a zone, touch these seven places:**
1. `ZONES` (order)
2. `ZONE_NAMES`
3. `MOMENT_FOR`
4. a branch in `genCell`
5. a branch in `buildMoment` (or a `make…` global)
6. `ZONE_TINT` (`:2865`)
7. any per-zone atmosphere in the frame loop near `:3019`, next to the fog-zone code

**New drive order** (10 zones; the district ahead still gets "next in order", 20% skip one):

```
corridor → office → boulevard → newtown → plaza → field → interchange → residential → corner → fog
sameness   sameness  scale       scale     exposure exposure  non-place    people        people   fading
```

---

## 1. Never Lived In — zone key `newtown`

**One line:** a brand-new district, finished and perfect, where no light has ever been switched on in a home.

**Research:** Ordos Kangbashi: "it wasn't because it had been abandoned. It was because it had never really been lived in"; "elaborate public buildings built for nobody… stadiums without crowds". Relph: placeless places "had no local history."

**Why it's different from the other zones:** elsewhere the windows *go out* over the night. Here they were never on. And every street lamp works, which nowhere else in the city is true. Everything is intact and none of it is used.

### Plan of one district (12×12 blocks) — WIREFRAME
```
 T = tower pair   S = sales pavilion   ◎ = stadium (centre)   . = empty paved lot with planters

 T T . T T . T T . T T .
 T S . T T . T S . T T .
 . . . . . . . . . . . .
 T T . T T . T T . T T .
 T T . T S . T T . T S .
 . . . . . . . . . . . .
 T T . T T . ◎ ◎ . T T .        ← stadium takes the 2×2 lots at li,lj = 6..7
 T S . T T . ◎ ◎ . T S .
 . . . . . . . . . . . .
 T T . T T . T T . T T .
 T T . T S . T T . T S .
 . . . . . . . . . . . .
```
- Every third row and column is left **empty** (`li % 3 === 2 || lj % 3 === 2`): paved, with a row of young trees in planters. This reads as "phase three, not started".
- Sales pavilion at `li % 6 === 1 && lj % 3 === 1`.

### Street view — WIREFRAME
```
            ┌──────┐  ┌──────┐
            │      │  │      │        pale, clean towers 110–150 m
            │ dark │  │ dark │        EVERY window dark, forever
            │      │  │      │        (no blank grey base: glass lobby, unlit)
            │      │  │      │
   ☼        │      │  │      │        ☼   ← every lamp works, cool white
   │  ▫ ▫ ▫ └──────┘  └──────┘  ▫ ▫ ▫ │       ▫ = sapling in a planter, tied to a stake
 ══╧══════════════════════════════════╧══
              road, new lane paint
```

### Build list (`genCell`, zone `newtown`)
| Element | Size / position (block coords) | Material | Collision |
|---|---|---|---|
| Tower pair | two towers 20×20 m at (53, 65) and (77, 65), or rotated by `zr()`; height 110 + `zr()`·40, **the same for the whole district** | new `winDead` = `windowMaterial(v, seed, 0, '#4b4a45')`: no lit windows, paler concrete (add a 4th param for base colour) | via `facades` as usual |
| Glass lobby | 20×20×6 m at each tower base, replacing the blank concrete base | new `glassDark`: MeshStandard `0x0d1114`, roughness .15, metalness .6 | part of the tower |
| Planters and saplings | every 9 m along the two road sides of the lot, at 35.5 m:<br>- planter 1.2×0.5×1.2<br>- stake 0.06×2.4<br>- crown 0.9 m cube | `concrete`, `pole`, `dark` | planter only (y1 = 0.5 → **not** solid; you can clip it; fine) |
| Sales pavilion | glass box 22×5×12 m at (65, 47), lit inside; flat roof slab overhanging 1.5 m | walls `warmwin` at 55% (clone, colour `0xd9c9a8`); roof `roof` | solid |
| Banner pylon | 9 m pole + 5×7.5 m sign at (38, 38) | existing `adTex` (NOW LEASING / FIND YOUR PLACE) plus two new ones: `['NOW', 'SELLING']`, `['PHASE TWO', 'COMING', 'SOON']` | pole solid |
| Stadium | on the 2×2 centre lots:<br>- four stands as stepped boxes (3 steps each, 6/11/16 m high) around a 60×40 m pitch that crosses the road gap<br>- 4 floodlight masts 38 m high, **lit** | stands `concrete`; mast heads `fluo`; pitch `glowf` flat 50×30 at opacity .12 | stands and masts solid |

- **Lamps:** `lampOn = 1.0`, **sodium** like the rest of the city (decided). Force the normal `lamp` / `glow` materials in this zone: no violet variant, so every lamp is identical and working.
- **Windows:** none lit, ever. `winDead` ignores `NIGHT`.
- **Signs:** none on the buildings. Only the pylons.
- **Map tint:** `#2e3336`.
- **Names:** `['Phase Two', 'Show Flat Row', 'New Horizon Estate', 'Keys Not Yet Issued']`.

### Moment — `showflat`
The one lit home in the district.
```
   tower base, ground floor, road side
  ┌───────────────────────────────────────┐
  │ ░░░░░░░░░ dark glass lobby ░░░░░░░░░░ │
  │ ┌───────────────────────────┐ ░░░░░░░ │
  │ │   ╥ pendant lamp          │ ░░░░░░░ │   9 × 3.2 m window, warm (0xffd49a)
  │ │  ┌───┐   ▭ sofa           │ ░░░░░░░ │   table set for two: 2 chairs, 2 plates
  │ │ h│   │h          ▯ lamp   │ ░░░░░░░ │   no figure, ever
  │ └───────────────────────────┘ ░░░░░░░ │   small card in the glass: SHOW FLAT
  └───────────────────────────────────────┘
      warm light pool on the pavement (glow, 14 m)
```
- Built in `buildMoment` on `frontFacade()` like `silhouette`, with no figure.
- Furniture is 8–10 small boxes, 0.6 m behind the glass plane.
- Done when the car has passed within 55 m (the existing rule).
- No caption.

### Atmosphere while inside the zone
- **Radio:** open the tape filter from 2000 Hz to 4800 Hz and halve the vinyl crackle, ramped over 2 s in and out. The radio sounds too clean here.
- **Fog:** unchanged.

### Acceptance
- [ ] Standing on any road in the district at night, **zero** lit windows are visible, and every lamp is on.
- [ ] The show flat is the only warm light in view when it appears.
- [ ] The stadium floodlights are visible from 3+ blocks away.
- [ ] 60 fps is held (towers are 2 boxes each; saplings are merged in the bucket).

---

## 2. Field of Blocks — zone key `field`

**One line:** lots filled with plain concrete slabs that rise as you drive in, until the city is gone and you are alone between walls.

**Research:** the spatial technique of Eisenman's Berlin stelae field, not the memorial. Eisenman:
- "these heads disappear -- like going under water"
- "You don't hear anything but the sound of your footsteps"
- "here is a place without information"

The game's names and look stay abstract: no plaques, no references.

### Plan of one lot — WIREFRAME
The 62 m lot is filled edge to edge; this zone has no apron.
```
 34                                                          96
  ┌──────────────────────────────────────────────────────────┐
  │  ▯   ▯   ▯   ▯   ▯   ▯   ▯   ▯      ← 8 columns           │
  │                                                          │   block  2.6 × 6.2 m
  │  ▯   ▯   ▯   ▯   ▯   ▯   ▯   ▯                           │   lane   5.0 m both ways
  │                                                          │   pitch  7.6 m × 11.2 m
  │  ▯   ▯   ▯   ▯   ▯   ▯   ▯   ▯      ← 5 rows = 40 blocks  │
  │                                                          │
  │  ▯   ▯   ▯   ▯   ▯   ▯   ▯   ▯                           │
  │                                                          │
  │  ▯   ▯   ▯   ▯   ▯   ▯   ▯   ▯                           │
  └──────────────────────────────────────────────────────────┘
   lanes are 5.0 m; the car needs 3.4 m (radius 1.7 × 2) → 0.8 m free each side
```
- The whole district shares one orientation (`zr() < .5` picks the long axis), and blocks sit on a district-wide grid. Lanes line up from lot to lot, so from the road you can see straight down them.
- The roads between lots stay normal roads. They are the only "outside".

### Section through one lot — WIREFRAME
```
 road │ lot edge                    centre                    lot edge │ road
      │                           ▄▄▄ ▄▄▄                              │
      │                     ▄▄▄ ▄▄███ ███▄▄ ▄▄▄                        │      up to 8.5 m
      │               ▄▄▄ ▄▄███ █████ █████ ███▄▄ ▄▄▄                  │
      │         ▄▄▄ ▄▄███ █████ █████ █████ █████ ███▄▄ ▄▄▄            │
  ☼   │   ▄▄▄ ▄▄███ █████ █████ █████ █████ █████ █████ ███▄▄ ▄▄▄      │   ☼
 ═════╧═══███═█████═█████═█████═█████═█████═█████═█████═█████═███══════╧═════
          0.9 m at the edge  →  car roof is 1.4 m  →  city gone by the 3rd row
```
- **Two surfaces, as at the Berlin field:** the ground sinks while the tops rise more gently. From the road it looks like a low field; inside, the walls are deep.
  - Ground: `g = −2.2 · s · w` m (0 at the lot edge, down to −2.2 m at the centre of the deepest lots).
  - Slab top, measured from road level: `top = 0.9 + 5.4 · s · w + jitter` (max about 6.3 m above the road).
  - Wall beside the car = `top − g`: up to **8.5 m**.
- **The formula's terms:**
  - `s`: 0 at the lot edge, 1 at the lot centre (smoothstep on distance to the nearest edge / 31 m).
  - `w`: the district "swell", 0.35…1.0, a slow sine across the district, so some lots are shallow (max about 3.5 m) and some are deep.
  - `jitter`: ±0.25 m per block.
  - Deepest wall = **8.5 m** (decided: deep), made of 6.3 m above road level plus the 2.2 m dip.
- No slab top is under 0.9 m above its own ground, so every slab is solid to the car.

### Build list (`genCell`, zone `field`)
| Element | Detail |
|---|---|
| Blocks | 40 slabs per lot into one bucket. Each stands on the dipped ground (base at `g`, top at `top`) and has a `solids` entry (`y0: g, y1: top`) that stays upright. |
| Tilt | see "Tilt and dip" below |
| Lot surface | a 17×17 grid mesh over the 62 m lot, displaced by `g`, in the same paving material as the other lots |
| Material | new `stele`: MeshStandard `0x2c2e32`, roughness .82, no texture noise. Smoother and slightly bluer than `concrete`, so it reads as a different, deliberate object. |
| Tower/plinth | none; no `tower()` calls. The skyline is whatever the neighbouring districts show. |
| Lamps | on the roads only, `lampOn = 0.5`. **Nothing** inside the lots. |
| Signs, neon, ads | none |

- **Map tint:** `#26282b`. On the pause map, draw the lot as a fine dot grid if cheap; otherwise a flat tint.
- **Names:** `['The Field', 'Grey Rows', 'Between the Blocks', 'Low Ground']`.

### Light — a dependency
Inside a deep lot there is no light at all, and the car currently lights nothing (design review G10). Without a light source this zone is a black screen.

**Decided:** give the saloon **one real headlight**, always on at night.
- A single `THREE.SpotLight`: colour `0xfff0d6`, angle 0.5, penumbra 0.6, distance 70, no shadows.
- Parented to the car and on in every zone at night (intensity 1.2), off by day.
- One light is cheap, and it also fixes G10 everywhere.
- The slabs are MeshStandard, so they respond to it. You'd see two walls sliding past in your own light.

### Moment — `pacer`
Someone else is in the field, one lane over.
```
   you →   ═══════════════════════►
           ▯   ▯   ▯   ▯   ▯   ▯
   them →  · · ·●· · · ·●· · · ·●·      their headlights flash through each gap as they keep pace with you
           ▯   ▯   ▯   ▯   ▯   ▯
```
- A global object like `makeTaillights`: two white points and a dim body, in the lane **two lanes over**, parallel to your heading. It works whether you're inside the lot or passing it on the road.
- It matches your speed (capped at 60 km/h) for 5–7 s, so its lights strobe through the gaps between slabs. Then it stops, and its lights go out after 1.5 s.
- If you drive to that lane, nothing is there.
- Counts as used once its lights go out.
- No caption.

### Atmosphere while inside a lot
Driven by `depth` = wall height beside the car (`top − g`) ÷ 8.5, 0…1, smoothed over 0.6 s:
- **Radio:** tape filter 2000 → `2000 − 1500·depth` Hz; music gain × `(1 − 0.5·depth)`.
- **Rain sound:** gain × `(1 − 0.6·depth)`.
- **Engine filter:** 400 → `400 − 200·depth` Hz.
- **Rain streaks:** unchanged.
- All of it returns to normal within about 1.5 s of leaving.

### Tilt and dip (decided 2026-10-11: both, done tastefully)

Both must be subtle. The player should feel them without being able to point at them.

**Tilt**
- Each slab leans by at most **1.5°**, about a random horizontal axis. About 30% of slabs stay perfectly upright.
- Neighbours lean in related directions: take the lean from a smooth noise field over the district, not an independent random number per slab. It should read as ground that has settled, not as jitter.
- Simplest build: shear the slab. Shift its four top vertices sideways by `height · tan(angle)`, at most 0.22 m at the tallest slab. The base stays where it is.
- Collision boxes stay upright and unchanged. The mismatch is under 0.25 m at the top, well above the car.
- No slab leans far enough to narrow a lane below 4.6 m at car height.

**Dip**
- The lot surface follows `g`: a smooth bowl, 0 at the edge and at most −2.2 m at the centre, scaled by the district swell `w`, so shallow lots barely sink.
- The first 4 m inside the lot edge is flat, with no kerb, lip or seam where the lot meets the sidewalk.
- Maximum slope **7%**. Slope is zero at the edge and at the centre (use smoothstep), so there is no crest or kink.
- The car follows the ground:
  - `car.pos.y = groundAt(x, z)`, which returns 0 everywhere except inside field lots.
  - The car pitches and rolls to the slope, smoothed over 0.25 s.
  - No gravity, no speed change on slopes, no bounce.
- Everything attached to the car follows it down: the camera, headlight, trails (`groundY`), rain and the `pacer` car.
- The chase camera keeps its usual height above the car and must not bob. Smooth its y over 0.4 s.
- Ground collision compares solids to the car's own height, not to 0: `b.y0 > car.pos.y + 1.5 || b.y1 < car.pos.y + 0.6`.
- Drawing it: the world ground is one flat 2.4 km plane (`:1822`), which would cover a sunken lot. Recommended:
  - Add a small mask texture to the ground material (one texel per cell around the car, set for field cells).
  - Discard the ground's pixels inside the lot rectangle of masked cells.
  - Draw the displaced lot mesh from the build list in their place.
  - An equivalent method is fine if it leaves no seam.
- The removed version `6891eef` had a `groundAt(x, z, cy)` for bridges and underpasses. Read it for reference, but build only this smooth bowl: no ramps, barriers or multi-level surfaces.
- Spaceship: unchanged. Its floor stays at road level.

**If the dip misbehaves:** ship the tilt alone and leave `g = 0`. Every other number in this section still works on flat ground. The walls are then 6.3 m; raise the top formula's 5.4 to 7.6 to restore 8.5 m.

### Known limits
- **Spaceship:** it flies over the field and sees the whole wave pattern from above. That's a bonus.
- **Speed:** at high speed you'll glance off slabs. That's intended: the zone slows you down.

### Acceptance
- [ ] Driving into a deep lot at 40 km/h, the surrounding towers are hidden by the third row.
- [ ] From the road the field looks low (tops about 6 m at most), and there is no visible edge where the lot starts to sink.
- [ ] Driving in and out at 80 km/h, the camera doesn't bob and the car doesn't hop.
- [ ] The lean is only noticeable when you look down a long lane: the tops don't line up.
- [ ] The car fits every lane without scraping when driven straight.
- [ ] From the road you can see down a lane to the far side.
- [ ] The audio muffles on the way in and recovers on the way out.
- [ ] 60 fps with 3×3 field cells loaded (about 360 boxes, merged per cell).

---

## 3. Office Park — zone key `office`

**One line:** low glass offices behind empty car parks, every floor lit for nobody, and one building that notices you.

**Research:**
- Tati's *Playtime*: "Everybody is filmed as if moving in straight lines and feeling prisoners of their surroundings."
- Lewis Baltz's *The New Industrial Parks*.
- Augé's non-places.

### Plan of one lot — WIREFRAME
```
 34                                                          96
  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │   ┌──────────────────────────────────────────────┐       │  building 44 × 16 m, 3 floors (11.4 m),
  │   │              OFFICE  (3 floors)              │       │  at the back of the lot (z 74…90)
  │   └──────────────────────────────────────────────┘       │
  │      ▔▔ entrance canopy                                  │
  │   ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷        ☼              │  car park: 2 rows of bays, 2.5 × 5 m,
  │   ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵                       │  white lines only: flush, drivable
  │                  (6 m aisle)                             │
  │   ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷ ╷        ☼              │  2 lighting columns (6 m, white)
  │   ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵ ╵                       │
  │ ▬ sign plinth                                            │  low lit sign by the road corner
  └──────────────────────────────────────────────────────────┘
                         x-road
```
- **Every building in a district is identical:** same size, same side of the lot, same sign position. Only the sign text changes.
- **Parked cars:** 85% of lots have none; 15% have exactly one, far from the door.

### Elevation — WIREFRAME
```
  ┌────────────────────────────────────────────────────────┐
  │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ panel ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  1.4 m
  │░░░░░░░░░░░░ glass band, floor 3 (lit) ░░░░░░░░░░░░░░░░░│  2.4 m
  │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  1.4 m
  │████████████ glass band, floor 2 (dark) ████████████████│  2.4 m
  │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  1.4 m
  │░░░░░░░░░░░░ glass band, floor 1 (lit) ░░░░░░░░░░░░░░░░░│  2.4 m
  └────────────────────────────────────────────────────────┘
     through the lit glass: a ceiling grid of light panels, rows of desks, no one
```

### Build list (`genCell`, zone `office`)
| Element | Detail | Material |
|---|---|---|
| Panel bands | 4 boxes 44×1.4×16 | new `panel`: MeshStandard `0x55585c`, roughness .7 |
| Glass bands | 3 boxes 44×2.4×15.6, recessed 0.2 m | lit: new `officeLit` (MeshBasic with a canvas texture: a ceiling-panel grid over dark desk silhouettes, colour `0xcfe3d2`); dark: `glassDark` (shared with zone 1) |
| Which floors are lit | fixed per building from `rnd()`; each floor has a 55% chance. They don't follow `NIGHT`: these lights are on timers, not people, so they stay on all night. | |
| Entrance canopy | 6×0.3×3 slab on two posts at the building's centre, one `fluo` strip under it | `roof`, `pole`, `fluo` |
| Bay lines | flat quads 0.12×5 m every 2.5 m, two rows, 0.02 m above the paving | existing `paint`, non-emissive |
| Lighting columns | 2 per lot: pole 6 m, `fluo` head, `glowf` pool 16 m | existing |
| Sign plinth | 4×1.1×0.5 m slab at (38, 38) with a lit face | new canvas set `OFFICE_SIGNS`: `UNIT 14`, `UNIT 22–40`, `TO LET`, `VISITORS REPORT TO RECEPTION`, `DELIVERIES →` |
| One parked car (15%) | the existing parked-car boxes from the interchange branch | existing |

- **Collision:** the building, columns, plinth and parked car are solid. The bay lines aren't.
- **Lamps:** street `lampOn = 0.9`, sodium (the car-park columns are the white ones).
- **Map tint:** `#2f3338`.
- **Names:** `['Business Park 3', 'Units 14–40', 'The Low Glass', 'Parkway South']`.

### Moment — `sensor`
The building that notices you.
- The moment block's building is built with **all three floors dark**, and its three glass bands are separate meshes (not merged), so they can switch.
- **Car within 45 m:**
  1. Floor 1 flickers on: three quick blinks over 0.4 s, like a fluorescent tube starting.
  2. Floor 2 follows 0.5 s later, floor 3 another 0.5 s after that.
  3. Each makes a soft `radio.click()`.
- **While the car stays within 60 m:** the floors stay on.
- **Car beyond 70 m:** floors go off top-down at 2.5 s, 3.5 s and 4.5 s.
- It counts as used once the car has been within 45 m and then left.
- No caption.
- This is the only thing in the city that responds to you, and it's a motion sensor.

### Atmosphere while inside the zone
- Within 30 m of any lit office band: a faint fluorescent hum (two sines at 100 Hz and 200 Hz, gain .015) panned to the building.
- Radio unchanged.

### Acceptance
- [ ] Looking down a road, the buildings repeat exactly: same height, same position.
- [ ] You can drive across every car park; the lines don't block the car.
- [ ] The lit floors stay lit at 04:00 while the towers in neighbouring districts have gone dark.
- [ ] The sensor moment switches on floor by floor on approach and off after leaving.

---

## 4. Build order for this batch
1. **Headlight:** it's needed by `field` and improves every zone. Check it in the existing zones first: it must not wash out the sodium pools or light the towers above their bases.
2. **`office`:** the simplest; it adds the `panel`, `glassDark` and `officeLit` materials.
3. **`newtown`:** reuses `glassDark`; adds `winDead`, the stadium and the show flat.
4. **`field`:** adds `stele`, the `pacer` moment and the audio muffling. Build it in three commits:
   1. flat and upright
   2. the tilt
   3. the dip

   That way the dip can be backed out on its own.
5. Add all three to `ZONES`, `ZONE_NAMES`, `MOMENT_FOR` and `ZONE_TINT`, in the order given in §0.
6. Screenshot each zone at night and by day (`tools/shoot.js`), from the road and from inside a lot. Commit and push per zone.

**Testing a zone quickly:** temporarily force `pick = '<zone>'` at `:1262` so the drive starts in it. Remove it before committing.
