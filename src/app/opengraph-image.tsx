import { ImageResponse } from "next/og";

export const alt =
  "Sound — Developer. Thoughtful web experiences, built with care.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#0B0D10",
        color: "#F5F5F2",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 19,
          letterSpacing: "4px",
        }}
      >
        <span>DEVELOPER PORTFOLIO</span>
        <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
          <path d="M22 22H66V66H22V22Z" stroke="#6895FF" strokeWidth="2" />
          <path
            d="M44 10L78 44L44 78L10 44L44 10Z"
            stroke="#F5F5F2"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          fontSize: 196,
          fontWeight: 700,
          letterSpacing: "-13px",
          lineHeight: 1,
        }}
      >
        Sound<span style={{ color: "#6895FF" }}>.</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #363A43",
          paddingTop: 30,
          fontSize: 27,
          color: "#B8BBC4",
        }}
      >
        Thoughtful web experiences, built with care.
      </div>
    </div>,
    size,
  );
}
