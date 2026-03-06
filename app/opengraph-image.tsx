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
            "radial-gradient(circle at 12% 8%, rgba(79,154,113,0.18), transparent 26%), radial-gradient(circle at 88% 0%, rgba(246,117,52,0.16), transparent 24%), linear-gradient(180deg, #fffaf1, #f3ead6)",
          color: "#17120d",
          fontFamily: "DM Sans",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.72 }}>
          Advicely v6
        </div>
        <div style={{ fontSize: 68, lineHeight: 1.02, maxWidth: 980, fontWeight: 700 }}>
          Random advice and quotes, clearly sourced.
        </div>
        <div style={{ fontSize: 30, opacity: 0.84, maxWidth: 760 }}>
          Draw, save, and revisit what matters. Personal notes stay local to your browser.
        </div>
      </div>
    ),
    size,
  );
}
