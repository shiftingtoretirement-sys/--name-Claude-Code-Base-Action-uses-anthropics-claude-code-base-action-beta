import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// Display / numbers / headers — tall industrial caps.
export const { fontFamily: DISPLAY_FONT } = loadBebas("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// Condensed sans for labels and mid-weight headers.
export const { fontFamily: CONDENSED_FONT } = loadBarlow("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

// Body / small print.
export const { fontFamily: BODY_FONT } = loadInter("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// Brand palette.
export const COLORS = {
  hazardYellow: "#FFC700",
  hazardYellowDim: "#B8901A",
  charcoal: "#1A1A1A",
  charcoalDeep: "#111111",
  offWhite: "#F2F2F2",
  offWhiteDim: "rgba(242, 242, 242, 0.6)",
  offWhiteFaint: "rgba(242, 242, 242, 0.35)",
  stripeBlack: "#0D0D0D",
} as const;

// Title-safe inset (~5% of frame each side => content within ~90%).
export const SAFE_MARGIN = 96;
