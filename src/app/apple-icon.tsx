import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// iOS home-screen icon: same "NG" mark at touch-icon resolution.
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
          background: "#ce1141",
          borderRadius: 36,
          color: "#ffffff",
          fontSize: 84,
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: -4,
        }}
      >
        NG
      </div>
    ),
    { ...size }
  );
}
