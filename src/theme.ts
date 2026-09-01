/**
 * Shared design system for the "Shifting to Retirement" Gen-X graphics.
 * A faded-photo, harvest-gold, VHS-era palette. Brand accent is gold #E8A317,
 * pulled from the episode's script formatting.
 */

export const FPS = 30;
export const DURATION_SECONDS = 8;
export const DURATION_FRAMES = FPS * DURATION_SECONDS; // 240
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const palette = {
  brandGold: "#E8A317",
  harvest: "#D8A93A",
  cream: "#F4E9CE",
  paper: "#EFE1BE",
  tan: "#E4CE9B",
  burntOrange: "#C8641B",
  rust: "#A8402A",
  avocado: "#6E7B3D",
  teal: "#2E6B6B",
  brown: "#5B4A2E",
  darkBrown: "#3A2E1B",
  dusk: "#26324A",
  night: "#141726",
  charcoal: "#1C1710",
  ink: "#211B14",
  bone: "#FBF3DE",
  faded: "#B9A379",
};

export const fonts = {
  // Web-safe stacks so renders never depend on the network.
  title: `"Arial Black", "Helvetica Neue", Impact, system-ui, sans-serif`,
  serif: `Georgia, "Times New Roman", serif`,
  mono: `"Courier New", "Lucida Console", monospace`,
};

/** Consistent lower-third numbering for the 8-part reel. */
export const scenes = [
  { id: "01", key: "GardenHose", title: "The Garden Hose", label: "EXHIBIT 01" },
  { id: "02", key: "WayBack", title: "The Way-Back", label: "EXHIBIT 02" },
  { id: "03", key: "LawnDarts", title: "Lawn Darts", label: "EXHIBIT 03" },
  { id: "04", key: "KeyOnShoelace", title: "The Key on a Shoelace", label: "EXHIBIT 04" },
  { id: "05", key: "Streetlights", title: "Streetlights", label: "EXHIBIT 05" },
  { id: "06", key: "RotaryPhone", title: "The Rotary Phone", label: "EXHIBIT 06" },
  { id: "07", key: "Passbook", title: "The Passbook", label: "EXHIBIT 07" },
  { id: "08", key: "CalculatorWatch", title: "The Calculator-Watch Guy", label: "EXHIBIT 08" },
] as const;
