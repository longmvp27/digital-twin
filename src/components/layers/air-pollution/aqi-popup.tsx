import { AqiStation } from "@/src/types/aqi.type";
import { aqiColor, aqiLabel } from "@/src/utils/aqi.utils";

export default function AqiPopup({ station, onClose }: { station: AqiStation; onClose: () => void }) {
  const aqi = Number(station.aqi);
  const color = aqiColor(aqi);
  const label = aqiLabel(aqi);
  const time = new Date(station.time.iso).toLocaleString("vi-VN");
  const p = station.pollutants;
  const w = station.weather;

  const pollutantRows: [string, number | null][] = [
    ["PM2.5", p?.pm25 ?? null],
    ["PM10",  p?.pm10 ?? null],
    ["Ozone (O₃)", p?.o3 ?? null],
    ["NO₂",  p?.no2 ?? null],
    ["SO₂",  p?.so2 ?? null],
    ["CO",   p?.co  ?? null],
  ];

  const weatherRows: [string, number | null, string][] = [
    ["Nhiệt độ",   w?.temperature ?? null, "°C"],
    ["Độ ẩm",      w?.humidity    ?? null, "%"],
    ["Áp suất",    w?.pressure    ?? null, "hPa"],
    ["Gió",        w?.wind        ?? null, "m/s"],
    ["Điểm sương", w?.dew         ?? null, "°C"],
  ];

  const Card = ({ rows }: { rows: [string, string][] }) => (
    <div style={{ margin: "0 12px 8px", background: "#14202e", borderRadius: 10, border: "0.5px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
      {rows.map(([label, value], i) => (
        <div key={label} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 12px",
          borderBottom: i < rows.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
          gap: 12,
        }}>
          <span style={{ color: "#7a9ab0", fontSize: 12 }}>{label}</span>
          <span style={{ color: value === "—" ? "#4a5a6a" : "#d4e4f0", fontSize: 12, textAlign: "right" }}>{value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{
      position: "absolute", top: 16, right: 16, width: 360,
      background: "#1a2332", borderRadius: 16, overflow: "hidden",
      fontFamily: "sans-serif", fontSize: 13, color: "#e0e6f0",
      border: "0.5px solid rgba(255,255,255,0.1)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 1000,
      maxHeight: "calc(100vh - 80px)", overflowY: "auto",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 16px", background: "#1e2c40",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{aqi}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {station.station.name}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: "#7a9ab0" }}>#{station.uid} · {label}</p>
        </div>
        <button onClick={onClose} style={{
          cursor: "pointer", width: 28, height: 28, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", border: "none",
          color: "#aaa", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>×</button>
      </div>

      <p style={{ margin: 0, padding: "10px 16px 6px", fontSize: 11, fontWeight: 500, color: "#5bc8a8", letterSpacing: "0.5px", textTransform: "uppercase" }}>
        ✦ Chất ô nhiễm (AQI)
      </p>
      <Card rows={pollutantRows.map(([l, v]) => [l, v != null ? String(v) : "—"])} />

      <p style={{ margin: 0, padding: "10px 16px 6px", fontSize: 11, fontWeight: 500, color: "#5bc8a8", letterSpacing: "0.5px", textTransform: "uppercase" }}>
        ✦ Thời tiết
      </p>
      <Card rows={weatherRows.map(([l, v, u]) => [l, v != null ? `${v} ${u}` : "—"])} />

      <p style={{ margin: "4px 16px 12px", fontSize: 10, color: "#4a5a6a", textAlign: "right" }}>
        Cập nhật: {time}
      </p>
    </div>
  );
}