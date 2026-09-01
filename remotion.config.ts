import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Concurrency left to Remotion's default; scenes are lightweight SVG/CSS.
Config.setChromiumOpenGlRenderer("angle");
