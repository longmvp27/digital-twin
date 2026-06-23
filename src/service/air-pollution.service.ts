export async function fetchAqi(): Promise<any> {
  try {
    const res = await fetch("/api/aqi");
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("[AqiService] fetchAqi failed:", e);
    return null;
  }
}