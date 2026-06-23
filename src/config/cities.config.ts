export interface CityConfig {
  name: string;
  address: string;
  heightKey: string;
  terrainUrl: string | null;
  useWorldTerrain?: boolean;
  depthTestAgainstTerrain: boolean;
  requestRenderMode: boolean;
  maximumRequestsPerServer?: number;
  maximumScreenSpaceError?: number;
  modelMatrixOffset?: number;
  cameraRadiusMultiplier?: number;
  tilesetUrls: string[];
  geojsonLayers?: {
    key: "water" | "vegetation" | "transport" | "residential";
    url: string;
    color: string;
    alpha: number;
  }[];
  cameraApiUrl?: string;
  showDashboard?: boolean;
}

export interface CameraDevice {
  _id: string;
  nameSubDevice: string;
  latitude: string;
  longitude: string;
  status: number;
  isActive: number;
  profiles: {
    streams: {
      protocol: string;
      source: string;
    }[];
  }[];
}

export const CITY_CONFIG: Record<string, CityConfig> = {
  Luxembourg: {
    name: "Luxembourg",
    address: "Luxembourg",
    heightKey: "bldg:measuredHeight",
    terrainUrl: "https://assets.yoolife.com.vn/MNT_Lidar2024",
    depthTestAgainstTerrain: false,
    requestRenderMode: false,
    tilesetUrls: [
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Luxembourg/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Winseler/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Ell/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Pétange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Mertzig/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Esch_sur_Alzette/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Beaufort/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Sanem/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Bous-Waldbredimus/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Steinfort/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Leudelange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Habscht/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Vichten/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Sandweiler/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Esch-sur-Sure/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Berdorf/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Colmar-Berg/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Mondorf-les-Bains/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Bourscheid/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Walferdange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Nommern/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Mersch/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Vianden/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Wiltz/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Biwer/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Echternach/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Goesdorf/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Mertert/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Junglinster/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Weiswampach/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Reisdorf/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Roeser/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Putscheid/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Remich/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Lorentzweiler/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Steinsel/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Schieren/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Betzdorf/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Schifflange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Dippach/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Schuttrange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Hesperange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Saeul/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Kiischpelt/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Lac-de-la-Haute-Sure/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Kopstal/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Feulen/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Bettembourg/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Fischbach/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Stadtbredimus/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Käerjeng/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Bertrange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Kehlen/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Weiler-la-Tour/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Dudelange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Lintgen/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Grevenmacher/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Differdange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Garnich/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Contern/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Bech/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Boulaide/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Wincrange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Lenningen/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Strassen/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Useldange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Frisange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Waldbillig/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Rumelange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Koerich/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Helperknapp/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Kayl/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Reckange-sur-Mess/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Rambrouch/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Dalheim/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Niederanven/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Mamer/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Redange-Attert/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Vallee-de-lErnz/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Tandel/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Manternach/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Schengen/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Bissen/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Clervaux/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Wormeldange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Ettelbruck/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Rosport-Mompach/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Mondercange/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Beckerich/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Heffingen/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Troisvierges/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Groussbus-Wal/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Consdorf/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Larochette/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Preizerdaul/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Erpeldange-sur-Sure/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Bettendorf/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Diekirch/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Parc-Hosingen/tileset.json",
      "https://assets.yoolife.com.vn/ACT2023v2_bati3d_Flaxweiler/tileset.json",
    ],
  },

  NewYork: {
    name: "New York",
    address: "New York",
    heightKey: "measuredHeight",
    terrainUrl: null,
    useWorldTerrain: true,
    depthTestAgainstTerrain: true,
    requestRenderMode: false,
    maximumRequestsPerServer: 18,
    maximumScreenSpaceError: 16,
    modelMatrixOffset: -30.0,
    cameraRadiusMultiplier: 2.5,
    tilesetUrls: [
      "https://cdn.yoolife.com.vn/models/DA13_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA19_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA17_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA15_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA5_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA12_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA4_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA7_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA9_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA8_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA11_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA20_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA10_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA16_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA1_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA3_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA14_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA2_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA6_3D_Buildings_Merged/tileset.json",
      "https://cdn.yoolife.com.vn/models/DA18_3D_Buildings_Merged/tileset.json",
    ],
  },

  GiangVo: {
    name: "Giảng Võ",
    address: "Phường Giảng Võ, Ba Đình, Hà Nội",
    heightKey: "height",
    terrainUrl: null,
    useWorldTerrain: true,
    depthTestAgainstTerrain: true,
    requestRenderMode: false,
    tilesetUrls: [
      "https://assets.yoolife.com.vn/GiangVo_citygml_ctt/250f_DC_LoD1_ctt/tileset.json",
      "https://assets.yoolife.com.vn/GiangVo_citygml_ctt/235g_DC_LoD1_ctt/tileset.json",
      "https://assets.yoolife.com.vn/GiangVo_citygml_ctt/250b_DC_LoD1_ctt/tileset.json",
      "https://assets.yoolife.com.vn/GiangVo_citygml_ctt/235h_DC_LoD1_ctt/tileset.json",
      "https://assets.yoolife.com.vn/GiangVo_citygml_ctt/251d_DC_LoD1_ctt/tileset.json",
      "https://assets.yoolife.com.vn/GiangVo_citygml_ctt/250c_DC_LoD1_ctt/tileset.json",
      "https://assets.yoolife.com.vn/GiangVo_citygml_ctt/234h_DC_LoD1_ctt/tileset.json",
      "https://assets.yoolife.com.vn/GiangVo_citygml_ctt/251a_DC_LoD1_ctt/tileset.json",
      "https://assets.yoolife.com.vn/GiangVo_citygml_ctt/234k_DC_LoD1_ctt/tileset.json",
    ],
    geojsonLayers: [
      {
        key: "water",
        url: "https://assets.yoolife.com.vn/GiangVo_geojson/Giang%20Vo_TH.geojson",
        color: "#38bdf8",
        alpha: 0.5,
      },
      {
        key: "vegetation",
        url: "https://assets.yoolife.com.vn/GiangVo_geojson/Giang%20Vo_TV.geojson",
        color: "#22c55e",
        alpha: 0.4,
      },
      {
        key: "transport",
        url: "https://assets.yoolife.com.vn/GiangVo_geojson/Giang%20Vo_GT.geojson",
        color: "#dd3636",
        alpha: 0.5,
      },
      {
        key: "residential",
        url: "https://assets.yoolife.com.vn/GiangVo_geojson/Giang%20Vo_DC.geojson",
        color: "#a78bfa",
        alpha: 0.3,
      },
    ],
    cameraApiUrl:
      "https://apiihanoi.vtscloud.vn/api/device/devices/getCameraOfSite?page=1&size=100&sort=_updated_at&direction=desc&siteId=J3CVztgHVG",
    showDashboard: true,
  },
};
