# New District Concepts — Concrete Nocturne

Drawn from `Research/Lonely_City/`. Each concept follows the brief's rules:
- **"Loneliness is not emptiness. It is presence you cannot reach."**
- The city is endless.
- The road grid (`C`, `R`, `SW`) is unchanged; a district only changes what stands on the lots.
- Every driving control and HUD readout stays.
- Beautiful, not horror.
- One moment per zone.

The seven existing zones are corridor, boulevard, plaza, interchange, residential, corner and fog. The concepts below cover research the game doesn't use yet.

Each concept lists:
- **Names:** a pool of four, like `ZONE_NAMES`
- **Idea:** with its research source and file
- **Builds:** what `genCell` places on the lots
- **Moment:** the zone's one moment
- **Lamps:** the `lampOn` share
- **Sound:** what the audio does here
- **Effort:** how much new code it needs

---

## 1. Mirror Quarter — the business district after hours
- **Names:** Glass Row · After Five · The Reflecting Blocks · Lobby Street
- **Idea:** glass towers that show you only yourself, and a district built for people who left at 5 p.m.
  - Maya Lin: "two worlds, one we are a part of and one we cannot enter" (`agents/CLAUDE_intentional_and_dimensions.md`).
  - Lavdas, Salingaros & Sussman 2021: glass curtain-wall floors "were ignored except where sky reflections supplied contrast" (`agents/CODEX_methods_senses_measures.md`).
  - Downtown smartphone data: "the median downtown has seen about 56% of its activity come back."
  - Kayden: 41% of New York's privately owned public spaces "served no public purpose."
- **Builds:**
  - Tall glass towers (a high-metalness, low-roughness material with an env map) and almost no lit windows. Most floors are dark, with only a few lit by cleaners' timers.
  - Each tower has a double-height lobby at ground level, fully lit, with a reception desk and one security guard silhouette.
  - A small "public plaza" with a rules sign (NO LOITERING / NO SKATING / CLOSES AT 10 PM), planters, and a revolving door that never turns.
- **Moment:** in one lobby, the guard faces a bank of CCTV monitors. As you pass, one monitor shows a small white car: yours. You are watched, not seen. (Klauser 2007: surveillance cameras "felt unreal during everyday activity".)
- **Lamps:** 0.9. The street is bright but empty; the glass glows with nothing in it.
- **Sound:** hard, bright echo between the glass, and the hum of ventilation.
- **Effort:** Medium. Reflections can come from a cheap cube env map, not a real-time mirror. The monitor showing your car can be a tiny render target or a static texture of the saloon.

## 2. The Port — automated, with nobody visible
- **Names:** Terminal Four · Stack Yard · The Gantries · Berth 9
- **Idea:** Mark Fisher's Felixstowe. The port is "noisy but feels eerily silent because people remain hidden inside cabs, cranes, and offices… Automated systems… dominate perception." Fisher's eerie asks "what is acting, what has disappeared, and why" (`agents/CODEX_theory_A.md`).
- **Builds:**
  - Container stacks, 4–6 high, as canyon walls along the lots, in rusted reds, blues and greens to break the grey palette.
  - Two or three gantry cranes on rails, a few straddle carriers, and high sodium masts at 30 m.
  - On the edge blocks, a black waterline with one ship hull lit along its deck.
- **Moment:** a crane runs a full cycle overhead. It lifts a container, carries it across the road above you, and sets it down. Its cab is lit, but you never see anyone in it. A ship's horn sounds far off.
- **Lamps:** 0.8, from tall masts, so the light pools are wide.
- **Sound:** the low hum of machinery, distant clanks and ship horns, with very little radio.
- **Effort:** Medium. Containers are boxes. The crane needs a tick function like the train's.

## 3. Field of Blocks — getting lost between slabs
- **Names:** The Field · Grey Rows · Between the Blocks · Where Heads Disappear
- **Idea:** the technique of Eisenman's Berlin memorial, not the memorial itself. Keep the name neutral; this is a spatial effect.
  - "these heads disappear -- like going under water."
  - "You don't hear anything but the sound of your footsteps."
  - "here is a place without information."
  - Libeskind's Garden of Exile: "The ground is tilted at odd angles, creating a sense of disorientation."
