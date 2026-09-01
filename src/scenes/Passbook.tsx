import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, ContactShadow, usePushIn } from "../components/film";
import { palette, fonts } from "../theme";

/** EXHIBIT 07 — a savings passbook in the pool of a banker's lamp. A rubber
 * stamp comes down, thunks, and a new balance is posted by hand. */
export const Passbook: React.FC = () => {
  const f = useCurrentFrame();
  const push = usePushIn(1.0, 1.045);

  const stampCycle = interpolate(f, [44, 74, 80, 116], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const stampY = interpolate(stampCycle, [0, 1], [-300, 8]);
  const thunk = f >= 74 && f <= 82;
  const mark = interpolate(f, [76, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const newLine = interpolate(f, [100, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rows = [
    ["03·14·84", "DEP", "25.00", "25.00"],
    ["05·02·84", "DEP", "40.00", "65.00"],
    ["07·19·84", "INT", "1.12", "66.12"],
    ["09·06·84", "DEP", "50.00", "116.12"],
  ];

  return (
    <Stage>
      <defs>
        <radialGradient id="pb-lamp" cx="46%" cy="30%" r="62%">
          <stop offset="0%" stopColor="#ffe6a6" stopOpacity={0.85} />
          <stop offset="60%" stopColor="#c98a3e" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="pb-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1c0e" />
          <stop offset="100%" stopColor="#120b05" />
        </linearGradient>
        <linearGradient id="pb-page" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4ecd6" />
          <stop offset="100%" stopColor="#d8caa6" />
        </linearGradient>
        <linearGradient id="pb-cover" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2f6360" />
          <stop offset="100%" stopColor="#173432" />
        </linearGradient>
      </defs>

      {/* counter + light pool */}
      <rect width={1920} height={1080} fill="url(#pb-wood)" />
      <rect width={1920} height={1080} fill="url(#pb-lamp)" />
      {/* hint of the green banker's-lamp shade, blurred, top */}
      <g filter="url(#dof)"><ellipse cx={640} cy={40} rx={360} ry={120} fill="#1c4f3a" opacity={0.5} /></g>

      <g transform={`translate(960 560) scale(${push}) translate(-960 -560)`}>
        {/* passbook, slight perspective, lifted clear of the title block */}
        <g transform="translate(960 460) rotate(-3)">
          <ContactShadow cx={0} cy={250} rx={560} ry={54} opacity={0.55} />
          <rect x={-560} y={-300} width={1120} height={560} rx={16} fill="url(#pb-cover)" />
          <rect x={-524} y={-270} width={1048} height={500} rx={8} fill="url(#pb-page)" />
          <rect x={-524} y={-270} width={1048} height={500} rx={8} fill="none" stroke="#b7a67e" strokeWidth={2} />
          <rect x={-6} y={-270} width={12} height={500} fill="#7c6c46" opacity={0.35} />

          {/* header */}
          <text x={-470} y={-196} fontFamily={fonts.display} fontStyle="italic" fontWeight={700} fontSize={52} fill="#1f4b48">First Savings &amp; Loan</text>
          <text x={-470} y={-150} fontFamily={fonts.sans} fontSize={22} fill="#6a5a38" letterSpacing={5}>PASSBOOK · ACCT 0041-77</text>
          <line x1={-470} y1={-128} x2={470} y2={-128} stroke="#b7a67e" strokeWidth={2} />

          {["DATE", "TX", "AMOUNT", "BALANCE"].map((c, i) => (
            <text key={c} x={[-470, -150, 60, 320][i]} y={-88} fontFamily={fonts.sans} fontSize={20} fill="#8a7850" letterSpacing={3}>{c}</text>
          ))}

          {rows.map((r, i) => (
            <g key={i} transform={`translate(0 ${-42 + i * 50})`} fontFamily={fonts.sans} fontSize={30}>
              <text x={-470} y={0} fill="#2a2113">{r[0]}</text>
              <text x={-150} y={0} fill="#2a2113">{r[1]}</text>
              <text x={60} y={0} fill="#2a2113">{r[2]}</text>
              <text x={320} y={0} fill="#1f4b48" fontWeight={600}>{r[3]}</text>
            </g>
          ))}

          {/* new posted line */}
          <g transform="translate(0 158)" fontFamily={fonts.sans} fontSize={30} opacity={newLine}>
            <text x={-470} y={0} fill="#2a2113">11·22·84</text>
            <text x={-150} y={0} fill="#2a2113">DEP</text>
            <text x={60} y={0} fill="#2a2113">75.00</text>
            <text x={320} y={0} fill="#1f4b48" fontWeight={600}>191.12</text>
          </g>

          {/* red POSTED impression */}
          <g transform="translate(300 108) rotate(-11)" opacity={mark}>
            <rect x={-128} y={-48} width={256} height={96} rx={10} fill="none" stroke={palette.rust} strokeWidth={6} opacity={0.85} />
            <text x={0} y={-4} textAnchor="middle" fontFamily={fonts.sans} fontSize={34} fontWeight={600} fill={palette.rust} letterSpacing={4} opacity={0.85}>POSTED</text>
            <text x={0} y={32} textAnchor="middle" fontFamily={fonts.sans} fontSize={22} fill={palette.rust} opacity={0.8}>NOV 22 '84</text>
          </g>
        </g>

        {/* descending stamp */}
        <g transform={`translate(1240 ${300 + stampY})`}>
          {thunk && [0, 1].map((i) => <ellipse key={i} cx={0} cy={210} rx={70 + i * 46} ry={18 + i * 9} fill="none" stroke={palette.rust} strokeWidth={4} opacity={0.4 - i * 0.18} />)}
          <rect x={-34} y={-170} width={68} height={160} rx={18} fill="#2a1c0e" />
          <rect x={-34} y={-170} width={26} height={160} rx={13} fill="#4a3218" />
          <rect x={-78} y={-16} width={156} height={78} rx={14} fill="#3a2814" />
          <rect x={-92} y={58} width={184} height={30} rx={8} fill={palette.rust} />
        </g>
      </g>
    </Stage>
  );
};
