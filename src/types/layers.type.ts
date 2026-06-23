import { LAYERS } from "../config/layer.config";

export type ActiveLayers = {
  camera: boolean;
  air: boolean;
  water: boolean;
  vegetation: boolean;
  transport: boolean;
  residential: boolean;
  parcel: boolean;
  flood: boolean;
  electric: boolean;
};
export type LayerKey = (typeof LAYERS)[number]["key"];
