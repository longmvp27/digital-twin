import type * as CesiumTypes from "cesium";
import { CityConfig } from "../config/cities.config";
import { BuildingInfo } from "../types/building.type";

type CesiumModule = typeof CesiumTypes;

export function extractBuildingInfo(
  Cesium: CesiumModule,
  feature: CesiumTypes.Cesium3DTileFeature,
  position: CesiumTypes.Cartesian3,
  config: CityConfig,
): BuildingInfo {
  const get = (key: string) => {
    try {
      return feature.getProperty(key);
    } catch {
      return undefined;
    }
  };

  const ids = feature.getPropertyIds();
  const props: Record<string, any> = {};
  ids.forEach((id) => {
    props[id] = get(id);
  });

  const name =
    get("name") ?? get("gml:name") ?? get("id") ?? get("building_id") ?? "—";
  const id = get("gml:id") ?? get("id") ?? get("building_id") ?? name;

  const rawHeight =
    get(config.heightKey) ??
    get("height") ??
    get("Height") ??
    get("roofHeight") ??
    get("heightAboveGround") ??
    get("z_max") ??
    null;
  const height = rawHeight != null ? parseFloat(rawHeight) : null;
  const floors = height !== null ? Math.round(height / 3) : null;

  const rawArea =
    get("area") ?? get("footprintArea") ?? get("groundArea") ?? null;
  const area = rawArea !== null ? parseFloat(rawArea) : null;

  const type = get("class") ?? get("function") ?? get("usage") ?? "Building";
  const status = get("status") ?? "Đang sử dụng";

  const carto = Cesium.Cartographic.fromCartesian(position);
  const lon = Cesium.Math.toDegrees(carto.longitude);
  const lat = Cesium.Math.toDegrees(carto.latitude);

  const address =
    get("address") ?? get("addr") ?? get("streetAddress") ?? config.address;
  const dataSource = get("dataSource") ?? get("source") ?? "CityGML";
  const crs = get("crs") ?? get("srsName") ?? "EPSG:4326";
  const updatedAt =
    get("updatedAt") ??
    get("lastModified") ??
    get("creationDate") ??
    new Date().toLocaleDateString("vi-VN");

  return {
    id,
    name,
    height,
    floors,
    area,
    type,
    status,
    longitude: lon,
    latitude: lat,
    address,
    dataSource,
    crs,
    updatedAt,
  };
}