import React from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { Stage, usePushIn } from "../components/film";
import { palette } from "../theme";

/** EXHIBIT 05 — a sodium-vapor streetlamp shuddering to life over an empty
 * street at dusk. A lone rider, small and far, heads home before it's full dark. */
export const Streetlights: React.FC = () => {
  const f = useCurrentFrame();
  const push = usePushIn(1.0, 1.05);

  // Lamp warms up ~f70, flickers, then holds.
  const warm = interpolate(f, [58, 72, 76, 86], [0, 0.85, 0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flick = f > 72 && f < 104 ? (Math.sin(f * 2.1) > 0.5 ? 0.82 : 1) : 1;
  const lamp = warm * flick;

  // Lone rider recedes down the road.
  const ride = interpolate(f, [0, 240], [1, 0.62]);
  const riderX = 960 + (1 - ride) * -120;
  const riderY = 812 - (1 - ride) * 150;
  const riderS = 0.9 - (1 - ride) * 1.4;

  return (
    <Stage>
      <defs>
        <linearGradient id="sl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141a2e" />
          <stop offset="55%" stopColor="#3a3550" />
          <stop offset="82%" stopColor="#8a5a3c" />
          <stop offset="100%" stopColor="#c98a4e" />
        </linearGradient>
        <radialGradient id="sl-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd27a" />
          <stop offset="40%" stopColor="#f0a94a" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#f0a94a" stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect width={1920} height={1080} fill="url(#sl-sky)" />

      {/* early stars */}
      {Array.from({ length: 24 }).map((_, i) => {
        const sx = random("sx" + i) * 1920;
        const sy = random("sy" + i) * 420;
        const tw = (Math.sin(f * 0.08 + i) + 1) / 2;
        return <circle key={i} cx={sx} cy={sy} r={1.4} fill={palette.bone} opacity={interpolate(f, [20, 120], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * tw} />;
      })}

      <g transform={`translate(960 560) scale(${push}) translate(-960 -560)`}>
        {/* silhouetted skyline of houses + trees */}
        <g fill="#0d1018" filter="url(#dofSoft)">
          {Array.from({ length: 7 }).map((_, i) => {
            const x = i * 300 - 80;
            const h = 150 + ((i * 61) % 120);
            return (
              <g key={i}>
                <rect x={x} y={720 - h} width={250} height={h + 120} />
                <polygon points={`${x},${720 - h} ${x + 125},${720 - h - 66} ${x + 250},${720 - h}`} />
              </g>
            );
          })}
          {/* a couple of trees */}
          <circle cx={330} cy={640} r={110} />
          <circle cx={1620} cy={660} r={130} />
        </g>
        {/* faint warm windows */}
        {[[180, 610], [520, 650], [1180, 600], [1780, 640]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={34} height={46} fill={palette.amber} opacity={0.4} />
        ))}

        {/* street */}
        <rect y={820} width={1920} height={260} fill="#15161f" />
        <rect y={816} width={1920} height={6} fill="#0a0b10" />

        {/* Streetlamp */}
        <g transform="translate(1440 0)">
          <rect x={-11} y={300} width={22} height={540} fill="#0c0d12" />
          <path d="M0 306 q 0 -66 -140 -66" fill="none" stroke="#0c0d12" strokeWidth={20} />
          <ellipse cx={-172} cy={252} rx={52} ry={26} fill="#0c0d12" />
          {/* light cone on the road */}
          <polygon points="-214,268 -128,268 120,900 -520,900" fill="url(#sl-glow)" opacity={lamp * 0.5} />
          {/* warm reflection pool */}
          <ellipse cx={-172} cy={892} rx={230} ry={40} fill="#f0a94a" opacity={lamp * 0.22} filter="url(#glow)" />
          {/* halo + bulb */}
          <circle cx={-172} cy={262} r={150} fill="url(#sl-glow)" opacity={lamp} />
          <circle cx={-172} cy={262} r={220} fill="#ffcf78" opacity={lamp * 0.4} filter="url(#glowBig)" />
          <ellipse cx={-172} cy={264} rx={30} ry={16} fill="#fff2cf" opacity={lamp} />
          {/* moths */}
          {lamp > 0.5 &&
            Array.from({ length: 7 }).map((_, i) => {
              const a = f * 0.14 + (i / 7) * Math.PI * 2;
              return <circle key={i} cx={-172 + Math.cos(a) * (70 + i * 6)} cy={262 + Math.sin(a) * (40 + i * 4)} r={2.4} fill="#3a2f1c" opacity={0.8} />;
            })}
        </g>

        {/* Lone rider, far and small */}
        <g transform={`translate(${riderX} ${riderY}) scale(${riderS})`} opacity={0.9} fill="#0a0b10" stroke="#0a0b10">
          <circle cx={-38} cy={0} r={30} fill="none" strokeWidth={5} />
          <circle cx={40} cy={0} r={30} fill="none" strokeWidth={5} />
          <path d="M-38 0 L 6 0 L 40 0 M6 0 L -6 -40 L 30 -40 M-6 -40 L -38 0" strokeWidth={6} fill="none" />
          <circle cx={0} cy={-78} r={16} />
          <path d="M0 -64 L 4 -38" strokeWidth={9} />
        </g>
      </g>
    </Stage>
  );
};
