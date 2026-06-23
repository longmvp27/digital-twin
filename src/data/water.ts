import { WaterSensorData } from "../types/water.type";

export const WATER_DATA: Record<string, WaterSensorData> = {
  "lake_giang_vo": {
    lakeId: "lake_giang_vo",
    lakeName: "Hồ Giảng Võ",
    pH:  { value: 7.2,  unit: "",         status: "good"    },
    DO:  { value: 5.8,  unit: "mg/L",     status: "good"    },
    TSS: { value: 42,   unit: "mg/L",     status: "warning" },
    COD: { value: 38,   unit: "mg/L",     status: "warning" },
    NH4: { value: 0.9,  unit: "mg/L",     status: "good"    },
    updatedAt: "2025-06-12 08:30",
  },
  "lake_thanh_cong": {
    lakeId: "lake_thanh_cong",
    lakeName: "Hồ Thành Công",
    pH:  { value: 6.8,  unit: "",         status: "good"    },
    DO:  { value: 3.2,  unit: "mg/L",     status: "danger"  },
    TSS: { value: 78,   unit: "mg/L",     status: "danger"  },
    COD: { value: 65,   unit: "mg/L",     status: "danger"  },
    NH4: { value: 2.4,  unit: "mg/L",     status: "warning" },
    updatedAt: "2025-06-12 08:30",
  },
};

export const DEFAULT_WATER: Omit<WaterSensorData, "lakeId" | "lakeName"> = {
  pH:  { value: 7.0,  unit: "",     status: "good"    },
  DO:  { value: 5.0,  unit: "mg/L", status: "good"    },
  TSS: { value: 30,   unit: "mg/L", status: "good"    },
  COD: { value: 25,   unit: "mg/L", status: "good"    },
  NH4: { value: 0.5,  unit: "mg/L", status: "good"    },
  updatedAt: "2025-06-12 08:30",
};