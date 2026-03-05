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
          background: "radial-gradient(circle at 30% 20%, #3aa5ff, #101739 70%)",
          color: "#fff8ef",
          fontSize: 30,
          fontWeight: 700,
          borderRadius: 16,
        }}
      >
        AR
      </div>
    ),
    size,
  );
}
