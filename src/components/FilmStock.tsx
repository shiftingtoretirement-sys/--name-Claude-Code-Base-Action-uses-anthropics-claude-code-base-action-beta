import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate } from "remotion";
import { WIDTH, HEIGHT } from "../theme";

/**
 * Super-8 / faded-Kodachrome film emulation, layered OVER real photographic
 * media. Grade goes on the media element (see MediaClip); everything here is
 * the emulsion + projector artifacts: grain, halation, dust/hair/scratches,
 * warm light leaks, exposure flicker, gate weave, vignette and an optional
 * Super-8 gate mask + camcorder date stamp.
 */

const px = { position: "absolute" as const, inset: 0, pointerEvents: "none" as const };

/** Warm color layers that give the faded-film cast (lifted blacks + warm wash). */
const ColorLayers: React.FC<{ intensity: number }> = ({ intensity }) => (
  <>
    {/* lifted blacks: a low beige veil */}
    <div style={{ ...px, background: "#6b5836", mixBlendMode: "screen", opacity: 0.1 * intensity }} />
    {/* warm wash */}
    <div style={{ ...px, background: "#c98a3e", mixBlendMode: "soft-light", opacity: 0.35 * intensity }} />
    {/* cool the shadows a touch (teal) for that Ektachrome split */}
    <div style={{ ...px, background: "radial-gradient(ellipse 90% 90% at 50% 40%, rgba(0,0,0,0) 55%, rgba(20,60,60,0.5) 100%)", mixBlendMode: "multiply", opacity: 0.35 * intensity }} />
  </>
);

/** Warm halation glow biased to a bright region of the frame. */
const Halation: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => (
  <div style={{ ...px, mixBlendMode: "screen", opacity, background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,206,120,0.85), rgba(210,130,50,0.28) 34%, rgba(0,0,0,0) 66%)` }} />
);

/** Animated 16mm grain, re-seeded a few times a second, + moving dust & a scratch. */
const Grain: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 10;
  return (
    <>
      <svg width={WIDTH} height={HEIGHT} style={{ ...px, opacity, mixBlendMode: "overlay" }}>
        <filter id={`fs-grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={WIDTH} height={HEIGHT} filter={`url(#fs-grain-${seed})`} />
      </svg>
      <svg width={WIDTH} height={HEIGHT} style={px}>
        {/* dust specks flicking in and out */}
        {Array.from({ length: 7 }).map((_, i) => {
          const life = (frame + i * 9) % 34;
          if (life > 5) return null;
          const gx = random(`dx${i}${Math.floor((frame + i * 9) / 34)}`) * WIDTH;
          const gy = random(`dy${i}${Math.floor((frame + i * 9) / 34)}`) * HEIGHT;
          return <circle key={i} cx={gx} cy={gy} r={1.4 + random(`dr${i}`) * 2.4} fill={i % 2 ? "#000" : "#efe6cf"} opacity={0.55} />;
        })}
        {/* an intermittent vertical scratch that wanders */}
        {frame % 71 < 5 && (
          <path d={`M ${WIDTH * (0.28 + random(`sc${Math.floor(frame / 71)}`) * 0.5)} 0 q 10 ${HEIGHT / 2} -8 ${HEIGHT}`} stroke="#efe6cf" strokeWidth={1.4} fill="none" opacity={0.3} />
        )}
        {/* rare hair in the gate, bottom corner */}
        {frame % 113 < 8 && (
          <path d="M 120 1080 q 40 -120 10 -190 q -20 -50 30 -70" stroke="#0a0a0a" strokeWidth={2} fill="none" opacity={0.35} />
        )}
      </svg>
    </>
  );
};

/** Occasional warm light-leak sweeps (start bloom + a mid flare). */
const LightLeaks: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const open = interpolate(frame, [0, 8, 22, 34], [0.6, 0.34, 0.06, 0], { extrapolateRight: "clamp" });
  const mid = interpolate(frame, [durationInFrames * 0.55, durationInFrames * 0.66, durationInFrames * 0.8], [0, 0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ ...px, mixBlendMode: "screen", opacity: open * intensity, background: "radial-gradient(circle at 92% 8%, rgba(255,170,70,0.95), rgba(0,0,0,0) 46%)" }} />
      <div style={{ ...px, mixBlendMode: "screen", opacity: mid * intensity, background: "linear-gradient(118deg, rgba(0,0,0,0) 58%, rgba(255,110,50,0.6) 80%, rgba(255,190,110,0.25) 100%)" }} />
    </>
  );
};

