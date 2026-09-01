/**
 * Shared design system — "Cinematic Archival Film".
 * A desaturated, warm faded-Kodachrome palette. Deep shadows, amber highlights,
 * a little teal in the low end. Brand accent gold #E8A317 used sparingly.
 */

export const FPS = 30;
export const DURATION_SECONDS = 8;
export const DURATION_FRAMES = FPS * DURATION_SECONDS; // 240
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const palette = {
  gold: "#E8A317",
  goldSoft: "#C9962E",
  amber: "#E7B15A",
  brass: "#B98B3E",
  cream: "#EDE3CC",
  bone: "#F3ECD9",
  paper: "#D9C9A4",
  faded: "#A78F63",
  clay: "#B4623A",
  rust: "#8F3F26",
  moss: "#5E6B44",
  teal: "#25514F",
  tealDeep: "#173432",
  brown: "#4A3A22",
  espresso: "#241A0F",
  ink: "#181209",
  black: "#0B0906",
  night: "#10131C",
  duskTop: "#1B2436",
  duskLow: "#5B4327",
};

// Fonts come from ./fonts (self-hosted). Re-exported for convenience.
export { fonts } from "./fonts";

/** The 8 exhibits, in script order. */
export const scenes = [
  { id: "01", key: "GardenHose", title: "The Garden Hose" },
  { id: "02", key: "WayBack", title: "The Way-Back" },
  { id: "03", key: "LawnDarts", title: "Lawn Darts" },
  { id: "04", key: "KeyOnShoelace", title: "The Key on a Shoelace" },
  { id: "05", key: "Streetlights", title: "Streetlights" },
  { id: "06", key: "RotaryPhone", title: "The Rotary Phone" },
  { id: "07", key: "Passbook", title: "The Passbook" },
  { id: "08", key: "CalculatorWatch", title: "The Calculator Watch" },
] as const;
