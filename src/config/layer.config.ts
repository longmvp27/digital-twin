import {
  Camera,
  Wind,
  Droplets,
  TreePine,
  Route,
  Building2,
  Map,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type LayerConfigItem = {
  key: string;
  label: string;
  sub: string;
  icon: LucideIcon;
  color: string;
};

export const LAYERS = [
  { key: "camera", label: "Camera", sub: "2 thiết bị · online", icon: Camera, color: "#378ADD" },
  { key: "air", label: "Ô nhiễm không khí", sub: "AQI 100 · trung bình", icon: Wind, color: "#5DCAA5" },
  { key: "water", label: "Thủy hệ", sub: "Sông · hồ · kênh", icon: Droplets, color: "#22D3EE" },
  { key: "vegetation", label: "Thực vật", sub: "Cây xanh · công viên", icon: TreePine, color: "#4ADE80" },
  { key: "transport", label: "Giao thông", sub: "Đường · cầu · nút", icon: Route, color: "#FB923C" },
  { key: "residential", label: "Dân cư", sub: "Khu dân cư · nhà ở", icon: Building2, color: "#FB7185" },
  { key: "parcel", label: "Đất đai", sub: "40 ha · 65%", icon: Map, color: "#C9952C" },
  { key: "flood", label: "Ngập lụt", sub: "Mô phỏng mực nước", icon: Waves, color: "#3B82F6" },
  { key: "electric", label: "Năng lượng điện", sub: "Tiêu thụ · kWh/tháng", icon: Zap, color: "#FACC15" },
] as const satisfies readonly LayerConfigItem[];

export const STATS = [
  { val: "100", label: "AQI trung bình", color: "#5DCAA5" },
  { val: "2", label: "Camera online", color: "#378ADD" },
  { val: "1,247", label: "Thửa đất", color: "#9e6c0a" },
  { val: "4", label: "Trạm quan trắc", color: "#a78bfa" },
];