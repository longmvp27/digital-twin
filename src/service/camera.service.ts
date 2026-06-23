import { CameraDevice } from "@/src/config/cities.config";

const CAMERA_HEADERS = {
  token: "r:sikzjuzcvr8zbjfikys02mxtxnpnp1jv",
  "Content-Type": "application/json",
  origin: "https://vmsihanoi.vtscloud.vn",
  referer: "https://vmsihanoi.vtscloud.vn/",
};

const CAMERA_BODY = {
  status: 3,
  mode: 1,
};

export async function fetchCameras(url: string): Promise<CameraDevice[]> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: CAMERA_HEADERS,
      body: JSON.stringify(CAMERA_BODY),
    });
    const json = await res.json();
    return json.data ?? [];
  } catch (e) {
    console.error("[CameraService] fetchCameras failed:", e);
    return [];
  }
}