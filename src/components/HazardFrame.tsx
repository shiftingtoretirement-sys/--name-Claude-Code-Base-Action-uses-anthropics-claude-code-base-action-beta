import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, CONDENSED_FONT } from "../theme";
import { HazardBar } from "./HazardStripes";
import { PunchClock } from "./PunchClock";

const BORDER = 16;

/**
 * Shared wrapper applied to every scene. Draws:
 *  - a thin hazard-stripe border frame around the full 1920x1080 canvas
 *  - a persistent punch-clock "bug" in the bottom-right corner
 * Children render inside the framed area.
 */
export const HazardFrame: React.FC<{
  children: React.ReactNode;
  background: React.ReactNode;
}> = ({ children, background }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoal }}>
      {/* Scene-specific background sits behind everything. */}
      {background}

      {/* Content */}
      <AbsoluteFill>{children}</AbsoluteFill>

      {/* Hazard-stripe border frame (top/bottom bars + left/right bars) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
          <HazardBar height={BORDER} />
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <HazardBar height={BORDER} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: BORDER,
            backgroundImage:
              "repeating-linear-gradient(45deg, #FFC700 0px, #FFC700 22px, #0D0D0D 22px, #0D0D0D 44px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: BORDER,
            backgroundImage:
              "repeating-linear-gradient(45deg, #FFC700 0px, #FFC700 22px, #0D0D0D 22px, #0D0D0D 44px)",
          }}
        />
      </AbsoluteFill>

      {/* Persistent punch-clock bug / watermark (bottom-right) */}
      <div
        style={{
          position: "absolute",
          right: 52,
          bottom: 48,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: 0.85,
        }}
      >
        <PunchClock size={52} />
        <span
          style={{
            fontFamily: CONDENSED_FONT,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: COLORS.hazardYellow,
            lineHeight: 1,
          }}
        >
          Shifting to
          <br />
          Retirement
        </span>
      </div>
    </AbsoluteFill>
  );
};
