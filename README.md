# Concrete Nocturne

A night drive through an endless brutalist city that is alive for everyone except you.
Towers too tall to see the top of, sodium lamps in a blue-black sky, windows going out one by one,
and a car radio playing cold post-punk to one person. It is not horror. Now and then a lone car
runs ahead of you, and when you catch it nobody is inside; the city is simply not for you.

- **Play online:** https://claude.ai/artifact/S4u6tWkfTZSLWjMYihDWFX (private artifact)
- **Play locally:** run `./build-play.sh`, then open `play.html` in a browser
- **Design brief:** `LONELY_CITY_BRIEF.md` (the research it draws on lives in `Research/`, which is not in git)

## Controls

| Key | Action |
|---|---|
| W / ↑ | Drive |
| S / ↓ | Brake, reverse |
| A D / ← → | Steer |
| Space | Booster |
| Q · E | Climb · descend (spaceship only; up to about 420 m, it holds height when you let go) |
| Shift | Drift |
| V | Switch vehicle: car → hoverboard → spaceship |
| B | Next spaceship design (seven: one original, three by Codex, three by AGY) |
| C | Camera: chase → cinematic → hood |
| M · R · H | Music · rain · hide HUD |
| Esc / P | Pause, with a map of where you've been tonight |
| T | Night or day: the same city under a pale, hazy afternoon sky, lamps and windows off |

