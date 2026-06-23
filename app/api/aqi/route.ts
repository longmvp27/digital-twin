export async function GET() {
  const token = process.env.WAQI_TOKEN;

  //Lấy danh sách trạm trong vùng Hà Nội
  const boundsRes = await fetch(
    `https://api.waqi.info/map/bounds/?latlng=20.9,105.7,21.2,106.0&token=${token}`,
    { next: { revalidate: 300 } }
  );
  const boundsData = await boundsRes.json();

  if (boundsData.status !== "ok") {
    return Response.json({ error: "Failed to fetch stations" }, { status: 500 });
  }

  const stations: Array<{ uid: number; lat: number; lon: number; aqi: string; station: { name: string } }> = boundsData.data;

  const stationsToFetch = stations.slice(0, 10);

  const detailResults = await Promise.allSettled(
    stationsToFetch.map((s) =>
      fetch(
        `https://api.waqi.info/feed/@${s.uid}/?token=${token}`,
        { next: { revalidate: 300 } }
      ).then((r) => r.json())
    )
  );

  const enrichedStations = stationsToFetch.map((station, i) => {
    const result = detailResults[i];

    if (result.status === "rejected" || result.value?.status !== "ok") {
      return { ...station, detail: null };
    }

    const d = result.value.data;

    return {
      uid: station.uid,
      aqi: d.aqi,
      station: d.city,
      time: d.time,
      pollutants: {
        pm25: d.iaqi?.pm25?.v ?? null,
        pm10: d.iaqi?.pm10?.v ?? null,
        o3:   d.iaqi?.o3?.v   ?? null,
        no2:  d.iaqi?.no2?.v  ?? null,
        so2:  d.iaqi?.so2?.v  ?? null,
        co:   d.iaqi?.co?.v   ?? null,
      },
      weather: {
        temperature: d.iaqi?.t?.v  ?? null,
        humidity:    d.iaqi?.h?.v  ?? null,
        pressure:    d.iaqi?.p?.v  ?? null,
        wind:        d.iaqi?.w?.v  ?? null,
        dew:         d.iaqi?.d?.v  ?? null,
      },
      dominantPollutant: d.dominentpol ?? null,
      forecast: d.forecast?.daily ?? null,
    };
  });

  return Response.json({
    status: "ok",
    total: stations.length,
    fetched: enrichedStations.length,
    data: enrichedStations,
  });
}