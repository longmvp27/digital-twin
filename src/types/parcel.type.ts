export interface ParcelInfo {
  parcel_no: string;
  area_m2: number;
  area_txt: string;
  landuse: string;
  owner: string | null;
  match_source: string;
}