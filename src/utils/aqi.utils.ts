export function aqiColor(aqi: number): string {
  if (aqi <= 50)  return "#9cd84e";
  if (aqi <= 100) return "#fdd64b";
  if (aqi <= 150) return "#ff9b57";
  if (aqi <= 200) return "#fe6a69";
  if (aqi <= 300) return "#a97abc";
  return "#a87383";
}

export function aqiLabel(aqi: number): string {
  if (aqi <= 50)  return "Tốt";
  if (aqi <= 100) return "Trung bình";
  if (aqi <= 150) return "Không tốt cho nhóm nhạy cảm";
  if (aqi <= 200) return "Không tốt";
  if (aqi <= 300) return "Rất không tốt";
  return "Nguy hiểm";
}

export function createAqiIcon(color: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <circle cx="20" cy="20" r="16" fill="${color}" fill-opacity="0.9" stroke="white" stroke-width="2"/>
    </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}