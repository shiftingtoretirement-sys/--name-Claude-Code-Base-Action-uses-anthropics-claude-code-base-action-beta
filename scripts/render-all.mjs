// Renders all eight compositions to out/*.mp4 in one pass.
// Usage: npm run render:all   (optionally: node scripts/render-all.mjs 01 05)
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "out");
fs.mkdirSync(outDir, { recursive: true });

const filter = process.argv.slice(2); // e.g. ["03"] renders only ids containing "03"

const run = async () => {
  console.log("Bundling…");
  const serveUrl = await bundle({
    entryPoint: path.join(root, "src/index.ts"),
    onProgress: (p) => process.stdout.write(`\r  bundle ${p}%   `),
  });
  console.log("\nBundle ready.");

  const ids = [
    "01-GardenHose",
    "02-WayBack",
    "03-LawnDarts",
    "04-KeyOnShoelace",
    "05-Streetlights",
    "06-RotaryPhone",
    "07-Passbook",
    "08-CalculatorWatch",
  ].filter((id) => filter.length === 0 || filter.some((f) => id.includes(f)));

  for (const id of ids) {
    const composition = await selectComposition({ serveUrl, id });
    const outputLocation = path.join(outDir, `${id}.mp4`);
    console.log(`\n▶ Rendering ${id} → out/${id}.mp4`);
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation,
      onProgress: ({ progress }) => process.stdout.write(`\r  ${Math.round(progress * 100)}%   `),
    });
    console.log(`\n✓ ${id} done`);
  }
  console.log("\nAll renders complete → ./out");
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
