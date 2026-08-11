import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { STATES, BORDERS_PATH, CITIES } from "../map/usaMapData";
import { COLORS, CONDENSED_FONT, DISPLAY_FONT, BODY_FONT } from "../theme";
import { DropPin, RedStar, LabelPlacement } from "../components/MapMarker";

// 8 seconds at 30fps.
export const SE_MAP_FPS = 30;
export const SE_MAP_DURATION = 240;

// Pins drop in radiating outward from Baton Rouge, so the zoom-out feels like
// the story opening up from home. Labels are hand-placed (offset from the pin
// tip, with a leader line) because several Gulf Coast towns sit almost on top
// of each other at the final framing.
const REVEALS: {
  key: keyof typeof CITIES;
  at: number;
  place: LabelPlacement;
}[] = [
  { key: "robert", at: 34, place: { lx: 20, ly: -50, anchor: "start" } },
  { key: "breauxBridge", at: 52, place: { lx: -22, ly: -8, anchor: "end" } },
  { key: "mccomb", at: 70, place: { lx: 0, ly: -50, anchor: "middle" } },
  { key: "biloxi", at: 88, place: { lx: -14, ly: 54, anchor: "end" } },
  { key: "oceanSprings", at: 106, place: { lx: 24, ly: 54, anchor: "start" } },
  { key: "gulfShores", at: 124, place: { lx: -14, ly: 78, anchor: "end" } },
  { key: "orangeBeach", at: 142, place: { lx: 22, ly: -50, anchor: "start" } },
  { key: "galveston", at: 160, place: { lx: -22, ly: -8, anchor: "end" } },
  { key: "gatlinburg", at: 182, place: { lx: 22, ly: -8, anchor: "start" } },
];

const STAR_AT = 8;

// Screen framing: where the map center should land and how tall the content
// band is (leaves room for the bottom brand bar).
const SCREEN_CX = 960;
const SCREEN_CY = 500;

// End framing computed from the spread of every marker, so the final hold
// fits the whole southeast region with margin.
const allX = Object.values(CITIES).map((c) => c.x);
const allY = Object.values(CITIES).map((c) => c.y);
const minX = Math.min(...allX);
const maxX = Math.max(...allX);
const minY = Math.min(...allY);
const maxY = Math.max(...allY);
const spanX = maxX - minX;
const spanY = maxY - minY;
const endCx = (minX + maxX) / 2;
const endCy = (minY + maxY) / 2;
const END_SCALE = Math.min((1920 * 0.62) / spanX, (1080 * 0.6) / spanY);

const START_SCALE = 7;
const bat = CITIES.batonRouge;

// Camera easing window: hold tight on Baton Rouge briefly, then ease the
// zoom-out, settling before the final hold.
const CAM_START = 18;
const CAM_END = 205;

export const SoutheastMap: React.FC = () => {
  const frame = useCurrentFrame();

  const camRaw = interpolate(frame, [CAM_START, CAM_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cam = Easing.inOut(Easing.cubic)(camRaw);

  const scale = interpolate(cam, [0, 1], [START_SCALE, END_SCALE]);
  const fx = interpolate(cam, [0, 1], [bat.x, endCx]);
  const fy = interpolate(cam, [0, 1], [bat.y, endCy]);

  // Screen = scale * map + translate.
  const tx = SCREEN_CX - fx * scale;
  const ty = SCREEN_CY - fy * scale;
  const toScreen = (p: { x: number; y: number }) => ({
    x: p.x * scale + tx,
    y: p.y * scale + ty,
  });

  // Gentle intro fade so the whole thing eases up from black.
  const introFade = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const batScreen = toScreen(bat);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoalDeep }}>
      {/* Ambient charcoal wash + subtle warm glow behind the region. */}
      <AbsoluteFill
        style={{
          background: [
            "radial-gradient(70% 60% at 50% 46%, rgba(255,199,0,0.06) 0%, rgba(255,199,0,0) 60%)",
            "linear-gradient(160deg, #16160f 0%, #111111 55%, #0b0b0b 100%)",
          ].join(","),
        }}
      />

      <AbsoluteFill style={{ opacity: introFade }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Map land + borders live in a single zoom/pan transform. */}
          <g transform={`translate(${tx}, ${ty}) scale(${scale})`}>
            <g>
              {STATES.map((s) => (
                <path
                  key={s.id}
                  d={s.d}
                  fill="#38352C"
                  stroke="none"
                />
              ))}
            </g>
            <path
              d={BORDERS_PATH}
              fill="none"
              stroke={COLORS.hazardYellow}
              strokeOpacity={0.9}
              strokeWidth={1.4}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          {/* Markers drawn in screen space so pins & labels stay a constant
              size regardless of zoom. */}
          {REVEALS.map((r) => {
            const p = toScreen(CITIES[r.key]);
            return (
              <DropPin
                key={r.key}
                x={p.x}
                y={p.y}
                label={CITIES[r.key].label}
                appearFrame={r.at}
                frame={frame}
                placement={r.place}
              />
            );
          })}

          <RedStar
            x={batScreen.x}
            y={batScreen.y}
            label={bat.label}
            appearFrame={STAR_AT}
            frame={frame}
          />
        </svg>
      </AbsoluteFill>

      {/* Brand bar — the "Shifting to Retirement" theme signature. */}
      <BrandBar />
    </AbsoluteFill>
  );
};

const BrandBar: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [6, 22], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [6, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        transform: `translateY(${rise}px)`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "22px 56px",
        background:
          "linear-gradient(0deg, rgba(11,11,11,0.92) 0%, rgba(11,11,11,0) 100%)",
      }}
    >
      <div
        style={{
          width: 14,
          height: 46,
          background: COLORS.hazardYellow,
          boxShadow: "3px 0 0 rgba(0,0,0,0.4)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 44,
            letterSpacing: 2,
            color: COLORS.offWhite,
          }}
        >
          SHIFTING TO RETIREMENT
        </span>
        <span
          style={{
            fontFamily: BODY_FONT,
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: COLORS.hazardYellow,
            marginTop: 6,
          }}
        >
          Our Gulf Coast Route
        </span>
      </div>
      <div style={{ flex: 1 }} />
      <span
        style={{
          fontFamily: CONDENSED_FONT,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 3,
          color: COLORS.offWhiteDim,
          textTransform: "uppercase",
        }}
      >
        ★ Baton Rouge, LA — Home Base
      </span>
    </div>
  );
};
