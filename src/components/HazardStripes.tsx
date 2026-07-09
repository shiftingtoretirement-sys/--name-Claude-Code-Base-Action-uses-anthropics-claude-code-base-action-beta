import React from "react";
import { COLORS } from "../theme";

/**
 * A repeating diagonal hazard-stripe pattern rendered as an inline SVG data
 * background. `opacity` and `scale` (stripe period in px) are configurable so
 * the same motif can be a bold border or a faint background texture.
 */
export const hazardStripeBackground = (
  period = 40,
  yellow: string = COLORS.hazardYellow,
  black: string = COLORS.stripeBlack,
): React.CSSProperties => {
  const half = period / 2;
  return {
    backgroundImage: `repeating-linear-gradient(45deg, ${yellow} 0px, ${yellow} ${half}px, ${black} ${half}px, ${black} ${period}px)`,
  };
};

// A single hazard-striped bar (used for the top/bottom border frame edges).
export const HazardBar: React.FC<{
  height: number;
  period?: number;
  opacity?: number;
}> = ({ height, period = 44, opacity = 1 }) => {
  return (
    <div
      style={{
        height,
        width: "100%",
        opacity,
        ...hazardStripeBackground(period),
      }}
    />
  );
};
