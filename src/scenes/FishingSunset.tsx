import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { filmGrade } from "../components/MediaClip";

/**
 * "Living photo" cinemagraph of the sunset fishing shot. The subjects stay
 * still (real head-turn/laugh motion would need generative video); life comes
 * from the water: the reflection ripples via an animated displacement map,
 * sun-glints drift down the reflection column, and gentle rings spread from
 * the fishing line. A near-imperceptible breathing push-in adds air.
 *
 * Image is 1168x784; all vector coordinates below are in that space, and the
 * SVG slices to cover 1920x1080 exactly like the base <Img> object-fit: cover.
 */
const W = 1168;
const H = 784;
const SRC = "media/fishing-sunset.jpg";

// Water surface polygon (far waterline across, down the right edge, back up the
// near grassy shoreline past the boys).
const WATER = "470,322 720,300 1168,278 1168,784 786,784";
const LINE_ENTRY = { x: 902, y: 442 }; // where the fishing line meets the water

export const FishingSunset: React.FC = () => {
  const f = useCurrentFrame();

  // Gentle breathing push-in (kept tiny so the sunset reads as stable).
  const scale = interpolate(f, [0, 150], [1.0, 1.03]);

  // Animated ripple parameters.
  const seed = Math.floor(f / 3);
  const bfY = 0.026 + Math.sin(f * 0.06) * 0.004;
  const dispScale = 6 + Math.sin(f * 0.12) * 3.5;

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, filter: filmGrade, transform: `scale(${scale})`, transformOrigin: "58% 46%" }}>
        {/* Base still */}
        <Img src={staticFile(SRC)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />

        {/* Rippling water (same image, displaced, masked to the surface) */}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <filter id="fs-water" x="-6%" y="-6%" width="112%" height="112%">
              <feTurbulence type="fractalNoise" baseFrequency={`0.011 ${bfY}`} numOctaves={2} seed={seed} result="t" />
              <feDisplacementMap in="SourceGraphic" in2="t" scale={dispScale} xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="fs-soft"><feGaussianBlur stdDeviation="10" /></filter>
            <mask id="fs-watermask">
              <polygon points={WATER} fill="#fff" filter="url(#fs-soft)" />
            </mask>
          </defs>
          <g mask="url(#fs-watermask)">
            <image href={staticFile(SRC)} x={0} y={0} width={W} height={H} preserveAspectRatio="xMidYMid slice" filter="url(#fs-water)" />
          </g>
        </svg>

        {/* Sun-reflection glints + fishing-line ripple rings (added light) */}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
          {/* drifting glints down the sun's reflection column */}
          {Array.from({ length: 9 }).map((_, i) => {
            const phase = (f * 0.7 + i * 26) % 230;
            const y = 300 + phase; // travels down the column
            if (y > 520) return null;
            const wob = Math.sin(f * 0.2 + i) * 12;
            const op = Math.sin((phase / 230) * Math.PI) * 0.5;
            const width = 26 + Math.sin(f * 0.3 + i * 2) * 12;
            return <rect key={i} x={1004 + wob - width / 2} y={y} width={width} height={2.4} rx={1.2} fill="#ffe3ad" opacity={op} />;
          })}
          {/* soft steady sparkle right under the sun */}
          <ellipse cx={1010} cy={318} rx={60} ry={7} fill="#fff0cf" opacity={0.18 + Math.sin(f * 0.5) * 0.06} />

          {/* concentric ripple rings spreading from the line entry */}
          {[0, 1, 2].map((k) => {
            const period = 66;
            const t = ((f + k * 22) % period) / period;
            const rx = 6 + t * 62;
            const op = (1 - t) * 0.42;
            return (
              <ellipse key={k} cx={LINE_ENTRY.x} cy={LINE_ENTRY.y} rx={rx} ry={rx * 0.32} fill="none" stroke="#ffe9c4" strokeWidth={2.4 * (1 - t) + 0.6} opacity={op} />
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
