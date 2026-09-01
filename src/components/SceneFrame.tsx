import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { palette, fonts, DURATION_FRAMES } from "../theme";
import { Grain, Vignette, Scanlines, TrackingBar, VhsHud } from "./effects";

type SceneFrameProps = {
  children: React.ReactNode;
  exhibit: string; // "EXHIBIT 03"
  title: string; // "Lawn Darts"
  caption: string; // the spoken line, deadpan
  bg: [string, string]; // gradient stops
  hudStamp?: string;
  vignette?: number;
};

/**
 * Wraps every scene with the shared Gen-X aesthetic: gradient ground, film
 * grain, vignette, scanlines, VHS HUD, an animated lower-third title and a
 * bottom deadpan caption. Handles the global fade-in and fade-to-black.
 */
export const SceneFrame: React.FC<SceneFrameProps> = ({
  children,
  exhibit,
  title,
  caption,
  bg,
  hudStamp,
  vignette = 0.55,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Global open/close fades.
  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DURATION_FRAMES - 16, DURATION_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const master = fadeIn * fadeOut;

  // Lower-third slides in around 0.7s and holds.
  const ltIn = spring({ frame: frame - 20, fps, config: { damping: 200, mass: 0.6 } });
  const ltX = interpolate(ltIn, [0, 1], [-680, 0]);

  // Caption typed reveal near the end of the first third.
  const capProgress = interpolate(frame, [46, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const capChars = Math.floor(caption.length * capProgress);

  return (
    <AbsoluteFill style={{ background: palette.night }}>
      <AbsoluteFill style={{ opacity: master }}>
        {/* Ground */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(160deg, ${bg[0]} 0%, ${bg[1]} 100%)`,
          }}
        />

        {/* Scene art */}
        <AbsoluteFill>{children}</AbsoluteFill>

        {/* Aged-photo treatment */}
        <Vignette strength={vignette} />
        <Scanlines />
        <TrackingBar />
        <Grain />

        {/* Lower third */}
        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 150,
            transform: `translateX(${ltX}px)`,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              background: palette.brandGold,
              color: palette.ink,
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: 6,
              padding: "6px 16px",
              boxShadow: "0 6px 0 rgba(0,0,0,0.35)",
            }}
          >
            {exhibit}
          </div>
          <div
            style={{
              fontFamily: fonts.title,
              color: palette.bone,
              fontSize: 96,
              lineHeight: 0.98,
              fontWeight: 900,
              letterSpacing: -1,
              textShadow: "0 6px 0 rgba(0,0,0,0.45), 0 0 40px rgba(0,0,0,0.4)",
              maxWidth: 1100,
            }}
          >
            {title}
          </div>
        </div>

        {/* Deadpan caption bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "26px 76px 40px",
            background: "linear-gradient(to top, rgba(10,7,3,0.86), rgba(10,7,3,0))",
          }}
        >
          <div
            style={{
              fontFamily: fonts.serif,
              fontStyle: "italic",
              color: palette.cream,
              fontSize: 40,
              lineHeight: 1.2,
              maxWidth: 1500,
              minHeight: 52,
            }}
          >
            {caption.slice(0, capChars)}
            <span style={{ opacity: capChars < caption.length ? 1 : 0, color: palette.brandGold }}>▍</span>
          </div>
        </div>

        <VhsHud stamp={hudStamp} />
      </AbsoluteFill>

      {/* Branding watermark */}
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 58,
          opacity: master * 0.9,
          textAlign: "right",
          fontFamily: fonts.mono,
          color: palette.brandGold,
          fontSize: 22,
          letterSpacing: 3,
          fontWeight: 700,
          textShadow: "0 2px 4px rgba(0,0,0,0.6)",
        }}
      >
        SHIFTING TO RETIREMENT
        <div style={{ color: palette.faded, fontSize: 16, letterSpacing: 2 }}>EP.08 · THE DAYS BEFORE</div>
      </div>
    </AbsoluteFill>
  );
};
