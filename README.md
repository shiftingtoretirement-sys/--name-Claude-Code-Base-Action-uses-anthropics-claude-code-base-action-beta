# S2R — Episode 08 · "The Days Before" · Gen-X Graphics

Eight 8-second animated motion graphics for the **Shifting to Retirement**
YouTube episode *"The Days Before — How Gen X Figured Out Retirement With Zero
Instructions."* Built with [Remotion](https://www.remotion.dev/).

Each clip dramatizes one of the concrete Gen-X objects the script hangs its
jokes on ("Rule 1 — anchor every beat to a concrete object"). Instead of
cartoons, every object is a realistically-lit **hero shot** — the brass hose
nozzle, the worn house key, a lawn dart standing in the grass — with a shared
**cinematic archival-film** finish: warm faded-Kodachrome color, dramatic
directional light, shallow depth-of-field, 16mm grain, halation glow, subtle
light leaks, projector gate-weave and a thin letterbox. Titling is editorial —
a Playfair Display serif title, an italic deadpan caption, and an Archivo
kicker — with the brand gold `#E8A317` used sparingly. All are
**1920×1080, 30 fps, 240 frames (8.0s)**.

## The eight exhibits

| # | Composition ID       | Scene                        | Script beat |
|---|----------------------|------------------------------|-------------|
| 1 | `01-GardenHose`      | Drinking from the garden hose | 0:00 hook |
| 2 | `02-WayBack`         | Facing backwards in the station-wagon way-back | 0:00 hook |
| 3 | `03-LawnDarts`       | Lawn darts — metal spears, as a toy | 0:00 hook |
| 4 | `04-KeyOnShoelace`   | The house key worn like a medal | 1:00 "How We Were Raised" |
| 5 | `05-Streetlights`    | "Be home when the streetlights come on" | 1:00 "How We Were Raised" |
| 6 | `06-RotaryPhone`     | The one rotary phone, on the wall, with a cord | 1:00 "How We Were Raised" |
| 7 | `07-Passbook`        | The passbook savings account, stamped by hand | 2:45 "We Learned Money in the Dark" |
| 8 | `08-CalculatorWatch` | The one guy at work with the calculator watch | 2:45 "We Learned Money in the Dark" |

## Use

```bash
npm install

# Preview / tweak any scene interactively in the Remotion Studio:
npm run dev

# Render all eight to out/*.mp4:
npm run render:all

# Render a subset (matches on id substring):
node scripts/render-all.mjs 03 05

# Grab a single still frame:
npx remotion still src/index.ts 05-Streetlights out/frame.png --frame=90
```

Rendered `.mp4` files land in `out/` (git-ignored). Drop them straight onto a
YouTube timeline as B-roll, or export the individual scenes as Shorts — each
is self-contained and captioned, so any one cuts clean.

## Structure

```
src/
  index.ts              registerRoot entry
  Root.tsx              registers the 8 compositions + per-scene caption/palette
  theme.ts              palette + timing constants
  fonts.ts              self-hosted Playfair Display + Archivo (offline render)
  components/
    SceneFrame.tsx      shared wrapper: film treatment + editorial title block
    film.tsx            FilmGrain / Vignette / Halation / LightLeak / GateWeave /
                        Letterbox / Stage (with DOF + glow filters) helpers
  scenes/               one realistically-lit SVG hero scene per exhibit
public/fonts/           woff2 files (copied from @fontsource, checked in)
scripts/render-all.mjs  batch renderer
```

## Editing tips

- **Text on a scene** (the deadpan line, the title) lives in `Root.tsx`.
- **Key-light position** per scene is the `halation` prop in `Root.tsx`.
- **Timing** (fps, 8-second length) is in `theme.ts`.
- **Film look** (grain strength, vignette, halation, leaks, gate-weave,
  letterbox) is in `components/film.tsx`; the title block is in `SceneFrame.tsx`.
- Each scene is pure animated SVG driven by `useCurrentFrame()`, and the fonts
  are self-hosted, so renders are fully offline and deterministic.
