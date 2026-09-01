import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Stage } from "../components/effects";
import { palette, fonts } from "../theme";

/** EXHIBIT 08 — the one guy at work with the calculator watch. He "did stocks."
 * A wrist raised to camera, the calculator watch hero-lit, tiny digits ticking,
 * a ghostly stock line ticking up behind him. */
export const CalculatorWatch: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f - 10, fps, config: { damping: 15 } });

  // Rolling "computed" figure on the LCD.
  const val = Math.floor(interpolate(f, [20, 180], [1240, 3897], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const lcd = val.toLocaleString();

  // Buttons light up in sequence like he's punching numbers.
  const activeBtn = Math.floor(f / 6) % 20;

  // Rising stock line behind.
  const pts = 40;
  const linePath = React.useMemo(() => {
    let d = "M0 700";
    for (let i = 0; i <= pts; i++) {
      const x = (i / pts) * 1920;
      const base = 720 - (i / pts) * 360;
      const jag = Math.sin(i * 0.9) * 40 + (i % 3) * 18;
      d += ` L ${x} ${base + jag}`;
    }
    return d;
  }, []);
  const lineDraw = interpolate(f, [10, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Stage>
      {/* office-ish backdrop from bg; ghost stock chart */}
      <g opacity={0.22}>
        {/* grid */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={"h" + i} x1={0} y1={i * 108} x2={1920} y2={i * 108} stroke={palette.brandGold} strokeWidth={1} />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={"v" + i} x1={i * 128} y1={0} x2={i * 128} y2={1080} stroke={palette.brandGold} strokeWidth={1} />
        ))}
      </g>
      <path
        d={linePath}
        fill="none"
        stroke={palette.brandGold}
        strokeWidth={8}
        strokeDasharray={4000}
        strokeDashoffset={4000 * (1 - lineDraw)}
        opacity={0.5}
      />
      {/* up-arrow ticker chip */}
      <g transform="translate(1560 210)" opacity={interpolate(f, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
        <rect x={-110} y={-40} width={220} height={80} rx={12} fill={palette.avocado} />
        <path d="M-70 20 L -40 -18 L -10 6 L 40 -30" stroke={palette.bone} strokeWidth={7} fill="none" />
        <path d="M40 -30 l -22 2 l 8 20 Z" fill={palette.bone} />
        <text x={60} y={12} fontFamily={fonts.mono} fontSize={30} fontWeight={700} fill={palette.bone}>+9%</text>
      </g>

      {/* Forearm + wrist raised, sleeve rolled up */}
      <g transform={`translate(960 640) scale(${0.92 + pop * 0.1})`} style={{ transformOrigin: "960px 640px" }}>
        {/* arm */}
        <path d="M-360 440 Q -120 300 40 120 L 300 300 Q 180 460 -120 620 Z" fill={palette.tan} />
        {/* rolled shirt sleeve */}
        <path d="M-360 440 Q -260 380 -190 470 L -300 640 Q -400 560 -360 440 Z" fill={palette.teal} />
        <path d="M-300 430 q 60 30 120 20" stroke="#1f5252" strokeWidth={16} fill="none" />

        {/* Watch band */}
        <g transform="rotate(-32) translate(60 -40)">
          <rect x={-150} y={-40} width={130} height={80} rx={16} fill={palette.charcoal} />
          <rect x={140} y={-40} width={130} height={80} rx={16} fill={palette.charcoal} />
          {/* watch body */}
          <rect x={-140} y={-150} width={300} height={300} rx={40} fill="#2A2A30" />
          <rect x={-140} y={-150} width={300} height={300} rx={40} fill="none" stroke="#4a4a52" strokeWidth={6} />
          {/* LCD */}
          <rect x={-104} y={-118} width={228} height={92} rx={10} fill="#8FB89A" />
          <rect x={-104} y={-118} width={228} height={92} rx={10} fill="none" stroke="#20302a" strokeWidth={4} />
          <text x={112} y={-48} textAnchor="end" fontFamily={fonts.mono} fontWeight={700} fontSize={64} fill="#12281a" letterSpacing={2}>
            {lcd}
          </text>
          {/* button grid */}
          {Array.from({ length: 20 }).map((_, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const bx = -104 + col * 46 + 14;
            const by = 6 + row * 34;
            const on = i === activeBtn;
            return (
              <rect
                key={i}
                x={bx}
                y={by}
                width={34}
                height={24}
                rx={5}
                fill={on ? palette.brandGold : "#3a3a42"}
                stroke="#111"
                strokeWidth={1.5}
              />
            );
          })}
        </g>
      </g>

      {/* Hero glint sweeping the watch */}
      <g opacity={0.7}>
        <rect
          x={interpolate(f % 80, [0, 80], [700, 1200])}
          y={380}
          width={30}
          height={360}
          fill={palette.bone}
          opacity={0.12}
          transform="skewX(-18)"
        />
      </g>
    </Stage>
  );
};
