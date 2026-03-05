import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "*::placeholder": {
      color: "gray.500",
      opacity: 1,
    },
    "*:focus-visible": {
      outline: "2px solid",
      outlineColor: "utility.300",
      outlineOffset: "2px",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-display), 'Gill Sans', sans-serif" },
        body: { value: "var(--font-body), 'Avenir Next', sans-serif" },
      },
      colors: {
        utility: {
          50: { value: "#eff8ff" },
          100: { value: "#d9efff" },
          200: { value: "#b3defd" },
          300: { value: "#7dc5fb" },
          400: { value: "#46a9f4" },
          500: { value: "#1889e1" },
          600: { value: "#0e6fbc" },
          700: { value: "#0f588f" },
          800: { value: "#124d77" },
          900: { value: "#154062" },
          950: { value: "#10273e" },
        },
        signal: {
          50: { value: "#fff7ec" },
          100: { value: "#ffe8c9" },
          200: { value: "#ffd39b" },
          300: { value: "#ffb767" },
          400: { value: "#ff9643" },
          500: { value: "#f67a1d" },
          600: { value: "#dc620f" },
          700: { value: "#b3480f" },
          800: { value: "#8f3b14" },
          900: { value: "#743315" },
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
        brisk: { value: "140ms" },
        smooth: { value: "260ms" },
      },
      shadows: {
        float: { value: "0 14px 34px rgba(15, 23, 42, 0.08)" },
      },
    },
  },
});

export const advicelySystem = createSystem(defaultConfig, config);
