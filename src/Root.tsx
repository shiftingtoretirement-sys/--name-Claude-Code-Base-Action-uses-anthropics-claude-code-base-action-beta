import "./index.css";
import React from "react";
import { Composition } from "remotion";
import {
  ShiftingToRetirement,
  TOTAL_DURATION,
} from "./ShiftingToRetirement";
import { RetireToWhatIntro } from "./scenes/RetireToWhatIntro";
import { QuestionCard } from "./scenes/QuestionCard";
import {
  ThreeQuestions,
  THREE_QUESTIONS_DURATION,
  QUESTIONS,
  CARD_DURATION,
} from "./scenes/ThreeQuestions";
import { KitchenScene, kitchenSchema } from "./scenes/KitchenScene";

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
      <Composition
        id="ThreeQuestions"
        component={ThreeQuestions}
        durationInFrames={THREE_QUESTIONS_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Individual cards for flexible editing (drop each in, trim the hold) */}
      {QUESTIONS.map((q) => (
        <Composition
          key={q.number}
          id={`Question${q.number}`}
          component={QuestionCard}
          durationInFrames={CARD_DURATION}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ number: q.number, question: q.question }}
        />
      ))}
      <Composition
        id="KitchenScene"
        component={KitchenScene}
        durationInFrames={156}
        fps={24}
        width={1920}
        height={1080}
        schema={kitchenSchema}
        defaultProps={{
          src: "kitchen-scene.jpg",
          steamX: 43,
          steamY: 82,
          steamIntensity: 1,
        }}
      />
    </>
  );
};
