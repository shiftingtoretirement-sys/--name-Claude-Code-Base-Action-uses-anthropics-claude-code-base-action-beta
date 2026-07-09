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
  SAFE_MARGIN,
} from "../theme";

const START_AGE = 55;
const END_AGE = 85;
const COUNT_END_FRAME = 150; // number lands here, holds for the rest

const TICKS = [55, 65, 75, 85];

const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: COLORS.charcoalDeep,
    }}
  >
    <AbsoluteFill
      style={{
        opacity: 0.06,
        ...hazardStripeBackground(120),
      }}
    />
  </AbsoluteFill>
);

export const Scene1LifeExpectancy: React.FC = () => {
  const frame = useCurrentFrame();

  // Ease-out cubic counter that decelerates into the final value.
  const ageValue = interpolate(frame, [0, COUNT_END_FRAME], [START_AGE, END_AGE], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayAge = Math.round(ageValue);

  const progress = (ageValue - START_AGE) / (END_AGE - START_AGE);

  // Single emphasis pulse once the number has landed.
  const pulse = interpolate(
    frame,
    [COUNT_END_FRAME + 4, COUNT_END_FRAME + 14, COUNT_END_FRAME + 24],
    [1, 1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // "30 YEARS" subtitle fades in on the hold.
  const subtitleOpacity = interpolate(
    frame,
    [COUNT_END_FRAME - 6, COUNT_END_FRAME + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const headerOpacity = interpolate(frame, [4, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <HazardFrame background={<Background />}>
      <AbsoluteFill
        style={{
          paddingLeft: SAFE_MARGIN,
          paddingRight: SAFE_MARGIN,
          paddingTop: SAFE_MARGIN,
          paddingBottom: SAFE_MARGIN,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <div
          style={{
            opacity: headerOpacity,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: CONDENSED_FONT,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: COLORS.hazardYellow,
            }}
          >
            Projected Runway
          </div>
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 64,
              letterSpacing: 2,
              color: COLORS.offWhite,
              lineHeight: 1,
            }}
          >
            How Long Does Your Money Need to Last?
          </div>
        </div>

        {/* Center number + subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              scale: String(pulse),
            }}
          >
            <span
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: 420,
                lineHeight: 0.85,
                color: COLORS.hazardYellow,
                textShadow: "0 8px 40px rgba(0,0,0,0.6)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {displayAge}
            </span>
            <span
              style={{
                fontFamily: CONDENSED_FONT,
                fontWeight: 600,
                fontSize: 72,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: COLORS.offWhite,
                marginLeft: 24,
              }}
            >
              Years Old
            </span>
          </div>
          <div
            style={{
              opacity: subtitleOpacity,
              fontFamily: CONDENSED_FONT,
              fontWeight: 700,
              fontSize: 56,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: COLORS.offWhite,
              marginTop: 8,
            }}
          >
            <span style={{ color: COLORS.hazardYellow }}>30 Years</span> of
            Retirement to Fund
          </div>
        </div>

        {/* Progress timeline */}
        <div style={{ width: "100%", maxWidth: 1400 }}>
          <div
            style={{
              position: "relative",
              height: 26,
              borderRadius: 13,
              backgroundColor: "rgba(242,242,242,0.10)",
              border: `2px solid ${COLORS.hazardYellowDim}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${progress * 100}%`,
                backgroundColor: COLORS.hazardYellow,
              }}
            />
          </div>
          {/* Tick marks */}
          <div
            style={{
              position: "relative",
              marginTop: 12,
              height: 40,
            }}
          >
            {TICKS.map((t) => {
              const pct = ((t - START_AGE) / (END_AGE - START_AGE)) * 100;
              return (
                <div
                  key={t}
                  style={{
                    position: "absolute",
                    left: `${pct}%`,
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 12,
                      backgroundColor: COLORS.hazardYellowDim,
                      marginTop: -18,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: CONDENSED_FONT,
                      fontWeight: 600,
                      fontSize: 30,
                      color: COLORS.offWhiteDim,
                    }}
                  >
                    {t}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer note */}
        <div
          style={{
            fontFamily: BODY_FONT,
            fontWeight: 400,
            fontSize: 24,
            color: COLORS.offWhiteFaint,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Healthy male, age 55 — average projected life expectancy ~85 (an
          estimate, not a guarantee). Individual results vary.
        </div>
      </AbsoluteFill>
    </HazardFrame>
  );
};
