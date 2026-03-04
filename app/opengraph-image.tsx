import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Advicely Momentum Coach";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg, #0b1026, #31103f 60%, #f72585)", color: "#fff", padding: "56px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontSize: 28, letterSpacing: "0.35em" }}>ADVICELY</div>
        <div style={{ fontSize: 82, lineHeight: 1 }}>Gamified Momentum Coach</div>
      </div>
    ),
    size
  );
}
