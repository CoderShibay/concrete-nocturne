# Design Review & Build Instructions — UI and Graphics
**Concrete Nocturne · review of 2026-10-08 (commit `d36de66`)**

Written by the design agent; it is meant to be implemented in a separate session. All 18 screenshots it refers to are in `../Screenshots/Review 2026-10-08/` (`01_intro.png` … `18_mobile.png`).
To re-shoot after changes: serve the folder (`python3 -m http.server 8931`), run `./build-play.sh`, then `node tools/shoot.js "<output folder>"`.

---

## 0. Verdict

The city is now good. The UI and the image on top of it are still from the old synthwave version, and they fight the lonely city.

The 3D world says one thing: Soviet concrete, sodium light, a white saloon, doomer radio. The interface and post-processing say another:
- wide futuristic display type
- orange and cyan glows on every word
- a row of six buttons that reads like a debug panel
- RGB colour fringing on every window
- a warp-speed starfield when you boost

On top of that, a few elements are simply crude:
- light pools that look like fried eggs
- crosswalk stripes brighter than anything in the city
- a big red dot covering the map
- an illegible caption
- the developers' names in a vehicle label

None of this needs new systems. It's mostly deletion, tuning and one consistent visual language.

**The one rule for the whole pass:**

> **The interface belongs to one small car in a city that doesn't care.** It should be as quiet as the city, readable at a glance, and gone when you don't need it. Eisenman: "here is a place without information. That is what I wanted."

---

## 1. What's wrong (with evidence)

Severity levels:
- **P0:** broken or embarrassing; fix first.
- **P1:** hurts the look on every frame.
- **P2:** polish.

### Interface

| # | Sev | Finding | Screenshot |
|---|---|---|---|
| U1 | P0 | The **start screen sits on top of the live HUD**: district, clock, minimap, speedo and all six buttons show behind the title. The first impression is cluttered. | 01 |
| U2 | P0 | **Developer labels are shown to the player**: "Vehicle: Spaceship · Night Courier **(Codex)**" (`concrete-nocturne.html:2419`). | 16, 18 |
| U3 | P0 | **The caption is illegible.** "SOMEONE ELSE IS OUT TONIGHT." is grey on dark, 13 px, letter-spacing .42em, opacity .82. The best writing in the game is invisible. | 06 |
| U4 | P1 | **Six buttons are always on screen** (Music, Rain, Vehicle, Camera, Time, Pause). They read as a debug toolbar, and on mobile they stack into a tall column over the road. | 02–17, 18 |
| U5 | P1 | **The type is wrong for this game.** Syncopate is a wide futuristic face from the synthwave version. Its mixed-height lowercase ("concrete nocturne") looks like a sci-fi logo, not a Soviet city. | all |
| U6 | P1 | **Glow on every piece of text**: orange and cyan `text-shadow` on the brand, clock, speed, gear and title. It's a synthwave leftover; the city's palette has no cyan. | all |
| U7 | P1 | **The speed readout:**<br>- At rest, the "0" in the display face reads as a donut ring.<br>- The gear number is tiny, and "KM/H" sits under the gear instead of the speed.<br>- In other vehicles the same slot shows "HOVER" or "ALT 78 m" in a different style, and "ALT 88 m" wraps over three lines on mobile. | 02, 12, 15, 18 |
| U8 | P1 | **Two unlabelled thin bars** (revs and boost) look the same. The revs bar turns red at the top end. | 02–04 |
| U9 | P1 | **The minimap competes with the road.** The chase car is a big red dot, the gas station an orange square, and zone tints are muddy browns. The red dot is the loudest thing on screen. | 06–17 |
| U10 | P1 | **The pause map is crude:**<br>- a red dot 60 px across covers the route<br>- district labels sit in boxes<br>- the controls list repeats "Q · E" (`:163–171`)<br>- "B · Q · E" wraps over two lines | 07 |
| U11 | P2 | **The brand title is shown all game** (top left). Once the drive starts, the player knows what game this is. | all |
| U12 | P2 | **The intro copy is out of date**: "neon in the rain, and a radio playing lo-fi". The game is now sodium light with a doomer post-punk radio, and the neon was removed. Eleven control rows are a wall of text. | 01 |

### Image

