import { ImageResponse } from "next/og";

export const alt = "Advicely social preview showing advice and quote draw experience";

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
          padding: "56px",
          background:
            "radial-gradient(circle at 10% 8%, rgba(90, 130, 108, 0.2), transparent 28%), radial-gradient(circle at 88% 6%, rgba(190, 150, 88, 0.18), transparent 30%), linear-gradient(180deg, #f8f4e9, #efe8d7)",
          color: "#17120d",
          fontFamily: "DM Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.8,
            }}
          >
            Advicely
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(23,18,13,0.16)",
              fontSize: 18,
              letterSpacing: "0.04em",
              color: "#2b231b",
            }}
          >
            Advice + Quotes
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 980,
          }}
        >
          <div style={{ fontSize: 72, lineHeight: 1.01, fontWeight: 700 }}>
            Draw advice and quotes that are easy to keep.
          </div>
          <div style={{ fontSize: 32, lineHeight: 1.25, opacity: 0.88, maxWidth: 920 }}>
            Pull from live sources, save what resonates, and keep optional notes private on your device.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            fontSize: 22,
            color: "#2f2a23",
          }}
        >
          <div style={{ display: "flex", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.58)" }}>
            Source aware
          </div>
          <div style={{ display: "flex", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.58)" }}>
            Local notes
          </div>
          <div style={{ display: "flex", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.58)" }}>
            Fast draw flow
          </div>
        </div>
      </div>
    ),
    size,
  );
}
