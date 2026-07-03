import { ImageResponse } from "next/og";

export const alt = "Niket Gupta — AI/ML Engineer & Full-Stack Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse 80% 60% at 75% 25%, rgba(206,17,65,0.45), transparent 60%), radial-gradient(ellipse 60% 50% at 15% 85%, rgba(122,10,38,0.4), transparent 65%), #0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 24px",
            borderRadius: 9999,
            border: "1px solid rgba(239,68,68,0.35)",
            background: "rgba(239,68,68,0.1)",
            color: "#fca5a5",
            fontSize: 22,
            letterSpacing: 6,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: "#34d399",
            }}
          />
          AVAILABLE FOR OPPORTUNITIES
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 130,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          <span style={{ color: "#ffffff" }}>Niket</span>
          <span
            style={{
              backgroundImage:
                "linear-gradient(90deg, #ce1141, #f87171, #fda4af)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Gupta
          </span>
        </div>
        <div
          style={{
            marginTop: 44,
            color: "#9ca3af",
            fontSize: 34,
            textAlign: "center",
          }}
        >
          AI/ML Engineer & Full-Stack Developer
        </div>
        <div
          style={{
            marginTop: 28,
            color: "#f87171",
            fontSize: 26,
            letterSpacing: 4,
          }}
        >
          niketgupta.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
