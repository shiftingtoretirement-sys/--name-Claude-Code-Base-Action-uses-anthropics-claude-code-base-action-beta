import "./index.css";
import React from "react";
import { Composition } from "remotion";
import {
  ShiftingToRetirement,
  TOTAL_DURATION,
} from "./ShiftingToRetirement";
import { RetireToWhatIntro } from "./scenes/RetireToWhatIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShiftingToRetirement"
        component={ShiftingToRetirement}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ voiceover: true }}
      />
      <Composition
        id="RetireToWhatIntro"
        component={RetireToWhatIntro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
