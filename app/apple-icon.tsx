import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1889e1 0%, #0f588f 58%, #f67a1d 100%)",
          color: "#ffffff",
          fontSize: 68,
          fontWeight: 700,
          borderRadius: 32,
        }}
      >
        A
      </div>
    ),
    size,
  );
}
