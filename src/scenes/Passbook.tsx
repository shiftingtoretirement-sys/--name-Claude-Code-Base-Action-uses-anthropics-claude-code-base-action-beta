import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { Stage } from "../components/effects";
import { palette, fonts } from "../theme";

/** EXHIBIT 07 — the passbook savings account. A little paper book, stamped
 * by hand at the teller window. A rubber stamp thunks down and a new balance
 * line appears. "That was the whole app." */
export const Passbook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame: f - 8, fps, config: { damping: 16 } });

  // The stamp descends, thunks at ~frame 70, lifts.
  const stampCycle = interpolate(f, [40, 70, 74, 110], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const stampY = interpolate(stampCycle, [0, 1], [-260, 20]);
  const thunk = f >= 70 && f <= 76;
  const stampMark = interpolate(f, [72, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // New balance line writes in after the stamp.
  const lineReveal = interpolate(f, [96, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rows = [
    ["03-14-84", "DEP", "25.00", "  25.00"],
    ["05-02-84", "DEP", "40.00", "  65.00"],
    ["07-19-84", "INT", " 1.12", "  66.12"],
    ["09-06-84", "DEP", "50.00", " 116.12"],
  ];

  return (
    <Stage>
      {/* Teller counter surface */}
      <rect x={0} y={0} width={1920} height={1080} fill={palette.brown} />
      <rect x={0} y={640} width={1920} height={440} fill={palette.darkBrown} />
      <rect x={0} y={632} width={1920} height={16} fill={palette.brandGold} opacity={0.5} />

      {/* The open passbook */}
      <g transform={`translate(960 560) scale(${0.9 + pop * 0.12})`} style={{ transformOrigin: "960px 560px" }}>
        {/* shadow */}
        <ellipse cx={0} cy={250} rx={520} ry={60} fill="#000" opacity={0.3} />
        {/* covers */}
        <rect x={-520} y={-280} width={1040} height={540} rx={16} fill={palette.teal} />
        {/* pages */}
        <rect x={-490} y={-250} width={980} height={480} rx={8} fill={palette.cream} />
        {/* center gutter */}
        <rect x={-6} y={-250} width={12} height={480} fill={palette.faded} opacity={0.5} />

        {/* Bank header */}
        <text x={-440} y={-190} fontFamily={fonts.serif} fontStyle="italic" fontSize={40} fill={palette.teal} fontWeight={700}>
          First Savings &amp; Loan
        </text>
        <text x={-440} y={-150} fontFamily={fonts.mono} fontSize={22} fill={palette.brown} letterSpacing={3}>
          PASSBOOK · ACCT 0041-77
        </text>
        <line x1={-440} y1={-128} x2={440} y2={-128} stroke={palette.faded} strokeWidth={2} />

        {/* column labels */}
        <text x={-440} y={-92} fontFamily={fonts.mono} fontSize={22} fill={palette.brown} letterSpacing={2}>DATE</text>
        <text x={-150} y={-92} fontFamily={fonts.mono} fontSize={22} fill={palette.brown} letterSpacing={2}>TX</text>
        <text x={40} y={-92} fontFamily={fonts.mono} fontSize={22} fill={palette.brown} letterSpacing={2}>AMOUNT</text>
        <text x={300} y={-92} fontFamily={fonts.mono} fontSize={22} fill={palette.brown} letterSpacing={2}>BALANCE</text>

        {/* existing rows */}
        {rows.map((r, i) => (
          <g key={i} transform={`translate(0 ${-50 + i * 46})`} fontFamily={fonts.mono} fontSize={30} fill={palette.ink}>
            <text x={-440} y={0}>{r[0]}</text>
            <text x={-150} y={0}>{r[1]}</text>
            <text x={40} y={0}>{r[2]}</text>
            <text x={300} y={0} fill={palette.teal} fontWeight={700}>{r[3]}</text>
          </g>
        ))}

        {/* the freshly stamped new row */}
        <g transform="translate(0 138)" fontFamily={fonts.mono} fontSize={30} opacity={lineReveal} fill={palette.ink}>
          <rect x={-460} y={-30} width={920} height={42} fill={palette.brandGold} opacity={0.15 * lineReveal} />
          <text x={-440} y={0}>11-22-84</text>
          <text x={-150} y={0}>DEP</text>
          <text x={40} y={0}>75.00</text>
          <text x={300} y={0} fill={palette.teal} fontWeight={700}> 191.12</text>
        </g>

        {/* red stamp impression */}
        <g transform="translate(230 96)" opacity={stampMark}>
          <g transform="rotate(-12)">
            <rect x={-120} y={-46} width={240} height={92} rx={10} fill="none" stroke={palette.rust} strokeWidth={7} />
            <text x={0} y={-6} textAnchor="middle" fontFamily='"Arial Black", sans-serif' fontSize={30} fill={palette.rust} fontWeight={900} letterSpacing={2}>POSTED</text>
            <text x={0} y={30} textAnchor="middle" fontFamily={fonts.mono} fontSize={22} fill={palette.rust}>NOV 22 '84</text>
          </g>
        </g>
      </g>

      {/* The descending rubber stamp */}
      <g transform={`translate(1190 ${360 + stampY})`}>
        {/* impact rings */}
        {thunk &&
          [0, 1].map((i) => (
            <ellipse key={i} cx={0} cy={200} rx={60 + i * 40} ry={16 + i * 8} fill="none" stroke={palette.rust} strokeWidth={4} opacity={0.5 - i * 0.2} />
          ))}
        <rect x={-30} y={-160} width={60} height={150} rx={16} fill={palette.charcoal} />
        <rect x={-70} y={-14} width={140} height={70} rx={12} fill={palette.brown} />
        <rect x={-84} y={54} width={168} height={30} rx={8} fill={palette.rust} />
      </g>
    </Stage>
  );
};
