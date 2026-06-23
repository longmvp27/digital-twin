const AQI_LEVELS = [
  { label: "Tốt", color: "#9cd84e", text: "#005500" },
  { label: "Trung bình", color: "#fdd64b", text: "#666600" },
  { label: "Nhạy cảm", color: "#ff9b57", text: "#7a3c00" },
  { label: "Không tốt", color: "#fe6a69", text: "#ffffff" },
  {
    label: "Rất không tốt",
    color: "#a97abc",
    text: "#f0d0f5",
  },
  { label: "Nguy hiểm", color: "#a87383", text: "#ffc0d0" },
];

export default function AirBar() {
  return (
    <div
      style={{
        background: "rgba(12,17,23,0.85)",
        borderRadius: 10,
        padding: "8px 12px",
        zIndex: 10,
      }}
    >
      <p style={{ fontSize: 11, color: "#aaa", margin: "0 0 6px" }}>
        Chất lượng không khí (AQI)
      </p>
      <div
        style={{
          display: "flex",
          borderRadius: 6,
          overflow: "hidden",
          height: 40,
        }}
      >
        {AQI_LEVELS.map((level) => (
          <div
            key={level.label}
            style={{
              flex: 1,
              background: level.color,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6px",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: level.text,
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              {level.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
