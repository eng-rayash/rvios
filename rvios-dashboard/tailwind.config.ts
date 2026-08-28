import type { Config } from "tailwindcss";

/**
 * كل القيم البصرية تأتي من preset التوكنز المولَّد.
 * لا تضف ألواناً أو مسافات هنا — أضفها في packages/design-tokens.
 */
const config: Config = {
  presets: [require("@rvios/design-tokens/preset")],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
};

export default config;
