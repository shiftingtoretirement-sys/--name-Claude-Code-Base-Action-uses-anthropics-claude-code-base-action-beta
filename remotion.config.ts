/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);

// This session's outbound HTTPS is MITM'd by an agent proxy whose CA the
// bundled Chromium doesn't trust, so Google Fonts fetches fail with
// CERT_AUTHORITY_INVALID. Accept the proxy cert so fonts load at render time.
Config.setChromiumIgnoreCertificateErrors(true);

// Use a pre-installed Chromium if one is provided (the bundled headless shell
// can't be downloaded here). Set REMOTION_BROWSER_EXECUTABLE to override.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
