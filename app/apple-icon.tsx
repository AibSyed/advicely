import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "radial-gradient(circle at 25% 20%, #ff6bb8, #0b1026)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 82, fontWeight: 800 }}>
        A
      </div>
    ),
    size
  );
}
