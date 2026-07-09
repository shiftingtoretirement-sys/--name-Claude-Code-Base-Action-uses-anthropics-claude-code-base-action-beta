import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { COLORS } from "./theme";
import { Scene1LifeExpectancy } from "./scenes/Scene1LifeExpectancy";
import { Scene2SpendingSmile } from "./scenes/Scene2SpendingSmile";
import { Scene3PortfolioGrowth } from "./scenes/Scene3PortfolioGrowth";

export const SCENE_DURATION = 210; // 7s @ 30fps
export const TOTAL_DURATION = SCENE_DURATION * 3; // 630 frames / 21s

export type ShiftingToRetirementProps = {
  voiceover: boolean;
};

// Per-scene narration. Each clip is authored to finish inside its 7s scene so
// voices never overlap across the hard cuts. See NARRATION.md for the script
// and generate-voiceover.mjs to (re)generate these files.
const VOICEOVER = [
  { file: "voiceover/scene-1.wav", from: 8 }, // small lead-in on scene 1
  { file: "voiceover/scene-2.wav", from: SCENE_DURATION },
  { file: "voiceover/scene-3.wav", from: SCENE_DURATION * 2 },
];

// Hard cuts between scenes (no crossfade): each Sequence is a plain, opaque
// full-frame slice back-to-back.
export const ShiftingToRetirement: React.FC<ShiftingToRetirementProps> = ({
  voiceover,
}) => {
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

      {voiceover &&
        VOICEOVER.map((v) => (
          <Sequence key={v.file} from={v.from}>
            <Audio src={staticFile(v.file)} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
