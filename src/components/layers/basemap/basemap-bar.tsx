const BASEMAP_LAYERS = [
  { color: "#38bdf8", label: "Thủy hệ" },
  { color: "#22c55e", label: "Thực vật" },
  { color: "#dd3636", label: "Giao thông" },
  { color: "#a78bfa", label: "Dân cư" },
];

export default function BasemapBar() {
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
        Lớp nền bản đồ
      </p>
      <div
        style={{
          display: "flex",
          borderRadius: 6,
          overflow: "hidden",
          height: 40,
        }}
      >
        {BASEMAP_LAYERS.map((layer) => (
          <div
            key={layer.label}
            style={{
              flex: 1,
              background: layer.color,
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
                color: "white",
                textAlign: "center",
                lineHeight: 1.3,
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {layer.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}