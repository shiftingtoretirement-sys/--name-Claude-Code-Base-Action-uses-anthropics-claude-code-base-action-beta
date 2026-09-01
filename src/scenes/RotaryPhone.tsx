import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Stage, wobble } from "../components/effects";
import { palette } from "../theme";

/** EXHIBIT 06 — the one rotary phone. On the wall. With a cord.
 * It rings (shakes), the dial spins, the coiled cord bounces. */
export const RotaryPhone: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ring bursts: shake during 20-45 and 80-105.
  const ringing = (f > 20 && f < 46) || (f > 80 && f < 106);
  const shake = ringing ? wobble(f, "ring", 10, 1.6) : 0;
  const shakeY = ringing ? wobble(f, "ringy", 6, 2.1) : 0;

  // Dial spins once after the rings (someone answers/dials back).
  const dial = interpolate(f, [120, 165], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pop = spring({ frame: f - 8, fps, config: { damping: 14 } });

  return (
    <Stage>
      {/* Kitchen wall with wallpaper stripes */}
      <rect x={0} y={0} width={1920} height={1080} fill={palette.tan} />
      {Array.from({ length: 24 }).map((_, i) => (
        <rect key={i} x={i * 90} y={0} width={44} height={1080} fill={palette.paper} opacity={0.5} />
      ))}
      {/* tiny wallpaper flowers */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i % 8) * 240 + 120;
        const y = Math.floor(i / 8) * 220 + 90;
        return <circle key={i} cx={x} cy={y} r={8} fill={palette.avocado} opacity={0.3} />;
      })}

      {/* Coiled cord dangling + bouncing */}
      <path
        d={`M960 620
            C ${900 + shake} ${720 + shakeY}, ${1040} ${760 + wobble(f, "c1", 14, 0.5)}, 960 820
            S 900 ${920 + wobble(f, "c2", 18, 0.4)}, 980 980
            S 900 1060, 960 1080`}
        fill="none"
        stroke={palette.charcoal}
        strokeWidth={16}
        strokeLinecap="round"
        opacity={0.9}
      />
      {/* coil rings */}
      {Array.from({ length: 8 }).map((_, i) => {
        const yy = 700 + i * 44 + wobble(f, "co" + i, 6, 0.5);
        return <ellipse key={i} cx={960 + (i % 2 === 0 ? -6 : 6)} cy={yy} rx={34} ry={14} fill="none" stroke={palette.charcoal} strokeWidth={12} opacity={0.85} />;
      })}

      {/* The phone on the wall */}
      <g transform={`translate(${960 + shake} ${360 + shakeY}) scale(${0.85 + pop * 0.18})`} style={{ transformOrigin: "960px 360px" }}>
        {/* backplate */}
        <rect x={-230} y={-190} width={460} height={470} rx={40} fill={palette.harvest} />
        <rect x={-230} y={-190} width={460} height={470} rx={40} fill="none" stroke="#8A6410" strokeWidth={6} />
        {/* handset cradle top */}
        <rect x={-250} y={-250} width={500} height={90} rx={40} fill={palette.brandGold} />
        {/* handset resting on top */}
        <g transform="translate(0 -250)">
          <rect x={-210} y={-40} width={420} height={54} rx={27} fill={palette.charcoal} />
          <circle cx={-210} cy={-13} r={44} fill={palette.charcoal} />
          <circle cx={210} cy={-13} r={44} fill={palette.charcoal} />
          {/* holes */}
          {[-210, 210].map((hx) => (
            <g key={hx}>
              {[[-14, -14], [14, -14], [-14, 14], [14, 14], [0, 0]].map(([ox, oy], k) => (
                <circle key={k} cx={hx + ox} cy={-13 + oy} r={4} fill={palette.faded} />
              ))}
            </g>
          ))}
        </g>
        {/* rotary dial */}
        <g transform="translate(0 60)">
          <circle r={150} fill={palette.cream} />
          <circle r={150} fill="none" stroke="#8A6410" strokeWidth={6} />
          <circle r={40} fill={palette.brown} />
          <g transform={`rotate(${dial})`}>
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
              const hx = Math.cos(a) * 105;
              const hy = Math.sin(a) * 105;
              return (
                <g key={i}>
                  <circle cx={hx} cy={hy} r={26} fill={palette.tan} />
                  <text x={hx} y={hy + 9} textAnchor="middle" fontFamily='"Courier New", monospace' fontWeight={700} fontSize={30} fill={palette.brown}>
                    {(i + 1) % 10}
                  </text>
                </g>
              );
            })}
          </g>
          {/* finger stop */}
          <rect x={120} y={-16} width={40} height={32} rx={8} fill={palette.brown} transform="rotate(58)" />
        </g>
      </g>

      {/* Ring waves */}
      {ringing &&
        [0, 1, 2].map((i) => {
          const t = ((f + i * 8) % 24) / 24;
          return (
            <g key={i} opacity={(1 - t) * 0.7}>
              <path
                d={`M1230 ${300 - i * 10} q ${40 + t * 60} -${20 + t * 30} 0 -${80 + t * 60}`}
                fill="none"
                stroke={palette.rust}
                strokeWidth={8}
                strokeLinecap="round"
                transform={`translate(${t * 40} 0)`}
              />
            </g>
          );
        })}
    </Stage>
  );
};
