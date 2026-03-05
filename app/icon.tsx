import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1889e1 0%, #0f588f 55%, #f67a1d 100%)",
          color: "#ffffff",
          fontSize: 28,
          fontWeight: 700,
          borderRadius: 16,
        }}
      >
        AV
      </div>
    ),
    size,
  );
}
