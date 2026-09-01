import React from "react";
import { Composition } from "remotion";
import { FPS, DURATION_FRAMES, WIDTH, HEIGHT } from "./theme";
import { SceneFrame } from "./components/SceneFrame";
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

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
