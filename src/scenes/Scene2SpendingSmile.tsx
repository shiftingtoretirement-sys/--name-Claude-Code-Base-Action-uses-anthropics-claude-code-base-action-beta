import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { HazardFrame } from "../components/HazardFrame";
import { hazardStripeBackground } from "../components/HazardStripes";
import {
  HouseIcon,
  MedicalIcon,
  SuitcaseIcon,
} from "../components/Icons";
import { COLORS, CONDENSED_FONT, DISPLAY_FONT } from "../theme";

// --- Chart geometry ---------------------------------------------------------
const CHART_LEFT = 170;
const CHART_RIGHT = 1750;
const CHART_TOP = 330;
const CHART_BOTTOM = 850;
const START_AGE = 55;
const END_AGE = 85;

const DRAW_DURATION = 150; // frames for the line to fully draw

const xForAge = (age: number) =>
  CHART_LEFT + ((age - START_AGE) / (END_AGE - START_AGE)) * (CHART_RIGHT - CHART_LEFT);
const yForFrac = (frac: number) => CHART_BOTTOM - frac * (CHART_BOTTOM - CHART_TOP);

// Smile-shaped spending curve as relative fraction of peak (0..1).
const KEYPOINTS: [number, number][] = [
  [55, 0.8],
  [60, 0.66],
  [66, 0.55],
  [70, 0.5],
  [75, 0.51],
  [80, 0.56],
  [83, 0.72],
  [85, 0.98],
];

const smoothstep = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

const spendingFrac = (age: number): number => {
  for (let i = 0; i < KEYPOINTS.length - 1; i++) {
    const [a0, f0] = KEYPOINTS[i];
    const [a1, f1] = KEYPOINTS[i + 1];
    if (age >= a0 && age <= a1) {
      const t = smoothstep((age - a0) / (a1 - a0));
      return f0 + (f1 - f0) * t;
    }
  }
  return KEYPOINTS[KEYPOINTS.length - 1][1];
};

// Build the smooth polyline path (pathLength normalised to 1 for the draw).
const buildPath = (): string => {
  const pts: string[] = [];
  for (let age = START_AGE; age <= END_AGE + 0.001; age += 0.5) {
    const x = xForAge(age).toFixed(2);
    const y = yForFrac(spendingFrac(age)).toFixed(2);
    pts.push(`${pts.length === 0 ? "M" : "L"} ${x} ${y}`);
  }
  return pts.join(" ");
};

const CURVE_PATH = buildPath();

const TICKS = [55, 65, 75, 85];

type Zone = {
  key: string;
  title: string;
  ages: string;
  from: number;
  to: number;
  band: string;
  triggerAge: number;
  icon: React.ReactNode;
};

const ZONES: Zone[] = [
  {
    key: "go",
    title: "Go-Go Years",
    ages: "55–70",
    from: 55,
    to: 70,
    band: "rgba(255, 199, 0, 0.16)",
    triggerAge: 57,
    icon: <SuitcaseIcon color={COLORS.hazardYellow} size={54} />,
  },
  {
    key: "slow",
    title: "Slow-Go Years",
    ages: "70–80",
    from: 70,
    to: 80,
    band: "rgba(184, 144, 26, 0.14)",
    triggerAge: 70,
    icon: <HouseIcon color={COLORS.offWhite} size={54} />,
  },
  {
    key: "no",
    title: "No-Go Years",
    ages: "80–85",
    from: 80,
    to: 85,
    band: "rgba(13, 13, 13, 0.55)",
    triggerAge: 80,
    icon: <MedicalIcon color={COLORS.hazardYellow} size={54} />,
  },
];

const Background: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.charcoal }}>
    <AbsoluteFill style={{ opacity: 0.05, ...hazardStripeBackground(120) }} />
  </AbsoluteFill>
);

