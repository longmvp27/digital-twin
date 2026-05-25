import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100vw",
      height: "100vh",
      background: "#0d1b2a",
      gap: 24,
    }}>
      <img
        src="https://assets.yoolife.com.vn/yootek/1779695510809-1884.png"
        style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", height: 48, marginBottom: 16 }}
      />
      <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 600, margin: 0 }}>
        Digital Twin
      </h1>
      <div style={{ display: "flex", gap: 16 }}>
        <Link href="/Luxembourg" style={{
          padding: "12px 28px",
          background: "#195658",
          color: "#fff",
          borderRadius: 10,
          textDecoration: "none",
          fontSize: 15,
          fontWeight: 500,
        }}>
          🇱🇺 Luxembourg
        </Link>
        <Link href="/NewYork" style={{
          padding: "12px 28px",
          background: "#195658",
          color: "#fff",
          borderRadius: 10,
          textDecoration: "none",
          fontSize: 15,
          fontWeight: 500,
        }}>
          🗽 New York
        </Link>
      </div>
    </div>
  );
}