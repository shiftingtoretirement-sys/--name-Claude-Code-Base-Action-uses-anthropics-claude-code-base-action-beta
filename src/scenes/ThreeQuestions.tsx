import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { QuestionCard } from "./QuestionCard";

// How long each card holds on screen (talk time) and the wipe length between.
export const CARD_DURATION = 150; // 5s
export const WIPE_DURATION = 18;

export const QUESTIONS = [
  { number: "1", question: "What gets you out of bed?" },
  { number: "2", question: "Who's your crew now?" },
  { number: "3", question: "What are you going to build?" },
];

// Total = sum of cards minus the two overlapping transitions.
export const THREE_QUESTIONS_DURATION =
  QUESTIONS.length * CARD_DURATION - (QUESTIONS.length - 1) * WIPE_DURATION;

export const ThreeQuestions: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0d" }}>
      <TransitionSeries>
        {QUESTIONS.map((q, i) => (
          <React.Fragment key={q.number}>
            {i > 0 && (
              <TransitionSeries.Transition
                presentation={wipe({ direction: "from-left" })}
                timing={linearTiming({ durationInFrames: WIPE_DURATION })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={CARD_DURATION}>
              <QuestionCard number={q.number} question={q.question} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
