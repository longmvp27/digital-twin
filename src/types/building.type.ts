export type BuildingInfo = {
  id: string;
  name: string;
  height: number | null;
  floors: number | null;
  area: number | null;
  type: string;
  status: string;
  longitude: number | null;
  latitude: number | null;
  address: string;
  dataSource: string;
  crs: string;
  updatedAt: string;
}