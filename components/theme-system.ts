import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-display), 'Trebuchet MS', sans-serif" },
        body: { value: "var(--font-body), 'Segoe UI', sans-serif" },
      },
      colors: {
        reactor: {
          50: { value: "#eef8ff" },
          100: { value: "#d8eeff" },
          200: { value: "#afd9ff" },
          300: { value: "#7dc1ff" },
          400: { value: "#4da6ff" },
          500: { value: "#1f88f6" },
          600: { value: "#0f6cca" },
          700: { value: "#0f5299" },
          800: { value: "#133f73" },
          900: { value: "#122f54" },
          950: { value: "#080f1f" },
        },
        ember: {
          50: { value: "#fff6ed" },
          100: { value: "#ffe7cc" },
          200: { value: "#ffd09e" },
          300: { value: "#ffb36a" },
          400: { value: "#ff9440" },
          500: { value: "#f97316" },
          600: { value: "#d95b0a" },
          700: { value: "#b1450a" },
          800: { value: "#8f370f" },
          900: { value: "#742f10" },
          950: { value: "#3f1908" },
        },
      },
      radii: {
        panel: { value: "1.25rem" },
      },
      spacing: {
        section: { value: "clamp(1.75rem, 1.2rem + 2vw, 3rem)" },
      },
      durations: {
        energetic: { value: "180ms" },
        smooth: { value: "320ms" },
      },
    },
  },
});

export const advicelySystem = createSystem(defaultConfig, config);