| # | Sev | Finding | Screenshot · code |
|---|---|---|---|
| G1 | P1 | **Chromatic aberration** puts red/blue fringes on every lit window. It reads as a cheap glitch, not lo-fi. | 02–06 · `lofiPass`, `off = d*r2*0.014` (`:2497`) |
| G2 | P1 | **Light pools look like fried eggs**: hard-edged, yellow-green, painted flat on the road at opacity .72 with additive blending. They're the brightest objects in most frames. | 01–03, 05, 08 · `glow: glowMat(0xff8a2a, 0.72)` (`:1148`) |
| G3 | P1 | **Road paint glows.** Crosswalks and lane lines are drawn into the emissive map too (`both()` paints both canvases, `:2176`), so they shine pale blue-white like neon. Real paint should only show where light falls on it. | 01, 02 |
| G4 | P1 | **Rain turns into a warp starfield** at speed: streaks are 1.1 m long plus a velocity smear (`vx*0.02`), at opacity .28, in front of everything. At boost it looks like a jump to hyperspace. | 04, 15 |
| G5 | P1 | **Tail-light trails never fade when you stop.** The red ribbons stay drawn as "rails" at 0 km/h. The fade is by point index, not time. At boost they turn into thick yellow beams (Tron). | 06, 10, 05, 04 · `updateTrails` (`:2423`) |
| G6 | P1 | **Night buildings dissolve into one black mass.** The towers have no edge against the sky; the only shape comes from scattered window slivers. | 03, 04, 12 |
| G7 | P1 | **Bloom catches too much** (threshold .3), so the car body, hoverboard deck, ship and paint all flare. The hoverboard deck is the brightest object in the city. | 12, 13, 14 · `UnrealBloomPass(…, 0.95, 0.55, 0.3)` (`:2491`) |
| G8 | P2 | **The view from the ship at night** is a black floor with an orange stripe for a horizon. The city's best shot, a grid of sodium light seen from above, never appears. | 15, 16 |
| G9 | P2 | **The ship's trail** runs as two white rails down to the ground and reads as headlight beams. | 15, 16 |
| G10 | P2 | **The saloon at night** is flat lavender-pink with no headlight light on the road ahead. | 02, 03 |

### Bugs seen while shooting

| # | Sev | Finding | Screenshot |
|---|---|---|---|
| B1 | P0 | **The hood camera shows a solid brown screen** when the car is stopped against a wall or parapet: the camera is inside the geometry. | 09 |
| B2 | P0 | **After about 20 s of holding W from the start**, the car ends up nose-in against the parapet of an elevated road at 0 km/h. In the chase camera, the parapet fills the middle of the frame. Check the start route and the barriers on the new raised roads. | 06, 10, 11 |

---

## 2. Design language (use for every UI change)

