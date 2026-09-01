import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Stage, usePushIn, wobble } from "../components/film";
import { palette } from "../theme";

/** EXHIBIT 02 — the view from the way-back: a two-lane highway receding into a
 * hazy sunset, seen through the station-wagon's rear glass. The road you've
 * already passed slides away toward the vanishing point. */
export const WayBack: React.FC = () => {
  const f = useCurrentFrame();
  const push = usePushIn(1.0, 1.05);
  const move = f * 0.9;
  const bob = wobble(f, "susp", 3, 0.5);
  const VX = 960, VY = 372; // vanishing point

  // Center-line dashes sliding from near (large, low) to far (small, center).
  const dashes = Array.from({ length: 9 }).map((_, i) => {
    const u = 1 - (((move + i * 60) % 540) / 540); // 1 near -> 0 far
    const y = VY + u * (900 - VY);
    const w = 8 + u * 46;
    const h = 16 + u * 70;
    return { y, w, h, o: interpolate(u, [0, 0.1, 1], [0, 1, 1]) };
  });

  // Telephone poles receding on both shoulders.
  const poles = (side: number) =>
    Array.from({ length: 5 }).map((_, i) => {
      const u = 1 - (((move + i * 108) % 540) / 540);
      const y = VY + u * (760 - VY);
      const x = VX + side * (60 + u * 940);
      const s = 0.12 + u * 1.1;
      return { x, y, s, o: interpolate(u, [0, 0.08, 1], [0, 1, 1]) };
    });

  return (
    <Stage>
      <defs>
        <linearGradient id="wb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3552" />
          <stop offset="45%" stopColor="#7d5a40" />
          <stop offset="72%" stopColor="#d98f45" />
          <stop offset="100%" stopColor="#f0b45c" />
        </linearGradient>
        <linearGradient id="wb-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b2a30" />
          <stop offset="100%" stopColor="#4a4038" />
        </linearGradient>
        <radialGradient id="wb-haze" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffdf9e" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#ffdf9e" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="wb-glass" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="80%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.5} />
        </radialGradient>
      </defs>

      <g transform={`translate(960 560) scale(${push}) translate(-960 -560)`}>
        <g transform={`translate(0 ${bob})`}>
          {/* Sky */}
          <rect width={1920} height={640} fill="url(#wb-sky)" />
          {/* low sun haze at the vanishing point */}
          <circle cx={VX} cy={470} r={430} fill="url(#wb-haze)" />
          {/* distant hills */}
          <path d="M0 560 Q 480 500 960 540 T 1920 540 L1920 640 L0 640 Z" fill="#3c3350" opacity={0.7} filter="url(#dofSoft)" />

          {/* Road */}
          <polygon points={`${VX - 26},${VY} ${VX + 26},${VY} 1500,1080 420,1080`} fill="url(#wb-road)" />
          {/* shoulders */}
          <polygon points={`${VX - 26},${VY} 420,1080 120,1080 ${VX - 60},${VY}`} fill="#39331f" opacity={0.7} />
          <polygon points={`${VX + 26},${VY} 1500,1080 1800,1080 ${VX + 60},${VY}`} fill="#39331f" opacity={0.7} />

          {/* center dashes */}
          {dashes.map((d, i) => (
            <rect key={i} x={VX - d.w / 2} y={d.y} width={d.w} height={d.h} rx={3} fill={palette.paper} opacity={d.o * 0.9} />
          ))}

          {/* telephone poles + drooping wires */}
          {[-1, 1].map((side) =>
            poles(side).map((p, i) => (
              <g key={side + "-" + i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`} opacity={p.o}>
                <rect x={-5} y={-150} width={10} height={190} fill="#1c1710" />
                <rect x={-46} y={-140} width={92} height={9} fill="#1c1710" />
                <rect x={-30} y={-160} width={60} height={8} fill="#1c1710" />
              </g>
            ))
          )}
        </g>

        {/* Faint ghost reflection of a kid's head in the glass (backwards) */}
        <g opacity={interpolate(f, [30, 90], [0, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} filter="url(#dofSoft)">
          <circle cx={1330} cy={640} r={120} fill="#0b0906" />
          <path d="M1210 900 q 120 -230 240 0 Z" fill="#0b0906" />
        </g>
      </g>

      {/* Interior: rear-window frame */}
      <rect width={1920} height={1080} fill="url(#wb-glass)" />
      {/* defroster lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={230} y={230 + i * 56} width={1460} height={2} fill={palette.amber} opacity={0.06} />
      ))}
      {/* window rubber gasket */}
      <rect x={150} y={150} width={1620} height={800} rx={70} fill="none" stroke={palette.black} strokeWidth={70} opacity={0.92} />
      <rect x={0} y={0} width={1920} height={1080} fill="none" stroke={palette.black} strokeWidth={200} opacity={1} />
      {/* rear wiper */}
      <g stroke="#0b0906" strokeWidth={9} opacity={0.55} strokeLinecap="round">
        <line x1={620} y1={900} x2={1180} y2={360} />
        <line x1={615} y1={905} x2={640} y2={890} />
      </g>
    </Stage>
  );
};
