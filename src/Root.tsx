import React from "react";
import { AbsoluteFill, Composition, useCurrentFrame, interpolate } from "remotion";
import { FPS, DURATION_FRAMES, WIDTH, HEIGHT } from "./theme";
import { SceneFrame } from "./components/SceneFrame";
import { MediaClip } from "./components/MediaClip";
import { FilmStock } from "./components/FilmStock";
import { FishingSunset } from "./scenes/FishingSunset";
import "./fonts";

import { GardenHose } from "./scenes/GardenHose";
import { WayBack } from "./scenes/WayBack";
import { LawnDarts } from "./scenes/LawnDarts";
import { KeyOnShoelace } from "./scenes/KeyOnShoelace";
import { Streetlights } from "./scenes/Streetlights";
import { RotaryPhone } from "./scenes/RotaryPhone";
import { Passbook } from "./scenes/Passbook";
import { CalculatorWatch } from "./scenes/CalculatorWatch";

const REEL = [
  {
    id: "01-GardenHose",
    index: "01",
    title: "The Garden Hose",
    caption: "We drank from the garden hose. It was fine. It was delicious.",
    halation: { x: 78, y: 28, opacity: 0.26 },
    Art: GardenHose,
  },
  {
    id: "02-WayBack",
    index: "02",
    title: "The Way-Back",
    caption: "No seatbelt. Facing backwards. Waving at the strangers behind us.",
    halation: { x: 50, y: 42, opacity: 0.2 },
    Art: WayBack,
  },
  {
    id: "03-LawnDarts",
    index: "03",
    title: "Lawn Darts",
    caption: "Actual metal spears. As a toy. For children.",
    halation: { x: 70, y: 58, opacity: 0.2 },
    Art: LawnDarts,
  },
  {
    id: "04-KeyOnShoelace",
    index: "04",
    title: "The Key on a Shoelace",
    caption: "You wore the house key around your neck. Like a medal.",
    halation: { x: 50, y: 22, opacity: 0.18 },
    Art: KeyOnShoelace,
  },
  {
    id: "05-Streetlights",
    index: "05",
    title: "Streetlights",
    caption: "“Be home when the streetlights come on.” That was the whole app.",
    halation: { x: 75, y: 24, opacity: 0.24 },
    Art: Streetlights,
  },
  {
    id: "06-RotaryPhone",
    index: "06",
    title: "The Rotary Phone",
    caption: "One phone. On the wall. With a cord. You answered blind.",
    halation: { x: 40, y: 26, opacity: 0.18 },
    Art: RotaryPhone,
  },
  {
    id: "07-Passbook",
    index: "07",
    title: "The Passbook",
    caption: "A little paper book, stamped by hand. That was the whole app.",
    halation: { x: 40, y: 22, opacity: 0.2 },
    Art: Passbook,
  },
  {
    id: "08-CalculatorWatch",
    index: "08",
    title: "The Calculator Watch",
    caption: "Every crew had the one guy who “did stocks.” We copied him.",
    halation: { x: 40, y: 30, opacity: 0.18 },
    Art: CalculatorWatch,
  },
];

/** A single photo animated for 5s with the Super-8 / 70s-80s film grade. */
const PhotoFilm: React.FC<{
  src: string;
  type?: "image" | "video";
  kenBurns?: React.ComponentProps<typeof MediaClip>["kenBurns"];
  halation?: { x: number; y: number; opacity: number };
}> = ({ src, type, kenBurns, halation }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 10, 140, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <FilmStock config={{ intensity: 1, halation, vignette: 0.66, weave: 1 }}>
          <MediaClip src={src} type={type} kenBurns={kenBurns} />
        </FilmStock>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Cinemagraph wrapper: a scene component (with its own internal motion) under
 * a stable film grade — no sweeping light leaks, so the lighting holds. */
const Cinemagraph: React.FC<{
  Scene: React.FC;
  halation?: { x: number; y: number; opacity: number };
}> = ({ Scene, halation }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 12, 138, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <FilmStock config={{ intensity: 0.82, halation, vignette: 0.62, weave: 0.5, leaks: false, grain: 0.12 }}>
          <Scene />
        </FilmStock>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 5-second animated photo — Super-8 / 70s-80s grade */}
      <Composition
        id="BMX-Jump"
        durationInFrames={150}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        component={PhotoFilm}
        defaultProps={{
          src: "media/bmx-jump.jpg",
          type: "image" as const,
          kenBurns: { from: 1.05, to: 1.17, originX: 42, originY: 40, panX: -22, panY: 6 },
          halation: { x: 62, y: 14, opacity: 0.26 },
        }}
      />

      {/* 5-second cinemagraph — rippling sunset water, stable lighting */}
      <Composition
        id="Fishing-Sunset"
        durationInFrames={150}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        component={() => <Cinemagraph Scene={FishingSunset} halation={{ x: 86, y: 26, opacity: 0.2 }} />}
      />
      {REEL.map(({ id, index, title, caption, halation, Art }) => (
        <Composition
          key={id}
          id={id}
          durationInFrames={DURATION_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          component={() => (
            <SceneFrame index={index} title={title} caption={caption} halation={halation}>
              <Art />
            </SceneFrame>
          )}
        />
      ))}
    </>
  );
};