- **Builds:**
  - Every lot is a dense grid of plain concrete blocks with narrow drivable lanes between them, about 4 m wide. They are low at the road and rise to 5–8 m in the middle of the lot, so the city vanishes as you drive in.
  - The lot surface dips gently toward the centre (a small height offset).
  - No windows, signs or lamps inside the field. Only your headlights, and sodium light at the road edge.
- **Moment:** deep in the field, the headlights of another car cross a gap between blocks ahead, left to right, and are gone. When you reach that lane, it's empty.
- **Lamps:** 0.5 on the roads, none inside.
- **Sound:** inside the field, the radio is low-passed almost to nothing and the engine is muffled. Sound comes back as you leave.
- **Effort:** Easy for the geometry, which is all boxes. Each block needs flight collision added to `solids`. The ground dip is optional.

## 4. Never Lived In — the finished, unopened new town
- **Names:** Phase Two · Show Flat Row · New Horizon Estate · Keys Not Yet Issued
- **Idea:**
  - Ordos Kangbashi: "elaborate public buildings built for nobody… roads to nowhere"; "it wasn't because it had been abandoned. It was because it had never really been lived in" (`RESEARCH.md`).
  - Relph's placelessness.
  - This is the opposite of kenopsia: a place that has no past moment to lose.
- **Builds:**
  - Brand-new, clean towers in pale cream and grey. Every window is permanently dark, overriding `litFraction` for this zone.
  - Fresh lane paint, young trees in square planters.
  - A huge sales-centre pavilion with a banner (NOW SELLING / YOUR NEW LIFE STARTS HERE, reusing the existing ad textures).
  - An empty stadium bowl on one block.
- **Moment:** the show flat. A ground-floor apartment behind glass, perfectly lit and furnished: a table set for two, a lamp, a sofa. Nobody lives there, and nobody ever has.
- **Lamps:** 1.0. Every lamp works perfectly, which is the wrong note.
- **Sound:** silence, with the radio slightly too clean.
- **Effort:** Easy. It reuses towers and ads; the show flat is a few boxes and a warm window.

## 5. Coming Soon — the neighbourhood being demolished
- **Names:** The Last Terrace · Hoarding Street · Coming Soon · Where Number 9 Was
- **Idea:** grief for a place while you're still in it.
  - Albrecht's solastalgia: "a form of homesickness one gets when one is still at 'home'".
  - Jeremiah Moss: "The spirit of the city as we knew it has vanished in the shadow of luxury condo towers" (`agents/CLAUDE_theory_B.md`).
  - Kenopsia: "you recognize the place, but can't find the moment."
