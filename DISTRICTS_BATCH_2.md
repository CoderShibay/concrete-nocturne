# Districts — Batch 2 (detailed spec)

**Coming Soon · Density Wall · The Port**

Written by the design agent for the build session, against commit `cd188bb` (2026-10-12).
Concepts and research sources: `DISTRICT_CONCEPTS.md` (#5, #8, #2). Rules: `LONELY_CITY_BRIEF.md`.
Wireframes: `wireframes/batch-2.html`.

> **Status: BUILT on 2026-10-12** (commits `6831eeb` to `e64fa36`). Approved by Ali on 2026-10-12. The wireframes and the four decisions below are final.
>
> **Where the build differs from this spec:**
> - **The Port**
>   - Containers carry 28% of their own colour as light at night; with only ambient light the stacks were black from the road.
>   - Crane legs do not block the car (they block the spaceship), so a creeping crane never closes a gap.
>   - The lift crane's beam reaches z 12, not z 22, so the container hangs over the middle of the road (the drawing has the trolley at z 15).
>   - The lift crane stands still and does not creep. The ship's hull is a near-black lit material, not `dark`. It has six lit windows on each side of the stern house.
>   - The basin lot has no light masts (they would stand in the water).
> - **Density Wall**
>   - Lit windows are at 70% strength. Its low floors do not go dark first, as they do in other districts; otherwise the street level was nearly dark at 04:00.
>   - The lintel's windows start at 9.6 m (three floors up) with a plain beam from 7 m, so window rows line up. The gate is still 9 × 7 m.
>   - The shutter band is a dark lit material, not `dark`. The map has no gate notch.
> - **Coming Soon**
>   - The hoarding is `#23262a`, not `#4a4d52`, which turned white in the headlight.
>   - The crown sign ignores fog. The tower is only built within three blocks of the car, so it cannot be seen from every cleared street.
>   - Terraces always run along x, whichever way the demolition crosses the district.
>   - Wallpapers are 2.3 times brighter by day.
>
> **Decisions:**
> 1. Coming Soon: demolition in **three bands** across the district.
> 2. Density Wall: blocks **fill the whole lot**.
> 3. Density Wall: windows **stay mostly lit all night**.
> 4. The Port: **include** the dock basin and ship.

---

## 0. Ground rules (unchanged from batch 1)

| Fact | Value |
|---|---|
| Block pitch | `C = 100` m |
| Road | `R = 30` m wide; sidewalk `SW = 4` m |
| Lot | 34→96 = **62 m** square |
| Building area | 41→89 = **48 m** square, centre 65 |
| District | `DS = 12` blocks per side |
| Car collision radius | 1.7 m; a solid blocks if it overlaps 0.6–1.5 m above the car's ground |
| Bloom | night threshold 0.3: any plain-colour (`MeshBasic`) surface brighter than about 45% grey will flare |

**Lessons from batch 1, applied here:**
- Every size in this spec has been added up. If a number still doesn't fit, keep the wireframe's proportions and report it.
- Lit surfaces are given as final dimmed colours, so they don't flare under bloom.
- The saloon already has a headlight (`HEADLIGHT`, `:2211`). Nothing here changes it.
- A sunken surface reuses the batch 1 ground cut-out (`HOLES`, `:2156`). Change its test from `c.zone !== 'field'` to a per-cell flag, `c.hole`.

**To add a zone, touch the same seven places as batch 1:** `ZONES`, `ZONE_NAMES`, `MOMENT_FOR`, a `genCell` branch, a moment builder, `ZONE_TINT`, and any per-zone atmosphere in the frame loop.

**New drive order** (13 zones):

```
corridor → office → boulevard → newtown → plaza → field → interchange → port → residential → density → corner → soon → fog
sameness   sameness  scale       scale     exposure exposure  non-place    non-place people      people    people   fading  fading
```

---

## 1. Coming Soon — zone key `soon`

**One line:** an old low-rise neighbourhood being demolished street by street, with the rooms people lived in cut open to the weather and a glass tower advertised over the rubble.

**Research:**
- Albrecht's solastalgia: "a form of homesickness one gets when one is still at 'home'".
- Jeremiah Moss: "The spirit of the city as we knew it has vanished in the shadow of luxury condo towers."
- Kenopsia: "you recognize the place, but can't find the moment."

**Why it's different:** it is the only zone with human-scale buildings (four storeys), and the only one with a past. Everywhere else is finished or never started; here you watch a place being removed.

### Plan of one district — WIREFRAME
The demolition moves across the district in one direction, picked per district by `zr()`. Driving along that axis, you pass from streets where people still live, through streets being cut open, to cleared ground.

```
 rows 0–3   INTACT    old terraces, a few windows still lit
 rows 4–7   CUT OPEN  one terrace standing with its front wall gone; the other is rubble
 rows 8–11  CLEARED   rubble, hoardings, billboards, a crane on one lot in four
 one lot    TOWER     the finished glass tower, in the cleared part (row 9, column 6)
```

**Decided:** the three bands, as drawn.

### The three kinds of lot

**Intact (rows 0–3)**
| Element | Size / position | Material |
|---|---|---|
| Two terraces | each 48 × 11 m, 4 floors × 3.4 m = 13.6 m plus a 0.8 m parapet = **14.4 m**; front row at z 41–52, back row at z 78–89 | new `winOld`: `windowMaterial(v, seed, 0.3, '#3a352f')`: warmer, browner concrete; windows follow `NIGHT` as usual |
| Back yard | z 52–78: three low sheds 4 × 2.4 × 3 m, and a washing line (two poles and a thin bar) | `concrete`, `pole` |
| Front doors | 8 per terrace, 1 × 2.1 m dark rectangles at ground level, one every 6 m | `dark` |

**Cut open (rows 4–7)**
| Element | Size / position | Material |
|---|---|---|
| Standing terrace | front row only (z 41–52). Its road-facing wall is missing for 30 m (x 41–71): **5 rooms × 4 floors = 20 open rooms**. The last 18 m (x 71–89) is intact. | `winOld` for the intact part |
| Each open room | 6 m wide × 3.4 m high × 4 m deep:<br>- back wall in one of six wallpaper colours<br>- 0.25 m floor slab<br>- 0.25 m party walls | wallpapers: new `paper0…5`, plain colours at night brightness: `#3d3524` ochre, `#2c3a30` sage, `#3d2b2c` dusty pink, `#27323d` pale blue, `#3a372e` cream, `#2e241c` brown |
| Room details | chosen per room from `rnd()`:<br>- a door (0.9 × 2 m, `dark`) in 60%<br>- a picture frame (0.6 × 0.45 m, `pole`) in 30%<br>- a stair run (5 steps, `concrete`) in one room per floor | |
| Rubble | where the back row was (z 78–89), and a strip in front of the cut face: 6–9 boxes, 0.5–2.2 m high, 2–6 m wide | `concrete` |
| Site floodlight | one 8 m pole at (38, 38) aimed at the cut face: `fluo` head, `glowf` pool 22 m on the ground in front of the rooms | existing |

**Cleared (rows 8–11)**
| Element | Size / position | Material |
|---|---|---|
| Rubble heaps | 3 heaps of 4–6 boxes | `concrete` |
| Hoarding | 2.4 m high, 0.2 m thick, along both road sides of the lot at 34.6 m, with an **8 m gate gap** in the middle of each side (61–69) so the lot stays drivable | new `hoard`: MeshStandard `#4a4d52` |
| Billboards | 2 per road side: 8 × 4 m boards on two posts, bottom edge at 3 m, behind the hoarding | new canvas set `SOON_ADS`, colour multiplied to 45%:<br>- `LUXURY LIVING / COMING SOON`<br>- `THE RESIDENCES`<br>- `A NEW WAY TO LIVE`<br>- `REGISTER YOUR INTEREST`<br><br>Each shows a pale glass tower drawn on a dusk gradient. |
| Tower crane | on lots where `(li + 2·lj) % 4 === 0`:<br>- mast 1.6 m square × 48 m at (70, 70)<br>- jib 40 m × 1.2 m<br>- counter-jib 12 m<br>- red `beacon` at the top | `pole`, `beacon` |

**The tower (one lot, row 9, column 6)**
| Element | Detail |
|---|---|
| Tower | 26 × 26 m at the lot centre, **210 m** tall, `glassDark` (batch 1), with a 6 m lit lobby band |
| Lobby | `room`-style dim warm wall (batch 1 `room` colour), a reception desk box, no figure |
| Crown sign | `THE RESIDENCES` on two faces at the top, 14 × 3.5 m, from `SOON_ADS` at 45% |
| Windows | none lit. The tower is sold, not lived in. |

- **Collision:** terraces, rubble, hoardings, billboard posts, crane mast and tower are solid.
- **Lamps:** `lampOn = 0.4`, `sodium = true`. Old lamps; many dead.
- **Signs:** none besides the billboards and the crown.
- **Map tint:** `#3a342c`.
- **Names:** `['The Last Terrace', 'Hoarding Street', 'Coming Soon', 'Where Number 9 Was']`.

### Moment — `lastroom`
One room in a cut-open terrace still has its lamp on.
- Placed only on "cut open" lots. On other rows the fallback is distant tail lights (as `showflat` does).
- The room is on the **third floor** (y 6.8–10.2), one of the five open rooms.
- Its back wall is the batch 1 `room` material (dim warm).
- Inside:
  - a standing lamp with a `shade`
  - one chair (`furn`)
  - a picture on the wall
  - a warm `glow` pool 10 m on the rubble below
- No figure.
- While the car is within 60 m, the radio picks up **another song**, faintly, panned to the room:
  - a slow 8-note major-key phrase on a sine wave
  - one note every 0.7 s
  - lowpassed at 900 Hz
  - gain 0.02, fading with distance
  - It stops when the moment is done.
- Done when the car has passed within 55 m.
- No caption.

### Atmosphere while inside the zone
- Wind through the open buildings: bandpassed noise at 400 Hz, gain 0.012, slowly swelling.
- Radio unchanged.

### Acceptance
- [ ] Driving along the demolition axis, you pass intact streets, then cut-open ones, then cleared ground, in that order.
- [ ] From the road, each open room's wallpaper colour is distinguishable at night without flaring.
- [ ] Every cleared lot can be entered through its gate gaps.
- [ ] The tower is visible from every street in the cleared part.
- [ ] The lit room is the only warm light in view when it appears.

---

## 2. Density Wall — zone key `density`

**One line:** housing so tall and so tightly packed that the sky is a strip, with most windows lit: the one district that is full of people, none of them reachable.

**Research:**
- Michael Wolf: "Any trace of a skyline or horizon is absent… from which the eye can no longer escape"; "Bits of laundry and hanging plants… the only irregularities."
- Hammoud et al. 2021: "Increased overcrowding and population density were associated with higher levels of loneliness."
- Simmel: "never feels as lonely and as deserted as in this metropolitan crush of persons."

**Why it's different:** every other zone is dark and getting darker. This one stays mostly lit all night. Its contrast makes the rest of the city emptier.

### Plan of one lot — WIREFRAME
A hollow block that fills the whole 62 m lot, with no apron.

```
 34                                                          96
  ┌──────────────────────────────────────────────────────────┐
  │████████████████████████ wing, 13 m ██████████████████████│
  │████┌────────────────────────────────────────────────┐████│
  │████│                                                │████│
  │████│            courtyard, 36 × 36 m                │████│
  │████│            (open to the sky, 200 m up)         │████│
  │████│                                                │████│
  │████└────────────────────────────────────────────────┘████│
  │█████████████████████████┐  gate  ┌█████████████████████████│
  └─────────────────────────┘ 9 × 7 m └────────────────────────┘
                         x-road
```
- **Four wings**, each 13 m deep, around a 36 × 36 m courtyard (47→83).
- **Height:** 190 + `zr()`·50 m, one height per district.
- **Gate:** a 9 m wide × 7 m high opening through the wing facing the x-road (x 60.5–69.5), on lots where `(li + lj) % 2 === 0`. You can drive into those courtyards. The other blocks are sealed.
- **Decided:** blocks fill the lot as drawn. The street becomes a 38 m canyon, and sealed blocks can't be driven onto.

### Build list (`genCell`, zone `density`)
| Element | Detail | Material |
|---|---|---|
| Wings | 4 boxes (the gated wing is two boxes plus a lintel above the gate) | new `winDense` |
| `winDense` texture | same 24 × 51.2 m tile, but 12 columns × 16 rows (windows 2 m apart). Painted into the texture:<br>- an air-conditioner box under about 40% of windows<br>- a laundry strip (3–4 small coloured rectangles) under about 15%<br>- a plant on about 10% | `windowMaterial` variant with `litAmt = 0.75` |
| Lit windows | **Decided:** they stay mostly lit all night. The zone uses its own uniform, `max(0.55, litFraction)`, so about half the windows are still on at 04:00. | |
| Street clutter | on the road faces, from 3 to 12 m up:<br>- balcony cages (1.6 × 1.1 × 0.6 m boxes, `pole`) on about 1 window in 6<br>- 3 vertical pipes per face (`pole`) | |
| Ground floor | rolled-down shutters: a 4 m `dark` band with thin `pole` lines every 3 m. No signs, no neon. | |
| Courtyard | paving, plus:<br>- one working lamp<br>- one dead lamp<br>- 4 parked cars<br>- a row of bins (0.8 m cubes) | existing |

- **Collision:** the wings are solid. The gate is open (the lintel's solid starts at 7 m).
- **Lamps:** street `lampOn = 0.7`, `sodium = true`.
- **Map tint:** `#3d3a36`. Draw gated blocks with a small notch if cheap.
- **Names:** `['No Horizon', 'Ten Thousand Windows', 'Monster Block', 'The Inner Courtyard']`.

### Moment — `flicker`
The same television in a hundred rooms.
- `winDense` gets a second emissive layer: a mask texture marking about 12% of windows, driven by one shared uniform `uTV`.
- When the moment is active and the car is within 150 m of its block, `uTV` runs for **6 seconds**:
  - A shared random signal changes level every 0.08–0.35 s.
  - The colour is `(0.45, 0.6, 1.0)`, at most 50% brightness.
  - Every marked window in view flickers in perfect unison.
- Then it cuts to zero in one frame.
- Because the uniform is shared, every Density Wall facade in view does it together. That is the point.
- Done when the 6 seconds finish. No caption.

### Atmosphere while inside the zone
- **A murmur of televisions:** two bandpassed noise layers (700 Hz and 1400 Hz, Q 4), each amplitude-modulated at speech rate (3–5 Hz, random), gain 0.02.
- **Air-conditioner hum:** 120 Hz, gain 0.01.
- This is the loudest zone, with nobody to talk to.
- **Inside a courtyard:** the same murmur at gain 0.035, and the rain is ducked by 30%.

### Acceptance
- [ ] Standing on a street in the district, no horizon is visible in the direction of the road: facades fill the frame to the top.
- [ ] At 04:00, about half the windows here are lit while neighbouring districts are nearly dark.
- [ ] The car drives through a gate into a courtyard and out again without scraping.
- [ ] Looking up from a courtyard shows a small square of sky.
- [ ] The flicker moment shows dozens of windows pulsing together, then stopping at once.
- [ ] 60 fps with 3 × 3 cells loaded.

---

## 3. The Port — zone key `port`

**One line:** a container terminal that runs all night with nobody visible: stacks like canyon walls, cranes moving on their own.

**Research:** Mark Fisher on the port of Felixstowe: it is "noisy but feels eerily silent because people remain hidden inside cabs, cranes, and offices… Automated systems… dominate perception." Fisher's eerie asks "what is acting, what has disappeared, and why."

**Why it's different:** it is the only zone where things move without you, and the only one with colour (the containers).

### Plan of one lot — WIREFRAME
```
 34                                                          96
  ┌──────────────────────────────────────────────────────────┐
  │ ✦ mast                                                   │
  │   ══════════ gantry leg rail ══════════════════════      │  z 44
  │   ▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓      stack group, 5 wide    │  z 48.3–60.5
  │   ▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓                             │
  │            9 m drivable aisle                            │  z 60.5–69.5
  │   ▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓      stack group, 5 wide    │  z 69.5–81.7
  │   ▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓                             │
  │   ══════════ gantry leg rail ══════════════════════      │  z 86
  │                                                   ✦ mast │
  └──────────────────────────────────────────────────────────┘
      x 41–53.2   58.9–71.1   76.8–89      (5.7 m gaps)
```
- **Container:** 12.2 × 2.44 × 2.59 m (a real 40-foot box).
- **Three bays along x**, each one container long: 3 × 12.2 + 2 × 5.7 = 48 m.
- **Two groups along z**, each five containers wide (5 × 2.44 = 12.2 m), with a 9 m drivable aisle between them.
- **Stack height:** each of the 30 columns is 2–6 containers high (5.2–15.5 m), from `rnd()`.

### Build list (`genCell`, zone `port`)
| Element | Detail | Material |
|---|---|---|
| Container columns | one box per column, n × 2.59 m high; one colour per column | new `box0…4`, MeshStandard with a corrugation texture (vertical stripes every 0.3 m): rust `#6e2f25`, blue `#24415e`, green `#2f4a3a`, grey `#55585c`, ochre `#7a5a22` |
| Gantry crane | on lots where `(li + 2·lj) % 3 === 0`:<br>- two leg frames 24 m high at z 44 and z 86 (span 42 m)<br>- a beam 2 × 2.5 m across the top<br>- a trolley under the beam<br>- a cab 3 × 2.4 × 3 m hanging beside the trolley, with a dim warm window, **empty** | `pole` structure, `roof` beam, `room` cab window |
| Gantry motion | **every gantry is always working:**<br>- the trolley travels the beam at 1.2 m/s, pauses 4 s at each end<br>- the whole crane creeps along its rails at 0.4 m/s between x 45 and 85<br>- a spreader hangs 6 m below the trolley on two thin cables | a per-cell `tick`, like the sensor |
| High masts | 2 per lot at (37, 37) and (93, 93): 30 m poles, four `lamp` heads, a `glow` pool 44 m across at opacity 0.3 | existing |
| Reefer hum units | on 2 columns per lot: a small `fluo` panel (0.4 × 0.6 m) on the container end, a tiny green status light | `fluo`, new `led` MeshBasic `#3d7a4a` |

**The dock basin (one lot, the district centre: row 6, column 6)**
| Element | Detail |
|---|---|
| Water | a flat plane at **−1.5 m**, filling the lot inside a 2 m quay edge (36→94), `glassDark`. The world ground is cut away with the batch 1 `HOLES` mask. |
| Quay edge | a 0.9 m kerb around the basin, **solid**: the car cannot drive in. Mooring bollards every 8 m. |
| Ship | - hull 50 × 12 m, top 8 m above the water, `dark`<br>- at the stern, a superstructure 10 × 12 × 12 m with **six lit windows** (`room`)<br>- a string of 8 deck lights (`lamp`)<br>- a `beacon` at the masthead |
| Decided | the basin and ship are included. It is the only water in the city. |

- **Collision:** container columns, crane legs, masts, the quay kerb and the ship are solid. The aisle and the gaps are open: the car fits the 5.7 m gaps (it needs 3.4 m).
- **Lamps:** street `lampOn = 0.8`, `sodium = true`.
- **Map tint:** `#33393f`.
- **Names:** `['Terminal Four', 'Stack Yard', 'The Gantries', 'Berth 9']`.

### Moment — `lift`
A crane carries a container over your head.
- The moment block gets a gantry whose beam extends **22 m past its front leg, out over the x-road** (to z 22).
- When the car is within 120 m:
  1. the spreader lifts a container from the front stack to 18 m (4 s)
  2. the trolley carries it out over the road (5 s)
  3. it hangs there for 2 s
  4. it travels back (5 s)
  5. it is lowered onto the stack (4 s), with a clank
- The cab is lit and empty throughout.
- A ship's horn sounds once, far off, as it sets down: `radio.trainHorn()` pitched down an octave, at half gain.
- Done when the cycle finishes or the car is more than 200 m away.
- No caption.

### Atmosphere while inside the zone
- **Machinery:** a low drone (55 Hz and 82 Hz sines, gain 0.02) and a slow whine (a 600–900 Hz sine sweeping over 8 s, gain 0.006).
- **Clanks:** a filtered noise burst every 12–25 s, randomly panned.
- **Radio:** music gain × 0.7. Something is always louder than it here.

### Acceptance
- [ ] From the road, the stacks read as coloured walls of different heights; the colours don't flare.
- [ ] The car drives the 9 m aisle and every 5.7 m gap without scraping.
- [ ] Every gantry in view is moving, slowly, with a lit empty cab.
- [ ] The lift moment carries a container over the road above the car and returns it.
- [ ] The basin's water sits below the quay, and the car cannot enter it.
- [ ] 60 fps with 3 × 3 cells loaded and three gantries moving.

---

## 4. Build order for this batch
1. **`HOLES` flag:** change the ground cut-out from "zone is field" to a per-cell `hole` flag. Check Field of Blocks still works.
2. **`port`:** stacks and masts, then the moving gantries, then the `lift` moment, then the basin.
3. **`density`:** `winDense` and the blocks, then the gates and courtyards, then the `flicker` moment.
4. **`soon`:** intact terraces, then the cut-open rooms, then cleared lots and the tower, then the `lastroom` moment.
5. Add all three to `ZONES` in the order in §0, plus `ZONE_NAMES`, `MOMENT_FOR` and `ZONE_TINT`.
6. Screenshot each zone at night and by day, from the road and from inside a lot. Commit and push per step.
