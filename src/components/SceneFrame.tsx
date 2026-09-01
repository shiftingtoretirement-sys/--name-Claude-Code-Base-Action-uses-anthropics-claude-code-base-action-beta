import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { palette, fonts, DURATION_FRAMES } from "../theme";
import { FilmGrain, Vignette, Halation, LightLeak, Letterbox, GateWeave } from "./film";

type SceneFrameProps = {
  children: React.ReactNode;
  index: string; // "03"
  title: string; // "Lawn Darts"
  caption: string; // deadpan line
  halation?: { x: number; y: number; opacity?: number };
  vignette?: number;
};

/**
 * Cinematic archival wrapper: gate-weave on the art, then film treatment
 * (halation, light leaks, vignette, grain, letterbox) and a restrained
 * editorial title block. No chrome, no chunky type — the film does the work.
 */
export const SceneFrame: React.FC<SceneFrameProps> = ({
  children,
  index,
  title,
  caption,
  halation = { x: 50, y: 32 },
  vignette = 0.72,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DURATION_FRAMES - 18, DURATION_FRAMES], [1, 0], { extrapolateLeft: "clamp" });
  const master = fadeIn * fadeOut;

  // Title rises slowly; caption follows.
  const tRise = interpolate(frame, [22, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const cRise = interpolate(frame, [40, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const ruleGrow = interpolate(frame, [18, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  return (
    <AbsoluteFill style={{ background: palette.black }}>
      <AbsoluteFill style={{ opacity: master }}>
        {/* Art + projector weave + slow motion handled inside each scene */}
        <GateWeave>{children}</GateWeave>

        {/* Film treatment */}
        <Halation x={halation.x} y={halation.y} opacity={halation.opacity ?? 0.2} />
        <LightLeak />
        <Vignette strength={vignette} />
        <FilmGrain />

        {/* Legibility scrim */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 460, background: "linear-gradient(to top, rgba(8,5,2,0.9), rgba(8,5,2,0.4) 45%, rgba(8,5,2,0))", pointerEvents: "none" }} />

        {/* Editorial title block */}
        <div style={{ position: "absolute", left: 96, bottom: 92, maxWidth: 1400 }}>
          {/* kicker */}
          <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <span style={{ display: "inline-block", width: 54 * ruleGrow, height: 2, background: palette.gold }} />
            <span style={{ fontFamily: fonts.sans, fontSize: 21, fontWeight: 600, letterSpacing: 6, color: palette.amber }}>
              SHIFTING&nbsp;TO&nbsp;RETIREMENT
            </span>
            <span style={{ fontFamily: fonts.sans, fontSize: 21, fontWeight: 500, letterSpacing: 4, color: palette.faded }}>
              EP.&nbsp;08 · THE DAYS BEFORE
            </span>
          </div>

          {/* title */}
          <div
            style={{
              marginTop: 14,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 104,
              lineHeight: 1.0,
              color: palette.bone,
              transform: `translateY(${(1 - tRise) * 26}px)`,
              opacity: tRise,
              textShadow: "0 8px 40px rgba(0,0,0,0.6)",
            }}
          >
            {title}
          </div>

          {/* caption */}
          <div
            style={{
              marginTop: 18,
              fontFamily: fonts.display,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 40,
              lineHeight: 1.3,
              color: palette.cream,
              maxWidth: 1180,
              transform: `translateY(${(1 - cRise) * 18}px)`,
              opacity: cRise * 0.96,
            }}
          >
            {caption}
          </div>
        </div>

        {/* Archival index, top-right */}
        <div style={{ position: "absolute", top: 66, right: 100, textAlign: "right", opacity: master * 0.9 }}>
          <div style={{ fontFamily: fonts.display, fontSize: 40, color: palette.gold, fontWeight: 500, lineHeight: 1 }}>
            {index}
            <span style={{ color: palette.faded, fontSize: 26 }}>&thinsp;/&thinsp;08</span>
          </div>
        </div>

        {/* faint film-stock edge mark, bottom-right */}
        <div style={{ position: "absolute", bottom: 96, right: 100, fontFamily: fonts.sans, fontSize: 17, letterSpacing: 4, color: palette.faded, opacity: master * 0.5 }}>
          KODACHROME · 64
        </div>
      </AbsoluteFill>

      <Letterbox bar={40} />
    </AbsoluteFill>
  );
};
