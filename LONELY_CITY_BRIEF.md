# Lonely City — Design Brief for Concrete Nocturne

Hand this file to a session along with `concrete-nocturne.html`.
Research lives in `/Users/alisyed/Documents/YouTube/Research/Lonely_City/`.

---

## The feeling we are building

You are driving alone at 3 a.m. through a city that is enormous, beautiful, and completely indifferent to you.
You have nobody. Everyone in this city is behind glass, far above you, or already gone.
And the city is so beautiful in its loneliness that you fall in love with it while you bleed out.

It is **not** horror, and it is **not** post-apocalypse. Nothing is chasing you. The city is simply alive for
everyone except you.

## The one idea everything must serve

> **Loneliness is not emptiness. It is presence you cannot reach.**

The research says this again and again:

- Laing, *The Lonely City*: a hundred thousand lit windows, "You can see them, but you can't reach them."
- Simmel, *The Stranger*: "he, who is close by, is far."
- Maya Lin: a mirrored world, "one we are a part of and one we cannot enter."
- Hido: "a singular lit window, a door left ajar or an empty car become signifiers of stories left untold."
- Kenopsia: "you recognize the place, but can't find the moment."

An empty city is only sad. A city full of signs of other people (lit windows, a running vending machine,
a bus stop, a far-off train horn) that you can never reach is **heartbreaking**. Every design choice should
show that other people exist and that you can't get to them.

## Why you fall in love with it (the other half)

A city that is only bleak is boring, and boredom isn't loneliness. Ellard found blank streets feel
"bland, monotonous and passionless." What we want is the **sublime**:

- Kant: vast, fearful things are "the more attractive, the more fearful it is, provided only that we are in security."
  **The car is that security.** It is the one warm place, the refuge (Appleton), moving through pure exposure.
- Tuan: "in the solitude of a sheltered place, the vastness of space beyond acquires a haunting presence."
- Ando: "Light can only shine bright by being set against darkness."
- Burke: vastness and "succession and uniformity" (the artificial infinite) give "delightful horror."

So the formula is: **vast, dark, and uniform, broken by rare moments of warm light that are never for you.**

---

## Design principles (each traced to the research)

| # | Principle | Research source | What it means in the game |
|---|---|---|---|
| 1 | **Inhuman scale** | Brutalism: "placed other people out of sight, out of hearing, and out of reach"; Kant, Burke | Towers much taller than now; fewer, bigger masses; the car tiny at their feet. Wide boulevards (Sitte's Ringstrasse, Naypyidaw's "twenty flawless lanes … eerily silent"). |
| 2 | **Prospect without refuge** | Appleton; Tuan, "to be open and free is to be exposed" | Huge open plazas and wide roads with no cover. The only refuge is the car's cabin glow. |
| 3 | **Lit windows you can't reach** | Laing; Hido; Hopper; Rear Window | Mostly dark facades with a few warm lit windows, high up. Now and then a silhouette crosses one, and never looks out. |
| 4 | **Signs of people, no people** | Fisher's eerie ("a failure of absence or … of presence"); kenopsia | Empty bus stops lit up, a vending machine glowing to nobody (already in the game, so keep it), parked cars with no drivers, a phone booth light, laundry on one balcony, a TV flicker. |
| 5 | **Blank, repeated, placeless** | Relph: "permeated with sameness"; Sussman: "people ignore blank facades"; Koolhaas Junkspace | Long runs of identical slabs. Blank ground floors. Fewer unique features, so the rare ones hurt more. |
| 6 | **Sodium and pallid green** | "orange streetlights evoke feelings of loneliness, suspense, and the unknown"; Hopper's green (Laing) | Move away from the purple synthwave palette toward sodium orange pools in a blue-black void, with one Nighthawks-green interior now and then. |
| 7 | **Fog, rain, muffled sound** | Allan: "damp mist makes alien a familiar place"; Eisenman: "You don't hear anything but the sound of your footsteps" | Heavier fog in the distance so the city dissolves. Sound is muffled and hi-fi (Schafer): every small sound is distinct because there is nothing else. |
| 8 | **The city is selling, not welcoming** | Dunn: "if you are not consuming you are not welcome"; Mirror's Edge's sterile city | Keep a few neon signs, but they advertise to no one. Some are half dead or flickering, or cycle a word on an empty street. |
| 9 | **The road as non-place** | Augé: "The space of non-place creates neither singular identity nor relations; only solitude, and similitude"; *The View from the Road* | Overpasses, underpasses and interchanges you pass under but never reach. Signs to places you'll never arrive at. |
| 10 | **Hostile design** | Hostile architecture; Planetizen "Lonely by Design" | Benches with armrests or spikes, fenced plazas, a locked gate onto a lit courtyard. |
| 11 | **Connection that is empty** | Montgomery's towers "built for loneliness"; the game's own sky bridges | Keep the sky bridges between slabs, lit and empty. A link that nobody uses. |
| 12 | **Time runs out** | Kenopsia; Beaumont's night city; Gwiazdzinski's rhythms | The night moves forward (the HUD clock already runs from 23:12). As it gets later, windows switch off one by one and the city gets darker and quieter. This is the "bleeding out." |

## The rhythm (this matters most)

Gehl's lively street has "an interesting new site about once every five seconds." Invert it:
**long stretches of vast, dark sameness (20–40 seconds), then one small moment of human warmth that passes
and is gone.** Hido: "How little would it need?" Rare moments are what hurt. Don't scatter details evenly.

