# Fix list — after the batch 2 review

Written by the design agent for the build session, against commit `419a2f5` (2026-10-12).
Approved by Ali on 2026-10-12, including the bloom change.

**How to work:** make a checkpoint commit first. Then do the sections in order: one commit per numbered fix, pushed. Screenshot before and after each visual fix into `../Screenshots/Fixes batch 2/`.

---

## A. Sound — the district sounds are inaudible

Ali reports he has almost never noticed any district sound. Measured in the running game with `tools/measure-audio.js` (dB, RMS, at each layer's own volume control):

| Layer | Level now | Compared with the music |
|---|---|---|
| Music | −24 | — |
| Rain | −31 | 7 dB under |
| Port drone | −34 | 10 dB under, **and almost all of it is at 55 and 82 Hz, which laptop speakers can't play** |
| Density Wall television murmur | **−58** | 34 dB under: inaudible |
| Density Wall air-conditioner hum | −43 | 19 dB under, at 120 Hz |
| Coming Soon wind | **−59** | 35 dB under: inaudible |

**Cause:** the gain numbers in my specs (0.012–0.02) were far too low. Narrow-band noise at those gains is about 25 dB quieter than I assumed. This is a spec error, not a build error.

**Rule for every district sound from now on:** set levels by measurement, not by gain number.
- A district's ambience should measure **−32 to −34 dB**: about as loud as the rain, 8–10 dB under the music.
- Every layer needs energy between 150 Hz and 3 kHz, so it survives small speakers.

Run `node tools/measure-audio.js <zone>` after each change and put the before and after numbers in the commit message.

### A1. Density Wall
- **Television murmur:** raise it to **−33 dB** (about 18 times the current gain). In a courtyard: −30 dB.
- **Air-conditioner hum:** add partials at 240 Hz (half level) and 360 Hz (quarter level) to the 120 Hz tone. Target **−38 dB** total.
- **Music:** × 0.75 while in the district.

### A2. Coming Soon
- **Wind:** raise it to **−34 dB** at the top of its swell (about 20 times the current gain).
- **The song from the lit room:**
  - Raise the note's peak gain from `0.02 × vol` to **`0.10 × vol`**.
  - Use a triangle wave, not a sine, so it has some body.
  - Duck the music to × 0.6 while the car is within 60 m of the room.
- **Music:** × 0.8 while in the district.

### A3. The Port
- **Drone:** add partials at 110 Hz and 165 Hz at the same level as the 55 and 82 Hz tones. Target **−31 dB**.
- **Whine:** three times its current level.
- **Clanks:** measure one. Its peak should reach about **−20 dB**. Raise it if it doesn't.

### A4. Office Park
- **Hum:** add a 400 Hz partial at half level. Target **−36 dB** beside a lit building, fading to nothing at 30 m.
- The tool can't measure this one from the start position. Check it by driving to a lit building with the sensor moment's test setup.

### A5. Check the batch 1 sounds the same way
- **Field of Blocks:** confirm the music drops by at least 6 dB between the lot edge and the deepest point. If the tool can't reach it, log `radio.duck.gain.value` inside a deep lot.
- **Never Lived In:** the "too clean" radio is a filter change only and may be too subtle to notice. Leave it, but report whether the measured music level or tone changes at all.

### A6. Add the new layers to the tool
If a fix adds a new volume control, add it to the `nodes` list in `tools/measure-audio.js`.

**Acceptance for section A:** the tool's table shows each district's ambience between −32 and −34 dB (hum −36 to −38). Ali will listen and give the final yes.

---

## B. Bloom — raise the threshold once, then undo the workarounds

Everything bright has been flaring because the night bloom threshold is 0.3. Batches 1 and 2 each dimmed surfaces one at a time to work around it.

**Tested on the road in Corridor, The Port and Density Wall:**

| Setting | Result |
|---|---|
| threshold 0.3, strength 0.95 (now) | lamps, windows, paint and the car all flare |
| threshold 0.6, strength 0.75 | **rejected:** lamps and windows lose their glow; the city looks flat |
| **threshold 0.45, strength 0.9** | **use this:** lamps and windows keep their glow; light pools soften |

Not tested: inside lots, the moments, or the headlight on pale walls. Check those as part of B2 and B3.

### B1. Change the setting
`LOOKS.night`: `bloomT: 0.3 → 0.45`, `bloomS: 0.95 → 0.9`. Change the same two numbers in the `UnrealBloomPass` constructor. Day is unchanged.

### B2. Undo the brightness workarounds, one at a time
For each surface: raise it toward the target, screenshot, and stop at the last value that doesn't flare.

| Surface | Now | Try |
|---|---|---|
| Sales pavilion (`PAVILION`) | 40% | 60% |
| Show flat wall (`room`) | 50% | 65% |
| Density Wall windows (`emissiveIntensity`) | 0.7 | 0.85 |
| Coming Soon billboards and crown | 45% | 60% |
| Hoarding (`hoard`) | `#23262a` | `#34373c` |

Leave the containers' own light (`BOX_LIT`, 0.28) as it is.

### B3. Headlight hot spots
After B1, check the headlight on pale, close surfaces: the containers at the end of a Port aisle, and the old terrace walls.
- If they still flare, raise the spotlight's `decay` from 1.1 to 1.5.
- Then check that the walls inside a deep Field of Blocks lot are still visibly lit. If they aren't, go back to 1.3.

**Acceptance for section B:**
- [ ] Street lamps, lit windows, tail lights and signs still have a soft glow.
- [ ] The car body, road paint, containers and walls under the headlight don't glow.
- [ ] The show flat, the lit room in Coming Soon and the office floors still read clearly.

---

## C. Density Wall

### C1. Move the gate off the lamp post
A street lamp stands at 66 m on the kerb, in the mouth of the gate (60.5–69.5 m). Lamp posts aren't solid, so the car drives through it. My spec put the gate there.
- **Move the gate to 48.5–57.5 m.** The street lamps are at 40 m and 66 m, so it is clear.
- Move the gate's lintel, passage walls, shutter gap and `inGate` test with it.
- In the courtyard:
  - Move the dead lamp from (52, 52) to (66, 52), so it isn't in the gate's exit.
  - Leave the working lamp at (78, 52), and the parked cars where they are.
- Check: no lamp post within 4 m of the gate opening, and the car drives in and out in a straight line.

### C2. No horizon
A strip of horizon glow still shows at the end of the street.
- Add a `density` entry to the per-zone sky handling beside `fogMix`.
- While in the district, lerp the sky's `hor` colour toward its `mid` colour by `0.9 × zoneMix.density`.
- The stars and moon stay.

---

## D. The Port

### D1. Make the ship and basin readable at night
The hull is near-black on near-black water.
- **Hull:** colour `#1c2733` with 0.2 of its own colour as light at night (the same trick as the containers). Add a 0.8 m band of `#5a2620` at the waterline.
- **Deck work lights:** three 6 m posts on the deck at x 58, 70 and 82, each with a `fluo` head and a `glowf` pool 12 m across on the deck.
- **Water:** colour `#0a1118`.
- **Reflections:** under each of the eight deck lights and each lit stern window, add a thin `glow` quad on the water, 0.8 × 9 m at opacity 0.25, stretching away from the ship's side.
- Check from the quay at night: you can see the ship's whole outline and where the water starts.

### D2. Make the lift moment hard to miss
The container passes at 17 m, above the camera once you're close.
- **Start earlier:** trigger at 180 m, not 120 m.
- **Hold longer:** the container stays over the road until the car has passed under it or 6 seconds have gone by, whichever comes first (now a fixed 2 seconds).
- **Light it from the trolley:** a `fluo` lamp on the underside of the trolley and a `glowf` pool 10 m across on the road, moving with the container. A light crossing the road ahead is visible from the chase camera even when the container isn't.
- **Shadow:** a dark quad 12.2 × 2.6 m at opacity 0.45 on the road inside that pool, under the container.
- Check: take one screenshot from 60 m back with the container over the road.

---

## E. Coming Soon

### E1. Wallpapers by day
Brighten them by 1.6 times in daylight, not 2.3. At 2.3 the rooms turn pastel and look like a doll's house.

---

## Not in this list

- **The finished tower can't be seen from most cleared streets.** Blocks are only built within three blocks of the car. Showing tall landmarks from far away is a new feature. I'll spec it separately if Ali wants it.
- **The earlier UI and graphics review** (`DESIGN_REVIEW_2026-10-08.md`) is still waiting for Ali's approval of its wireframes. The bloom item from that review (G7) is replaced by section B here.

## When done
Report, for each fix: what changed, the before and after measurement or screenshot, and anything you couldn't do. Update the README if a control or behaviour changed.
