import React from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { Stage, usePushIn } from "../components/film";
import { palette } from "../theme";

/** EXHIBIT 04 — a worn brass house key on a knotted shoelace, hanging in a
 * shaft of warm light. Macro, shallow focus, dust motes drifting. */
export const KeyOnShoelace: React.FC = () => {
  const f = useCurrentFrame();
  const push = usePushIn(1.0, 1.05);
  const sway = Math.sin(f * 0.045) * 4.5; // slow pendulum, degrees
  const glint = interpolate(f % 120, [0, 60, 120], [-1, 1, -1]);

  return (
    <Stage>
      <defs>
        <radialGradient id="k-bg" cx="52%" cy="34%" r="75%">
          <stop offset="0%" stopColor="#3a2c17" />
          <stop offset="55%" stopColor="#1a130a" />
          <stop offset="100%" stopColor="#0b0805" />
        </radialGradient>
        <linearGradient id="k-brass" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#6a4f1f" />
          <stop offset="38%" stopColor="#c79a3d" />
          <stop offset="52%" stopColor="#f4dd93" />
          <stop offset="66%" stopColor="#b98b3e" />
          <stop offset="100%" stopColor="#4a3315" />
        </linearGradient>
        <linearGradient id="k-lace" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a7d5f" />
          <stop offset="50%" stopColor="#d8cba3" />
          <stop offset="100%" stopColor="#6f6244" />
        </linearGradient>
        <clipPath id="k-clip" clipPathUnits="userSpaceOnUse">
          <circle cx={960} cy={470} r={104} />
        </clipPath>
      </defs>

      <rect width={1920} height={1080} fill="url(#k-bg)" />
      {/* light shaft from top */}
      <polygon points="820,-40 1100,-40 1360,1120 560,1120" fill="#f2c46a" opacity={0.06} filter="url(#glowBig)" />

      {/* drifting dust motes */}
      {Array.from({ length: 30 }).map((_, i) => {
        const speed = 8 + random("s" + i) * 20;
        const y = (1120 - ((f * speed * 0.02 + random("y" + i) * 1120) % 1160));
        const x = 300 + random("x" + i) * 1320 + Math.sin(f * 0.02 + i) * 20;
        const r = 1 + random("r" + i) * 3;
        const o = 0.1 + random("o" + i) * 0.35;
        return <circle key={i} cx={x} cy={y} r={r} fill={palette.amber} opacity={o} filter="url(#glow)" />;
      })}

      {/* Everything hangs from the top; sway rotates about the anchor */}
      <g transform={`translate(960 200) scale(${push}) translate(-960 -200)`}>
        <g transform={`rotate(${sway} 960 120)`}>
          {/* shoelace to the key hole */}
          <path d="M780 60 C 850 260, 900 300, 940 360" fill="none" stroke="url(#k-lace)" strokeWidth={13} strokeLinecap="round" />
          <path d="M1140 60 C 1070 260, 1020 300, 980 360" fill="none" stroke="url(#k-lace)" strokeWidth={13} strokeLinecap="round" />
          {/* knot through the bow */}
          <ellipse cx={960} cy={372} rx={26} ry={18} fill="url(#k-lace)" />

          {/* KEY */}
          <g>
            {/* bow (head) */}
            <circle cx={960} cy={470} r={104} fill="url(#k-brass)" />
            <circle cx={960} cy={470} r={104} fill="none" stroke="#7a5a20" strokeWidth={4} />
            <circle cx={960} cy={452} r={46} fill="#211809" />
            <circle cx={960} cy={452} r={46} fill="none" stroke="#8a6a2a" strokeWidth={5} />
            {/* shoulder + blade */}
            <rect x={938} y={560} width={44} height={330} rx={8} fill="url(#k-brass)" />
            {/* teeth cut on right edge */}
            <path d="M982 640 l 0 24 l -20 0 l 0 22 l 20 0 l 0 30 l -16 0 l 0 22 l 16 0 l 0 34 l -22 0 l 0 22 l 22 0 l 0 40 l -44 0 l 0 -290 Z" fill="#0f0a04" opacity={0.35} />
            <path d="M982 640 l 0 24 l -20 0 l 0 22 l 20 0 l 0 30 l -16 0 l 0 22 l 16 0 l 0 34 l -22 0 l 0 22 l 22 0 l 0 40" fill="none" stroke="#3a2a10" strokeWidth={3} />
            {/* worn specular on the blade */}
            <rect x={946} y={560} width={10} height={330} rx={5} fill="#fdf1c0" opacity={0.55} />
            {/* moving glint across the bow, clipped to the head */}
            <g clipPath="url(#k-clip)">
              <rect x={860 + (glint + 1) * 90} y={360} width={30} height={220} fill="#fff6d8" opacity={0.5} />
            </g>
          </g>
        </g>
      </g>
    </Stage>
  );
};
