import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Stage, wobble } from "../components/effects";
import { palette } from "../theme";

/** EXHIBIT 02 — riding backwards in the way-back of the station wagon,
 * no seatbelt, making faces at the strangers in the car behind. */
export const WayBack: React.FC = () => {
  const f = useCurrentFrame();
  const road = (f * 40) % 200;
  const bump = wobble(f, "susp", 5, 0.55);

  // The car behind recedes/approaches slightly (traffic).
  const behind = 1 + Math.sin(f * 0.06) * 0.05;

  return (
    <Stage>
      {/* Sky already from bg; distant road + horizon */}
      <rect x={0} y={0} width={1920} height={620} fill="none" />
      {/* Highway receding to a point (seen out the back window) */}
      <polygon points="760,300 1160,300 1500,780 420,780" fill="#4A4A52" />
      <polygon points="820,300 1100,300 1360,780 560,780" fill="#565660" opacity={0.5} />
      {/* Dashed lane line rushing away */}
      {Array.from({ length: 7 }).map((_, i) => {
        const t = ((i * 90 + road) % 560) / 560;
        const y = interpolate(t, [0, 1], [320, 780]);
        const w = interpolate(t, [0, 1], [10, 46]);
        const h = interpolate(t, [0, 1], [22, 80]);
        return <rect key={i} x={960 - w / 2} y={y} width={w} height={h} rx={4} fill={palette.harvest} opacity={0.9} />;
      })}
      {/* Roadside telephone poles whipping by */}
      {Array.from({ length: 4 }).map((_, i) => {
        const t = ((i * 140 + road * 1.4) % 560) / 560;
        const x = interpolate(t, [0, 1], [960, 300]);
        const y = interpolate(t, [0, 1], [330, 470]);
        const s = interpolate(t, [0, 1], [0.3, 1.1]);
        return (
          <g key={"L" + i} transform={`translate(${x} ${y}) scale(${s})`} opacity={0.7}>
            <rect x={-6} y={-120} width={12} height={160} fill={palette.brown} />
            <rect x={-40} y={-110} width={80} height={12} fill={palette.brown} />
          </g>
        );
      })}
      {Array.from({ length: 4 }).map((_, i) => {
        const t = ((i * 140 + road * 1.4 + 70) % 560) / 560;
        const x = interpolate(t, [0, 1], [960, 1620]);
        const y = interpolate(t, [0, 1], [330, 470]);
        const s = interpolate(t, [0, 1], [0.3, 1.1]);
        return (
          <g key={"R" + i} transform={`translate(${x} ${y}) scale(${s})`} opacity={0.7}>
            <rect x={-6} y={-120} width={12} height={160} fill={palette.brown} />
            <rect x={-40} y={-110} width={80} height={12} fill={palette.brown} />
          </g>
        );
      })}

      {/* The car behind us in traffic */}
      <g transform={`translate(960 560) scale(${behind})`}>
        <rect x={-150} y={-70} width={300} height={120} rx={26} fill={palette.rust} />
        <rect x={-110} y={-60} width={220} height={62} rx={16} fill="#2A3340" />
        <circle cx={-95} cy={55} r={26} fill={palette.ink} />
        <circle cx={95} cy={55} r={26} fill={palette.ink} />
        {/* startled stranger */}
        <circle cx={0} cy={-28} r={26} fill={palette.tan} />
        <circle cx={-8} cy={-30} r={4} fill={palette.ink} />
        <circle cx={9} cy={-30} r={4} fill={palette.ink} />
        <ellipse cx={0} cy={-16} rx={7} ry={10} fill={palette.ink} />
      </g>

      {/* The tailgate window frame we're looking through */}
      <g transform={`translate(0 ${bump})`}>
        {/* interior roof shadow */}
        <rect x={0} y={0} width={1920} height={150} fill={palette.charcoal} opacity={0.85} />
        <rect x={0} y={790} width={1920} height={290} fill={palette.charcoal} />
        {/* window rubber gasket */}
        <rect x={120} y={130} width={1680} height={700} rx={40} fill="none" stroke={palette.ink} strokeWidth={44} opacity={0.85} />
        {/* rear wiper */}
        <line x1={520} y1={800} x2={1180} y2={300} stroke={palette.ink} strokeWidth={10} opacity={0.5} />

        {/* Two kids in the way-back, backs to us, making faces (we see the backs of heads + one turning) */}
        <g transform="translate(560 560)" fill={palette.darkBrown}>
          <path d="M-60 260 q 60 -220 120 0 Z" />
          <circle cx={0} cy={40} r={70} />
        </g>
        <g transform="translate(1300 560)" fill={palette.darkBrown}>
          <path d="M-60 260 q 60 -220 120 0 Z" />
          <circle cx={0} cy={40} r={70} />
          {/* turned cheek + tongue out, cartoon face on the glass reflection */}
          <g transform="translate(48 24)">
            <circle cx={0} cy={0} r={44} fill={palette.tan} />
            <circle cx={-14} cy={-8} r={5} fill={palette.ink} />
            <circle cx={12} cy={-8} r={5} fill={palette.ink} />
            <path d="M-16 16 q 16 18 34 0" stroke={palette.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
            <ellipse cx={9} cy={22} rx={8} ry={12} fill={palette.rust} />
          </g>
        </g>
      </g>
    </Stage>
  );
};
