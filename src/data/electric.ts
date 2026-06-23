import { EnergyInfo } from "../types/electric.type";

export const ENERGY_DATA: Record<string, EnergyInfo> = {
  BLD_34484f44a6d5: {
    gmlId: "BLD_34484f44a6d5",
    buildingName: "Tòa nhà 185 Giảng Võ",
    floorArea: 20000,
    monthlyKwh: [250000, 350000],
    kwhPerM2: [12, 18],
    hvacPercent: [40, 55],
    lightingPercent: [15, 25],
    socketPercent: [10, 20],
    hourlyKwh: [
      232.12, 270.88, 259.93, 293.57, 270.78, 291.14, 353.52, 362.41, 525.06,
      463.51, 516.68, 555.67, 518.4, 536.23, 1127.57, 587.5, 493.4, 496.84,
      505.39, 336.25, 317.34, 282.19, 257.74, 255.33,
    ],
  },
};