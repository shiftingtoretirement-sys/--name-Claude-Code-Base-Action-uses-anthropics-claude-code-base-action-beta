import React from "react";
import { useCurrentFrame, random, interpolate } from "remotion";
import { WIDTH, HEIGHT, palette } from "../theme";

/** Animated film grain built from an SVG turbulence filter re-seeded per frame. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.14 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 12; // shuffle a few times per second
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none" }}
    >
      <filter id={`grain-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={WIDTH} height={HEIGHT} filter={`url(#grain-${seed})`} />
    </svg>
  );
};

/** Warm vignette to focus the eye and sell the aged-photo feel. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 78% 78% at 50% 46%, rgba(0,0,0,0) 45%, rgba(20,12,4,${strength}) 100%)`,
    }}
  />
);

/** Subtle CRT scanlines. */
export const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.08 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      opacity,
      backgroundImage: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1px, transparent 2px, transparent 4px)",
    }}
  />
);

/** A slow chromatic-aberration-ish color wash sweeping down, like tape tracking. */
export const TrackingBar: React.FC = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame % 150, [0, 150], [-0.15, 1.15]) * HEIGHT;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        height: 90,
        pointerEvents: "none",
        opacity: 0.06,
        background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.9), transparent)",
      }}
    />
  );
};

/** Blinking REC dot + running VHS timestamp in the corners. */
export const VhsHud: React.FC<{ stamp?: string }> = ({ stamp = "PLAY  ►" }) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 15) % 2 === 0;
  // Fake camcorder clock ticking up from a fixed retro date.
  const totalSec = 6 + frame / 30;
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(Math.floor(totalSec % 60)).padStart(2, "0");
  const hud: React.CSSProperties = {
    position: "absolute",
    fontFamily: `"Courier New", monospace`,
    color: palette.bone,
    fontWeight: 700,
    letterSpacing: 2,
    textShadow: "0 2px 4px rgba(0,0,0,0.6)",
    fontSize: 34,
  };
  return (
    <>
      <div style={{ ...hud, top: 44, left: 56, display: "flex", alignItems: "center", gap: 16 }}>
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: blink ? "#E8352E" : "rgba(232,53,46,0.25)",
            boxShadow: blink ? "0 0 18px rgba(232,53,46,0.9)" : "none",
            display: "inline-block",
          }}
        />
        <span>REC</span>
      </div>
      <div style={{ ...hud, top: 44, right: 56 }}>{stamp}</div>
      <div style={{ ...hud, bottom: 44, right: 56, fontSize: 30 }}>
        SP&nbsp;&nbsp;0:{mm}:{ss}
      </div>
    </>
  );
};

/** Aspect-safe stage: everything drawn against a 1920x1080 SVG coordinate space. */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    width={WIDTH}
    height={HEIGHT}
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    style={{ position: "absolute", inset: 0 }}
  >
    {children}
  </svg>
);

/** Deterministic jitter helper for hand-drawn wobble. */
export const wobble = (frame: number, key: string, amp: number, speed = 0.15) =>
  Math.sin(frame * speed + random(key) * Math.PI * 2) * amp;
