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
          background:
            "radial-gradient(circle at 10% 10%, rgba(24,137,225,0.28), transparent 35%), radial-gradient(circle at 90% 0%, rgba(246,122,29,0.32), transparent 32%), linear-gradient(180deg, #f4f7ff, #fff8ee)",
          color: "#0f172a",
          fontFamily: "Manrope",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7 }}>
          Advicely v5
        </div>
        <div style={{ fontSize: 70, lineHeight: 1.03, maxWidth: 940, fontWeight: 700 }}>
          Practical advice you can use right now.
        </div>
        <div style={{ fontSize: 30, opacity: 0.8 }}>
          Generate, save, find later, and share cleanly.
        </div>
      </div>
    ),
    size,
  );
}
