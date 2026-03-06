import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "*::placeholder": {
      color: "ink.400",
      opacity: 1,
    },
    "*:focus-visible": {
      outline: "2px solid",
      outlineColor: "accent.400",
      outlineOffset: "3px",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-display), 'Times New Roman', serif" },
        body: { value: "var(--font-body), 'Helvetica Neue', sans-serif" },
      },
      colors: {
        ink: {
          50: { value: "#f5f4ef" },
          100: { value: "#e6e2d7" },
          200: { value: "#cec6b3" },
          300: { value: "#a99c81" },
          400: { value: "#7a6d56" },
          500: { value: "#5d513f" },
          600: { value: "#473d2e" },
          700: { value: "#362e22" },
          800: { value: "#241e16" },
          900: { value: "#17120d" },
        },
        paper: {
          50: { value: "#fffdf7" },
          100: { value: "#fbf5e8" },
          200: { value: "#f3ead6" },
          300: { value: "#eadab8" },
          400: { value: "#dec594" },
          500: { value: "#cfab69" },
          600: { value: "#b38a3f" },
          700: { value: "#8c692a" },
          800: { value: "#634816" },
          900: { value: "#3b2908" },
        },
        accent: {
          50: { value: "#eef8f1" },
          100: { value: "#d3ebda" },
          200: { value: "#acd7ba" },
          300: { value: "#7cbc95" },
          400: { value: "#4f9a71" },
          500: { value: "#3d7e5a" },
          600: { value: "#2d6446" },
          700: { value: "#234e37" },
          800: { value: "#193828" },
          900: { value: "#101f16" },
        },
        ember: {
          50: { value: "#fff4ec" },
          100: { value: "#ffe0cc" },
          200: { value: "#ffc09a" },
          300: { value: "#ff9a62" },
          400: { value: "#f67534" },
          500: { value: "#d95a1e" },
          600: { value: "#b54618" },
          700: { value: "#8e3517" },
          800: { value: "#682713" },
          900: { value: "#42180a" },
        },
      },
      radii: {
        panel: { value: "1.5rem" },
      },
      spacing: {
        section: { value: "clamp(2rem, 1.2rem + 2vw, 3.75rem)" },
      },
      durations: {
        brisk: { value: "140ms" },
        smooth: { value: "220ms" },
      },
      shadows: {
        float: { value: "0 20px 48px rgba(23, 18, 13, 0.12)" },
      },
    },
  },
});

export const advicelySystem = createSystem(defaultConfig, config);
