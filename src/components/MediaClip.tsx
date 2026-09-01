import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/** The faded-film color grade applied to the photographic media itself. */
export const filmGrade = "contrast(1.06) saturate(0.9) brightness(1.02) sepia(0.16) hue-rotate(-8deg)";

export type KenBurns = {
  from: number; // start scale (>=1)
  to: number; // end scale
  originX?: number; // % focal point
  originY?: number;
  panX?: number; // px drift over the clip
  panY?: number;
};

type MediaClipProps = {
  src: string; // path under public/ (e.g. "media/bmx-jump.jpg")
  type?: "image" | "video";
  kenBurns?: KenBurns;
  grade?: string;
};

/** A photo (with a slow Ken Burns move) or a video clip, cover-fitted to frame. */
export const MediaClip: React.FC<MediaClipProps> = ({ src, type = "image", kenBurns, grade = filmGrade }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const kb = kenBurns ?? { from: 1.05, to: 1.16, originX: 50, originY: 45 };
  const t = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const scale = interpolate(t, [0, 1], [kb.from, kb.to]);
  const tx = interpolate(t, [0, 1], [0, kb.panX ?? 0]);
  const ty = interpolate(t, [0, 1], [0, kb.panY ?? 0]);

  const cover: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
    transformOrigin: `${kb.originX ?? 50}% ${kb.originY ?? 45}%`,
    filter: grade,
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {type === "video" ? (
        <OffthreadVideo src={staticFile(src)} style={cover} muted />
      ) : (
        <Img src={staticFile(src)} style={cover} />
      )}
    </AbsoluteFill>
  );
};
