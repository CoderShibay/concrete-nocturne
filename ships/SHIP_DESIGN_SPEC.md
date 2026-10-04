# Spaceship design brief — Concrete Nocturne

You are designing **three spaceships** for *Concrete Nocturne*, a browser game (one HTML file, three.js **r128**).
Your file will be pasted into the game **exactly as you write it**. Nobody will edit it. Follow the contract
to the letter or it will not work.

## The game (read this first)

A night drive through an endless brutalist city that is alive for everyone except you. Towers too tall to see
the top of, sodium-orange street lamps in a blue-black sky, windows going out one by one, a car radio playing
doomer post-punk. It is lonely, quiet and beautiful — never horror, never cheerful.

The player's car is a **white 1970s Soviet saloon** (boxy, off-white enamel, chrome bumpers, round headlamps).
The hoverboard and the existing spaceship share its look: off-white enamel, grey and chrome, a thin red stripe,
warm amber light. The spaceship hovers ~1.35 m above the street, flies up to 420 m between the towers, banks
into turns and can land on rooftops and moving metro trains.

Reference screenshots: `../../Screenshots/` (from this file: `Projects/Concrete Nocturne/Screenshots/`).
The full brief is `../LONELY_CITY_BRIEF.md`.

## What the ships must feel like

- Built by the **same tired state industry** as the white saloon: plain, sturdy, a little old, made to last.
  Retro-futurist (think Soviet space programme, 1970s industrial design, Buran, Vostok, Tupolev, brutalism),
  **not** glossy sci-fi, not neon, not a fighter jet from a video game.
- Quiet and lonely. Each one should look like it carries one person through an empty city at 3 a.m.
- **Your three designs must be dramatically different from each other** — different silhouette, different
  idea of how it flies (e.g. a lifting body, a ring or disc, a slab/monolith, a ducted-fan VTOL, an insect-like
  frame, a capsule on struts). Someone should tell them apart instantly from the outline alone.

## Palette (use only these, plus greys in between)

| Use | Colour |
|---|---|
| Body enamel | `#bdb8ab` (off-white), `#9a958a` (dirty enamel) |
| Structure | `#2c2d31` (graphite), `#55575b` (grey), concrete `#6a6866` |
| Livery stripe / markings | `#8e2a21` (dull red) — thin, sparing |
| Engine / hover light | `#ff9a40` (warm amber) — the only strong glow |
| Cabin glass | dark `#0a0806` with emissive `#4a2a10` (warm dash glow) |
| Headlamp | `#fff1d6` |

**Forbidden:** pink, magenta, cyan, purple, neon green, rainbow, chrome-everywhere, glowing outlines on every edge.

## The contract (exact)

Write **one plain JavaScript file**, no `import`, no `export`, no modules, no external files, no textures loaded
from anywhere. It must define exactly one global array:

```js
window.SHIP_DESIGNS_<AUTHOR> = [ design1, design2, design3 ];   // <AUTHOR> is CODEX or AGY
```

Each design object:

```js
{
  name: 'Short Name',                 // 1–3 words, shown in the HUD
  author: 'codex',                    // or 'agy'
  idea: 'One sentence on how it flies and why it looks like this.',
  build(THREE, kit) {                 // called once when the game starts
    // build everything inside one THREE.Group and return the parts below
    return {
      group,          // THREE.Group — the whole ship (REQUIRED)
      engines,        // array of THREE.Mesh whose material is a MeshBasicMaterial; the game recolours
                      // them every frame (warm amber idle, whiter on boost). At least 1. (REQUIRED)
      engineGlows,    // array of THREE.Sprite made with kit.glowSprite(); the game sets their opacity
                      // and scale every frame. Can be [] but should usually have one per engine.
      underRing,      // a THREE.Mesh with MeshBasicMaterial that pulses (e.g. a hover ring), or null
      groundGlow,     // a THREE.Mesh made with kit.groundGlow(w, d) — the light the ship throws on the
                      // street; the game moves it to the ground. Or null.
      underLight,     // a THREE.PointLight under the ship (warm amber), or null
      headlamp,       // a THREE.SpotLight pointing forward-down with its .target added to the group, or null
      trailPoints,    // array of 2 THREE.Vector3 in ship-local coordinates where the light trails start
                      // (usually the wingtips or the outer engines) (REQUIRED, exactly 2)
    };
  }
}
```

`kit` (provided by the game — use it, don't re-create these):

| `kit.` | What it is |
|---|---|
| `mats.enamel` `mats.dirty` `mats.graphite` `mats.grey` `mats.concrete` | `MeshStandardMaterial`s in the palette above |
| `mats.glass` | cabin glass with the warm dash glow |
| `mats.red` | `MeshBasicMaterial` dull red for livery |
| `mats.headlamp` | `MeshBasicMaterial` for headlamp lenses |
| `amber()` | returns a **new** `MeshBasicMaterial` in warm amber — use one per engine mesh |
| `glowSprite()` | returns a new additive glow `THREE.Sprite` (warm amber) |
| `groundGlow(w, d)` | returns a flat additive glow `THREE.Mesh` of size w × d for the ground |

You may create other `MeshStandardMaterial` / `MeshBasicMaterial` in the palette if you need them.

### Coordinate rules

- Units are metres. **Nose points to −Z.** Up is +Y. Origin = the ship's hover centre.
- Overall length 3–7 m, width ≤ 6 m, height ≤ 2.5 m. The underside should sit about 0.5–1.0 m below origin.
- Build from three.js r128 primitives only: `BoxGeometry`, `CylinderGeometry`, `SphereGeometry`, `ConeGeometry`,
  `TorusGeometry`, `CircleGeometry`, `PlaneGeometry`, `LatheGeometry`, `ExtrudeGeometry` (with `THREE.Shape`).
  Do not use anything newer than r128 (no `CapsuleGeometry`).
- Keep it light: **at most 70 meshes** per ship, segment counts ≤ 32.
- Do not add the group to a scene, do not create lights other than `underLight` and `headlamp`, do not animate
  anything yourself (no timers, no requestAnimationFrame). The game animates: banking, bobbing, engine colour.
- Must not throw. Must not touch `document`, `window` (except defining your one global array) or the DOM.

## Deliverable

1. Write the file to the exact path you were given.
2. Check it parses: `node --check <your file>`.
3. Reply with the three names and one line each on what makes them different.
