"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { CityConfig } from "@/src/config/cities.config";
import { LayerKey } from "@/src/types/layers.type";
import { LAYERS, STATS } from "@/src/config/layer.config";

const CesiumViewer = dynamic(() => import("../cesium/cesium-viewer"), {
  ssr: false,
});


export default function Layout({ config }: { config: CityConfig }) {
  const [active, setActive] = useState<Record<LayerKey, boolean>>({
    camera: false,
    air: false,
    water: false,
    vegetation: false,
    transport: false,
    residential: false,
    parcel: false,
    flood: false,
    electric: false,
  });
  const [clock, setClock] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loadingLayers, setLoadingLayers] = useState<
    Partial<Record<LayerKey, boolean>>
  >({});

  const handleLayerLoading = useCallback((layer: string, loading: boolean) => {
    setLoadingLayers((prev) => ({ ...prev, [layer]: loading }));
  }, []);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const p = (x: number) => String(x).padStart(2, "0");
      setClock(`${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const toggle = (key: LayerKey) =>
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));

  const activeCount = Object.values(active).filter(Boolean).length;
  const isDashboard = !!config.showDashboard;

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isDashboard && (
        <div
          style={{
            height: 46,
            background: "rgba(8,12,18,.92)",
            borderBottom: "0.5px solid #141d28",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 12,
            flexShrink: 0,
            zIndex: 200,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#1d9e75",
              }}
            />
            <img src="/tab-logo.svg" style={{ height: 40 }} />
            <img
              src="/tphn-logo.svg"
              style={{ height: 40, background: "white", borderRadius: "6px" }}
            />
          </div>
          <div style={{ width: "0.5px", height: 18, background: "#141d28" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4a6278"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span style={{ fontSize: 12, color: "#4a6278" }}>
              {config.name ?? "City"}
            </span>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "#0a1f16",
                border: "0.5px solid #0f4030",
                borderRadius: 99,
                padding: "3px 9px",
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#1d9e75",
                }}
              />
              <span style={{ fontSize: 11, color: "#1d9e75" }}>Live</span>
            </div>
            <span
              style={{
                fontSize: 11,
                color: "#2d4155",
                fontFamily: "monospace",
              }}
            >
              {clock}
            </span>
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              style={{
                background: "none",
                border: "0.5px solid #1a2535",
                borderRadius: 6,
                padding: "4px 7px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#4a6278",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {sidebarOpen ? (
                  <>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                  </>
                ) : (
                  <>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <CesiumViewer
            config={config}
            activeLayers={active}
            onLayerLoadingChange={handleLayerLoading}
          />
        </div>

        {isDashboard && (
          <div
            style={{
              width: sidebarOpen ? 256 : 0,
              background: "#0c1117",
              borderLeft: "0.5px solid #141d28",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              overflowY: sidebarOpen ? "auto" : "hidden",
              overflowX: "hidden",
              transition: "width .25s ease",
            }}
          >
            <div
              style={{
                padding: "14px 16px 12px",
                borderBottom: "0.5px solid #141d28",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: "#3a5268",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                Bảng điều khiển
              </div>
              <div style={{ fontSize: 11, color: "#2d4155", marginTop: 2 }}>
                {LAYERS.length} lớp · {activeCount} đang bật
              </div>
            </div>

            <div
              style={{
                padding: "10px 16px 4px",
                borderBottom: "0.5px solid #0f161f",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#253545",
                  textTransform: "uppercase",
                  letterSpacing: ".09em",
                  marginBottom: 8,
                }}
              >
                Lớp hiển thị
              </div>
              {LAYERS.map((layer) => {
                const on = active[layer.key as LayerKey];
                const isLoading = !!loadingLayers[layer.key as LayerKey];
                const Icon = layer.icon;

                return (
                  <div
                    key={layer.key}
                    onClick={() => toggle(layer.key as LayerKey)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "7px 8px",
                      borderRadius: 8,
                      cursor: "pointer",
                      marginBottom: 2,
                      background: on ? "#0d1d16" : "transparent",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 10,
                        flexShrink: 0,
                        background: on
                          ? `${layer.color}29`
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${on ? `${layer.color}59` : "rgba(255,255,255,0.06)"}`,
                        transition:
                          "background .2s ease, border-color .2s ease",
                      }}
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.75}
                        color={on ? layer.color : "#4a6278"}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          color: on ? "#b8cad8" : "#4a6278",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {layer.label}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: on ? "#3a5a48" : "#253545",
                          marginTop: 1,
                        }}
                      >
                        {isLoading ? (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <span style={{ color: "#5DCAA5" }}>Đang tải</span>
                            <span
                              style={{
                                display: "inline-block",
                                width: 40,
                                height: 2,
                                borderRadius: 99,
                                background: "#141d28",
                                position: "relative",
                                overflow: "hidden",
                                verticalAlign: "middle",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  height: "100%",
                                  width: "40%",
                                  background: "#5DCAA5",
                                  borderRadius: 99,
                                  animation: "slide 1.4s ease-in-out infinite",
                                }}
                              />
                            </span>
                          </span>
                        ) : (
                          layer.sub
                        )}
                      </div>
                    </div>
                    {/* <div
                    style={{
                      width: 34,
                      height: 19,
                      borderRadius: 10,
                      background: on ? "#0f4030" : "#141d28",
                      border: `0.5px solid ${on ? "#1d6e52" : "#1a2535"}`,
                      position: "relative",
                      flexShrink: 0,
                      transition: "background .2s",
                    }}
                  >
                    <div
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: "50%",
                        background: on ? "#5DCAA5" : "#253545",
                        position: "absolute",
                        top: 2.5,
                        left: on ? 18.5 : 2.5,
                        transition: "left .2s, background .2s",
                      }}
                    />
                  </div> */}
                    {isLoading ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          flexShrink: 0,
                          padding: "0 2px",
                        }}
                      >
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: "#5DCAA5",
                              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          width: 34,
                          height: 19,
                          borderRadius: 10,
                          background: on ? "#0f4030" : "#141d28",
                          border: `0.5px solid ${on ? "#1d6e52" : "#1a2535"}`,
                          position: "relative",
                          flexShrink: 0,
                          transition: "background .2s",
                        }}
                      >
                        <div
                          style={{
                            width: 13,
                            height: 13,
                            borderRadius: "50%",
                            background: on ? "#5DCAA5" : "#253545",
                            position: "absolute",
                            top: 2.5,
                            left: on ? 18.5 : 2.5,
                            transition: "left .2s, background .2s",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
                padding: "12px 16px",
              }}
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "#080c12",
                    border: "0.5px solid #141d28",
                    borderRadius: 8,
                    padding: "8px 10px",
                  }}
                >
                  <div
                    style={{ fontSize: 16, fontWeight: 500, color: s.color }}
                  >
                    {s.val}
                  </div>
                  <div style={{ fontSize: 10, color: "#253545", marginTop: 3 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "auto",
                borderTop: "0.5px solid #141d28",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: "#2d4155",
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#1d9e75",
                  }}
                />
                312 cảm biến
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: "#2d4155",
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#E24B4A",
                  }}
                />
                6 cảnh báo
              </div>
            </div>
          </div>
        )}
      </div>
      {isDashboard && (
        <style>{`
          @keyframes pulse {
            0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1); }
          }
          @keyframes slide {
            0% { left: -40%; }
            100% { left: 100%; }
          }
        `}</style>
      )}
    </div>
  );
}
