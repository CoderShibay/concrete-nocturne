# Concrete Nocturne

A night drive through an endless brutalist city that is alive for everyone except you.
Towers too tall to see the top of, sodium lamps in a blue-black sky, windows going out one by one,
and a car radio playing cold post-punk to one person. It is not horror and nothing chases you;
the city is simply not for you.

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
| Shift | Drift |
| V | Switch vehicle: car → hoverboard → spaceship |
| C | Camera: chase → cinematic → hood |
| M · R · H | Music · rain · hide HUD |

On a phone, touch buttons replace the keys.

## How the city works

The city is endless and built block by block around the car (90 m blocks, 3×3 blocks to a district).
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

- **Radio Panelka (88.4 FM):** slowed cold-wave post-punk in E minor: drum machine, driving bass,
  a cold pad and a chorused guitar, drowned in reverb. Guitar and hats drop out after about 1 a.m.,
  drums by 3, and by 4 there is mostly just the rain.
- **Inside the car:** rain on the roof, spray off wet tyres, the wipers.
- **Far away:** a siren, a train horn, a dog, wind between the towers, thunder. One at a time.
- If the browser pauses the sound (Safari does when you switch tabs), any click or key wakes it.
  The Music button says "Sound paused · click" or "Sound failed · see console" when there is none.

## The car

A white Soviet-era saloon: boxy, chrome bumpers, four round headlamps. Its cabin glows warm, the one
refuge in the city. Hoverboard and compact spaceship are there too (V).

## Files

| File | What it is |
|---|---|
| `concrete-nocturne.html` | The game source. This is what gets published to the artifact. |
| `build-play.sh` | Builds `play.html`, a standalone copy you can double-click. |
| `play.html` | Generated; gitignored. Edit the source and rebuild. |
| `play-test.html` | Generated test copy that exposes internals as `window.__cn`; gitignored. |
| `LONELY_CITY_BRIEF.md` | The design brief the city is built from. |

## Tech

Single HTML file. three.js r128 from a CDN, plus its bloom post-processing scripts. Everything else
(city, textures, models, music, rain, thunder) is generated in code at load time. Needs an internet
connection the first time to fetch three.js and the fonts.

To test locally: `python3 -m http.server 8931` in this folder, then open `http://127.0.0.1:8931/play.html`.