Suggested "moments" (each rare, one at a time):
- One lit kitchen window high in a dark slab, with a figure crossing it
- An empty, lit bus stop in the rain
- A diner at a corner, green-lit, seen through glass, one person with their back to you (Nighthawks)
- A distant train horn (already in the game) and a lit train crossing a far overpass
- A payphone ringing as you pass
- A second car's tail lights far ahead that turn off and are gone
- A window where the light switches off the moment you look at it

## How the city is built: an endless city with a director (decided)

The city stays endless and free to drive in any direction. It is **not** a fixed map. Right now every 90 m block
is built by `genCell(i, j)` from a random seed, and blocks stream in within `VIEW` (3 cells) of the car in
`updateCells` / `pumpCells`. We keep that system and add a **director**: a small piece of state that decides what
each *new* block becomes, based on how the drive has gone so far, so the rhythm happens wherever you turn.

**Zones.** Each district (the existing 3×3-cell groups used for `DISTRICTS` names) gets one of the seven zone
types from the wireframe, and `genCell` builds its blocks differently for each:

| Zone | What `genCell` does in it |
|---|---|
| Slab Corridor | Twin slabs only, identical heights and window patterns, blank plinths, lit sky bridges with nobody in them |
| Boulevard | Buildings pushed to the back of the lot and made much taller, so the road reads as far wider; no neon at street level |
| Plaza | Some blocks left fully empty at ground level (no building), one monument block, a single lamp |
| Interchange | Elevated road decks crossing overhead that you can never get onto; fences, spiked ledges |
| Residential Wall | Dense slabs with many windows, very few lit; candidate cells for the silhouette and the bus stop |
| Corner | Normal blocks; candidate corner for the diner and payphone |
| Fog Edge | Sparse, low, fog density raised locally; lamps switch off after the car passes |

The director chooses the next district's zone so that zones rarely repeat back to back and the mix follows the
order in the wireframe roughly (sameness, then scale, then exposure, then people you can't reach, then fading out).

**Director state** (a few variables, not a system):
- `distanceDriven` and the HUD clock (`elapsed`, already running from 23:12)
- `sinceLastMoment`: seconds since the last moment was seen
- `litFraction`: share of windows lit, falling over the drive (100% down to about 15%), used by `windowMaterial` / `genCell`
- `musicDensity`: fed to the radio so it thins out with `litFraction`

**Moments.** When `sinceLastMoment` passes 30–50 s (randomised), the next cell generated *ahead of the car*
(in the direction of travel, at the edge of `VIEW`) gets one moment that fits its zone. A moment counts as
used only once the car has actually passed it; if the player turns away, the director places it again ahead.
Never two moments in view at once.

**Rules that keep it consistent:**
- Cache each cell's zone and moment in a `Map` the first time it's generated, so driving back to a block shows
  the same thing (cells are disposed and rebuilt when you leave and return).
- The road grid (`C`, `R`, `SW`) and collision stay as they are. Zones change what stands on each lot, not the grid.
- The wireframe's route map shows the *order and mix* of zones, not fixed places.

## What to remove or tone down


**Keep all the driving controls and readouts.** Speed, gear, rev bar, boost bar, the drift label, and the boost and
drift controls all stay. Driving the car is the game: without that feedback you don't feel like you're driving,
and without interaction there is no game. Loneliness comes from the city, not from taking the car away. The HUD
may be restyled to match the new look (colour, glow) in the visual pass, but nothing is removed or hidden.

Tone down:
- Cheerful or busy district names ("Night Market"). Rename them to places that sound like memories or non-places.
- Even neon everywhere. Neon should be the exception, not the texture.
- Anything that fills silence with busyness, like a music loop that is too upbeat.

## Sound

- Close sounds: tyres on wet road, wipers, rain on the roof. Intimate, inside the refuge.
- Far sounds: one distant siren, a train, a dog, wind between towers (tower downdraft research). Sparse and clear.
- Music: sparse, slow, minor. It should feel like the car radio playing to one person. It thins out as the night goes on.

## Guard rails

- It must still be **beautiful**. If a screenshot looks like a grey, depressing screenshot, it failed. If it looks
  like a painting you'd want to be inside and can't, it worked.
- Don't solve it with just "darker plus emptier." Principle 3 (presence you can't reach) matters more than every other row.
- Don't add horror, monsters, jump scares or ruins. This city is fully working. It just isn't for you.
- Performance: stay within the current cell or streaming system and the single-file constraint.

## How to work (for the session)

1. Read the research files named in the table above (at least `LONELINESS_BY_DESIGN_vs_EVOKED.md`,
   `SPACE_ITSELF_AND_LONELINESS.md`, and Part B of `agents/CLAUDE_intentional_and_dimensions.md`).
2. Read `concrete-nocturne.html`: `genCell` (buildings, lamps, signs, vacant lots), `FOG` and the sky, the `radio`
   audio class, `DISTRICTS`, and `updateHud`.
3. **Wireframe first:** the layout is drafted at https://claude.ai/artifact/Ns3VVKdS3kLnduXNo2FqLf
   (route map, rhythm timeline, street section, driver's view). Build from the approved version of it.
   Board 1 is a concept of zone order, not a literal map; see "How the city is built" above.
4. Then implement in small steps, one principle at a time, and republish the artifact after each so the feel can be judged.
5. For each change, write one line on which principle it serves.

## How we'll know it worked

Drive for five minutes without music, then with music. Afterwards you should want to keep driving, and not want to arrive anywhere.
