# S2R — Episode 08 · "The Days Before" · Gen-X Graphics

Eight 8-second animated motion graphics for the **Shifting to Retirement**
YouTube episode *"The Days Before — How Gen X Figured Out Retirement With Zero
Instructions."* Built with [Remotion](https://www.remotion.dev/).

Each clip dramatizes one of the concrete Gen-X objects the script hangs its
jokes on ("Rule 1 — anchor every beat to a concrete object"). They share a
faded-photo / VHS aesthetic — film grain, vignette, scanlines, a camcorder
HUD, an "EXHIBIT ##" lower-third, and a deadpan caption bar — plus the brand
gold `#E8A317`. All are **1920×1080, 30 fps, 240 frames (8.0s)**.

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
  theme.ts              palette, fonts, timing constants
  components/
    SceneFrame.tsx      shared wrapper: grain, vignette, HUD, lower-third, caption
    effects.tsx         Grain / Vignette / Scanlines / VhsHud / Stage helpers
  scenes/               one animated SVG scene per exhibit
scripts/render-all.mjs  batch renderer
```

## Editing tips

- **Text on a scene** (the deadpan line, the exhibit title) lives in `Root.tsx`.
- **Background mood** is the `bg` gradient pair per scene in `Root.tsx`.
- **Timing** (fps, 8-second length) is in `theme.ts`.
- **Look** (grain strength, vignette, HUD) is in `components/effects.tsx`.
- Each scene is pure SVG animated off `useCurrentFrame()`, so nothing depends
  on external images or fonts — renders are fully offline and deterministic.
