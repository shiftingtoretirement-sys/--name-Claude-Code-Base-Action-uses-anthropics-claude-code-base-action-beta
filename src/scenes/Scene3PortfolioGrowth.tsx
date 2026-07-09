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
  BODY_FONT,
  COLORS,
  CONDENSED_FONT,
  DISPLAY_FONT,
} from "../theme";

// --- Chart geometry ---------------------------------------------------------
const CHART_LEFT = 250;
const CHART_RIGHT = 1740;
const CHART_TOP = 300;
const CHART_BOTTOM = 820;
const START_AGE = 55;
const END_AGE = 85;
const Y_MAX = 3; // $3M top of axis

const DRAW_DURATION = 150;

const xForAge = (age: number) =>
  CHART_LEFT + ((age - START_AGE) / (END_AGE - START_AGE)) * (CHART_RIGHT - CHART_LEFT);
const yForValue = (m: number) =>
  CHART_BOTTOM - (m / Y_MAX) * (CHART_BOTTOM - CHART_TOP);

// Illustrative portfolio trajectory (values in $millions): $2M start, drifts
// up through the 60s/70s, flattens in the 80s, tapers only slightly by 85.
const KEYPOINTS: [number, number][] = [
  [55, 2.0],
  [60, 2.26],
  [65, 2.52],
  [70, 2.74],
  [75, 2.9],
  [78, 2.93],
  [80, 2.92],
  [83, 2.86],
  [85, 2.8],
];

const smoothstep = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

const valueForAge = (age: number): number => {
  for (let i = 0; i < KEYPOINTS.length - 1; i++) {
    const [a0, v0] = KEYPOINTS[i];
    const [a1, v1] = KEYPOINTS[i + 1];
    if (age >= a0 && age <= a1) {
      const t = smoothstep((age - a0) / (a1 - a0));
      return v0 + (v1 - v0) * t;
    }
  }
  return KEYPOINTS[KEYPOINTS.length - 1][1];
};

const LINE_PATH = (() => {
  const pts: string[] = [];
  for (let age = START_AGE; age <= END_AGE + 0.001; age += 0.5) {
    pts.push(
      `${pts.length === 0 ? "M" : "L"} ${xForAge(age).toFixed(2)} ${yForValue(
        valueForAge(age),
      ).toFixed(2)}`,
    );
  }
  return pts.join(" ");
})();

const AREA_PATH = `${LINE_PATH} L ${xForAge(END_AGE).toFixed(2)} ${CHART_BOTTOM} L ${xForAge(
  START_AGE,
).toFixed(2)} ${CHART_BOTTOM} Z`;

const GRIDLINES = [0, 1, 2, 3];
const AGE_TICKS = [55, 65, 75, 85];

type Milestone = { age: number; label: string };
const MILESTONES: Milestone[] = [
  { age: 65, label: "Age 65 — Medicare eligible" },
  { age: 73, label: "Age 73 — RMDs begin" },
];

const Background: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.charcoalDeep }}>
    <AbsoluteFill style={{ opacity: 0.05, ...hazardStripeBackground(120) }} />
  </AbsoluteFill>
);

