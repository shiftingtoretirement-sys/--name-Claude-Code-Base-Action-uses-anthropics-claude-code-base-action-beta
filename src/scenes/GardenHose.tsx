import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Stage, ContactShadow, usePushIn } from "../components/film";
import { palette } from "../theme";

/** EXHIBIT 01 — a brass hose nozzle, backlit at golden hour, water arcing in
 * rim-lit droplets. Macro, shallow focus. No people; the memory is the light. */
export const GardenHose: React.FC = () => {
  const f = useCurrentFrame();
  const push = usePushIn(1.0, 1.06);
  const flow = f * 0.9;

  // Water droplets travelling along the arc, catching the backlight.
  const drops = Array.from({ length: 34 }).map((_, i) => {
    const t = ((flow + i * 7) % 130) / 130;
    const x = interpolate(t, [0, 1], [640, 1580]);
    const y = 640 - Math.sin(t * Math.PI) * 360 + t * 40;
    const r = 3 + (i % 4) * 2.2;
    const o = Math.sin(t * Math.PI) * 0.9 + 0.1;
    return { x, y, r, o };
  });

  return (
    <Stage>
      <defs>
        <radialGradient id="gh-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE9B0" />
          <stop offset="35%" stopColor="#F2B24E" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#F2B24E" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="gh-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6b5324" />
          <stop offset="42%" stopColor="#d9ad55" />
          <stop offset="55%" stopColor="#f6e2a0" />
          <stop offset="70%" stopColor="#b98b3e" />
          <stop offset="100%" stopColor="#4a3a1c" />
        </linearGradient>
        <linearGradient id="gh-grip" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#20160b" />
          <stop offset="50%" stopColor="#6b4a24" />
          <stop offset="100%" stopColor="#1c130a" />
        </linearGradient>
      </defs>

      {/* Dusk-backyard ground */}
      <rect width={1920} height={1080} fill={palette.espresso} />
      <rect y={520} width={1920} height={560} fill="#2a2c17" opacity={0.9} />

      {/* Out-of-focus greenery + bokeh (blurred) */}
      <g filter="url(#dof)" opacity={0.9}>
        <rect y={560} width={1920} height={520} fill="#33361c" />
        {Array.from({ length: 16 }).map((_, i) => {
          const bx = (i * 173 + 60) % 1920;
          const by = 700 + ((i * 97) % 320);
          const s = 30 + (i % 5) * 26;
          return <circle key={i} cx={bx} cy={by} r={s} fill={i % 3 ? "#5c6a2f" : palette.amber} opacity={0.14} />;
        })}
      </g>

      {/* Sun flare, upper right, blooming */}
      <circle cx={1500} cy={300} r={520} fill="url(#gh-sun)" />
      <circle cx={1500} cy={300} r={90} fill="#FFF6DC" filter="url(#glowBig)" opacity={0.9} />

      {/* Slow push-in group */}
      <g transform={`translate(960 560) scale(${push}) translate(-960 -560)`}>
        {/* Water arc — soft stream underlay */}
        <path d="M660 650 C 900 240 1240 200 1560 470" fill="none" stroke="#cfe7ee" strokeWidth={26} strokeLinecap="round" opacity={0.14} filter="url(#dofSoft)" />
        {/* rim-lit droplets */}
        {drops.map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={d.r * 2.4} fill="#FFE9C0" opacity={d.o * 0.25} filter="url(#glow)" />
            <circle cx={d.x} cy={d.y} r={d.r} fill="#eaf6fb" opacity={d.o} />
            <circle cx={d.x - d.r * 0.3} cy={d.y - d.r * 0.3} r={d.r * 0.4} fill="#fff" opacity={d.o} />
          </g>
        ))}

        {/* Mist near nozzle */}
        <ellipse cx={700} cy={640} rx={130} ry={70} fill="#dfeef2" opacity={0.08} filter="url(#glow)" />

        {/* Brass nozzle, lower-left, angled up toward the arc */}
        <g transform="translate(560 720) rotate(-34)">
          <ContactShadow cx={40} cy={130} rx={150} ry={26} opacity={0.5} />
          {/* rubber grip / hose end */}
          <rect x={-40} y={40} width={150} height={70} rx={22} fill="url(#gh-grip)" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={-30 + i * 30} y={40} width={8} height={70} rx={4} fill="#000" opacity={0.28} />
          ))}
          {/* body */}
          <rect x={70} y={44} width={230} height={62} rx={16} fill="url(#gh-brass)" />
          {/* threaded collar */}
          <rect x={286} y={40} width={30} height={70} rx={8} fill="url(#gh-brass)" />
          {/* tapered tip */}
          <path d="M316 52 L 402 66 L 402 84 L 316 98 Z" fill="url(#gh-brass)" />
          <circle cx={402} cy={75} r={9} fill="#dff2f6" opacity={0.9} filter="url(#glow)" />
          {/* specular streak */}
          <rect x={80} y={50} width={210} height={7} rx={4} fill="#fff6d8" opacity={0.6} />
        </g>
      </g>
    </Stage>
  );
};
