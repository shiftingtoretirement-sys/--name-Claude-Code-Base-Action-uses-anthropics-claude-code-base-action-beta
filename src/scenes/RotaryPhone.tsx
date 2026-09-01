import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Stage, ContactShadow, usePushIn, wobble } from "../components/film";
import { palette, fonts } from "../theme";

/** EXHIBIT 06 — a molded wall phone under warm tungsten light. Shallow focus,
 * coiled cord hanging into shadow. It rings; the dial waits. */
export const RotaryPhone: React.FC = () => {
  const f = useCurrentFrame();
  const push = usePushIn(1.0, 1.05);
  const ringing = (f > 24 && f < 50) || (f > 92 && f < 118);
  const sx = ringing ? wobble(f, "rx", 6, 1.7) : 0;
  const sy = ringing ? wobble(f, "ry", 4, 2.2) : 0;
  const spec = interpolate(f % 140, [0, 70, 140], [-1, 1, -1]);

  return (
    <Stage>
      <defs>
        <radialGradient id="ph-bg" cx="60%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#3c2c18" />
          <stop offset="60%" stopColor="#1c140b" />
          <stop offset="100%" stopColor="#0a0705" />
        </radialGradient>
        <linearGradient id="ph-body" x1="0" y1="0" x2="1" y2="0.7">
          <stop offset="0%" stopColor="#efd9a6" />
          <stop offset="42%" stopColor="#d8b877" />
          <stop offset="70%" stopColor="#9c7a40" />
          <stop offset="100%" stopColor="#4e3a1c" />
        </linearGradient>
        <radialGradient id="ph-dial" cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#f3ecd7" />
          <stop offset="70%" stopColor="#d7c9a4" />
          <stop offset="100%" stopColor="#93835c" />
        </radialGradient>
        <linearGradient id="ph-hand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7cf98" />
          <stop offset="55%" stopColor="#b7934e" />
          <stop offset="100%" stopColor="#3c2c15" />
        </linearGradient>
        <linearGradient id="ph-chrome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a5a60" />
          <stop offset="50%" stopColor="#e8e8ee" />
          <stop offset="100%" stopColor="#3a3a40" />
        </linearGradient>
      </defs>

      <rect width={1920} height={1080} fill="url(#ph-bg)" />
      {/* bokeh window highlight, blurred */}
      <g filter="url(#dof)"><circle cx={1560} cy={300} r={150} fill={palette.amber} opacity={0.16} /></g>

      <g transform={`translate(960 540) scale(${push}) translate(-960 -540)`}>
        <g transform={`translate(${sx} ${sy})`}>
          {/* coiled cord into shadow */}
          <path d="M960 720 C 900 820, 1030 860, 970 940 S 900 1060 960 1120" fill="none" stroke="#241a0d" strokeWidth={20} strokeLinecap="round" />
          {Array.from({ length: 9 }).map((_, i) => {
            const yy = 720 + i * 46 + wobble(f, "cc" + i, 4, 0.5);
            return <ellipse key={i} cx={960 + (i % 2 ? 8 : -8)} cy={yy} rx={34} ry={13} fill="none" stroke="#2c2010" strokeWidth={13} />;
          })}

          <ContactShadow cx={975} cy={745} rx={250} ry={40} opacity={0.6} />

          {/* body */}
          <rect x={740} y={250} width={440} height={500} rx={54} fill="url(#ph-body)" />
          <rect x={740} y={250} width={440} height={500} rx={54} fill="none" stroke="#3a2a14" strokeWidth={3} opacity={0.6} />
          {/* top highlight */}
          <rect x={772} y={266} width={376} height={40} rx={20} fill="#fff4d6" opacity={0.3} />

          {/* handset cradle + resting handset */}
          <g transform="translate(960 232)">
            <ellipse cx={0} cy={20} rx={220} ry={30} fill="#3a2a14" opacity={0.5} />
            <rect x={-210} y={-30} width={420} height={52} rx={26} fill="url(#ph-hand)" />
            <ellipse cx={-210} cy={-4} rx={54} ry={44} fill="url(#ph-hand)" />
            <ellipse cx={210} cy={-4} rx={54} ry={44} fill="url(#ph-hand)" />
            {[-210, 210].map((hx) => (
              <g key={hx}>
                {[[-13, -12], [13, -12], [-13, 13], [13, 13], [0, 0]].map(([ox, oy], k) => (
                  <circle key={k} cx={hx + ox} cy={-4 + oy} r={3.4} fill="#2a1e0e" />
                ))}
              </g>
            ))}
            <rect x={-190} y={-28} width={380} height={10} rx={5} fill="#fff2cf" opacity={0.35} />
          </g>

          {/* rotary dial */}
          <g transform="translate(960 520)">
            <circle r={168} fill="url(#ph-dial)" />
            <circle r={168} fill="none" stroke="#3a2a14" strokeWidth={4} opacity={0.5} />
            <circle r={44} fill="#2a1e0e" />
            <circle r={44} fill="none" stroke="#6a512a" strokeWidth={4} />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2 - Math.PI / 2 + 0.16;
              const hx = Math.cos(a) * 118;
              const hy = Math.sin(a) * 118;
              return (
                <g key={i}>
                  <circle cx={hx} cy={hy} r={27} fill="#2a1e0e" opacity={0.5} />
                  <circle cx={hx} cy={hy} r={22} fill="url(#ph-dial)" />
                  <text x={hx} y={hy + 10} textAnchor="middle" fontFamily={fonts.sans} fontWeight={600} fontSize={30} fill="#4a3818">
                    {(i + 1) % 10}
                  </text>
                </g>
              );
            })}
            {/* chrome finger stop */}
            <g transform="rotate(56)"><rect x={132} y={-18} width={44} height={36} rx={10} fill="url(#ph-chrome)" /></g>
            {/* moving specular on the dial */}
            <clipPath id="ph-dclip"><circle r={168} /></clipPath>
            <rect x={-40 + spec * 150} y={-190} width={54} height={380} fill="#fff" opacity={0.14} clipPath="url(#ph-dclip)" transform="skewX(-14)" />
          </g>
        </g>
      </g>

      {/* ring waves */}
      {ringing &&
        [0, 1, 2].map((i) => {
          const t = ((f + i * 8) % 24) / 24;
          return (
            <path key={i} d={`M1230 ${360 - i * 14} q ${50 + t * 70} -${26 + t * 34} 0 -${100 + t * 68}`} fill="none" stroke={palette.amber} strokeWidth={7} strokeLinecap="round" opacity={(1 - t) * 0.6} transform={`translate(${t * 44} 0)`} />
          );
        })}
    </Stage>
  );
};
