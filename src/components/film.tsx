import React from "react";
import { AbsoluteFill, useCurrentFrame, random, interpolate } from "remotion";
import { WIDTH, HEIGHT, palette } from "../theme";

/** Fine 16mm-style film grain, re-seeded a few times a second, plus drifting dust. */
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.13 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 10;
  return (
    <>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
        <filter id={`fg-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={WIDTH} height={HEIGHT} filter={`url(#fg-${seed})`} />
      </svg>
      {/* occasional dust specks + a stray hair */}
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const life = (frame + i * 13) % 40;
          if (life > 6) return null;
          const x = random(`dx${i}${Math.floor((frame + i * 13) / 40)}`) * WIDTH;
          const y = random(`dy${i}${Math.floor((frame + i * 13) / 40)}`) * HEIGHT;
          return <circle key={i} cx={x} cy={y} r={1.5 + random(`dr${i}`) * 2} fill={i % 2 ? "#000" : palette.bone} opacity={0.5} />;
        })}
        {frame % 97 < 3 && (
          <path d={`M ${WIDTH * 0.7} 0 q 8 ${HEIGHT / 2} -14 ${HEIGHT}`} stroke="#000" strokeWidth={1.5} fill="none" opacity={0.25} />
        )}
      </svg>
    </>
  );
};

/** Deep warm vignette. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.7 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 70% 72% at 50% 44%, rgba(0,0,0,0) 42%, rgba(8,5,2,${strength}) 100%)`,
    }}
  />
);

/** A warm halation/bloom wash — sells the "light glowing into the emulsion" feel. */
export const Halation: React.FC<{ x?: number; y?: number; opacity?: number }> = ({ x = 50, y = 34, opacity = 0.22 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      mixBlendMode: "screen",
      opacity,
      background: `radial-gradient(circle at ${x}% ${y}%, rgba(232,163,23,0.9), rgba(200,120,40,0.35) 30%, rgba(0,0,0,0) 62%)`,
    }}
  />
);

/** Occasional warm light-leak sweep across the frame. */
export const LightLeak: React.FC = () => {
  const frame = useCurrentFrame();
  // Two leaks: an early bloom and a late edge flare.
  const a = interpolate(frame, [0, 10, 26, 40], [0.5, 0.28, 0.05, 0], { extrapolateRight: "clamp" });
  const b = interpolate(frame, [150, 176, 210, 236], [0, 0.3, 0.16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen", opacity: a, background: "radial-gradient(circle at 88% 12%, rgba(255,180,80,0.9), rgba(0,0,0,0) 45%)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen", opacity: b, background: "linear-gradient(115deg, rgba(0,0,0,0) 60%, rgba(255,120,60,0.55) 82%, rgba(255,200,120,0.2) 100%)" }} />
    </>
  );
};

/** Thin cinematic letterbox bars. */
export const Letterbox: React.FC<{ bar?: number }> = ({ bar = 40 }) => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: bar, background: palette.black, zIndex: 40 }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: bar, background: palette.black, zIndex: 40 }} />
  </>
);

/** Subtle projector gate-weave: tiny whole-frame drift + rotation. */
export const GateWeave: React.FC<{ children: React.ReactNode; amp?: number }> = ({ children, amp = 1 }) => {
  const frame = useCurrentFrame();
  const x = (Math.sin(frame * 0.6) + Math.sin(frame * 0.23 + 1)) * 0.9 * amp;
  const y = (Math.cos(frame * 0.5) + Math.sin(frame * 0.31)) * 0.7 * amp;
  const r = Math.sin(frame * 0.17) * 0.08 * amp;
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` }}>{children}</AbsoluteFill>;
};

/** SVG stage in 1920x1080 coordinates, with shared filters for DOF + glow. */
export const Stage: React.FC<{ children: React.ReactNode; blurBackdrop?: boolean }> = ({ children }) => (
  <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="dof" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="16" />
      </filter>
      <filter id="dofSoft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
      <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
      <filter id="glowBig" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="46" />
      </filter>
    </defs>
    {children}
  </svg>
);

/** A soft contact shadow ellipse. */
export const ContactShadow: React.FC<{ cx: number; cy: number; rx: number; ry: number; opacity?: number }> = ({ cx, cy, rx, ry, opacity = 0.55 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" opacity={opacity} filter="url(#glow)" />
);

/** Deterministic low-amplitude wobble. */
export const wobble = (frame: number, key: string, amp: number, speed = 0.15) =>
  Math.sin(frame * speed + random(key) * Math.PI * 2) * amp;

/** Slow cinematic push-in scale for a whole scene. */
export const usePushIn = (from = 1.0, to = 1.06) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, 240], [from, to]);
};
