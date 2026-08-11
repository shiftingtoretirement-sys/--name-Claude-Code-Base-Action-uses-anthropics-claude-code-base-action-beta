import React from "react";
import { spring, interpolate, useVideoConfig } from "remotion";
import { COLORS, CONDENSED_FONT } from "../theme";

// Explicit label placement relative to a marker's tip. Along the Gulf Coast
// several towns sit almost on top of each other, so labels are hand-placed
// with a thin leader line back to the pin instead of auto-stacking.
export type LabelPlacement = {
  lx: number; // label anchor x offset from tip
  ly: number; // label anchor y offset from tip
  anchor: "start" | "end" | "middle";
};

const LABEL: React.CSSProperties = {
  fontFamily: CONDENSED_FONT,
  fontWeight: 700,
  fontSize: 25,
  fill: COLORS.offWhite,
  paintOrder: "stroke",
  stroke: "rgba(9,9,9,0.9)",
  strokeWidth: 5,
};

// A leader line + a small connector dot from the pin tip to the label, drawn
// only when the label is pushed away from the tip.
const Leader: React.FC<{
  tx: number;
  ty: number;
  lx: number;
  ly: number;
  opacity: number;
}> = ({ tx, ty, lx, ly, opacity }) => {
  const dist = Math.hypot(lx - tx, ly - ty);
  if (dist < 6) return null;
  return (
    <line
      x1={tx}
      y1={ty}
      x2={lx}
      y2={ly}
      stroke={COLORS.hazardYellow}
      strokeWidth={1.5}
      strokeOpacity={0.55 * opacity}
    />
  );
};

// A classic teardrop drop-pin whose tip sits exactly on (x, y). It falls in
// from above with a spring bounce as it lands.
export const DropPin: React.FC<{
  x: number;
  y: number;
  label: string;
  appearFrame: number;
  frame: number;
  placement: LabelPlacement;
}> = ({ x, y, label, appearFrame, frame, placement }) => {
  const { fps } = useVideoConfig();
  const local = frame - appearFrame;
  if (local < 0) return null;

  const drop = spring({
    frame: local,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.8 },
  });
  const fallY = interpolate(drop, [0, 1], [-70, 0]);
  const opacity = interpolate(local, [0, 5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const shadow = interpolate(drop, [0.55, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label anchor point in absolute screen coords.
  const lx = x + placement.lx;
  const ly = y + placement.ly;

  return (
    <g opacity={opacity}>
      <Leader tx={x} ty={y} lx={lx} ly={ly} opacity={opacity} />
      <ellipse
        cx={x}
        cy={y + 2}
        rx={9 * shadow}
        ry={3 * shadow}
        fill="rgba(0,0,0,0.45)"
      />
      <g transform={`translate(${x}, ${y + fallY})`}>
        <path
          d="M0,0 C-9,-14 -13,-20 -13,-28 A13,13 0 1 1 13,-28 C13,-20 9,-14 0,0 Z"
          fill={COLORS.hazardYellow}
          stroke={COLORS.charcoalDeep}
          strokeWidth={2}
        />
        <circle cx={0} cy={-28} r={5.5} fill={COLORS.charcoalDeep} />
      </g>
      <text
        x={lx}
        y={ly}
        textAnchor={placement.anchor}
        dominantBaseline="middle"
        style={LABEL}
      >
        {label}
      </text>
    </g>
  );
};

// The origin marker: a red five-point star with a soft pulsing glow, centered
// on (x, y). Pops in early and holds for the whole piece.
export const RedStar: React.FC<{
  x: number;
  y: number;
  label: string;
  appearFrame: number;
  frame: number;
}> = ({ x, y, label, appearFrame, frame }) => {
  const { fps } = useVideoConfig();
  const local = frame - appearFrame;
  if (local < 0) return null;

  const pop = spring({
    frame: local,
    fps,
    config: { damping: 11, stiffness: 200, mass: 0.7 },
  });
  const scale = interpolate(pop, [0, 1], [0, 1]);
  const pulse = 1 + 0.12 * Math.sin(local / 7);
  const glow = 0.55 + 0.25 * Math.sin(local / 7);

  const star = starPath(0, 0, 5, 20, 8.5);

  return (
    <g>
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        <circle r={30 * pulse} fill="#E11D2A" opacity={0.16 * glow} />
        <circle r={20 * pulse} fill="#E11D2A" opacity={0.22 * glow} />
        <path
          d={star}
          fill="#E11D2A"
          stroke="#7A0C13"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path d={starPath(0, 0, 5, 9, 3.6)} fill="#FFD1D4" opacity={0.9} />
      </g>
      <text
        x={x}
        y={y - 40}
        textAnchor="middle"
        dominantBaseline="auto"
        opacity={interpolate(local, [4, 12], [0, 1], {
          extrapolateRight: "clamp",
        })}
        style={{
          fontFamily: CONDENSED_FONT,
          fontWeight: 700,
          fontSize: 30,
          fill: "#FFFFFF",
          paintOrder: "stroke",
          stroke: "rgba(9,9,9,0.92)",
          strokeWidth: 6,
        }}
      >
        {label}
      </text>
    </g>
  );
};

// Builds an SVG path for a star centered at (cx, cy).
function starPath(
  cx: number,
  cy: number,
  points: number,
  outer: number,
  inner: number,
): string {
  const step = Math.PI / points;
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * step - Math.PI / 2;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    d += `${i === 0 ? "M" : "L"}${px.toFixed(2)},${py.toFixed(2)} `;
  }
  return d + "Z";
}
