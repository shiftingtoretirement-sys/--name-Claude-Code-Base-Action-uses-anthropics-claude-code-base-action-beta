import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Stage, ContactShadow, usePushIn } from "../components/film";
import { palette, fonts } from "../theme";

/** EXHIBIT 08 — the calculator watch, hero macro on a dark reflective desk.
 * The little LCD glows and computes; a stock line rises, far out of focus. */
export const CalculatorWatch: React.FC = () => {
  const f = useCurrentFrame();
  const push = usePushIn(1.0, 1.06);
  const val = Math.floor(interpolate(f, [16, 200], [1240, 3897], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const lcd = val.toLocaleString();
  const activeBtn = Math.floor(f / 6) % 20;
  const spec = interpolate(f % 130, [0, 65, 130], [-1, 1, -1]);

  // faint blurred rising stock line, background
  const line = React.useMemo(() => {
    let d = "M-40 760";
    for (let i = 0; i <= 30; i++) {
      const x = (i / 30) * 2000 - 40;
      const y = 780 - (i / 30) * 300 + Math.sin(i * 0.9) * 34 + (i % 3) * 14;
      d += ` L ${x} ${y}`;
    }
    return d;
  }, []);
  const draw = interpolate(f, [10, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Stage>
      <defs>
        <radialGradient id="cw-bg" cx="42%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#2a2213" />
          <stop offset="60%" stopColor="#120d07" />
          <stop offset="100%" stopColor="#070502" />
        </radialGradient>
        <linearGradient id="cw-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a140b" />
          <stop offset="100%" stopColor="#0a0704" />
        </linearGradient>
        <linearGradient id="cw-bezel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6a6a72" />
          <stop offset="30%" stopColor="#c9c9d2" />
          <stop offset="52%" stopColor="#eef0f5" />
          <stop offset="70%" stopColor="#4a4a52" />
          <stop offset="100%" stopColor="#1c1c22" />
        </linearGradient>
        <linearGradient id="cw-case" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a42" />
          <stop offset="100%" stopColor="#15151a" />
        </linearGradient>
        <linearGradient id="cw-lcd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a7c8a0" />
          <stop offset="100%" stopColor="#7fa585" />
        </linearGradient>
      </defs>

      <rect width={1920} height={1080} fill="url(#cw-bg)" />
      <rect y={620} width={1920} height={460} fill="url(#cw-desk)" />

      {/* far, blurred rising line + bokeh */}
      <g filter="url(#dof)" opacity={0.55}>
        <path d={line} fill="none" stroke={palette.gold} strokeWidth={10} strokeDasharray={3400} strokeDashoffset={3400 * (1 - draw)} opacity={0.5} />
        {[[1500, 240], [1660, 360], [360, 300]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={70} fill={palette.amber} opacity={0.12} />)}
      </g>

      <g transform={`translate(940 560) scale(${push}) translate(-940 -560)`}>
       <g transform="translate(0 -72)">
        {/* reflection beneath */}
        <g transform="translate(940 980) scale(1 -1) translate(-940 -560)" opacity={0.18} filter="url(#dofSoft)">
          <WatchBody lcd="" activeBtn={-1} spec={0} />
        </g>
        <ContactShadow cx={940} cy={790} rx={360} ry={54} opacity={0.6} />
        {/* band curving off into shadow */}
        <path d="M700 560 C 520 470 470 640 300 700 L 320 790 C 520 740 640 720 760 720 Z" fill="#0f0f13" />
        <path d="M1180 560 C 1360 470 1420 640 1600 700 L 1580 800 C 1360 740 1240 720 1120 720 Z" fill="#0f0f13" />

        <WatchBody lcd={lcd} activeBtn={activeBtn} spec={spec} />
       </g>
      </g>
    </Stage>
  );
};

const WatchBody: React.FC<{ lcd: string; activeBtn: number; spec: number }> = ({ lcd, activeBtn, spec }) => (
  <g transform="translate(940 560) rotate(-13)">
    {/* case */}
    <rect x={-260} y={-260} width={520} height={520} rx={70} fill="url(#cw-case)" />
    {/* metal bezel */}
    <rect x={-236} y={-236} width={472} height={472} rx={58} fill="url(#cw-bezel)" />
    <rect x={-200} y={-200} width={400} height={400} rx={42} fill="#17171c" />

    {/* LCD */}
    <rect x={-176} y={-176} width={352} height={150} rx={12} fill="url(#cw-lcd)" />
    <rect x={-176} y={-176} width={352} height={150} rx={12} fill="none" stroke="#25352a" strokeWidth={5} />
    {/* ghost segments */}
    <text x={150} y={-70} textAnchor="end" fontFamily={fonts.sans} fontWeight={600} fontSize={92} fill="#12281a" opacity={0.12} letterSpacing={4}>8,888</text>
    {lcd && <text x={150} y={-70} textAnchor="end" fontFamily={fonts.sans} fontWeight={600} fontSize={92} fill="#12281a" letterSpacing={4}>{lcd}</text>}
    <text x={-160} y={-140} fontFamily={fonts.sans} fontSize={20} fill="#12281a" opacity={0.6} letterSpacing={2}>CALC</text>

    {/* button grid */}
    {Array.from({ length: 20 }).map((_, i) => {
      const col = i % 5, row = Math.floor(i / 5);
      const bx = -176 + col * 74;
      const by = 2 + row * 58;
      const on = i === activeBtn;
      return (
        <g key={i}>
          <rect x={bx} y={by} width={60} height={44} rx={9} fill={on ? "#caa23a" : "#26262c"} stroke="#0c0c10" strokeWidth={2} />
          <rect x={bx + 6} y={by + 5} width={48} height={10} rx={5} fill="#fff" opacity={on ? 0.5 : 0.12} />
        </g>
      );
    })}

    {/* moving specular across bezel */}
    <clipPath id="cw-clip"><rect x={-236} y={-236} width={472} height={472} rx={58} /></clipPath>
    <rect x={-260 + (spec + 1) * 230} y={-300} width={70} height={620} fill="#ffffff" opacity={0.16} clipPath="url(#cw-clip)" transform="skewX(-16)" />
  </g>
);
