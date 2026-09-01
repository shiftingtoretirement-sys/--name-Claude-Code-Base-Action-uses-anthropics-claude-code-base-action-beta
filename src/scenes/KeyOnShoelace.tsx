import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Stage } from "../components/effects";
import { palette } from "../theme";

/** EXHIBIT 04 — the house key on a shoelace, worn around the neck like a medal.
 * A hero close-up: the key swings gently on its lace, catching the light. */
export const KeyOnShoelace: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pendulum swing of the key.
  const swing = Math.sin(f * 0.06) * 7;
  // Glint sweeps across the metal.
  const glint = interpolate(f % 90, [0, 45, 90], [-1, 1, -1]);
  // "Medal" ribbon presentation pop.
  const pop = spring({ frame: f - 12, fps, config: { damping: 12, mass: 0.8 } });

  return (
    <Stage>
      {/* Chest / collar silhouette so the key reads as worn on the neck */}
      <path d="M0 1080 L0 720 Q 500 560 960 560 Q 1420 560 1920 720 L1920 1080 Z" fill={palette.brown} opacity={0.9} />
      <path d="M760 560 Q 960 640 1160 560 L1160 620 Q 960 700 760 620 Z" fill={palette.darkBrown} />

      {/* Sunbeam behind the key */}
      <g opacity={0.35}>
        {Array.from({ length: 9 }).map((_, i) => (
          <polygon key={i} points="960,360 900,-200 1020,-200" fill={palette.harvest} transform={`rotate(${(i - 4) * 16} 960 360)`} />
        ))}
      </g>

      {/* Shoelace loop around the neck */}
      <path d="M700 120 Q 960 380 1220 120" fill="none" stroke={palette.cream} strokeWidth={12} strokeLinecap="round" opacity={0.9} />
      <path d="M700 120 Q 960 388 1220 120" fill="none" stroke={palette.faded} strokeWidth={4} strokeLinecap="round" opacity={0.7} />

      {/* The key, swinging like a medal */}
      <g transform={`translate(960 300) scale(${0.7 + pop * 0.35}) rotate(${swing})`} style={{ transformOrigin: "960px 300px" }}>
        {/* lace tie */}
        <path d="M-4 -60 q 40 60 4 60 q -40 0 -4 -60" fill={palette.cream} />
        {/* key body */}
        <g>
          <circle cx={0} cy={40} r={78} fill={palette.brandGold} />
          <circle cx={0} cy={40} r={40} fill={palette.brown} />
          <circle cx={0} cy={40} r={78} fill="none" stroke="#8A6410" strokeWidth={5} />
          <rect x={-20} y={110} width={40} height={230} rx={10} fill={palette.brandGold} />
          {/* teeth */}
          <path d="M-20 300 l 0 40 l 26 0 l 0 -22 l 16 0 l 0 -18 l 18 0 l 0 40 l -60 0 Z" fill={palette.harvest} />
          <rect x={-20} y={110} width={12} height={230} fill="#F6D27A" opacity={0.7} />
          {/* moving glint */}
          <rect x={-20 + glint * 34} y={110} width={10} height={230} fill={palette.bone} opacity={0.75} />
        </g>
      </g>

      {/* Sparkle at the head */}
      {[0, 1, 2].map((i) => {
        const s = (Math.sin(f * 0.2 + i * 2) + 1) / 2;
        const px = 960 + [70, -60, 20][i];
        const py = 300 + [-30, 20, -70][i];
        return (
          <g key={i} transform={`translate(${px} ${py})`} opacity={0.4 + s * 0.6}>
            <path d={`M0 ${-10 - s * 8} L2 -2 L${10 + s * 8} 0 L2 2 L0 ${10 + s * 8} L-2 2 L${-10 - s * 8} 0 L-2 -2 Z`} fill={palette.bone} />
          </g>
        );
      })}
    </Stage>
  );
};
