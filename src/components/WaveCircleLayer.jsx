import { useEffect } from "react";
import WaveCircle from "./WaveCircle";

let mapInstance = null;
let waveCircleInstance = null;

const WaveCircleLayer = ({ map, center, color = "red", speed = 6000 }) => {
  useEffect(() => {
    mapInstance = map;

    const initializeWaveCircle = () => {
      try {
        const kabkotaSource = map.getSource("kabkota");

        if (!kabkotaSource) {
          console.warn("Kabkota GeoJSON source not found yet!");
          return;
        }

        const geojsonData = kabkotaSource._data; // Mapbox simpan GeoJSON di _data

        if (!geojsonData || !geojsonData.features) {
          console.warn("Kabkota GeoJSON data not valid.");
          return;
        }

        if (waveCircleInstance) {
          if (map.getLayer(waveCircleInstance.id)) map.removeLayer(waveCircleInstance.id);
          if (map.getSource(waveCircleInstance.id)) map.removeSource(waveCircleInstance.id);
        }

        waveCircleInstance = new WaveCircle(
          "wave-circle-layer", // ID layer
          speed,
          map,
          center,
          {
            color: color,
            geoJson: geojsonData, // pakai geojson dari kabkota
          }
        );
      } catch (error) {
        console.error("Error initializing WaveCircle:", error);
      }
    };

    if (map.isStyleLoaded()) {
      initializeWaveCircle();
    } else {
      map.once('styledata', initializeWaveCircle);
    }

    return () => {
      if (waveCircleInstance) {
        if (map.getLayer(waveCircleInstance.id)) map.removeLayer(waveCircleInstance.id);
        if (map.getSource(waveCircleInstance.id)) map.removeSource(waveCircleInstance.id);
      }
    };
  }, [map, center, color, speed]);

  return null;
};

export default WaveCircleLayer;
