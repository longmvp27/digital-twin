"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  data: number[];
}

export default function HourlyChart({ data }: Props) {
  const chartData = data.map((value, hour) => ({
    hour: `${hour}h`,
    value,
  }));

  const avg = data.reduce((a, b) => a + b, 0) / data.length;

  const getColor = (v: number) => {
    if (v > 700) return "#E24B4A";
    if (v < 300) return "#1D9E75";
    return "#378ADD";
  };

  return (
    <div style={{ width: "100%", height: 160 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="hour"
            interval={2}
            tick={{ fill: "#7a9ab0", fontSize: 9 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#7a9ab0", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
          />
          <Tooltip
            contentStyle={{
              background: "#1e2c40",
              border: "0.5px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 11,
            }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#d4e4f0" }}
            formatter={(value: number) => [`${value.toFixed(2)} kWh`, "Tiêu thụ"]}
          />
          <ReferenceLine
            y={avg}
            stroke="#F0997B"
            strokeDasharray="4 3"
            strokeWidth={1}
            label={{ value: "TB", position: "right", fill: "#F0997B", fontSize: 9 }}
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}