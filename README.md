# Shifting to Retirement — Data Video

A 21-second (630-frame) 1920×1080 @ 30fps Remotion data video with an
industrial hazard-caution visual theme. Three 7-second scenes, hard cuts
between them:

1. **Life Expectancy Countdown** (`src/scenes/Scene1LifeExpectancy.tsx`) — a
   counter eases from age 55 → 85, a hazard-yellow timeline fills with tick
   marks at 55/65/75/85, and the landed number pulses once with a "30 Years of
   Retirement to Fund" subtitle.
2. **The Retirement Spending Smile** (`src/scenes/Scene2SpendingSmile.tsx`) — an
   SVG smile curve draws itself left-to-right (normalised `stroke-dashoffset`),
   with Go-Go / Slow-Go / No-Go bands, icons, and labels fading in as the pen
   crosses each zone.
3. **Portfolio Growth Through Retirement** (`src/scenes/Scene3PortfolioGrowth.tsx`)
   — a $2M portfolio area chart reveals left-to-right (animated `clipPath`),
   synced to a corner age tracker, with Medicare / RMD milestone callouts and an
   ending-value label. Illustrative only.

## Shared building blocks

- `src/components/HazardFrame.tsx` — hazard-stripe border frame + persistent
  punch-clock "bug" watermark wrapping every scene.
- `src/components/HazardStripes.tsx`, `PunchClock.tsx`, `Icons.tsx` — motif
  helpers and inline SVG icons.
- `src/theme.ts` — brand palette + Google Fonts (Bebas Neue, Barlow Condensed,
  Inter).
- `src/ShiftingToRetirement.tsx` — the three `<Sequence>`s at 0 / 210 / 420.

All animation uses `useCurrentFrame()` + `interpolate()` (no CSS
transitions/animations), per Remotion best practices. Text is kept inside a
~90% title-safe area.

## Develop

```bash
npm install
npm run dev          # Remotion Studio
```

## Render

```bash
npx remotion render ShiftingToRetirement out/shifting-to-retirement.mp4
```

### Rendering in a sandboxed / proxied environment

If the environment blocks Remotion's Chromium download and/or intercepts TLS
(e.g. Google Fonts served through a proxy CA), point Remotion at a
pre-installed **headless-shell** binary and allow the proxy cert:

```bash
npx remotion render ShiftingToRetirement out/shifting-to-retirement.mp4 \
  --browser-executable=/path/to/chrome-headless-shell \
  --ignore-certificate-errors
```

These flags are intentionally **not** baked into `remotion.config.ts` because
the browser path is host-specific.