export const Scene2SpendingSmile: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [10, 10 + DRAW_DURATION], [0, 1], {
    easing: Easing.linear,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentAge = START_AGE + progress * (END_AGE - START_AGE);

  const headerOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <HazardFrame background={<Background />}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 96,
            letterSpacing: 3,
            color: COLORS.offWhite,
            lineHeight: 1,
          }}
        >
          The Retirement Spending{" "}
          <span style={{ color: COLORS.hazardYellow }}>Smile</span>
        </div>
      </div>

      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Zone bands */}
        {ZONES.map((z) => {
          const bandOpacity = interpolate(
            currentAge,
            [z.triggerAge, z.triggerAge + 3],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const x = xForAge(z.from);
          const w = xForAge(z.to) - xForAge(z.from);
          return (
            <rect
              key={z.key}
              x={x}
              y={CHART_TOP}
              width={w}
              height={CHART_BOTTOM - CHART_TOP}
              fill={z.band}
              opacity={bandOpacity}
            />
          );
        })}

        {/* Baseline (x-axis) */}
        <line
          x1={CHART_LEFT}
          y1={CHART_BOTTOM}
          x2={CHART_RIGHT}
          y2={CHART_BOTTOM}
          stroke="rgba(242,242,242,0.35)"
          strokeWidth={2}
        />

        {/* Zone divider ticks on the axis */}
        {TICKS.map((t) => (
          <g key={t}>
            <line
              x1={xForAge(t)}
              y1={CHART_BOTTOM}
              x2={xForAge(t)}
              y2={CHART_BOTTOM + 12}
              stroke="rgba(242,242,242,0.5)"
              strokeWidth={2}
            />
            <text
              x={xForAge(t)}
              y={CHART_BOTTOM + 48}
              textAnchor="middle"
              fill={COLORS.offWhiteDim}
              fontFamily={CONDENSED_FONT}
              fontSize={34}
              fontWeight={600}
            >
              {t}
            </text>
          </g>
        ))}
        <text
          x={CHART_RIGHT}
          y={CHART_BOTTOM + 92}
          textAnchor="end"
          fill={COLORS.offWhiteFaint}
          fontFamily={CONDENSED_FONT}
          fontSize={28}
          letterSpacing={2}
        >
          AGE →
        </text>
        <text
          x={72}
          y={(CHART_TOP + CHART_BOTTOM) / 2}
          textAnchor="middle"
          transform={`rotate(-90 72 ${(CHART_TOP + CHART_BOTTOM) / 2})`}
          fill={COLORS.offWhiteFaint}
          fontFamily={CONDENSED_FONT}
          fontSize={28}
          letterSpacing={2}
        >
          ANNUAL SPENDING →
        </text>

        {/* The smile curve, drawn via normalised dashoffset */}
        <path
          d={CURVE_PATH}
          fill="none"
          stroke={COLORS.hazardYellow}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
        />

        {/* Moving dot at the pen tip */}
        {progress > 0 && progress < 1 && (
          <circle
            cx={xForAge(currentAge)}
            cy={yForFrac(spendingFrac(currentAge))}
            r={11}
            fill={COLORS.offWhite}
            stroke={COLORS.hazardYellow}
            strokeWidth={4}
          />
        )}
      </svg>

      {/* Zone labels + icons (HTML overlay, positioned over each band) */}
      {ZONES.map((z) => {
        const labelOpacity = interpolate(
          currentAge,
          [z.triggerAge + 1, z.triggerAge + 5],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const slide = interpolate(
          currentAge,
          [z.triggerAge + 1, z.triggerAge + 5],
          [18, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const centerX = (xForAge(z.from) + xForAge(z.to)) / 2;
        return (
          <div
            key={z.key}
            style={{
              position: "absolute",
              left: centerX,
              top: CHART_TOP - 96,
              transform: `translateX(-50%) translateY(${slide}px)`,
              opacity: labelOpacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              width: 320,
            }}
          >
            {z.icon}
            <div
              style={{
                fontFamily: CONDENSED_FONT,
                fontWeight: 700,
                fontSize: 40,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: COLORS.offWhite,
                lineHeight: 1,
              }}
            >
              {z.title}
            </div>
            <div
              style={{
                fontFamily: CONDENSED_FONT,
                fontWeight: 600,
                fontSize: 26,
                letterSpacing: 2,
                color: COLORS.hazardYellow,
              }}
            >
              AGES {z.ages}
            </div>
          </div>
        );
      })}
    </HazardFrame>
  );
};
