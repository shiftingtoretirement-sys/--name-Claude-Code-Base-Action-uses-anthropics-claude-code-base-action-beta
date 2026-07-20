import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";

const { fontFamily: ANTON } = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const GOLD = "#FBBF24";
const WHITE = "#FFFFFF";

// Deep charcoal -> black background matching the thumbnail (percent-based, so
// resolution-independent) plus an edge vignette that lets a webcam / photo
// composited on the right blend into the frame.
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

type LineProps = {
  text: string;
  color: string;
  fontSize: number;
  marginTop?: number;
  // wipe reveal window (frames)
  start: number;
  end: number;
};

const WipeLine: React.FC<LineProps> = ({
  text,
  color,
  fontSize,
  marginTop = 0,
  start,
  end,
}) => {
  const frame = useCurrentFrame();

  // Percentage of the line still hidden on the right (100 -> 0 = L→R reveal).
  const hidden = interpolate(frame, [start, end], [100, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Leading edge bar visible only while the wipe is travelling.
  const revealed = 100 - hidden; // 0 -> 100 as the line draws on
  const edgeOpacity = interpolate(
    revealed,
    [0, 2, 94, 100],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        marginTop,
        lineHeight: 0.9,
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontFamily: ANTON,
          textTransform: "uppercase",
          fontSize,
          color,
          letterSpacing: 1,
          clipPath: `inset(-15% ${hidden}% -15% 0)`,
        }}
      >
        {text}
      </span>
      {/* Golden leading edge that "draws" the line on */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          bottom: "6%",
          left: `${100 - hidden}%`,
          width: 10,
          translate: "-50% 0",
          background: GOLD,
          opacity: edgeOpacity,
          boxShadow: `0 0 28px 6px ${GOLD}`,
        }}
      />
    </div>
  );
};

export const RetireToWhatIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // Gentle fade up from black at the very start.
  const stageOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0d" }}>
      <AbsoluteFill style={{ ...STAGE_BG, opacity: stageOpacity }} />
      <AbsoluteFill style={VIGNETTE} />

      {/* Left-aligned headline block; right ~45% left open for a subject. */}
      <div
        style={{
          position: "absolute",
          left: 130,
          top: "50%",
          translate: "0 -50%",
          maxWidth: 1020, // stays within the left ~55% (1056px)
          opacity: stageOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // each line shrinks to its own width, own row
        }}
      >
        <WipeLine text="Retire" color={WHITE} fontSize={228} start={10} end={36} />
        <WipeLine
          text="To"
          color={WHITE}
          fontSize={228}
          marginTop={8}
          start={26}
          end={52}
        />
        <WipeLine
          text="What?"
          color={GOLD}
          fontSize={320}
          marginTop={18}
          start={46}
          end={78}
        />
      </div>
    </AbsoluteFill>
  );
};
