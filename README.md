# Concrete Nocturne

A calm night drive through an endless brutalist city: neon, rain, thunder, a generated lo-fi radio,
and three vehicles (sci-fi car, hoverboard, compact spaceship).

- **Play online:** https://claude.ai/artifact/S4u6tWkfTZSLWjMYihDWFX (private artifact)
- **Play locally:** run `./build-play.sh`, then open `play.html` in a browser

## Files

| File | What it is |
|---|---|
| `concrete-nocturne.html` | The game source. This is what gets published to the artifact. |
| `build-play.sh` | Builds `play.html`, a standalone copy you can double-click. |
| `play.html` | Generated. Don't edit it; edit the source and rebuild. |

## Controls

W/↑ drive · S/↓ brake/reverse · A D/← → steer · Space boost · Shift drift ·
V switch vehicle · C camera · M music · R rain · H hide HUD

## Tech

Single HTML file, three.js r128 from a CDN (plus its bloom post-processing scripts).
Everything else (city, textures, models, music, rain, thunder) is generated in code at load time.
Needs an internet connection the first time to fetch three.js and the fonts.
