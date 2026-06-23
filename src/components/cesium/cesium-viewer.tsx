"use client";

import { useEffect, useRef, useState } from "react";
import type * as CesiumTypes from "cesium";
import { CameraDevice, CityConfig } from "@/src/config/cities.config";
import CameraPopup from "../layers/camera/camera-popup";
import { fetchCameras } from "../../service/camera.service";
import { createCameraIcon } from "../../utils/camera-icon.utils";
import { extractBuildingInfo } from "../../utils/building.utils";
import BuildingPopup from "../layers/building/building-info";
import { BuildingInfo } from "../../types/building.type";
import { ActiveLayers } from "../../types/layers.type";
import { fetchAqi } from "@/src/service/air-pollution.service";
import { aqiColor, createAqiIcon } from "@/src/utils/aqi.utils";
import AirBar from "../layers/air-pollution/air-bar";
import { AqiStation } from "@/src/types/aqi.type";
import AqiPopup from "../layers/air-pollution/aqi-popup";
import { ParcelInfo } from "@/src/types/parcel.type";
import ParcelPopup from "../layers/parcel/parcel-popup";
import BasemapBar from "../layers/basemap/basemap-bar";
import FloodSlider from "../layers/basemap/flood-slider";
import { EnergyInfo } from "@/src/types/electric.type";
import { ENERGY_DATA } from "@/src/data/electric";
import EnergyPopup from "../layers/electric/electric-popup";
import { WaterSensorData } from "@/src/types/water.type";
import { DEFAULT_WATER, WATER_DATA } from "@/src/data/water";
import WaterPopup from "../layers/water/water-popup";

type CesiumModule = typeof CesiumTypes;

declare global {
  interface Window {
    Cesium?: CesiumModule;
    CESIUM_BASE_URL?: string;
  }
}

const CESIUM_BASE_URL = "/cesium/";
const CESIUM_SCRIPT_URL = `${CESIUM_BASE_URL}Cesium.js`;
const CESIUM_ION_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhODUwOGNkNS0zMTcxLTQ0MWItOTUwYy04NTNiZjNlNDgyMTkiLCJpZCI6MzcwMDc4LCJpYXQiOjE3NjU4NTg0MzR9.Fm4O3_VjyKQ5uPNTRt38X7NIuTn1p5gXp1XO2VQU6uI";

function loadCesium(): Promise<CesiumModule> {
  window.CESIUM_BASE_URL = CESIUM_BASE_URL;

  if (window.Cesium) {
    window.Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;
    return Promise.resolve(window.Cesium);
  }

  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${CESIUM_SCRIPT_URL}"]`,
    );

    const handleLoad = () => {
      if (!window.Cesium) {
        reject(new Error("Cesium global is unavailable after script load."));
        return;
      }

      window.Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;
      resolve(window.Cesium);
    };

    const handleError = () => {
      reject(new Error(`Failed to load ${CESIUM_SCRIPT_URL}`));
    };

    const shouldAppendScript = !script;

    if (!script) {
      script = document.createElement("script");
      script.src = CESIUM_SCRIPT_URL;
      script.async = true;
    }

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (shouldAppendScript) {
      document.head.appendChild(script);
    }
  });
}

interface CesiumViewerProps {
  config: CityConfig;
  activeLayers: ActiveLayers;
  onLayerLoadingChange?: (
    layer: "basemap" | "parcel",
    loading: boolean,
  ) => void;
}

const GEOJSON_STYLES = [
  { color: "#38bdf8", alpha: 0.5 }, // TH - Thủy hệ - xanh nước
  { color: "#22c55e", alpha: 0.4 }, // TV - Thực vật - xanh lá
  { color: "#dd3636", alpha: 0.5 }, // GT - Giao thông - cam
  { color: "#a78bfa", alpha: 0.3 }, // DC - Dân cư - tím
];

