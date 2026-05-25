"use client";

import dynamic from "next/dynamic";
import { CityConfig } from "@/src/config/cities";

const CesiumViewer = dynamic(() => import("./cesium-viewer"), { ssr: false });

interface LayoutProps {
  config: CityConfig;
}

const Layout = ({ config }: LayoutProps) => {
  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
    }}>
      <img
        src="https://assets.yoolife.com.vn/yootek/1779695510809-1884.png"
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          height: 40,
          zIndex: 1000,
          pointerEvents: "none",
        }}
      />
      <CesiumViewer config={config} />
    </div>
  );
};

export default Layout;