### Typeface
Replace Syncopate with **PT Sans Narrow** (700) for display, and IBM Plex Mono with **PT Mono** for labels.
- PT was made by ParaType in 2009 for the *Public Types of Russian Federation* project. It is "based off Russian sans-serifs of the latter half of the twentieth century", with full Cyrillic ([Wikipedia](https://en.wikipedia.org/wiki/PT_Fonts), [Google Fonts](https://fonts.google.com/specimen/PT+Sans+Narrow)). It's the right voice for Radio Panelka.
- Load it with:
  `https://fonts.googleapis.com/css2?family=PT+Mono&family=PT+Sans+Narrow:wght@400;700&display=swap`
- Display text is UPPERCASE, letter-spacing .04–.08em. Never use more than .2em, except for the 10 px labels.

### Colour tokens
Replace `:root`:

```css
--night:#07090c;               /* background, unchanged */
--ink:#e6e0d4;                 /* warm off-white: all primary text */
--dim:#8a857c;                 /* labels, secondary */
--line:rgba(230,224,212,.14);  /* hairlines, borders */
--panel:rgba(8,10,13,.62);     /* panels (pause, settings) */
--sodium:#ff9a3c;              /* the only accent: active state, warning, your position */
--hopper:#7fae8a;              /* rare: moments, the caption rule, "visited" */
--enamel:#1f3a63;              /* district sign plate only */
```

- Delete `--cyan` and `--mag`, and every use of them.
- **Accent budget:** at most one sodium element per screen region.

### Effects
- Remove every coloured `text-shadow` and `box-shadow` glow from the UI.
- For legibility over the 3D view, use `text-shadow:0 1px 2px rgba(0,0,0,.65)` only.
- No `backdrop-filter` on in-game HUD elements (the pause panel may keep it).

### Size scale
- 10 px: labels, caps, PT Mono
- 13 px: body
- 16 px: district and radio
- 22 px: clock
- 40 px: speed

### Motion
- HUD fades take .6 s ease. District signs take 1.2 s in, hold 3.5 s, then 1.6 s out.
- Respect `prefers-reduced-motion`: no fades, instant switches.

---

## 3. Wireframes — APPROVAL NEEDED BEFORE BUILDING U-items

Per the wireframe-first rule, **Ali approves these layouts before any U-item is built**. The G-items and B-items don't change the layout and can be done right away.

### W1 · Start screen (fixes U1, U5, U6, U12)
```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│   (no HUD at all: body.intro hides .hud, .minimap, .chips)         │
│   (camera: slow orbit / dolly along the first corridor, 0.4 m/s)   │
│                                                                    │
│                                                                    │
│  CONCRETE                                                          │
│  NOCTURNE                     ← PT Sans Narrow 700, 72–96 px, ink  │
│  БЕТОННЫЙ НОКТЮРН             ← PT Mono 13 px, dim, .3em spacing    │
│                                                                    │
│  A city that never finishes. Sodium lamps, rain,                   │
│  and Radio Panelka until morning. There is nowhere to be.          │
│                                                                    │
│  W A S D  drive · SPACE  booster · ESC  pause, map, settings       │
│                                                                    │
│  [ START THE DRIVE  ↵ ]       ← hairline border, no glow;          │
│                                  sodium border on hover/focus      │
└────────────────────────────────────────────────────────────────────┘
```
- One line of essential controls. Everything else lives in the pause screen.
- Enter also starts the drive.

### W2 · Driving HUD (fixes U4, U6, U7, U8, U9, U11)
```
┌────────────────────────────────────────────────────────────────────┐
│ 23:41                                                    ┌──────┐  │
│ 88.4  RADIO PANELKA  ▁▃▂▅                                │ mini │  │
│ (radio line shows 6 s after start or a track change,      │ map  │  │
│  then fades; the clock always stays)                     └──────┘  │
│                                                                    │
│               ┌─────────────────────────────┐                      │
│               │  ПАРАЛЛЕЛЬНЫЙ РЯД           │  ← W3 district sign   │
│               │  PARALLEL ROW               │    (only on entering) │
│               └─────────────────────────────┘                      │
│                                                                    │
│                                                                    │
│                  Someone else is out tonight.        ← W4 caption  │
│                                                                    │
│  87  KM/H                                                          │
│  ───────────────  4                                                │
│  ═════            BOOST                                            │
└────────────────────────────────────────────────────────────────────┘
```
- **Removed from the driving screen:**
  - the brand title
  - the "DISTRICT" label and permanent district name (they become W3)
  - all six buttons (they move into W5)
- **Clock:** top left, 22 px, PT Sans Narrow 700, ink, no glow.
- **Speed:** bottom left, 40 px, "KM/H" set to the *right* of the number (not under the gear).
- **Revs line:** 160×2 px, with the gear number at its right end (16 px).
- **Boost line:** 160×2 px, labelled "BOOST" in 10 px PT Mono. It turns `--sodium` when below 25%.
- **Vehicle readouts:** the slot under the speed shows `HOVER`, `ALT 78 M`, `ON TRAIN` or `R` as a 10 px PT Mono label. Never in the speed's display face.
- **Minimap:**
  - 140 px, 1 px `--line` border, no glow
  - fades to 35% opacity after 8 s of straight driving; back to 100% on steering, braking or slowing below 30 km/h
- **Idle fade:** after 10 s without changing input, the whole HUD drops to 55% opacity. Any key brings it back. Nothing is removed, so the brief's "keep every HUD readout" still holds.

### W3 · District sign (replaces the permanent district name)
Shown when you enter a new district, like a street-name plate passing by:
```
   ┌─────────────────────────────────────┐   enamel-blue plate (#1f3a63),
   │  ПАРАЛЛЕЛЬНЫЙ РЯД                   │   1 px #c9c3b6 inner border,
   │  PARALLEL ROW                       │   PT Sans Narrow 700 caps,
   └─────────────────────────────────────┘   top-centre, 26% from top
```
- **Cyrillic line:** optional. If used, write a fixed translation for each name in `ZONE_NAMES` (`:1263` area); no machine translation at runtime.
- **Timing:** fade in 1.2 s, hold 3.5 s, fade out 1.6 s. Never two in a row within 8 s.
- **Reference:** Soviet and Russian street-name plates are white on enamel blue. This makes the district name part of the city, not an overlay. Firewatch's UI is the model: "the elements that make up the HUD are a tangible part of the in-game universe" ([Game Developer](https://www.gamedeveloper.com/design/how-firewatch-s-ui-enhances-player-immersion)).

### W4 · Caption (fixes U3)
```
                 ───
     Someone else is out tonight.
```
- PT Sans Narrow 400, sentence case (not caps), 20 px desktop / 17 px mobile.
- Ink at 92% opacity; shadow `0 1px 3px rgba(0,0,0,.8)`; position 24% from the bottom.
- A 24 px `--hopper` hairline above it.
- Fade 1.2 s in, hold 4.2 s, 1.6 s out.
- These lines are the game's voice. Read them like film subtitles, not like a logo.

### W5 · Pause = map + settings (fixes U4, U10)
```
┌────────────────────────────────────────────────────────────────────┐
│  PAUSED                            WHERE YOU'VE BEEN TONIGHT       │
│  The city waits.                   ┌──────────────────────────┐    │
│  It isn't waiting for you.         │                          │    │
│                                    │   (route in sodium,      │    │
│  SETTINGS                          │    you = small sodium    │    │
│  Music .............. On     M     │    arrow, the other car =│    │
│  Rain ............... On     R     │    6 px ring, district   │    │
│  Time ............... Night  T     │    names as plain 10 px  │    │
│  Camera ............. Chase  C     │    labels, no boxes)     │    │
│  Vehicle ............ Car    V     │                          │    │
│  Ship design ........ Lastochka B  │                          │    │
│                                    └──────────────────────────┘    │
│  CONTROLS ▸ (expands)                                              │
│                                                                    │
│  [ KEEP DRIVING  Esc ]                                             │
└────────────────────────────────────────────────────────────────────┘
```
- **Settings rows** are buttons with the same handlers the chips used. They're mouse- and touch-clickable, so nothing is lost when the chips leave the HUD.
- **Controls:** collapsed by default. When expanded, one row per key. Remove the duplicate `B · Q · E` row.
- **Map:**
  - zone tints desaturated: lightness spread 18–30%, no browns above 35% saturation
  - the chase car as a 6 px `#c8453a` ring, not a 60 px dot
  - visited-district names as plain `--dim` text

### W6 · Mobile (≤560 px)
- Clock top left, minimap 96 px top right. Speed and boost bottom left, above the touch pads.
- No buttons in the HUD (they're in pause). A small pause icon button sits top centre (44×44 px tap target).
- The speed slot label stays on one line: use `ALT 88` with the unit dropped on mobile.

---

## 4. Graphics instructions (do now; no approval needed)

Check each change against the matching review screenshot.

### G1 · Post-processing (`lofiPass`, `:2493`)
- Chromatic offset: `d * r2 * 0.014` → **`d * r2 * 0.0025`**. Fringe only at the far corners.
- Grain: `0.045` → **`0.028`**.
- Keep the vignette and the blue lift.

### G2 · Light pools (`glowMat`, `radialTex`, `mats.glow*`)
- Make the radial falloff softer: alpha = `pow(1 - r, 2.4)` instead of linear. No visible edge.
- `glow` opacity `.72` → **`.38`**; `glowd` `.6` → `.4`; `glowf` `.26` → `.18`.
- Colour: keep sodium, but make it slightly less yellow: `0xff8a2a` → **`0xff7f2e`**.
- **Add wet-road streaks**, the classic night look. For each working street lamp, add one thin vertical-ish quad on the road surface, stretched from the lamp's foot *toward the camera*:
  - about 1.2 m wide, 14–22 m long
  - additive, opacity .22
  - a gradient texture that fades to 0 at the far end
  - the long axis re-aligned each frame (or every few frames) to the camera-to-lamp direction
  - a slight ripple wobble from rain intensity

  This is the standard technique: a "streak texture that draws… down from the light source to the bottom of the screen", or a quad per lamp computing its glossy reflection ([roadhaul PR #10](https://github.com/keremcan534/roadhaul/pull/10); [gamedev.net thread](https://gamedev.net/forums/topic/280855-reflection-on-wet-street-at-night/)). Hide the streaks when `T` = day or rain is off.

### G3 · Road paint (`groundMaterial`, `:2160–2185`)
- Crosswalks and edge lines: draw them **only into the colour canvas `a`**, not the emissive canvas `b`. Paint should be lit, not glowing.
- Centre dashes: keep emissive, but at 25% of the current brightness.
- Paint colour `#66676c` → `#5b5b5e`.

### G4 · Rain (`updateRain`, `:2473`)
- Opacity `.28` → **`.15`**. Streak length `1.1` → **`0.55`**.
- Velocity smear: clamp the `vx*0.02` / `vz*0.02` terms to at most 0.35 m, so boosting never makes a starfield.
- Remove drops closer than 2.5 m to the camera (respawn them farther), so streaks never cross the car.

### G5 · Trails (`updateTrails`, `:2423`)
- Fade by **time**, not index:
  - store a timestamp per point
  - fade = `max(0, 1 - age/0.9 s)`
  - drop points older than 0.9 s

  Stopped means no trail within a second.
- Only draw while speed > 25 km/h.
- On boost: no width doubling (`w = t.width * (1 + b)` → `t.width * (1 + 0.25*b)`), no colour change to EMBER, brightness `+ b*0.15` max.
- Ship trails: at the ship's own height, max 25 points, colour PALE at 40%. No ground rails.

### G6 · Night building edges
- Add a faint height-based sky fill to facades at night: the top 30% of each tower lifts toward `0x1a2233` by up to 12%. Use the window shader or a vertex-colour gradient on the facade boxes.
- Set the roof material slightly lighter than the sky at the horizon (`0x1b1b1e` → `0x22252b` at night).
- Every tower over 120 m gets one dim red aviation beacon (already in `beacon`); make sure tall slabs have one.
- Check: in screenshot 03, each tower's edge must be visible against the sky.

### G7 · Bloom (`:2491`, `LOOKS.night`)
- Night: threshold `0.3` → **`0.6`**, strength `0.95` → **`0.75`**, radius stays.
- Then retune what must glow, so only lamps, lit windows, signs and tail lights bloom:
  - Hoverboard deck emissive: about −50%.
  - Ship hull emissive: about −40%.
  - Car body: no emissive at all.

### G8 · Night view from the ship
- At altitude above 40 m, reduce fog density with height (e.g. `fogD *= mix(1, 0.45, smoothstep(40, 160, alt))`), so the lamp grid is visible below.
- Keep the light-pool meshes visible at distance (check frustum and fog settings on `glow*` materials; use `fog:false` with distance fade if needed).
- Lower the horizon band and soften it, by about −40% intensity and a wider gradient.
- Check: screenshot 15 should show a sodium grid of streets to the horizon.

### G10 · The saloon at night
- Body colour: warm off-white `#d9d3c6`, roughness .55, a small clearcoat-like spec (raise metalness to .15).
- Add two soft headlight pools on the road ahead: the `glowg` texture tinted `0xfff0d6`, opacity .25, 9×14 m, about 8 m in front of the car, following it.

---

## 5. Bugs (do now)
- **B1 · Hood camera:** clamp the hood camera position with a short raycast or sweep from the car centre forward. If it would be inside geometry, pull it back toward the cabin. Also set `camera.near` to 0.15 in hood mode.
- **B2 · Stuck on a parapet:** reproduce with `tools/shoot.js` (hold W from the start, about 20 s).
  - Check the barriers where raised roads meet ground roads, and the start heading.
  - In chase mode, raise the camera when the car's nose is within 4 m of a barrier taller than 0.8 m, so the parapet doesn't fill the frame.
- **U2 · Dev labels:** in `:2419`, drop the `by` suffix from player-facing text. Keep it in a comment or a debug flag only.

---

## 6. Build order for the implementing session
1. **B1, B2, U2.** Bugs and labels.
2. **G1, G3, G4, G5, G7.** Pure tuning: the biggest visual win for the least risk.
3. **G2.** Softer pools, then wet streaks.
4. **G6, G8, G10.**
5. **After Ali approves W1–W6:**
   - fonts and tokens (§2)
   - start screen W1
   - HUD W2
   - district sign W3
   - caption W4
   - pause W5
   - mobile W6
6. Re-shoot with `tools/shoot.js` and put new and old screenshots side by side in `Screenshots/`.
7. Commit after each numbered step and push (house rule).

## 7. Acceptance checklist (compare against the re-shot screenshots)
- [ ] 01: no HUD visible behind the title; no glow on the title; new copy.
- [ ] 02/03: the light pools have no visible edge; crosswalks don't glow; the windows have no red/blue fringe.
- [ ] 04: boosting shows no starfield and no yellow beams.
- [ ] 06/10: at 0 km/h there are no trail ribbons behind the car.
- [ ] 03: every tower's edge reads against the sky.
- [ ] 07: the map has no big red dot; no duplicate control rows; the settings list works by mouse.
- [ ] 09: the hood camera is never inside a wall.
- [ ] 12–14: the hoverboard and ship aren't the brightest things in the frame.
- [ ] 15: a sodium grid of streets is visible from the ship at night.
- [ ] 16/18: no "(Codex)" or "(AGY)" anywhere.
- [ ] 18: nothing stacks or wraps on a 390 px wide phone.

## 8. Don'ts
- Don't add new glow, neon, cyan or magenta anywhere in the UI.
- Don't remove any readout or control. Move it into the pause screen instead.
- Don't make the city darker overall. Make it *clearer*: fewer, softer, warmer lights.
- Don't add text to the HUD that isn't needed while driving.