A small map in the top-right corner turns with the car (up is the way you're facing) and shows the
blocks tinted by zone and your route. Moments never appear on either map.

On a phone, touch buttons replace the keys.

## How the city works

The city is endless and built block by block around the car (100 m blocks with 30 m, six-lane roads;
12×12 blocks to a district, so each zone lasts about 30–50 seconds of driving). Buildings stand 7 m back
inside their lots, so there is a drivable apron of paving around them, and empty lots are open ground.

**Structures:** a low metro line runs over the road of every seventh row and a high line over every ninth
column, with long lit trains. You can land the spaceship on a moving train and ride it.

- **Expressways.** Most districts lift one road onto an elevated expressway: 130 m ramps up to a deck 16 m
  high and 18 m wide, on single T-piers, running 0.6–1 km over several junctions under sodium lamps. The
  outer lanes stay at street level underneath. Green signs hang on the deck's face over each junction.
- **Sunken underpasses.** Many districts drop one road into a tunnel: 80 m open ramps down to 7.5 m, then a
  lit, covered tunnel under two or three junctions. The outer lanes and the road on top stay at street level.
- **Multi-storey car parks** fill a whole lot: four open decks on an 18 m column grid, straight two-way ramps
  that wind up the two sides, parked cars on every level, lamps on the open roof.
- **Underground car parks** fill the ground under a whole lot: a 10 m ramp beside the road drops into one
  wide, low room with 20 m between columns, strip lights and a few parked cars.
- Some towers stand on a few great columns (about 20 m apart, 9 m headroom) that you can drive straight
  through; some buildings bridge a road on four piers over a lit hall 14 m high; lit footbridges cross others.
- There is exactly one gas station in the whole city, on the first road you drive. The first road also
  takes you up the first expressway, past a car park; the first tunnel crosses under it.

The maps show expressways as pale lines and tunnels as dashed ones.

**The chase:** every couple of minutes a lone car appears ahead and drives off through the city. It waits if
you fall back and runs if you close in; it shows as a red dot on the map. Stay right behind it for a moment
and it pulls over, its lights go out, and nobody is inside.
A small **director** decides what each new district becomes and when something happens.

**Zones.** Each district gets one zone the first time it comes into view. The district you are driving
toward takes the next zone in this order; districts beside you take any zone unlike their neighbours.
Zones are remembered, so driving back shows the same blocks.

| Zone | What it is |
|---|---|
| Slab Corridor | Identical twin slabs block after block, dim empty sky bridges between them |
| Boulevard | One huge tower on every other block; open forecourts with spiked ledges, armrest benches and ads selling to nobody |
| Plaza | Empty, fenced ground; one monument lost in the haze |
| Interchange | Elevated roads overhead that come out of one portal and go into another; green signs to places you never reach; parked cars with nobody in them |
| Residential Wall | Housing slabs, most windows dark; sometimes a locked gate in front of a lit courtyard |
| Corner | The ordinary city at human scale; the only street-level neon, often half dead or blinking OPEN |
| Fog Edge | Low and sparse; the fog closes in around you and lifts when you leave |

**Moments.** Every 30–50 seconds, one small sign of other people, never for you, placed in the block
about to appear ahead. It only counts once you have passed it; turn away and it is placed ahead again.

| Zone | Moment |
|---|---|
| Slab Corridor | One sky bridge fully lit, nobody in it |
| Boulevard | A single window high up that goes out while you look at it |
| Plaza | A lone lamp, a bench, and a statue's long shadow across the square |
| Interchange | A lit, empty train crossing a high line ahead, then its horn |
| Residential Wall | A figure crossing a lit window; below, a lit bus stop with nobody waiting |
| Corner | A green-lit diner with one figure's back to you; a payphone ringing as you pass |
| Fog Edge | The lamps go out one by one just after you pass under them |
| (anywhere) | Another car's tail lights far ahead, pacing you, then gone |

**The night runs down.** The clock runs from 23:12 at about a game minute per second of driving until
4 a.m., then slows so dawn never comes. Over those five minutes the lit windows fall from 100% to 15%
(lower floors first) and the radio thins out with them.

## Sound

- **Radio Panelka (88.4 FM):** slowed doomer post-punk at 84 BPM in D minor (Dm, Gm, B♭, Am): a tired
  half-time drum machine, heavy bass, a cold pad, a slow falling synth riff that comes and goes, and a
  chorused guitar, drowned in reverb with a warbling tape. The riff, guitar and hats drop out after
  about 1 a.m., drums by 3, and by 4 there is mostly just the rain.
- **Inside the car:** rain on the roof, spray off wet tyres, the wipers.
- **Far away:** a siren, a train horn, a dog, wind between the towers, thunder. One at a time.
- If the browser pauses the sound (Safari does when you switch tabs), any click or key wakes it.
  The Music button says "Sound paused · click" or "Sound failed · see console" when there is none.

## The car

A white Soviet-era saloon: boxy, chrome bumpers, four round headlamps. Its cabin glows warm, the one
refuge in the city. The hoverboard and the original spaceship (V) share its look: off-white enamel, grey and
chrome, a red stripe, and warm amber glow instead of neon. B cycles through six more ship designs by
Codex and AGY, each built from the same palette.

## Files

| File | What it is |
|---|---|
| `concrete-nocturne.html` | The game source. This is what gets published to the artifact. |
| `build-play.sh` | Builds `play.html`, a standalone copy you can double-click. |
| `play.html` | Generated; gitignored. Edit the source and rebuild. |
| `play-test.html` | Generated test copy that exposes internals as `window.__cn`; gitignored. |
| `LONELY_CITY_BRIEF.md` | The design brief the city is built from. |
| `DISTRICT_CONCEPTS.md` | Twelve further district ideas drawn from the research (not built yet). |
| `ships/SHIP_DESIGN_SPEC.md` | The brief and code contract for the spaceship designs. |
| `ships/codex-ships.js`, `ships/agy-ships.js` | Three ships each by Codex and AGY, embedded in the game unchanged. |
| `autotest.html` | Generated headless-test copy; gitignored. |

## Tech

Single HTML file. three.js r128 from a CDN, plus its bloom post-processing scripts. Everything else
(city, textures, models, music, rain, thunder) is generated in code at load time. Needs an internet
connection the first time to fetch three.js and the fonts.

To test locally: `python3 -m http.server 8931` in this folder, then open `http://127.0.0.1:8931/play.html`.
