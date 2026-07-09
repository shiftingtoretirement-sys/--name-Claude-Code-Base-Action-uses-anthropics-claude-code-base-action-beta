import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "./theme";
import { Scene1LifeExpectancy } from "./scenes/Scene1LifeExpectancy";
import { Scene2SpendingSmile } from "./scenes/Scene2SpendingSmile";
import { Scene3PortfolioGrowth } from "./scenes/Scene3PortfolioGrowth";

export const SCENE_DURATION = 210; // 7s @ 30fps
export const TOTAL_DURATION = SCENE_DURATION * 3; // 630 frames / 21s

// Hard cuts between scenes (no crossfade): each Sequence is a plain, opaque
// full-frame slice back-to-back.
export const ShiftingToRetirement: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoal }}>
      <Sequence durationInFrames={SCENE_DURATION}>
        <Scene1LifeExpectancy />
      </Sequence>
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <Scene2SpendingSmile />
      </Sequence>
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <Scene3PortfolioGrowth />
      </Sequence>
    </AbsoluteFill>
  );
};
