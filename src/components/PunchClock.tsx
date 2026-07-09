import React from "react";
import { COLORS } from "../theme";

// Small industrial punch-clock / time-clock icon used as a persistent bug.
export const PunchClock: React.FC<{ size?: number }> = ({ size = 64 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clock body */}
      <rect
        x="8"
        y="10"
        width="48"
        height="44"
        rx="6"
        stroke={COLORS.hazardYellow}
        strokeWidth="3"
      />
      {/* Card slot at the bottom (the "punch" slot) */}
      <rect
        x="20"
        y="49"
        width="24"
        height="4"
        rx="2"
        fill={COLORS.hazardYellow}
      />
      {/* Clock face */}
      <circle
        cx="32"
        cy="28"
        r="14"
        stroke={COLORS.hazardYellow}
        strokeWidth="3"
      />
      {/* Hands */}
      <line
        x1="32"
        y1="28"
        x2="32"
        y2="19"
        stroke={COLORS.hazardYellow}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="28"
        x2="39"
        y2="30"
        stroke={COLORS.hazardYellow}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};