export const Scene3PortfolioGrowth: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [10, 10 + DRAW_DURATION], [0, 1], {
    easing: Easing.linear,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentAge = START_AGE + progress * (END_AGE - START_AGE);
  const currentX = xForAge(currentAge);
  const currentValue = valueForAge(currentAge);

  const headerOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const endLabelOpacity = interpolate(frame, [172, 188], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade the corner age tracker out as the ending-value label takes over the
  // top-right, so the two don't overlap on the final hold.
  const ageTrackerOpacity = interpolate(frame, [162, 178], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <HazardFrame background={<Background />}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 116,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 92,
            letterSpacing: 3,
            color: COLORS.offWhite,
            lineHeight: 1,
          }}
        >
          <span style={{ color: COLORS.hazardYellow }}>$2M Portfolio</span>, 55
          to End of Plan
        </div>
      </div>

      {/* Age tracker (top-right, synced to the draw) */}
      <div
        style={{
          position: "absolute",
          top: 210,
          right: 96,
          textAlign: "right",
          opacity: ageTrackerOpacity,
        }}
      >
        <div
          style={{
            fontFamily: CONDENSED_FONT,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: 3,
            color: COLORS.offWhiteFaint,
            textTransform: "uppercase",
          }}
        >
          Current Age
        </div>
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 84,
            color: COLORS.hazardYellow,
            lineHeight: 0.9,
          }}
        >
          {Math.round(currentAge)}
        </div>
      </div>

      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.hazardYellow} stopOpacity={0.55} />
            <stop offset="100%" stopColor={COLORS.hazardYellow} stopOpacity={0.02} />
          </linearGradient>
          <clipPath id="revealClip">
            <rect x={0} y={0} width={currentX} height={1080} />
          </clipPath>
        </defs>

        {/* Gridlines + $ labels */}
        {GRIDLINES.map((g) => (
          <g key={g}>
            <line
              x1={CHART_LEFT}
              y1={yForValue(g)}
              x2={CHART_RIGHT}
              y2={yForValue(g)}
              stroke="rgba(242,242,242,0.14)"
              strokeWidth={2}
            />
            <text
              x={CHART_LEFT - 24}
              y={yForValue(g) + 10}
              textAnchor="end"
              fill={COLORS.offWhiteDim}
              fontFamily={CONDENSED_FONT}
              fontSize={32}
              fontWeight={600}
            >
              {g === 0 ? "$0" : `$${g}M`}
            </text>
          </g>
        ))}

        {/* Age ticks */}
        {AGE_TICKS.map((t) => (
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

        {/* Area + line, revealed left-to-right by the clip */}
        <g clipPath="url(#revealClip)">
          <path d={AREA_PATH} fill="url(#areaGrad)" />
          <path
            d={LINE_PATH}
            fill="none"
            stroke={COLORS.hazardYellow}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Milestone markers */}
        {MILESTONES.map((m) => {
          const passed = currentAge >= m.age;
          const op = interpolate(currentAge, [m.age, m.age + 2], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={m.age} opacity={op}>
              <line
                x1={xForAge(m.age)}
                y1={yForValue(valueForAge(m.age))}
                x2={xForAge(m.age)}
                y2={CHART_BOTTOM}
                stroke="rgba(242,242,242,0.4)"
                strokeWidth={2}
                strokeDasharray="6 8"
              />
              <circle
                cx={xForAge(m.age)}
                cy={yForValue(valueForAge(m.age))}
                r={9}
                fill={COLORS.charcoal}
                stroke={COLORS.hazardYellow}
                strokeWidth={4}
              />
              {passed && (
                <text
                  x={xForAge(m.age)}
                  y={yForValue(valueForAge(m.age)) - 26}
                  textAnchor="middle"
                  fill={COLORS.offWhite}
                  fontFamily={CONDENSED_FONT}
                  fontSize={30}
                  fontWeight={600}
                >
                  {m.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Pen tip */}
        {progress > 0 && progress < 1 && (
          <circle
            cx={currentX}
            cy={yForValue(currentValue)}
            r={12}
            fill={COLORS.offWhite}
            stroke={COLORS.hazardYellow}
            strokeWidth={4}
          />
        )}

        {/* Ending value label */}
        <g opacity={endLabelOpacity}>
          <circle
            cx={xForAge(END_AGE)}
            cy={yForValue(valueForAge(END_AGE))}
            r={12}
            fill={COLORS.hazardYellow}
          />
          <text
            x={xForAge(END_AGE) - 20}
            y={yForValue(valueForAge(END_AGE)) - 58}
            textAnchor="end"
            fill={COLORS.hazardYellow}
            fontFamily={DISPLAY_FONT}
            fontSize={72}
          >
            ~$2.8M
          </text>
          <text
            x={xForAge(END_AGE) - 20}
            y={yForValue(valueForAge(END_AGE)) - 22}
            textAnchor="end"
            fill={COLORS.offWhiteDim}
            fontFamily={CONDENSED_FONT}
            fontSize={28}
            letterSpacing={1}
          >
            ENDING VALUE, AGE 85
          </text>
        </g>
      </svg>

      {/* Footer disclaimer */}
      <div
        style={{
          position: "absolute",
          bottom: 44,
          left: 96,
          maxWidth: 1250,
          fontFamily: BODY_FONT,
          fontWeight: 400,
          fontSize: 23,
          lineHeight: 1.35,
          color: COLORS.offWhiteFaint,
        }}
      >
        Illustrative projection only. Assumes ~6–7% average annual return and
        ~4% annual withdrawal rate. Not a guarantee of future performance.
      </div>
    </HazardFrame>
  );
};
