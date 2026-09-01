import { loadFont } from "@remotion/fonts";
import { playfair500, playfairItalic, archivo500, archivo600 } from "./fontsData";

/**
 * Editorial fonts embedded as base64 data URIs (see fontsData.ts). Loading from
 * a data: URL means no network and no dev-server fetch at render time, so the
 * font's delayRender clears instantly in every tab — fully deterministic and
 * safe under the media renderer's concurrency.
 */

export const DISPLAY = "Playfair Display"; // high-contrast Didone serif
export const SANS = "Archivo"; // clean grotesque for labels/kickers

let started = false;
export const ensureFonts = () => {
  if (started) return;
  started = true;
  loadFont({ family: DISPLAY, url: playfair500, weight: "500", format: "woff2" });
  loadFont({ family: DISPLAY, url: playfairItalic, weight: "400", style: "italic", format: "woff2" });
  loadFont({ family: SANS, url: archivo500, weight: "500", format: "woff2" });
  loadFont({ family: SANS, url: archivo600, weight: "600", format: "woff2" });
};

ensureFonts();

export const fonts = {
  display: `"${DISPLAY}", Georgia, "Times New Roman", serif`,
  sans: `"${SANS}", "Helvetica Neue", Arial, sans-serif`,
};