const CesiumViewer = ({
  config,
  activeLayers,
  onLayerLoadingChange,
}: CesiumViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CesiumTypes.Viewer | null>(null);
  const lastFeatureRef = useRef<CesiumTypes.Cesium3DTileFeature | null>(null);
  const cameraEntitiesRef = useRef<CesiumTypes.Entity[]>([]);
  const aqiEntitiesRef = useRef<CesiumTypes.Entity[]>([]);
  const geojsonSourcesRef = useRef<any[]>([]);
  const parcelSourceRef = useRef<any>(null);
  const highlightedParcelRef = useRef<{
    entity: CesiumTypes.Entity;
    originalMaterial: CesiumTypes.MaterialProperty;
  } | null>(null);
  const tilesetRef = useRef<CesiumTypes.Cesium3DTileset[]>([]);
  const activeLayersRef = useRef(activeLayers);
  const floodEntityRef = useRef<CesiumTypes.Entity | null>(null);
  const floodLevelRef = useRef<number>(0);
  const floodBaseHeightRef = useRef<number>(0);
  const geojsonRefsMap = useRef<
    Partial<Record<string, CesiumTypes.GeoJsonDataSource>>
  >({});
  const geojsonLoadingMap = useRef<Partial<Record<string, boolean>>>({});
  const geojsonAbortMap = useRef<Partial<Record<string, AbortController>>>({});

  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(
    null,
  );
  const [selectedCamera, setSelectedCamera] = useState<CameraDevice | null>(
    null,
  );
  const [selectedAqi, setSelectedAqi] = useState<AqiStation | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<ParcelInfo | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyInfo | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [floodLevel, setFloodLevel] = useState<number>(0);
  const [selectedWater, setSelectedWater] = useState<WaterSensorData | null>(
    null,
  );

  useEffect(() => {
    activeLayersRef.current = activeLayers;
  }, [activeLayers]);

  useEffect(() => {
    let cancelled = false;
    let handler: CesiumTypes.ScreenSpaceEventHandler | undefined;

    const init = async () => {
      if (!containerRef.current) return;

      const Cesium = await loadCesium();
      if (cancelled) return;

      let terrainProvider: CesiumTypes.TerrainProvider | undefined;

      if (config.useWorldTerrain) {
        terrainProvider = await Cesium.createWorldTerrainAsync({
          requestWaterMask: true,
          requestVertexNormals: true,
        });
      } else if (config.terrainUrl) {
        terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
          config.terrainUrl,
        );
      }
      if (cancelled) return;

      const viewer = new Cesium.Viewer(containerRef.current, {
        baseLayerPicker: false,
        timeline: false,
        animation: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        requestRenderMode: config.requestRenderMode,
        maximumRenderTimeChange: Infinity,
        contextOptions: { webgl: { alpha: true } },
        infoBox: false,
        selectionIndicator: false,
        ...(terrainProvider ? { terrainProvider } : {}),
      });

      viewerRef.current = viewer;
      setViewerReady(true);
      viewer.scene.globe.depthTestAgainstTerrain =
        config.depthTestAgainstTerrain;
      viewer.scene.globe.enableLighting = false;
      (viewer.cesiumWidget.creditContainer as HTMLElement).style.display =
        "none";

      if (config.maximumRequestsPerServer) {
        Cesium.RequestScheduler.maximumRequestsPerServer =
          config.maximumRequestsPerServer;
      }

      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      const loadedTilesets: CesiumTypes.Cesium3DTileset[] = [];

      if (config.tilesetUrls.length) {
        for (const url of config.tilesetUrls) {
          if (cancelled) break;
          try {
            const tileset = await Cesium.Cesium3DTileset.fromUrl(url, {
              ...(config.maximumScreenSpaceError
                ? { maximumScreenSpaceError: config.maximumScreenSpaceError }
                : {}),
            });

            if (cancelled) break;

            tileset.style = new Cesium.Cesium3DTileStyle({
              color: {
                conditions: [
                  [
                    "${feature['gml:id']} === 'BLD_34484f44a6d5'",
                    "color('#ff4444', 1.0)",
                  ],
                  ["true", "color('#ffffff', 1.0)"],
                ],
              },
            });

            if (config.modelMatrixOffset !== undefined) {
              const cart = Cesium.Cartographic.fromCartesian(
                tileset.boundingSphere.center,
              );
              const surface = Cesium.Cartesian3.fromRadians(
                cart.longitude,
                cart.latitude,
                0,
              );
              const offset = Cesium.Cartesian3.fromRadians(
                cart.longitude,
                cart.latitude,
                config.modelMatrixOffset,
              );
              tileset.modelMatrix = Cesium.Matrix4.fromTranslation(
                Cesium.Cartesian3.subtract(
                  offset,
                  surface,
                  new Cesium.Cartesian3(),
                ),
              );
            }

            viewer.scene.primitives.add(tileset);
            loadedTilesets.push(tileset);
            tilesetRef.current.push(tileset);
            viewer.scene.requestRender();

            if (loadedTilesets.length === 1) {
              viewer.camera.flyToBoundingSphere(tileset.boundingSphere, {
                duration: 0,
                offset: new Cesium.HeadingPitchRange(
                  0,
                  -0.5,
                  config.cameraRadiusMultiplier
                    ? tileset.boundingSphere.radius *
                        config.cameraRadiusMultiplier
                    : tileset.boundingSphere.radius,
                ),
              });
            }
          } catch (err) {
            console.warn("Failed to load tileset:", url, err);
          }
        }
      }

      handler.setInputAction((movement: any) => {
        const picked = viewer.scene.pick(movement.position);

        if (highlightedParcelRef.current) {
          const { entity, originalMaterial } = highlightedParcelRef.current;
          if (entity.polygon) {
            entity.polygon.material = originalMaterial;
          }
          highlightedParcelRef.current = null;
        }

        if (lastFeatureRef.current) {
          lastFeatureRef.current.color = Cesium.Color.WHITE;
          lastFeatureRef.current = null;
        }

        if (
          activeLayersRef.current.electric &&
          Cesium.defined(picked) &&
          picked instanceof Cesium.Cesium3DTileFeature
        ) {
          const gmlId =
            picked.getProperty("gml:id") ?? picked.getProperty("gml_id");
          if (gmlId && ENERGY_DATA[gmlId]) {
            setSelectedEnergy(ENERGY_DATA[gmlId]);
            setSelectedBuilding(null);
            viewer.scene.requestRender();
            return;
          }
        }
        setSelectedEnergy(null);

        if (Cesium.defined(picked) && picked.id instanceof Cesium.Entity) {
          const entity = picked.id as CesiumTypes.Entity;
          const props = entity.properties?.getValue(Cesium.JulianDate.now());

          if (props?.cameraData) {
            const cam: CameraDevice = JSON.parse(props.cameraData);
            setSelectedCamera(cam);
            setSelectedBuilding(null);
            setSelectedAqi(null);
            setSelectedParcel(null);
            return;
          }

          if (props?.stationData) {
            const station: AqiStation = JSON.parse(props.stationData);
            setSelectedAqi(station);
            setSelectedBuilding(null);
            setSelectedCamera(null);
            setSelectedParcel(null);
            return;
          }

          if (entity.polygon && activeLayersRef.current.parcel) {
            const originalMaterial = entity.polygon.material;
            entity.polygon.material = new Cesium.ColorMaterialProperty(
              Cesium.Color.YELLOW.withAlpha(0.6),
            );
            highlightedParcelRef.current = { entity, originalMaterial };
            const parcelProps = entity.properties?.getValue(
              Cesium.JulianDate.now(),
            );
            setSelectedParcel(parcelProps ?? {});
            setSelectedBuilding(null);
            setSelectedCamera(null);
            setSelectedAqi(null);
            return;
          }

          if (entity.polygon && activeLayersRef.current.water) {
            const props = entity.properties?.getValue(Cesium.JulianDate.now());
            const name = props?.name ?? props?.Name ?? props?.NAME ?? "Hồ / Ao";
            const lakeId = (name as string).toLowerCase().replace(/\s+/g, "_");

            const waterData: WaterSensorData = WATER_DATA[lakeId] ?? {
              lakeId,
              lakeName: name,
              ...DEFAULT_WATER,
            };

            setSelectedWater(waterData);
            setSelectedBuilding(null);
            setSelectedCamera(null);
            setSelectedAqi(null);
            setSelectedParcel(null);
            setSelectedEnergy(null);
            return;
          }
        }

        if (
          !Cesium.defined(picked) ||
          !(picked instanceof Cesium.Cesium3DTileFeature)
        ) {
          setSelectedBuilding(null);
          return;
        }

        // const ids = picked.getPropertyIds();
        // console.log("Property IDs:", ids);
        // ids.forEach((id) => {
        //   console.log(`  ${id}:`, picked.getProperty(id));
        // });

        picked.color =
          Cesium.Color.fromCssColorString("#5bc8a8").withAlpha(0.9);
        lastFeatureRef.current = picked;
        viewer.scene.requestRender();

        const worldPos = viewer.scene.pickPosition(movement.position);
        if (!Cesium.defined(worldPos)) return;

        const info = extractBuildingInfo(Cesium, picked, worldPos, config);
        setSelectedBuilding(info);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    init().catch((err) => {
      if (!cancelled) console.error("Init error:", err);
    });

    return () => {
      cancelled = true;
      handler?.destroy();
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
      viewerRef.current = null;
      lastFeatureRef.current = null;
      setViewerReady(false);
    };
  }, [config]);

  //Camera
  useEffect(() => {
    if (!viewerReady || !config.cameraApiUrl) return;
    const viewer = viewerRef.current;
    const Cesium = window.Cesium;
    if (!viewer || !Cesium) return;

    if (cameraEntitiesRef.current.length > 0) {
      cameraEntitiesRef.current.forEach((e) => {
        e.show = activeLayers.camera;
      });
      return;
    }

    if (!activeLayers.camera) return;

    let cancelled = false;
    (async () => {
      if (!config.cameraApiUrl) return;
      const cameras: CameraDevice[] = await fetchCameras(config.cameraApiUrl);
      if (cancelled) return;

      for (const cam of cameras) {
        const lat = parseFloat(cam.latitude);
        const lon = parseFloat(cam.longitude);
        if (isNaN(lat) || isNaN(lon)) continue;

        const entity = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(lon, lat, 5),
          billboard: {
            image: createCameraIcon(cam.status === 1),
            width: 32,
            height: 32,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          properties: new Cesium.PropertyBag({
            cameraData: JSON.stringify(cam),
          }),
        });
        cameraEntitiesRef.current.push(entity);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeLayers.camera, config.cameraApiUrl, viewerReady]);

  //Air pollution
  useEffect(() => {
    if (!viewerReady) return;
    const viewer = viewerRef.current;
    const Cesium = window.Cesium;
    if (!viewer || !Cesium) return;

    if (aqiEntitiesRef.current.length > 0) {
      aqiEntitiesRef.current.forEach((e) => {
        e.show = activeLayers.air;
      });
      return;
    }

    if (!activeLayers.air) return;

    let cancelled = false;
    (async () => {
      const data = await fetchAqi();
      if (cancelled) return;

      for (const station of data.data) {
        if (station.aqi === "-") continue;
        const [lat, lon] = station.station.geo;
        if (lat == null || lon == null) continue;

        const aqi = Number(station.aqi);
        const color = aqiColor(aqi);

        const entity = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(lon, lat, 20),
          billboard: {
            image: createAqiIcon(color),
            width: 36,
            height: 36,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: String(aqi),
            font: "bold 11px sans-serif",
            fillColor: Cesium.Color.WHITE,
            pixelOffset: new Cesium.Cartesian2(0, 0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            showBackground: false,
          },
          properties: new Cesium.PropertyBag({
            stationData: JSON.stringify(station),
          }),
        });
        aqiEntitiesRef.current.push(entity);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeLayers.air, viewerReady]);

  useEffect(() => {
    if (!viewerReady) return;
    const shouldHide =
      activeLayers.water ||
      activeLayers.vegetation ||
      activeLayers.transport ||
      activeLayers.residential ||
      activeLayers.parcel;
    tilesetRef.current.forEach((ts) => {
      ts.show = !shouldHide;
    });
  }, [
    activeLayers.water,
    activeLayers.vegetation,
    activeLayers.transport,
    activeLayers.residential,
    activeLayers.parcel,
    viewerReady,
  ]);

  useEffect(() => {
    if (!viewerReady) return;
    const viewer = viewerRef.current;
    const Cesium = window.Cesium;
    if (!viewer || !Cesium || !config.geojsonLayers?.length) return;

    for (const layer of config.geojsonLayers) {
      const { key, url, color, alpha } = layer;
      const isActive = activeLayers[key as keyof ActiveLayers] as boolean;

      // Already loaded → chỉ toggle show
      if (geojsonRefsMap.current[key]) {
        geojsonRefsMap.current[key]!.show = isActive;
        continue;
      }

      if (!isActive || geojsonLoadingMap.current[key]) continue;

      geojsonAbortMap.current[key]?.abort();
      const abort = new AbortController();
      geojsonAbortMap.current[key] = abort;
      geojsonLoadingMap.current[key] = true;

      (async () => {
        onLayerLoadingChange?.(key as any, true);
        try {
          const ds = await Cesium.GeoJsonDataSource.load(url, {
            clampToGround: false,
            fill: Cesium.Color.fromCssColorString(color).withAlpha(alpha),
            stroke: Cesium.Color.fromCssColorString(color),
            strokeWidth: 1,
          });

          if (abort.signal.aborted || viewer.isDestroyed()) return;
          if (!activeLayersRef.current[key as keyof ActiveLayers]) return;

          viewer.dataSources.add(ds);
          geojsonRefsMap.current[key] = ds;
          viewer.scene.requestRender();
        } catch (err) {
          console.warn("GeoJSON load failed:", key, err);
        } finally {
          geojsonLoadingMap.current[key] = false;
          if (!abort.signal.aborted) onLayerLoadingChange?.(key as any, false);
        }
      })();
    }

    viewer.scene.requestRender();
  }, [
    activeLayers.water,
    activeLayers.vegetation,
    activeLayers.transport,
    activeLayers.residential,
    viewerReady,
  ]);

  //Parcel
  useEffect(() => {
    if (!viewerReady) return;
    const viewer = viewerRef.current;
    const Cesium = window.Cesium;
    if (!viewer || !Cesium) return;

    if (parcelSourceRef.current) {
      if (activeLayers.parcel) {
        if (!viewer.dataSources.contains(parcelSourceRef.current)) {
          viewer.dataSources.add(parcelSourceRef.current);
        }
      } else {
        if (viewer.dataSources.contains(parcelSourceRef.current)) {
          viewer.dataSources.remove(parcelSourceRef.current, true);
        }
      }
      return;
    }

    if (!activeLayers.parcel) return;

    let cancelled = false;

    (async () => {
      onLayerLoadingChange?.("parcel", true);
      try {
        const dataSource = await Cesium.GeoJsonDataSource.load(
          "https://assets.yoolife.com.vn/GiangVo_geojson/GiangVo_PhanThua.geojson",
          {
            stroke: Cesium.Color.WHITE,
            fill: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.3),
            strokeWidth: 2,
            clampToGround: false,
          },
        );

        if (cancelled) return;

        if (viewer.isDestroyed()) return;

        viewer.dataSources.add(dataSource);
        parcelSourceRef.current = dataSource;
      } catch (err) {
        console.error("Parcel load failed:", err);
      } finally {
        onLayerLoadingChange?.("parcel", false);
      }
    })();

    return () => {
      onLayerLoadingChange?.("parcel", false);
      cancelled = true;
    };
  }, [activeLayers.parcel, viewerReady]);

  //Flood
  useEffect(() => {
    if (!viewerReady) return;
    const viewer = viewerRef.current;
    const Cesium = window.Cesium;
    if (!viewer || !Cesium) return;

    if (!activeLayers.flood) {
      if (floodEntityRef.current) {
        floodEntityRef.current.show = false;
      }
      return;
    }

    if (floodEntityRef.current) {
      floodEntityRef.current.show = floodLevelRef.current > 0;
      return;
    }

    let rectangle: CesiumTypes.Rectangle | undefined;
    for (const ts of tilesetRef.current) {
      const sphere = ts.boundingSphere;
      const center = Cesium.Cartographic.fromCartesian(sphere.center);
      const angularRadius =
        sphere.radius / Cesium.Ellipsoid.WGS84.maximumRadius;
      const rect = new Cesium.Rectangle(
        center.longitude - angularRadius,
        center.latitude - angularRadius,
        center.longitude + angularRadius,
        center.latitude + angularRadius,
      );
      rectangle = rectangle ? Cesium.Rectangle.union(rectangle, rect) : rect;
    }

    if (!rectangle) {
      console.warn("Tileset chưa load xong, không thể tạo vùng flood");
      return;
    }

    const west = Cesium.Math.toDegrees(rectangle.west);
    const east = Cesium.Math.toDegrees(rectangle.east);
    const south = Cesium.Math.toDegrees(rectangle.south);
    const north = Cesium.Math.toDegrees(rectangle.north);

    const entity = viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray([
            west,
            north,
            east,
            north,
            east,
            south,
            west,
            south,
          ]),
        ),
        material: Cesium.Color.fromCssColorString("#1e90ff").withAlpha(0.45),
        outline: false,
        height: floodBaseHeightRef.current + floodLevelRef.current,
      },
      show: floodLevelRef.current > 0,
    });

    floodEntityRef.current = entity;
    viewer.scene.requestRender();

    let cancelled = false;
    const centerLon = (west + east) / 2;
    const centerLat = (south + north) / 2;

    const samplePoints: CesiumTypes.Cartographic[] = [];

    for (const ts of tilesetRef.current) {
      const cart = Cesium.Cartographic.fromCartesian(ts.boundingSphere.center);
      const r = ts.boundingSphere.radius;

      const radiusDeg = Cesium.Math.toDegrees(
        r / Cesium.Ellipsoid.WGS84.maximumRadius,
      );

      const lon = Cesium.Math.toDegrees(cart.longitude);
      const lat = Cesium.Math.toDegrees(cart.latitude);

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          samplePoints.push(
            Cesium.Cartographic.fromDegrees(
              lon + i * radiusDeg * 0.5,
              lat + j * radiusDeg * 0.5,
            ),
          );
        }
      }
    }

    Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, samplePoints).then(
      (sampledPoints) => {
        if (cancelled || viewer.isDestroyed()) return;

        const minHeight = Math.min(...sampledPoints.map((p) => p.height ?? 0));
        console.log(minHeight);
        floodBaseHeightRef.current = minHeight;

        if (floodEntityRef.current?.polygon) {
          floodEntityRef.current.polygon.height = new Cesium.ConstantProperty(
            floodBaseHeightRef.current + floodLevelRef.current,
          );
          viewer.scene.requestRender();
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [activeLayers.flood, viewerReady]);

  useEffect(() => {
    if (!viewerReady || !floodEntityRef.current) return;
    const Cesium = window.Cesium;
    if (!Cesium) return;

    const polygon = floodEntityRef.current.polygon;
    if (!polygon) return;
    floodEntityRef.current.show = floodLevel > 0;

    polygon.height = new Cesium.ConstantProperty(
      floodBaseHeightRef.current + (floodLevel ?? 0),
    );
    floodLevelRef.current = floodLevel ?? 0;
    viewerRef.current?.scene.requestRender();
  }, [floodLevel, viewerReady]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {selectedBuilding && (
        <BuildingPopup
          info={selectedBuilding}
          onClose={() => {
            setSelectedBuilding(null);
            const Cesium = window.Cesium;
            if (Cesium && lastFeatureRef.current) {
              lastFeatureRef.current.color = Cesium.Color.WHITE;
              lastFeatureRef.current = null;
              viewerRef.current?.scene.requestRender();
            }
          }}
        />
      )}
      {selectedCamera && (
        <CameraPopup
          camera={selectedCamera}
          onClose={() => setSelectedCamera(null)}
        />
      )}
      {selectedAqi && (
        <AqiPopup station={selectedAqi} onClose={() => setSelectedAqi(null)} />
      )}
      {selectedParcel && (
        <ParcelPopup
          info={selectedParcel}
          onClose={() => setSelectedParcel(null)}
        />
      )}
      {activeLayers.air && (
        <div
          style={{
            position: "absolute",
            bottom: "6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            marginLeft: "auto",
          }}
        >
          <AirBar />
        </div>
      )}
      {/* {activeLayers.basemap && (
        <div
          style={{
            position: "absolute",
            bottom: activeLayers.air ? "70px" : "6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "400px",
          }}
        >
          <BasemapBar />
        </div>
      )} */}
      {activeLayers.flood && (
        <div
          style={{
            position: "absolute",
            bottom: activeLayers.air ? "70px" : "6px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <FloodSlider level={floodLevel} onChange={setFloodLevel} />
        </div>
      )}
      {selectedEnergy && (
        <EnergyPopup
          info={selectedEnergy}
          onClose={() => setSelectedEnergy(null)}
        />
      )}
      {selectedWater && (
        <WaterPopup
          data={selectedWater}
          onClose={() => setSelectedWater(null)}
          onSimulateFlood={() => {
            // bật flood layer + open slider
            // gọi lên layout toggle flood
          }}
        />
      )}
    </div>
  );
};;

export default CesiumViewer;
