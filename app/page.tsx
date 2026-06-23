"use client";
import Link from "next/link";
import { useState } from "react";

const cities = [
  { name: "Luxembourg", country: "Luxembourg", flag: "🇱🇺", href: "/Luxembourg" },
  { name: "New York", country: "United States", flag: "🗽", href: "/NewYork" },
  { name: "Giảng Võ", country: "Việt Nam", flag: "🇻🇳", href: "/GiangVo" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const filtered = cities.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a", padding: "40px 24px" }}>
      <img src="/logo.png" style={{ display: "block", margin: "0 auto 32px", height: 36, top: 12 }} />
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <input
          placeholder="Tìm kiếm thành phố..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #2a3f55", background: "#162232", color: "#fff", fontSize: 14, marginBottom: 20, boxSizing: "border-box" }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {filtered.map(c => (
            <Link key={c.href} href={c.href} style={{ background: "#162232", border: "1px solid #2a3f55", borderRadius: 12, padding: "18px 16px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{c.flag}</span>
              <div>
                <p style={{ margin: 0, color: "#fff", fontWeight: 500, fontSize: 15 }}>{c.name}</p>
                <p style={{ margin: 0, color: "#7a9ab5", fontSize: 12 }}>{c.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}