- **Builds:**
  - Old four-storey buildings (Alexander's human scale) cut open by demolition. Rooms are exposed in cross-section, each painted a different colour, with wallpaper still on and staircases leading nowhere.
  - Rubble heaps and a tower crane.
  - Along the road, lit hoardings with a glowing rendering of a glass tower and the words LUXURY LIVING · COMING SOON.
- **Moment:** in one half-demolished building, a single room on the third floor still has its lamp on, with a chair and a picture on the wall. The wall that faced the street is already gone.
- **Lamps:** 0.4 on old lamps, with bright white floodlights on the site.
- **Sound:** the radio picks up an old song faintly, as if from that room, then loses it.
- **Effort:** Medium. Cutaway rooms are boxes with the front face missing, five sides each.

## 6. Office Park — the lights that only respond to motion
- **Names:** Business Park 3 · Unit 14–40 · The Low Glass · Parkway South
- **Idea:**
  - Tati's *Playtime*: "Everybody is filmed as if moving in straight lines and feeling prisoners of their surroundings."
  - Lewis Baltz's *New Industrial Parks*.
  - Augé's non-place (`agents/CLAUDE_art_media.md`).
- **Builds:**
  - Low identical glass-and-panel boxes of 2–3 storeys, each with a huge car park of painted bays and nobody parked.
  - Corporate signs on low plinths, still lit.
  - Inside, cubicle floors on timers: whole floors lit and empty.
- **Moment:** as you pass one building, its floors switch on in sequence on motion sensors, as if reacting to you. They time out and go dark behind you. It's the only thing in the city that notices you, and it's a machine.
- **Lamps:** 0.9 on car-park lighting columns.
- **Sound:** a fluorescent hum, and the radio slightly muzak-like.
- **Effort:** Easy for the geometry. The lighting sequence is a tick function that switches `warmwin`/`fluo` materials floor by floor.

## 7. Arcade Quarter — de Chirico by night, and by day
- **Names:** The Long Colonnade · Square of Arches · Metaphysical Row · Afternoon Forever
- **Idea:**
  - De Chirico: "deserted squares bordered by steeply receding arcades in raking light, with tiny figures casting long shadows."
  - Rome's EUR district at the end of *L'Eclisse*: "as depopulated as a Hopper or de Chirico painting" (`agents/CLAUDE_art_media.md`).
  - Alexander's Building Edge: arcades as an "inhabited zone", here with nobody in it (`agents/CODEX_theory_A.md`).
- **Builds:**
  - Low, long white buildings with continuous colonnades on the road sides.
  - Square-arched facades like EUR's Palazzo della Civiltà.
  - One statue per district, and long fake shadows (flat dark planes, as in the plaza moment).
  - In daylight mode (`T`), set the sun very low so the shadows run across whole blocks.
- **Moment:** at the far end of a colonnade, a single figure walks away, with a shadow ten times its length. When you reach the arcade, there's nobody, only the shadow fading.
- **Lamps:** 0.6, a warm white instead of sodium for contrast.
- **Sound:** a long, clear echo from the arcades.
- **Effort:** Medium. Colonnades are easy; the convincing long shadows need fake planes because the game has no real-time shadows.

## 8. Density Wall — so full you can't see the sky
- **Names:** No Horizon · Ten Thousand Windows · Monster Block · The Inner Courtyard
- **Idea:** being lonely among too many people.
  - Michael Wolf's *Architecture of Density*: "Any trace of a skyline or horizon is absent… from which the eye can no longer escape"; "Bits of laundry and hanging plants… the only irregularities."
  - Hammoud et al. 2021: "Increased overcrowding and population density were associated with higher levels of loneliness" (`RESEARCH.md`).
  - Simmel: "never feels as lonely and as deserted as in this metropolitan crush of persons."
- **Builds:**
  - Very tall, very narrow towers right up to the lot edge (almost no apron), so the road is a canyon.
  - A dense window grid with many windows *lit*. This is the only zone where most of the city is home.
  - Air-conditioner boxes, laundry poles and small balcony cages.
  - One block per district hollowed into an enclosed courtyard (Hong Kong's Monster Building), drivable through a gap.
- **Moment:** the same blue TV flicker starts in dozens of windows at once, everyone watching the same thing alone, then stops.
- **Lamps:** 0.7.
- **Sound:** layered faint TV voices and AC hum. This is the loudest zone, with nobody to talk to.
- **Effort:** Medium. It needs a variant of the window texture with clutter. The flicker is a shared material whose colour pulses.

## 9. The Levels — a multi-storey car park you can drive up
- **Names:** Level 4 · Park & Wait · The Ramps · Rooftop Deck
- **Idea:**
  - Liminal space: "abandoned offices, shopping centres, hotels, schools, car parks… 'threshold' environments caught between states of use and disuse, presence and absence" (`agents/CLAUDE_art_media.md`).
  - Hido: "a door left ajar or an empty car become signifiers of stories left untold" (the brief).
- **Builds:**
  - Open-sided concrete car parks filling whole lots, with fluorescent strips and painted level numbers.
  - A spiral ramp you can actually drive up. The roof gives the only high view in the game without the spaceship.
  - One parked car per level, nobody around.
- **Moment:** on the rooftop, one car is parked with its driver's door open and the interior light on, the whole city spread out below. No one comes back.
- **Lamps:** fluorescent strips inside; the road lamps are as normal.
- **Sound:** an exaggerated concrete echo of your own engine.
- **Effort:** Hard. The ground car needs to drive on ramps, which means height-aware driving beyond the spaceship's 3D collision. This could be the first non-flat driving surface.

## 10. Terminus — the night bus depot
- **Names:** Night Route N9 · The Depot · Last Stop · Bus Station
- **Idea:** Burial on his music: "about when you come back from being out somewhere; in a minicab or a night bus… walking home across London late at night, dreamlike" (`agents/CLAUDE_art_media.md`).
- **Builds:**
  - A depot block with rows of parked double-decker buses, all with interiors lit.
  - A bus station canopy with a departure board that slowly flips through destinations.
  - Lit, empty shelters on the surrounding lots.
- **Moment:** a lit night bus pulls out of the depot and drives ahead of you down your road. It stops at an empty stop, opens its doors, waits, closes them and moves on. Nobody gets on or off. You can follow it for as long as you like.
- **Lamps:** 0.7.
- **Sound:** the radio turns to a faint 2-step / garage pattern here, then back to Radio Panelka.
- **Effort:** Medium. The bus can reuse the chase car's code with a different body and a stop/go timer.

## 11. Windward — the plaza where the wind pushes you
- **Names:** Downdraft · Corner of Gusts · The Wind Gap · Fenchurch Corner
- **Idea:** a plaza nobody stays in, because of the towers around it.
  - Dublin's Grand Canal Square: "speeds up to 60% above the Dublin Airport reference around corners… preventing long-duration outdoor activity."
  - Tall buildings "accelerate pedestrian-level wind through downdraught, funnelling, and corner acceleration" (`agents/CODEX_methods_senses_measures.md`).
- **Builds:**
  - Wide plazas between blade-thin towers.
  - Paper and leaf particles streaming across the road, and flags on poles pulled flat.
  - Benches facing into the wind with nobody on them.
- **Moment:** a gust at a tower corner pushes the car sideways (a small lateral force) as an umbrella tumbles past and away down the road.
- **Lamps:** 0.75.
- **Sound:** wind noise rises at corners, and the rain slants harder.
- **Effort:** Easy for the visuals, using a particle system like the rain. Easy for the push: one lateral force term near tower corners.

## 12. The Cul-de-sacs — the edge of the city, where the houses turn away
- **Names:** Willow Close · Garage Row · Edge Estates · Quiet Crescent
- **Idea:**
  - Todd Hido's houses at night: "At night, houses become glowing chambers."
  - Snout houses: "A garage-lined street inhibits neighborhood interaction."
  - Putnam's commuting finding: "every 10 minutes added to a commute decreases… community involvement by around 10%" (`LONELINESS_BY_DESIGN_vs_EVOKED.md`).
- **Builds:**
  - Small detached houses with the garage at the front (snout houses), on loops of private drive inside each lot.
  - Fences and a basketball hoop.
  - Mostly dark, with one lit window per few houses and a blue TV glow.
  - The towers of the city visible behind, far off.
- **Moment:** a garage door is open with its light on and a car inside, ticking as it cools, as if someone just got home. The house is dark.
- **Lamps:** 0.5.
- **Sound:** crickets or near-silence, and a sprinkler.
- **Effort:** Easy to Medium. Loop drives are just a different paving texture on the lot; the road grid is unchanged.

---

## Suggested place in the drive order
The current order is: corridor → boulevard → plaza → interchange → residential → corner → fog.

| Stage of the drive | Existing | Add |
|---|---|---|
| Sameness | corridor | Office Park, Mirror Quarter |
| Scale | boulevard | Never Lived In, Windward |
| Exposure | plaza | Arcade Quarter, Field of Blocks |
| Non-place | interchange | The Port, The Levels |
| People you can't reach | residential, corner | Density Wall, Terminus |
| Fading out | fog | Coming Soon, The Cul-de-sacs |

## Suggested build order (impact vs. effort)
1. **Never Lived In.** Easy, and the show-flat moment is very strong.
2. **Field of Blocks.** Easy, and a feeling the game doesn't have yet: being swallowed.
3. **Office Park.** Easy, with a new kind of moment: a machine that notices you.
4. **Coming Soon.** Gives the city a past.
5. **Density Wall.** The only "full" zone, and its contrast makes every other zone emptier.
6. **The Port.**
7. **Terminus.**
8. **Mirror Quarter.**
9. **Arcade Quarter.**
10. **Windward.**
11. **The Cul-de-sacs.**
12. **The Levels.** Last, because it needs driving on ramps.

## Notes
- **Field of Blocks** borrows a spatial technique from a Holocaust memorial. Keep its names and look abstract, with no reference to the memorial in-game.
- **Wireframes first:** per the design rule, each new zone should get a wireframe (layout of one district from above, plus one street-level view) before it's built.
