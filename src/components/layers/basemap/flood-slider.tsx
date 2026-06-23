"use client";
interface FloodSliderProps {
  level: number;
  onChange: (level: number) => void;
}

const LEVELS = [0, 1, 2, 3, 4, 5];

export default function FloodSlider({ level, onChange }: FloodSliderProps) {
  return (
    <div style={{
      background: "rgba(8,12,18,.88)",
      border: "0.5px solid #141d28",
      borderRadius: 10,
      padding: "10px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: 400,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13 }}>💧</span>
          <span style={{ fontSize: 12, color: "#b8cad8" }}>Mô phỏng ngập lụt</span>
        </div>
        <div style={{
          fontSize: 12,
          color: level === 0 ? "#3a5268" : level < 2 ? "#5DCAA5" : "#E24B4A",
          fontFamily: "monospace",
          background: "#080c12",
          border: "0.5px solid #141d28",
          borderRadius: 6,
          padding: "2px 8px",
        }}>
          {level === 0 ? "Bình thường" : `+${level}m`}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={5}
        step={0.1}
        value={level}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#1e90ff", cursor: "pointer" }}
      />

      <div
  style={{
    position: "relative",
    width: "100%",
    height: 20,
  }}
>
  {LEVELS.map((l) => (
    <span
      key={l}
      style={{
        position: "absolute",
        left: `${(l / 5) * 100}%`,
        transform: "translateX(-50%)",
        fontSize: 10,
        color: "#3a5268",
      }}
    >
      {l === 0 ? "0" : `${l}m`}
    </span>
  ))}
</div>
    </div>
  );
}