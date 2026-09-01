import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, wobble } from "../components/effects";
import { palette } from "../theme";

/** EXHIBIT 03 — lawn darts. Actual metal spears. As a toy. For children.
 * A giant dart arcs across the sky and thunks into the lawn beside a ring. */
export const LawnDarts: React.FC = () => {
  const f = useCurrentFrame();

  // Dart flight: launches, arcs, lands ~ frame 90, then quivers.
  const flight = interpolate(f, [10, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const dx = interpolate(flight, [0, 1], [180, 1180]);
  const dy = 300 + Math.sin(flight * Math.PI) * -220 + flight * 360; // parabola down
  const angle = interpolate(flight, [0, 0.5, 1], [-35, 20, 78]);
  const landed = f > 90;
  const quiver = landed ? wobble(f, "q", 4, 0.9) * Math.max(0, 1 - (f - 90) / 30) : 0;

  // Impact flash + dirt puff at landing.
  const impact = interpolate(f, [90, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Stage>
      {/* Lawn */}
      <path d="M0 760 Q 960 700 1920 760 L1920 1080 L0 1080 Z" fill={palette.avocado} />
      <path d="M0 850 Q 960 800 1920 850 L1920 1080 L0 1080 Z" fill="#586330" />

      {/* Target ring on the grass */}
      <g transform="translate(1180 900)">
        <ellipse cx={0} cy={0} rx={190} ry={64} fill="none" stroke={palette.bone} strokeWidth={14} opacity={0.85} />
        <ellipse cx={0} cy={0} rx={110} ry={38} fill="none" stroke={palette.brandGold} strokeWidth={12} opacity={0.9} />
      </g>

      {/* A second dart already planted, for context */}
      <g transform="translate(760 905) rotate(66)">
        <DartArt scale={0.85} />
      </g>

      {/* Motion trail */}
      {flight > 0.02 && !landed &&
        Array.from({ length: 6 }).map((_, i) => {
          const t = Math.max(0, flight - i * 0.05);
          const tx = interpolate(t, [0, 1], [180, 1180]);
          const ty = 300 + Math.sin(t * Math.PI) * -220 + t * 360;
          return <circle key={i} cx={tx} cy={ty} r={10 - i} fill={palette.faded} opacity={0.25 - i * 0.03} />;
        })}

      {/* The flying / landed dart */}
      <g transform={`translate(${landed ? 1180 : dx} ${landed ? 900 : dy}) rotate(${(landed ? 78 : angle) + quiver})`}>
        <DartArt scale={1} />
      </g>

      {/* Impact puff */}
      {impact > 0 && (
        <g transform="translate(1180 905)" opacity={0.8 * (1 - impact)}>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const r = impact * 90;
            return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.4} r={12 * (1 - impact) + 4} fill="#7A6A44" />;
          })}
        </g>
      )}

      {/* Warning starburst, because: for children */}
      <g transform="translate(360 300)" opacity={interpolate(f, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
        <path d={starPath(70, 34, 12)} fill={palette.rust} transform={`rotate(${(f * 1.2) % 360})`} />
        <text x={0} y={12} textAnchor="middle" fontFamily='"Arial Black", sans-serif' fontSize={30} fill={palette.bone} fontWeight={900}>
          FUN!
        </text>
      </g>
    </Stage>
  );
};

const DartArt: React.FC<{ scale: number }> = ({ scale }) => (
  <g transform={`scale(${scale})`}>
    {/* fins */}
    <path d="M0 -150 l 34 -46 l 0 60 l -34 30 Z" fill={palette.brandGold} />
    <path d="M0 -150 l -34 -46 l 0 60 l 34 30 Z" fill={palette.harvest} />
    <path d="M0 -150 l 20 -50 l -20 12 l -20 -12 Z" fill={palette.rust} />
    {/* shaft */}
    <rect x={-8} y={-150} width={16} height={150} rx={4} fill={palette.faded} />
    <rect x={-8} y={-150} width={6} height={150} fill={palette.bone} opacity={0.6} />
    {/* heavy metal spike */}
    <path d="M-10 0 L 10 0 L 0 70 Z" fill="#6E6E76" />
    <path d="M0 0 L 10 0 L 0 70 Z" fill="#43434A" />
  </g>
);

function starPath(outer: number, inner: number, points: number) {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"} ${Math.cos(a) * r} ${Math.sin(a) * r} `;
  }
  return d + "Z";
}
