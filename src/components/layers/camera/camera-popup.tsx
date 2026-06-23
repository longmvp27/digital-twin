import { useEffect, useRef, useState, useCallback } from "react";
import { CameraDevice } from "../../../config/cities.config";

const VMS_SCRIPTS = [
  "/vms/utils.js",
  "/vms/render.js",
  "/vms/player.js",
];

const VMS_TOKEN = "1675995657330G8lYh6PKsM";

function useGlobalScripts(srcs: string[]): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ((window as any).VmsPlayer) {
      setReady(true);
      return;
    }

    let cancelled = false;

    const loadNext = (index: number) => {
      if (index >= srcs.length) {
        if (!cancelled) setReady(true);
        return;
      }
      const existing = document.querySelector(`script[src="${srcs[index]}"]`);
      if (existing) {
        loadNext(index + 1);
        return;
      }
      const el = document.createElement("script");
      el.src = srcs[index];
      el.async = false;
      el.onload = () => {
        loadNext(index + 1);
      };
      el.onerror = (e) => {
        console.error("[VMS] FAILED to load:", srcs[index], e);
      };
      el.onerror = () => console.error(`[VMS] Failed to load ${srcs[index]}`);
      document.head.appendChild(el);
    };

    loadNext(0);
    return () => { cancelled = true; };
  }, []);

  return ready;
}

const CameraStream = ({ camera }: { camera: CameraDevice }) => {
  const scriptsReady = useGlobalScripts(VMS_SCRIPTS);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const playerRef    = useRef<any>(null);

  const [uiState, setUiState] = useState<"loading" | "playing" | "offline">("loading");
  const [videoInfo, setVideoInfo] = useState<{ res: string; codec: string } | null>(null);

  const streamUrls = (camera.profiles ?? [])
    .flatMap((p) => p.streams)
    .filter((s) => s.protocol === "WSS")
    .map((s) => s.source);

  const httpsUrl = (camera.profiles ?? [])
    .flatMap((p) => p.streams)
    .find((s) => s.protocol === "HTTPS")?.source;

  const startPlayer = useCallback(() => {
    const VmsPlayer = (window as any).VmsPlayer;

    if (!VmsPlayer || !canvasRef.current || !streamUrls.length) return;

    const canvas = canvasRef.current;
    const w = canvas.clientWidth  || 640;
    const h = canvas.clientHeight || 360;
    canvas.width  = w;
    canvas.height = h;

    const gridLayout = [{ width: w, height: h, left: 0, bottom: 0 }];

    const arrayCameras = [streamUrls];

    const player = new VmsPlayer({
      token:        VMS_TOKEN,
      isDebug:      false,
      isPlayback:   false,
      decoderPath:  "/vms/decoder.js",
      canvasDiv:    canvas,
      gridLayout,
      arrayCameras,
      maxCamerasNo: 1,
      renderInterval: 30,
    });

    player.onShowLoading        = () => setUiState("loading");
    player.onHideLoading        = () => {};
    player.onShowOffline        = () => setUiState("offline");
    player.onHideOffline        = () => {};
    player.onShowVideoParams    = (_i: number, params: any) => {
      setVideoInfo({ res: params.resolution ?? "--", codec: (params.vcodec ?? "--").toUpperCase() });
      setUiState("playing");
    };
    player.onChangeStateCameras = (_i: number, status: number) => {
      if (status === 1) setUiState("playing");
    };

    playerRef.current = player;
    player.start();
  }, [streamUrls.join(",")]);

  useEffect(() => {
    if (!scriptsReady) return;
    const raf = requestAnimationFrame(() => requestAnimationFrame(startPlayer));
    return () => cancelAnimationFrame(raf);
  }, [scriptsReady, startPlayer]);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      const player = playerRef.current;
      if (!canvas || !player) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width  = w;
      canvas.height = h;
      const layout = [{ width: w, height: h, left: 0, bottom: 0 }];
      player.gridLayout = layout;
      player.updateGridLayout(layout);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#050d14", borderRadius: 8, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />

      {uiState === "loading" && (
        <div style={overlayStyle}>
          <div style={spinnerStyle} />
          <span style={{ color: "#5bc8a8", fontSize: 11, letterSpacing: "0.05em" }}>Đang kết nối…</span>
        </div>
      )}

      {uiState === "offline" && (
        <div style={overlayStyle}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e05c5c" strokeWidth="1.5">
            <path d="M3 3l18 18M9.172 9.172A4 4 0 0112 8c1.105 0 2.105.448 2.828 1.172M6.343 6.343A8 8 0 0117.657 17.657M3 9a9 9 0 0118 0"/>
          </svg>
          <span style={{ color: "#e05c5c", fontSize: 11 }}>Camera ngoại tuyến</span>
        </div>
      )}

      {uiState === "playing" && videoInfo && (
        <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: 6 }}>
          {[videoInfo.codec, videoInfo.res].map((v) => (
            <span key={v} style={{
              background: "rgba(0,0,0,0.55)", color: "#a0b4c8",
              fontSize: 10, padding: "2px 7px", borderRadius: 4,
              border: "0.5px solid rgba(255,255,255,0.12)", letterSpacing: "0.04em",
            }}>{v}</span>
          ))}
        </div>
      )}

      {/* {httpsUrl && (
        <a href={httpsUrl} target="_blank" rel="noreferrer" style={{
          position: "absolute", bottom: 8, right: 8,
          fontSize: 10, color: "#5bc8a8", textDecoration: "none",
          background: "rgba(0,0,0,0.45)", padding: "2px 8px",
          borderRadius: 4, border: "0.5px solid rgba(91,200,168,0.3)",
        }}>
          Mở tab mới ↗
        </a>
      )} */}
    </div>
  );
};

