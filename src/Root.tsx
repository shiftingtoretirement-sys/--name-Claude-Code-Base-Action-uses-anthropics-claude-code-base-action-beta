import React from "react";
import { Composition } from "remotion";
import { FPS, DURATION_FRAMES, WIDTH, HEIGHT, palette } from "./theme";
import { SceneFrame } from "./components/SceneFrame";

import { GardenHose } from "./scenes/GardenHose";
import { WayBack } from "./scenes/WayBack";
import { LawnDarts } from "./scenes/LawnDarts";
import { KeyOnShoelace } from "./scenes/KeyOnShoelace";
import { Streetlights } from "./scenes/Streetlights";
import { RotaryPhone } from "./scenes/RotaryPhone";
import { Passbook } from "./scenes/Passbook";
import { CalculatorWatch } from "./scenes/CalculatorWatch";

/**
 * Each entry pairs a scene's art with its lower-third and the deadpan caption
 * (a paraphrase of the script's spoken line). Backgrounds are tuned per mood.
 */
const REEL = [
  {
    id: "01-GardenHose",
    exhibit: "EXHIBIT 01",
    title: "The Garden Hose",
    caption: "We drank from the garden hose. It was fine. It was delicious.",
    bg: ["#7FB6D8", "#E4CE9B"] as [string, string],
    Art: GardenHose,
  },
  {
    id: "02-WayBack",
    exhibit: "EXHIBIT 02",
    title: "The Way-Back",
    caption: "No seatbelt, facing backwards, making faces at strangers.",
    bg: ["#9DB7C4", "#C89B6A"] as [string, string],
    Art: WayBack,
  },
  {
    id: "03-LawnDarts",
    exhibit: "EXHIBIT 03",
    title: "Lawn Darts",
    caption: "Actual metal spears. As a toy. For children.",
    bg: ["#8FB4C6", "#B7A66E"] as [string, string],
    Art: LawnDarts,
  },
  {
    id: "04-KeyOnShoelace",
    exhibit: "EXHIBIT 04",
    title: "The Key on a Shoelace",
    caption: "You wore the house key around your neck like a medal.",
    bg: ["#3A2F1E", "#7A5A28"] as [string, string],
    Art: KeyOnShoelace,
  },
  {
    id: "05-Streetlights",
    exhibit: "EXHIBIT 05",
    title: "Streetlights",
    caption: "“Be home when the streetlights come on.” That was the whole app.",
    bg: ["#243049", "#7A5233"] as [string, string],
    Art: Streetlights,
  },
  {
    id: "06-RotaryPhone",
    exhibit: "EXHIBIT 06",
    title: "The Rotary Phone",
    caption: "One phone. On the wall. With a cord. You answered blind.",
    bg: ["#C7A86A", "#8A6A34"] as [string, string],
    Art: RotaryPhone,
  },
  {
    id: "07-Passbook",
    exhibit: "EXHIBIT 07",
    title: "The Passbook",
    caption: "A little paper book, stamped by hand. That was the whole app.",
    bg: ["#5B4A2E", "#2E6B6B"] as [string, string],
    Art: Passbook,
  },
  {
    id: "08-CalculatorWatch",
    exhibit: "EXHIBIT 08",
    title: "The Calculator-Watch Guy",
    caption: "Every crew had him. He “did stocks.” We copied whatever he did.",
    bg: ["#22242E", "#5B4A2E"] as [string, string],
    Art: CalculatorWatch,
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {REEL.map(({ id, exhibit, title, caption, bg, Art }) => (
        <Composition
          key={id}
          id={id}
          durationInFrames={DURATION_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          component={() => (
            <SceneFrame exhibit={exhibit} title={title} caption={caption} bg={bg}>
              <Art />
            </SceneFrame>
          )}
        />
      ))}
    </>
  );
};
