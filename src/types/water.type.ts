export interface WaterSensorData {
  lakeId: string;
  lakeName: string;
  pH: { value: number; unit: string; status: "good" | "warning" | "danger" };
  DO: { value: number; unit: string; status: "good" | "warning" | "danger" };
  TSS: { value: number; unit: string; status: "good" | "warning" | "danger" };
  COD: { value: number; unit: string; status: "good" | "warning" | "danger" };
  NH4: { value: number; unit: string; status: "good" | "warning" | "danger" };
  updatedAt: string;
}