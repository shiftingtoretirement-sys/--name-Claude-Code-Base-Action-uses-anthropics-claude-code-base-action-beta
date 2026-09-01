import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Stage, ContactShadow, usePushIn } from "../components/film";
import { palette } from "../theme";

/** EXHIBIT 03 — a single lawn dart standing in the grass at dusk. Low angle,
 * long shadow, the steel tip catching the last light. Quietly ominous. */
export const LawnDarts: React.FC = () => {
  const f = useCurrentFrame();
  const push = usePushIn(1.02, 1.09);
  const glint = interpolate(f % 110, [0, 55, 110], [-1, 1, -1]);

  const Dart: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
    <g transform={`scale(${scale})`}>
      {/* fins */}
      <path d="M0 -250 L 40 -320 L 40 -238 L 0 -206 Z" fill="#9a7a2c" />
      <path d="M0 -250 L -40 -320 L -40 -238 L 0 -206 Z" fill="#7d5f24" />
      <path d="M0 -250 L 16 -330 L 0 -318 L -16 -330 Z" fill="#8a3b26" />
      {/* shaft (aluminium) */}
      <rect x={-9} y={-250} width={18} height={190} rx={5} fill="url(#ld-alum)" />
      {/* weighted body */}
      <path d="M-13 -60 Q -13 -74 0 -74 Q 13 -74 13 -60 L 9 0 L -9 0 Z" fill="url(#ld-alum)" />
      {/* steel spike into ground */}
      <path d="M-9 0 L 9 0 L 2 96 L -2 96 Z" fill="url(#ld-steel)" />
      {/* tip glint */}
      <rect x={-9 + (glint + 1) * 8} y={-250} width={4} height={150} fill="#fff7dd" opacity={0.5} />
    </g>
  );

  return (
    <Stage>
      <defs>
        <linearGradient id="ld-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#20283a" />
          <stop offset="60%" stopColor="#5a4327" />
          <stop offset="100%" stopColor="#9a6d34" />
        </linearGradient>
        <linearGradient id="ld-alum" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a3a40" />
          <stop offset="45%" stopColor="#cfcfd6" />
          <stop offset="60%" stopColor="#f2f2f6" />
          <stop offset="100%" stopColor="#2c2c32" />
        </linearGradient>
        <linearGradient id="ld-steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#26262b" />
          <stop offset="50%" stopColor="#b9bcc4" />
          <stop offset="100%" stopColor="#1a1a1e" />
        </linearGradient>
        <linearGradient id="ld-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f461f" />
          <stop offset="100%" stopColor="#161a0c" />
        </linearGradient>
      </defs>

      {/* Dusk sky + ground */}
      <rect width={1920} height={1080} fill="url(#ld-sky)" />
      <path d="M0 700 Q 960 640 1920 700 L1920 1080 L0 1080 Z" fill="url(#ld-grass)" />
      {/* low sun bloom */}
      <circle cx={1360} cy={640} r={260} fill="#f2b24e" opacity={0.28} filter="url(#glowBig)" />

      {/* Background: blurred target ring + a second dart, out of focus */}
      <g filter="url(#dof)" opacity={0.9}>
        <ellipse cx={1230} cy={790} rx={210} ry={60} fill="none" stroke={palette.paper} strokeWidth={12} opacity={0.4} />
        <ellipse cx={1230} cy={790} rx={120} ry={34} fill="none" stroke={palette.clay} strokeWidth={10} opacity={0.4} />
        <g transform="translate(1360 730) rotate(24) scale(0.7)" opacity={0.7}>
          <path d="M0 -250 L 40 -320 L 40 -238 L 0 -206 Z" fill="#9a7a2c" />
          <rect x={-9} y={-250} width={18} height={250} rx={5} fill="#8a8a90" />
        </g>
      </g>

      {/* Hero dart with long shadow */}
      <g transform={`translate(760 620) scale(${push}) translate(-760 -620)`}>
        {/* long cast shadow across grass */}
        <g transform="translate(760 812) rotate(-8)">
          <ellipse cx={220} cy={0} rx={300} ry={20} fill="#000" opacity={0.4} filter="url(#glow)" />
        </g>
        <ContactShadow cx={760} cy={812} rx={70} ry={16} opacity={0.6} />
        <g transform="translate(760 812) rotate(9)">
          <Dart scale={1} />
        </g>
      </g>

      {/* Foreground grass blades, blurred, framing the base */}
      <g filter="url(#dofSoft)">
        {Array.from({ length: 26 }).map((_, i) => {
          const gx = (i * 82 + 20) % 1920;
          const hh = 90 + ((i * 53) % 130);
          const sway = Math.sin(f * 0.05 + i) * 10;
          return <path key={i} d={`M${gx} 1080 q ${sway} -${hh * 0.6} ${sway * 0.3} -${hh}`} stroke="#12160a" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.85} />;
        })}
      </g>
    </Stage>
  );
};
