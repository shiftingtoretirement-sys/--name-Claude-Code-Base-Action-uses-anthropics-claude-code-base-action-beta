import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  ANTON,
  GOLD,
  StageBackground,
  WHITE,
} from "../components/StageBackground";

export type QuestionCardProps = {
  number: string; // e.g. "1"
  question: string; // e.g. "What gets you out of bed?"
};

// Timing (frames, relative to the card's own start)
const NUM_START = 4;
const NUM_END = 24;
const TYPE_START = 28;

// The question types on character-by-character (words kept intact so lines only
// break between words). Each char softly fades as the reveal edge passes it.
const TypedQuestion: React.FC<{ question: string }> = ({ question }) => {
  const frame = useCurrentFrame();
  const chars = [...question];
  const total = chars.length;
  const typeEnd = TYPE_START + Math.min(total * 1.15, 52);
  // Range padded at both ends so the first and last glyphs fully resolve.
  const revealed = interpolate(
    frame,
    [TYPE_START, typeEnd],
    [-1.5, total + 1.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const words = question.split(" ");
  let idx = 0; // running global character index across words

  return (
    <div
      style={{
        fontFamily: ANTON,
        textTransform: "uppercase",
        fontSize: 92,
        lineHeight: 1.04,
        color: WHITE,
        letterSpacing: 1,
        maxWidth: 1040,
      }}
    >
      {words.map((word, w) => {
        const wordSpan = (
          <span key={`w${w}`} style={{ display: "inline-block" }}>
            {[...word].map((ch, c) => {
              const i = idx++;
              const op = interpolate(revealed, [i - 0.5, i + 1.5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <span key={`c${c}`} style={{ opacity: op }}>
                  {ch}
                </span>
              );
            })}
          </span>
        );
        // consume the space that followed this word in the original string
        const spaceIdx = w < words.length - 1 ? idx++ : -1;
        const spaceOp =
          spaceIdx >= 0
            ? interpolate(revealed, [spaceIdx - 0.5, spaceIdx + 1.5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0;
        return (
          <React.Fragment key={`f${w}`}>
            {wordSpan}
            {spaceIdx >= 0 ? (
              <span style={{ opacity: spaceOp }}> </span>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  number,
  question,
}) => {
  const frame = useCurrentFrame();

  const stageOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Big number swipe-in: left-to-right clip wipe + a short slide.
  const hidden = interpolate(frame, [NUM_START, NUM_END], [100, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideX = interpolate(frame, [NUM_START, NUM_END], [-48, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const revealed = 100 - hidden;
  const edgeOpacity = interpolate(revealed, [0, 2, 94, 100], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Kicker fades in first.
  const kickerOpacity = interpolate(frame, [2, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <StageBackground opacity={stageOpacity} />

      <div
        style={{
          position: "absolute",
          left: 130,
          top: "50%",
          translate: "0 -50%",
          opacity: stageOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Kicker */}
        <div
          style={{
            fontFamily: ANTON,
            textTransform: "uppercase",
            fontSize: 46,
            letterSpacing: 14,
            color: WHITE,
            opacity: kickerOpacity,
            marginBottom: 4,
          }}
        >
          Question
        </div>

        {/* Big number (swipes in) */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            translate: `${slideX}px 0`,
            lineHeight: 0.86,
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontFamily: ANTON,
              fontSize: 300,
              color: GOLD,
              clipPath: `inset(-10% ${hidden}% -10% 0)`,
            }}
          >
            {number}
          </span>
          <div
            style={{
              position: "absolute",
              top: "8%",
              bottom: "8%",
              left: `${100 - hidden}%`,
              width: 10,
              translate: "-50% 0",
              background: WHITE,
              opacity: edgeOpacity,
              boxShadow: `0 0 26px 6px ${GOLD}`,
            }}
          />
        </div>

        {/* Question (types / fades under it) */}
        <div style={{ marginTop: 18 }}>
          <TypedQuestion question={question} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
