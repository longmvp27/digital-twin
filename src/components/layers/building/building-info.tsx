import { BuildingInfo } from "@/src/types/building.type";

const BuildingPopup = ({
  info,
  onClose,
}: {
  info: BuildingInfo;
  onClose: () => void;
}) => {
  const fmt = (v: number | null, decimals = 2) =>
    v !== null ? v.toFixed(decimals) : "—";

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        width: 360,
        background: "#1a2332",
        borderRadius: 16,
        overflow: "hidden",
        fontFamily: "sans-serif",
        fontSize: 13,
        color: "#e0e6f0",
        border: "0.5px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        zIndex: 1000,
        maxHeight: "calc(100vh - 80px)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 16px",
          background: "#1e2c40",
          borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img
            src="/building-logo.png"
            alt="logo"
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 500,
              color: "#fff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {info.name}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 10,
              color: "#7a9ab0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {info.id}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            marginLeft: "auto",
            cursor: "pointer",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            fontSize: 18,
            flexShrink: 0,
            border: "none",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {[
        {
          title: "✦ Thông tin chung",
          rows: [
            ["ID", info.id.length > 24 ? info.id.slice(0, 24) + "…" : info.id],
            ["Chiều cao", info.height !== null ? `${fmt(info.height)} m` : "—"],
            [
              "Số tầng (ước tính)",
              info.floors !== null ? `~ ${info.floors} tầng` : "—",
            ],
            [
              "Diện tích",
              info.area !== null ? `~ ${info.area.toLocaleString()} m²` : "—",
            ],
            ["Loại công trình", info.type],
            ["Trạng thái", info.status, "badge"],
          ],
        },
        {
          title: "✦ Thông tin vị trí",
          rows: [
            [
              "Kinh độ",
              info.longitude !== null ? info.longitude.toFixed(7) : "—",
            ],
            ["Vĩ độ", info.latitude !== null ? info.latitude.toFixed(7) : "—"],
            ["Địa chỉ (ước tính)", info.address],
          ],
        },
        {
          title: "✦ Thông tin GIS",
          rows: [
            ["Tên", info.name],
            ["Nguồn dữ liệu", info.dataSource],
            ["Hệ quy chiếu", info.crs],
            ["Ngày cập nhật", info.updatedAt],
          ],
        },
      ].map((section) => (
        <div key={section.title}>
          <p
            style={{
              margin: 0,
              padding: "10px 16px 6px",
              fontSize: 11,
              fontWeight: 500,
              color: "#5bc8a8",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {section.title}
          </p>
          <div
            style={{
              margin: "0 12px 8px",
              background: "#14202e",
              borderRadius: 10,
              border: "0.5px solid rgba(255,255,255,0.07)",
              overflow: "hidden",
            }}
          >
            {section.rows.map(([label, value, type], i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderBottom:
                    i < section.rows.length - 1
                      ? "0.5px solid rgba(255,255,255,0.05)"
                      : "none",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    color: "#7a9ab0",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
                {type === "badge" ? (
                  <span
                    style={{
                      background: "rgba(91,200,168,0.15)",
                      color: "#5bc8a8",
                      borderRadius: 20,
                      padding: "2px 8px",
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#5bc8a8",
                        flexShrink: 0,
                      }}
                    />
                    {value}
                  </span>
                ) : (
                  <span
                    style={{
                      color: "#d4e4f0",
                      fontSize: 12,
                      textAlign: "right",
                      wordBreak: "break-all",
                    }}
                  >
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ height: 8 }} />
    </div>
  );
};
export default BuildingPopup;