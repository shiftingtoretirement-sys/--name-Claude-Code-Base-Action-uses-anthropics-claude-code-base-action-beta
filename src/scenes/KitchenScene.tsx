import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const kitchenSchema = z.object({
  src: z.string(),
  steamX: z.number().min(0).max(100),
  steamY: z.number().min(0).max(100),
  steamIntensity: z.number().min(0).max(2),
});

export type KitchenSceneProps = z.infer<typeof kitchenSchema>;

// ---- Procedural steam rising from the pan -----------------------------------
const RISE = 620; // px a wisp travels upward over its life
const LIFE = 96; // frames per wisp cycle
const COUNT = 20;

const SteamField: React.FC<{ x: number; y: number; intensity: number }> = ({
  x,
  y,
  intensity,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        pointerEvents: "none",
        filter: "blur(2px)",
      }}
    >
      {[...Array(COUNT)].map((_, i) => {
        const speed = 0.55 + random(`sp${i}`) * 0.5;
        const off = random(`of${i}`) * LIFE;
        const t = (((frame * speed) + off) % LIFE) / LIFE; // 0..1 life progress

        const yPos = -t * RISE; // travels up
        const swayFreq = 0.6 + random(`f${i}`) * 0.9;
        const sway =
          Math.sin(t * Math.PI * 2 * swayFreq + random(`ph${i}`) * 6.28) *
          (24 + t * 95); // widens as it rises
        const xJit = (random(`xj${i}`) - 0.5) * 70;
        const size = (38 + random(`sz${i}`) * 46) * (0.5 + t * 1.7);
        const op =
          Math.min(t / 0.12, 1) * Math.pow(1 - t, 1.35) * 0.5 * intensity;
        const blur = 7 + t * 24;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: size,
              height: size,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,246,232,0.9) 0%, rgba(255,240,220,0.35) 45%, rgba(255,240,220,0) 70%)",
              transform: `translate(-50%, -50%) translate(${sway + xJit}px, ${yPos}px)`,
              filter: `blur(${blur}px)`,
              mixBlendMode: "screen",
              opacity: op,
            }}
          />
        );
      })}
    </div>
  );
};

// ---- Animated film grain ----------------------------------------------------
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{ mixBlendMode: "overlay", opacity: 0.06, pointerEvents: "none" }}
    >
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={frame % 32}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const KitchenScene: React.FC<KitchenSceneProps> = ({
  src,
  steamX,
  steamY,
  steamIntensity,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const end = durationInFrames - 1;

  // Slow cinematic push-in toward the children/stove + a gentle L→R drift.
  const scale = interpolate(frame, [0, end], [1.06, 1.16]);
  const driftX = interpolate(frame, [0, end], [22, -22]);
  const driftY = interpolate(frame, [0, end], [6, -6]);

  // Soft warm stove-light flicker.
  const flicker =
    0.12 +
    0.05 * Math.sin(frame * 0.9) +
    0.03 * Math.sin(frame * 2.7 + 1.3) +
    0.02 * (random(`fl${frame}`) - 0.5) * 2;

  // Gentle fade up from black at the start.
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Camera group: everything anchored to the scene scales/pans together */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${driftX}px, ${driftY}px)`,
          transformOrigin: "46% 56%",
        }}
      >
        {/* Sharp base image with a subtle warm grade */}
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "saturate(1.06) contrast(1.03) brightness(1.0)",
          }}
        />

        {/* Shallow depth-of-field: blurred copy showing only at the edges */}
        <Img
          src={staticFile(src)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(9px) saturate(1.06)",
            WebkitMaskImage:
              "radial-gradient(ellipse 62% 66% at 46% 54%, rgba(0,0,0,0) 55%, rgba(0,0,0,1) 100%)",
            maskImage:
              "radial-gradient(ellipse 62% 66% at 46% 54%, rgba(0,0,0,0) 55%, rgba(0,0,0,1) 100%)",
          }}
        />

        {/* Warm flickering glow from the pan/stove */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle 42% at ${steamX}% ${steamY - 4}%, rgba(255,168,74,${flicker}) 0%, rgba(255,150,60,0) 55%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />

        <SteamField x={steamX} y={steamY} intensity={steamIntensity} />
      </AbsoluteFill>

      {/* Warm nostalgic wash + lifted shadows (screen-space, above camera) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,196,120,0.10), rgba(120,70,30,0.10))",
          mixBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: "rgba(60,44,28,0.06)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 74% 82% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)",
          pointerEvents: "none",
        }}
      />

      <Grain />

      {/* Fade up from black */}
      <AbsoluteFill
        style={{ backgroundColor: "#000", opacity: 1 - fadeIn, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