/** Sub-frame exposure flicker, like a projector shutter. */
const Flicker: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();
  const f = (random(`fl${frame}`) - 0.5) * 0.12 * intensity;
  return <div style={{ ...px, background: f > 0 ? "#fff" : "#000", opacity: Math.abs(f) }} />;
};

const Vignette: React.FC<{ strength: number }> = ({ strength }) => (
  <div style={{ ...px, background: `radial-gradient(ellipse 74% 76% at 50% 46%, rgba(0,0,0,0) 40%, rgba(6,4,2,${strength}) 100%)` }} />
);

/** Optional rounded Super-8 gate: soft dark mask with slightly wobbly corners. */
const Super8Gate: React.FC = () => (
  <svg width={WIDTH} height={HEIGHT} style={px}>
    <defs>
      <mask id="s8mask">
        <rect width={WIDTH} height={HEIGHT} fill="#fff" />
        <rect x={34} y={26} width={WIDTH - 68} height={HEIGHT - 52} rx={54} fill="#000" />
      </mask>
    </defs>
    <rect width={WIDTH} height={HEIGHT} fill="#080604" mask="url(#s8mask)" />
  </svg>
);

export type FilmConfig = {
  intensity?: number; // overall strength of the emulation (0..1.5)
  halation?: { x: number; y: number; opacity: number };
  vignette?: number;
  gate?: boolean;
  weave?: number;
  leaks?: boolean; // sweeping light leaks — turn off to keep lighting stable
  grain?: number; // grain opacity override
};

export const FilmStock: React.FC<{ children: React.ReactNode; config?: FilmConfig }> = ({ children, config = {} }) => {
  const { intensity = 1, halation = { x: 50, y: 24, opacity: 0.24 }, vignette = 0.7, gate = false, weave = 1, leaks = true, grain = 0.16 } = config;
  const frame = useCurrentFrame();

  // Projector gate weave: small translate/rotate/scale breathing on the picture.
  const wx = (Math.sin(frame * 0.6) + Math.sin(frame * 0.23 + 1)) * 1.1 * weave;
  const wy = (Math.cos(frame * 0.5) + Math.sin(frame * 0.31)) * 0.9 * weave;
  const wr = Math.sin(frame * 0.17) * 0.09 * weave;
  const ws = 1.012 + Math.sin(frame * 0.28) * 0.004 * weave;

  return (
    <AbsoluteFill style={{ background: "#050403", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${wx}px, ${wy}px) rotate(${wr}deg) scale(${ws})` }}>
        {children}
      </AbsoluteFill>
      <ColorLayers intensity={intensity} />
      <Halation x={halation.x} y={halation.y} opacity={halation.opacity * intensity} />
      {leaks && <LightLeaks intensity={intensity} />}
      <Vignette strength={vignette} />
      <Grain opacity={grain * intensity} />
      <Flicker intensity={intensity} />
      {gate && <Super8Gate />}
    </AbsoluteFill>
  );
};

/** Iconic orange seven-segment-ish camcorder date stamp, bottom-right. */
export const DateStamp: React.FC<{ text?: string; blink?: boolean }> = ({ text = "AM 7:42  JUL 4 1984", blink = true }) => {
  const frame = useCurrentFrame();
  const on = !blink || Math.floor(frame / 20) % 2 === 0;
  return (
    <div style={{ position: "absolute", right: 56, bottom: 48, fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 34, letterSpacing: 2, color: "#ff9a2e", textShadow: "0 0 10px rgba(255,140,40,0.8), 0 2px 3px rgba(0,0,0,0.6)" }}>
      <span style={{ opacity: on ? 1 : 0.25 }}>▸</span>&nbsp;{text}
    </div>
  );
};
