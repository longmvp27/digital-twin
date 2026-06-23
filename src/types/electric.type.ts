export interface EnergyInfo {
  gmlId: string;
  buildingName?: string;
  floorArea: number;
  monthlyKwh: [number, number];
  kwhPerM2: [number, number];
  hvacPercent: [number, number];
  lightingPercent: [number, number];
  socketPercent: [number, number];
  hourlyKwh?: number[];
}