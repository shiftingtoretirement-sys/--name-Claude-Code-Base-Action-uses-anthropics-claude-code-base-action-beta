/**
 * Regenerate the narration WAVs in public/voiceover/ with a premium AI voice.
 *
 * The committed clips are produced offline with espeak-ng (robotic but
 * dependency-free). Run this to replace them with ElevenLabs speech:
 *
 *   ELEVENLABS_API_KEY=sk_... node generate-voiceover.mjs
 *   npx remotion render ShiftingToRetirement out/shifting-to-retirement.mp4
 *
 * It requests raw PCM and wraps it in a WAV header, writing the SAME filenames
 * the composition already references (scene-1/2/3.wav) — so no code changes are
 * needed, just a re-render.
 *
 * Optional env:
 *   ELEVENLABS_VOICE_ID  (default: "onwK4e9ZLuTAKqWW03F9" — "Daniel", calm male)
 *   ELEVENLABS_MODEL_ID  (default: "eleven_multilingual_v2")
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("Set ELEVENLABS_API_KEY in the environment first.");
  process.exit(1);
}

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "onwK4e9ZLuTAKqWW03F9";
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";
const SAMPLE_RATE = 22050;
const OUTPUT_FORMAT = `pcm_${SAMPLE_RATE}`;

// Keep these in sync with NARRATION.md. Each line is authored to land inside
// its 7-second scene.
const SCENES = [
  {
    file: "public/voiceover/scene-1.wav",
    text: "How long must your money last? A healthy fifty-five-year-old can expect to reach eighty-five — about thirty years.",
  },
  {
    file: "public/voiceover/scene-2.wav",
    text: "But spending isn't flat. High in the go-go years, it dips mid-retirement, then climbs late for care. The retirement smile.",
  },
  {
    file: "public/voiceover/scene-3.wav",
    text: "Yet a disciplined portfolio, drawing four percent, keeps growing — past Medicare and RMDs — to near two point eight million.",
  },
];

// Wrap raw little-endian 16-bit mono PCM in a minimal WAV container.
function pcmToWav(pcm, sampleRate) {
  const header = Buffer.alloc(44);
  const dataSize = pcm.length;
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28); // byte rate (mono * 16-bit)
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcm]);
}

for (const scene of SCENES) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=${OUTPUT_FORMAT}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/pcm",
      },
      body: JSON.stringify({
        text: scene.text,
        model_id: MODEL_ID,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.2 },
      }),
    },
  );

  if (!res.ok) {
    console.error(`ElevenLabs error ${res.status}: ${await res.text()}`);
    process.exit(1);
  }

  const pcm = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(scene.file), { recursive: true });
  writeFileSync(scene.file, pcmToWav(pcm, SAMPLE_RATE));
  const seconds = pcm.length / (SAMPLE_RATE * 2);
  console.log(`Wrote ${scene.file} (${seconds.toFixed(2)}s)`);
}

console.log(
  "\nDone. If any clip runs longer than ~7s it will overlap the next scene —" +
    " shorten that line in SCENES (and NARRATION.md) and re-run.",
);
