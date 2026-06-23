const LANDUSE_LABEL: Record<string, string> = {
  MNC: "Mặt nước công cộng",
  ODT: "Đất ở đô thị",
  CLN: "Cây lâu năm",
  BHK: "Bãi hoang, khe suối",
  DGT: "Đất giao thông",
  DVH: "Văn hóa",
  DYT: "Y tế",
  GD:  "Giáo dục",
  CQP: "Quốc phòng",
  TSC: "Trụ sở cơ quan",
};

const MATCH_SOURCE_LABEL: Record<string, string> = {
  within:    "Nằm trong vùng",
  intersect: "Giao cắt",
  centroid:  "Tâm điểm",
};

export default function ParcelPopup({ info, onClose }: { info: Record<string, any>; onClose: () => void }) {
  const landuse = info.landuse ?? "—";
  const landuseLabel = LANDUSE_LABEL[landuse] ?? landuse;

  return (
    <div style={{
      position: "absolute", top: 16, right: 16, width: 360,
      background: "#1a2332", borderRadius: 16, overflow: "hidden",
      fontFamily: "sans-serif", fontSize: 13, color: "#e0e6f0",
      border: "0.5px solid rgba(255,255,255,0.1)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 1000,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 16px", background: "#1e2c40",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(91,200,168,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
          🗺️
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#fff" }}>
            Thửa đất #{info.parcel_no ?? "—"}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: "#7a9ab0" }}>
            {landuseLabel}
          </p>
        </div>
        <button onClick={onClose} style={{
          cursor: "pointer", width: 28, height: 28, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", border: "none",
          color: "#aaa", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>×</button>
      </div>

      <p style={{ margin: 0, padding: "10px 16px 6px", fontSize: 11, fontWeight: 500, color: "#5bc8a8", letterSpacing: "0.5px", textTransform: "uppercase" }}>
        ✦ Thông tin thửa đất
      </p>
      <div style={{ margin: "0 12px 12px", background: "#14202e", borderRadius: 10, border: "0.5px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        {([
          ["Mã thửa", `#${info.parcel_no ?? "—"}`],
          ["Mục đích sử dụng", `${landuseLabel} (${landuse})`],
          ["Diện tích", `${Number(info.area_m2).toLocaleString("vi-VN")} m²`],
          ["Chủ sở hữu", info.owner ?? "Chưa có thông tin"],
          ["Nguồn khớp", MATCH_SOURCE_LABEL[info.match_source] ?? info.match_source],
        ] as [string, string][]).map(([label, value], i, arr) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 12px",
            borderBottom: i < arr.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
            gap: 12,
          }}>
            <span style={{ color: "#7a9ab0", fontSize: 12, whiteSpace: "nowrap" }}>{label}</span>
            <span style={{ color: !info.owner && label === "Chủ sở hữu" ? "#4a5a6a" : "#d4e4f0", fontSize: 12, textAlign: "right" }}>
              {value}
            </span>
          </div>
        ))}
      </div>
      <div style={{ height: 8 }} />
    </div>
  );
}