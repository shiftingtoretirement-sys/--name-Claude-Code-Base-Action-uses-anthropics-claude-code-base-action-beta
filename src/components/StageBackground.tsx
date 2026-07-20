import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";

export const { fontFamily: ANTON } = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const GOLD = "#FBBF24";
export const WHITE = "#FFFFFF";

// Deep charcoal -> black gradient + edge vignette, shared across the
// "Retire to What?" title set so every card reads as the same system. The
// right ~45% is left open for a webcam / photo composite.
const STAGE_BG: React.CSSProperties = {
  background: [
    "radial-gradient(120% 90% at 26% 42%, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0) 46%)",
    "radial-gradient(80% 75% at 80% 52%, rgba(255,255,255,0.030) 0%, rgba(255,255,255,0) 55%)",
    "linear-gradient(145deg, #26262b 0%, #171719 46%, #0b0b0d 100%)",
  ].join(","),
};

const VIGNETTE: React.CSSProperties = {
  background:
    "radial-gradient(ellipse 78% 86% at 50% 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.38) 100%)",
};

export const StageBackground: React.FC<{ opacity?: number }> = ({
  opacity = 1,
}) => (
  <>
    <AbsoluteFill style={{ backgroundColor: "#0b0b0d" }} />
    <AbsoluteFill style={{ ...STAGE_BG, opacity }} />
    <AbsoluteFill style={VIGNETTE} />
  </>
);
