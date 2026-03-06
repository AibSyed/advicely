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
          background: "linear-gradient(145deg, #3d7e5a 0%, #2d6446 52%, #d95a1e 100%)",
          color: "#fffaf0",
          fontSize: 64,
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
