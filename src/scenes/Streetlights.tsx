import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, wobble } from "../components/effects";
import { palette } from "../theme";

/** EXHIBIT 05 — "Be home when the streetlights come on." Kids on bikes
 * silhouetted against dusk as the streetlight buzzes to life. */
export const Streetlights: React.FC = () => {
  const f = useCurrentFrame();

  // The lamp flickers on around frame 70 and then glows steady.
  const warmup = interpolate(f, [60, 74, 78, 88], [0, 0.9, 0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flicker = f > 74 && f < 100 ? (Math.sin(f * 2.3) > 0.6 ? 0.85 : 1) : 1;
  const lampGlow = warmup * flicker;

  // Two kids pedalling home, gently bobbing.
  const ride = (f * 6) % 60;
  const bob1 = wobble(f, "b1", 4, 0.6);
  const bob2 = wobble(f, "b2", 4, 0.6) + 2;

  return (
    <Stage>
      {/* Dusk gradient handled by bg. Add distant houses. */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = i * 340 - 60;
        const h = 150 + ((i * 53) % 90);
        return (
          <g key={i} transform={`translate(${x} ${720 - h})`} fill={palette.night} opacity={0.85}>
            <rect x={0} y={0} width={260} height={h + 200} />
            <polygon points={`0,0 130,-70 260,0`} />
            {/* one warm window */}
            <rect x={60} y={40} width={40} height={54} fill={palette.brandGold} opacity={0.5} />
            <rect x={160} y={90} width={40} height={54} fill={palette.harvest} opacity={0.35} />
          </g>
        );
      })}

      {/* Ground / street */}
      <rect x={0} y={840} width={1920} height={240} fill="#1B1E2C" />
      <rect x={0} y={840} width={1920} height={10} fill={palette.night} />
      {/* road center dashes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={((i * 220 + ride * 3) % 2100) - 120} y={980} width={90} height={14} fill={palette.faded} opacity={0.5} />
      ))}

      {/* Streetlamp */}
      <g transform="translate(1480 0)">
        <rect x={-14} y={300} width={28} height={560} fill={palette.charcoal} />
        <path d="M0 300 q 0 -60 -120 -60" fill="none" stroke={palette.charcoal} strokeWidth={22} />
        {/* lamp head */}
        <ellipse cx={-150} cy={250} rx={44} ry={26} fill={palette.charcoal} />
        <ellipse cx={-150} cy={262} rx={30} ry={16} fill={palette.brandGold} opacity={lampGlow} />
        {/* halo */}
        <circle cx={-150} cy={262} r={110} fill={palette.brandGold} opacity={lampGlow * 0.18} />
        {/* light cone */}
        <polygon points="-190,272 -110,272 60,880 -420,880" fill={palette.brandGold} opacity={lampGlow * 0.12} />
      </g>

      {/* Bugs circling the lamp once it's on */}
      {lampGlow > 0.5 &&
        Array.from({ length: 6 }).map((_, i) => {
          const a = f * 0.15 + (i / 6) * Math.PI * 2;
          return <circle key={i} cx={1330 + Math.cos(a) * 60} cy={262 + Math.sin(a) * 34} r={3} fill={palette.bone} opacity={0.7} />;
        })}

      {/* Two kids riding bikes toward home (silhouettes) */}
      <g transform={`translate(430 ${824 + bob1})`}>
        <BikeKid pedal={ride} />
      </g>
      <g transform={`translate(700 ${832 + bob2}) scale(0.9)`}>
        <BikeKid pedal={ride + 30} />
      </g>

      {/* A couple of early stars fading in */}
      {Array.from({ length: 14 }).map((_, i) => {
        const sx = (i * 137) % 1920;
        const sy = (i * 71) % 380 + 40;
        const tw = (Math.sin(f * 0.1 + i) + 1) / 2;
        return <circle key={i} cx={sx} cy={sy} r={2} fill={palette.bone} opacity={interpolate(f, [30, 120], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * tw} />;
      })}
    </Stage>
  );
};

const BikeKid: React.FC<{ pedal: number }> = ({ pedal }) => {
  const p = (pedal / 60) * Math.PI * 2;
  return (
    <g fill={palette.charcoal} stroke={palette.charcoal}>
      {/* wheels */}
      <circle cx={-70} cy={0} r={58} fill="none" strokeWidth={8} />
      <circle cx={90} cy={0} r={58} fill="none" strokeWidth={8} />
      {/* spokes spin */}
      <g transform={`translate(-70 0) rotate(${(pedal * 6) % 360})`}>
        <line x1={-50} y1={0} x2={50} y2={0} strokeWidth={4} />
        <line x1={0} y1={-50} x2={0} y2={50} strokeWidth={4} />
      </g>
      {/* frame */}
      <path d="M-70 0 L10 0 L90 0 M10 0 L-10 -70 L60 -70 M-10 -70 L-70 0" strokeWidth={9} fill="none" />
      {/* seat + bars */}
      <rect x={-24} y={-84} width={40} height={10} rx={4} />
      <path d="M60 -70 l 26 -26" strokeWidth={9} />
      {/* rider */}
      <circle cx={0} cy={-150} r={30} />
      <path d="M0 -122 L 6 -74" strokeWidth={16} />
      <path d="M4 -96 L 74 -92" strokeWidth={12} />
      {/* legs pedalling */}
      <path d={`M6 -74 L ${10 + Math.cos(p) * 26} ${-6 + Math.sin(p) * 20}`} strokeWidth={12} fill="none" />
      <path d={`M6 -74 L ${10 + Math.cos(p + Math.PI) * 26} ${-6 + Math.sin(p + Math.PI) * 20}`} strokeWidth={12} fill="none" />
    </g>
  );
};
