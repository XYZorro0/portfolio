import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Browser-tab icon: the "NG" mark on Rockets red, matching the nav logo.
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
          background: "#ce1141",
          borderRadius: 7,
          color: "#ffffff",
          fontSize: 15,
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: -1,
        }}
      >
        NG
      </div>
    ),
    { ...size }
  );
}