const CameraPopup = ({
  camera,
  onClose,
}: {
  camera: CameraDevice;
  onClose: () => void;
}) => {
  const hasStream = (camera.profiles ?? [])
    .flatMap((p) => p.streams)
    .some((s) => s.protocol === "WSS");

  return (
    <div style={{
      position: "absolute", top: 16, right: 16, width: 380,
      background: "#1a2332", borderRadius: 16, overflow: "hidden",
      fontFamily: "sans-serif", color: "#e0e6f0",
      border: "0.5px solid rgba(255,255,255,0.1)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.55)", zIndex: 1000,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px", background: "#1e2c40",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: "50%",
          background: camera.status === 1 ? "#5bc8a8" : "#e05c5c",
          flexShrink: 0,
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {camera.nameSubDevice}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: "#7a9ab0" }}>
            {camera.latitude}, {camera.longitude}
          </p>
        </div>
        <button onClick={onClose} style={{
          cursor: "pointer", width: 28, height: 28, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", border: "none",
          color: "#aaa", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>×</button>
      </div>

      <div style={{ padding: 12 }}>
        {hasStream ? (
          <>
            <p style={{ margin: "0 0 8px", fontSize: 11, color: "#5bc8a8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              ✦ Live Stream
            </p>
            <CameraStream key={camera._id} camera={camera} />
          </>
        ) : (
          <div style={{ padding: "20px 0", textAlign: "center", color: "#7a9ab0", fontSize: 12 }}>
            Không có stream khả dụng
          </div>
        )}
      </div>

      <div style={{
        margin: "0 12px 12px", background: "#14202e", borderRadius: 10,
        border: "0.5px solid rgba(255,255,255,0.07)", overflow: "hidden",
      }}>
        {([
          ["Trạng thái", camera.status === 1 ? "Online" : "Offline", "badge"],
          ["ID", camera._id],
        ] as [string, string, string?][]).map(([label, value, type], i) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 12px",
            borderBottom: i === 0 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <span style={{ color: "#7a9ab0", fontSize: 12 }}>{label}</span>
            {type === "badge" ? (
              <span style={{
                background: camera.status === 1 ? "rgba(91,200,168,0.15)" : "rgba(224,92,92,0.15)",
                color: camera.status === 1 ? "#5bc8a8" : "#e05c5c",
                borderRadius: 20, padding: "2px 8px", fontSize: 11,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: camera.status === 1 ? "#5bc8a8" : "#e05c5c" }} />
                {value}
              </span>
            ) : (
              <span style={{ color: "#d4e4f0", fontSize: 12, wordBreak: "break-all" }}>{value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraPopup;

const overlayStyle: React.CSSProperties = {
  position: "absolute", inset: 0,
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", gap: 10,
};

const spinnerStyle: React.CSSProperties = {
  width: 28, height: 28,
  border: "2.5px solid rgba(255,255,255,0.1)",
  borderTopColor: "#5bc8a8",
  borderRadius: "50%",
  animation: "vms-spin 0.8s linear infinite",
};

if (typeof document !== "undefined" && !document.getElementById("vms-keyframes")) {
  const style = document.createElement("style");
  style.id = "vms-keyframes";
  style.textContent = `@keyframes vms-spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}