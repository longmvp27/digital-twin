"use client";
import { WaterSensorData } from "@/src/types/water.type";

interface Props {
  data: WaterSensorData;
  onClose: () => void;
  onSimulateFlood: () => void;
}

const STATUS_COLOR = {
  good:    "#5bc8a8",
  warning: "#f59e0b",
  danger:  "#E24B4A",
};

const STATUS_LABEL = {
  good:    "Tốt",
  warning: "Cảnh báo",
  danger:  "Nguy hiểm",
};

const SENSORS = [
  { key: "pH",  label: "pH",       device: "CPF81E"  },
  { key: "DO",  label: "DO",       device: "COS61D"  },
  { key: "TSS", label: "TSS",      device: "CUS51D"  },
  { key: "COD", label: "COD",      device: "CAS51D"  },
  { key: "NH4", label: "Ammonium", device: "CAS40D"  },
] as const;

export default function WaterPopup({ data, onClose, onSimulateFlood }: Props) {
  return (
    <div style={{
      position: "absolute",
      top: 16,
      right: 16,
      width: 360,
      background: "#1a2332",
      border: "0.5px solid rgba(255,255,255,0.1)",
      borderRadius: 16,
      overflow: "hidden",
      fontFamily: "sans-serif",
      color: "#e0e6f0",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      zIndex: 1000,
      maxHeight: "calc(100vh - 80px)",
      overflowY: "auto",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 16px",
        background: "#1e2c40",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: "rgba(56,189,248,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>💧</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#fff" }}>
            {data.lakeName}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: "#7a9ab0" }}>
            Cập nhật: {data.updatedAt}
          </p>
        </div>
        <button onClick={onClose} style={{
          cursor: "pointer", width: 28, height: 28, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#aaa", fontSize: 18, lineHeight: 1, flexShrink: 0,
        }}>×</button>
      </div>

      <p style={{
        margin: 0, padding: "10px 16px 6px",
        fontSize: 11, fontWeight: 500, color: "#5bc8a8",
        letterSpacing: "0.5px", textTransform: "uppercase",
      }}>✦ Chất lượng nước · E&H</p>

      <div style={{
        margin: "0 12px 8px",
        background: "#14202e",
        borderRadius: 10,
        border: "0.5px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
      }}>
        {SENSORS.map(({ key, label, device }, i) => {
          const sensor = data[key];
          const color = STATUS_COLOR[sensor.status];
          return (
            <div key={key} style={{
              display: "flex", alignItems: "center",
              padding: "9px 12px",
              borderBottom: i < SENSORS.length - 1
                ? "0.5px solid rgba(255,255,255,0.05)" : "none",
              gap: 8,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "#d4e4f0" }}>{label}</div>
                <div style={{ fontSize: 10, color: "#3a5268", marginTop: 1 }}>{device}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 13, color, fontFamily: "monospace", fontWeight: 500 }}>
                  {sensor.value}
                </span>
                {sensor.unit && (
                  <span style={{ fontSize: 10, color: "#4a6278", marginLeft: 3 }}>
                    {sensor.unit}
                  </span>
                )}
              </div>
              <div style={{
                background: `${color}18`,
                border: `0.5px solid ${color}44`,
                borderRadius: 20, padding: "2px 8px",
                display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
              }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
                <span style={{ fontSize: 10, color }}>{STATUS_LABEL[sensor.status]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* <p style={{
        margin: 0, padding: "10px 16px 6px",
        fontSize: 11, fontWeight: 500, color: "#5bc8a8",
        letterSpacing: "0.5px", textTransform: "uppercase",
      }}>✦ Mô phỏng</p>
      <div style={{ margin: "0 12px 12px" }}>
        <button
          onClick={onSimulateFlood}
          style={{
            width: "100%", padding: "10px",
            background: "rgba(30,144,255,0.12)",
            border: "0.5px solid rgba(30,144,255,0.3)",
            borderRadius: 10, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            color: "#60aadd", fontSize: 12,
            transition: "background .2s",
          }}
        >
          🌊 Mô phỏng ngập lụt khu vực này
        </button>
      </div> */}

      <div style={{ height: 4 }} />
    </div>
  );
}