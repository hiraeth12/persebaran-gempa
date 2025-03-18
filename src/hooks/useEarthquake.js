import { useState, useEffect, useRef } from "react";
import { fetchNewestEarthquakeData } from "@/utils/fetchLatestEarthquake";
import { playEarthquakeAlert } from "../components/EarthquakeNotification";
import { DateTime } from "luxon";

export const useEarthquake = (map) => {
  const lastGempaKecilId = useRef(null);
  const [gempaTerakhir, setGempaTerakhir] = useState(null);
  const tgs = useRef([]);
  const geoJsonTitikGempa = useRef({ type: "FeatureCollection", features: [] });

  useEffect(() => {
    const getGempaKecil = async () => {
      if (lastGempaKecilId.current) return;

      console.log("Fetching earthquake data...");
      const feature = await fetchNewestEarthquakeData();
      if (!feature) return;

      lastGempaKecilId.current = feature.properties.id;
      const sentTime = DateTime.fromSQL(feature.properties.time, {
        zone: "UTC",
      });
      const currentTime = DateTime.now().setZone("UTC");

      const msg = `${feature.properties.place}
    Magnitudo : ${Number(feature.properties.mag).toFixed(1)}
    Kedalaman : ${feature.properties.depth} km
    Lokasi (Lat,Lng): ${feature.geometry.coordinates[1]}, ${
        feature.geometry.coordinates[0]
      }`;

      const dt = DateTime.fromSQL(feature.properties.time, {
        zone: "UTC",
      }).setZone("Asia/Jakarta");
      const readAbleTime = `${dt.toISODate()} ${dt.toLocaleString(
        DateTime.TIME_24_WITH_SECONDS
      )}`;

      const earthquakeData = {
        id: feature.properties.id,
        lng: parseFloat(feature.geometry.coordinates[0]),
        lat: parseFloat(feature.geometry.coordinates[1]),
        mag: parseFloat(feature.properties.mag),
        depth: feature.properties.depth,
        message: msg,
        place: feature.properties.place,
        time: readAbleTime,
      };

      if (currentTime.toMillis() - sentTime.toMillis() < 600000) {
        if (map.current) {
          playEarthquakeAlert();
          setGempaTerakhir(earthquakeData);
        }
      }

      // Tambahkan ke daftar gempa terakhir
      if (!tgs.current.find((v) => v.id === feature.properties.id)) {
        tgs.current.unshift(earthquakeData);
        geoJsonTitikGempa.current.features.push(feature);

        if (map.current) {
          map.current
            .getSource("earthquakes")
            .setData(geoJsonTitikGempa.current);
        }
      }
    };

    getGempaKecil();
  }, [map]);

  return { gempaTerakhir, tgs };
};
