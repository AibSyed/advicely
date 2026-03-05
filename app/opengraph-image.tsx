import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "radial-gradient(circle at 20% 20%, #2f9bff 0%, #0d1a3e 45%, #130b2a 100%)",
          color: "#f8fbff",
          fontFamily: "Inter",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.85 }}>
          Advicely Reactor
        </div>
        <div style={{ fontSize: 72, lineHeight: 1.03, maxWidth: 900, fontWeight: 700 }}>
          One click. Better advice. Repeatable momentum.
        </div>
        <div style={{ fontSize: 30, opacity: 0.92 }}>
          Adaptive tone, fallback intelligence, and daily progress loops.
        </div>
      </div>
    ),
    size,
  );
}
