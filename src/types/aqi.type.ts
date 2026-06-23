export interface AqiStation {
  uid: number;
  aqi: number | string;
  station: {
    name: string;
    geo: [number, number];
    url: string;
    location: string;
  };
  time: {
    s: string;
    iso: string;
    tz: string;
    v: number;
  };
  pollutants: {
    pm25: number | null;
    pm10: number | null;
    o3: number | null;
    no2: number | null;
    so2: number | null;
    co: number | null;
  } | null;
  weather: {
    temperature: number | null;
    humidity: number | null;
    pressure: number | null;
    wind: number | null;
    dew: number | null;
  } | null;
  dominantPollutant: string | null;
  forecast: any;
  lat?: number;
  lon?: number;
}