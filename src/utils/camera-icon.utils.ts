export function createCameraIcon(online: boolean): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 40;
  canvas.height = 40;
  const ctx = canvas.getContext("2d")!;

  ctx.beginPath();
  ctx.arc(20, 20, 19, 0, Math.PI * 2);
  ctx.fillStyle = "#1a2332";
  ctx.fill();
  ctx.strokeStyle = online ? "#5bc8a8" : "#e05c5c";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = online ? "#5bc8a8" : "#e05c5c";

  ctx.beginPath();
  ctx.roundRect(8, 14, 18, 12, 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(26, 16);
  ctx.lineTo(32, 13);
  ctx.lineTo(32, 27);
  ctx.lineTo(26, 24);
  ctx.closePath();
  ctx.fill();

  return canvas;
}