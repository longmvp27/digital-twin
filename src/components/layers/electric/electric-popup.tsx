// electric-popup.tsx
"use client";

import { useEffect, useRef } from "react";
import { EnergyInfo } from "@/src/types/electric.type";
import HourlyChart from "./hourly-chart";

interface Props {
  info: EnergyInfo;
  onClose: () => void;
}

const ROW = (label: string, value: string) => (
  <tr key={label}>
    <td style={{ padding: "6px 10px", color: "#7a9ab0", fontSize: 12, borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
      {label}
    </td>
    <td style={{ padding: "6px 10px", color: "#d4e4f0", fontSize: 12, fontFamily: "monospace", borderBottom: "0.5px solid rgba(255,255,255,0.05)", textAlign: "right" }}>
      {value}
    </td>
  </tr>
);

export default function EnergyPopup({ info, onClose }: Props) {
  const fmt = (n: number) => n.toLocaleString("vi-VN");
  const range = (a: number, b: number, unit: string) => `${fmt(a)} – ${fmt(b)} ${unit}`;

  return (
    <div style={{
      position: "absolute", top: 16, right: 16, width: 360,
      background: "#1a2332", border: "0.5px solid rgba(255,255,255,0.1)",
      borderRadius: 16, overflow: "hidden", fontFamily: "sans-serif",
      color: "#e0e6f0", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      zIndex: 1000, maxHeight: "calc(100vh - 80px)", overflowY: "auto",
    }}>
      <div style={{
        padding: "14px 16px", background: "#1e2c40",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 12, color: "#5bc8a8", marginBottom: 2 }}>⚡ Năng lượng điện</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{info.buildingName ?? info.gmlId}</div>
          <div style={{ fontSize: 10, color: "#7a9ab0", marginTop: 2 }}>{info.gmlId}</div>
        </div>
        <button onClick={onClose} style={{
          cursor: "pointer", width: 28, height: 28, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#aaa", fontSize: 18, lineHeight: 1, flexShrink: 0,
        }}>×</button>
      </div>

      <p style={{ margin: 0, padding: "10px 16px 6px", fontSize: 11, fontWeight: 500, color: "#5bc8a8", letterSpacing: "0.5px", textTransform: "uppercase" }}>
        ✦ Chỉ tiêu tiêu thụ
      </p>
      <div style={{ margin: "0 12px 8px", background: "#14202e", borderRadius: 10, border: "0.5px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {ROW("Diện tích sàn", `${fmt(info.floorArea)} m²`)}
            {ROW("Tổng điện năng tháng", range(...info.monthlyKwh, "kWh"))}
            {ROW("Suất tiêu thụ", range(...info.kwhPerM2, "kWh/m²/tháng"))}
            {ROW("Điện năng HVAC", range(...info.hvacPercent, "%"))}
            {ROW("Điện năng chiếu sáng", range(...info.lightingPercent, "%"))}
            {ROW("Điện năng ổ cắm", range(...info.socketPercent, "%"))}
          </tbody>
        </table>
      </div>

      <p style={{ margin: 0, padding: "10px 16px 6px", fontSize: 11, fontWeight: 500, color: "#5bc8a8", letterSpacing: "0.5px", textTransform: "uppercase" }}>
        ✦ Phân bổ điện năng
      </p>
      <div style={{ margin: "0 12px 12px", background: "#14202e", borderRadius: 10, border: "0.5px solid rgba(255,255,255,0.07)", padding: "10px 12px" }}>
        {[
          { label: "HVAC", pct: info.hvacPercent[0], color: "#378ADD" },
          { label: "Chiếu sáng", pct: info.lightingPercent[0], color: "#5bc8a8" },
          { label: "Ổ cắm", pct: info.socketPercent[0], color: "#a78bfa" },
        ].map(({ label, pct, color }) => (
          <div key={label} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#7a9ab0" }}>{label}</span>
              <span style={{ fontSize: 11, color, fontFamily: "monospace" }}>{pct}%</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ theo giờ */}
      {info.hourlyKwh && info.hourlyKwh.length === 24 && (
        <>
          <p style={{ margin: 0, padding: "10px 16px 6px", fontSize: 11, fontWeight: 500, color: "#5bc8a8", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            ✦ Tiêu thụ theo giờ
          </p>
          <div style={{ margin: "0 12px 12px", background: "#14202e", borderRadius: 10, border: "0.5px solid rgba(255,255,255,0.07)", padding: "10px 12px" }}>
            <HourlyChart data={info.hourlyKwh} />
            <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
              {[
                { color: "#1D9E75", label: "Thấp điểm" },
                { color: "#378ADD", label: "Bình thường" },
                { color: "#E24B4A", label: "Cao điểm" },
                { color: "#F0997B", label: "Trung bình", dashed: true },
              ].map(({ color, label, dashed }) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#7a9ab0" }}>
                  <span style={{
                    width: 16, height: dashed ? 0 : 8,
                    borderTop: dashed ? `1.5px dashed ${color}` : "none",
                    background: dashed ? "none" : color,
                    borderRadius: dashed ? 0 : 2,
                    display: "inline-block",
                  }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      <div style={{ height: 8 }} />
    </div>
  );
}