import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import EarthquakeLayer from "./layers/EarthquakeLayer";
import GeoJsonLayer from "./layers/GeoJsonLayer";
import FaultLineLayer from "./layers/FaultLineLayer";
import LatestEarthquakeLayer from "./layers/LatestEarthquakeLayer";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (map.current) return; // Mencegah inisialisasi ulang

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v9",
      projection: "globe",
      center: [113.9213, -0.7893], // Default ke tengah Indonesia
      zoom: 4,
    });

    map.current.on("style.load", async () => {
      map.current.setFog({});
      setMapInstance(map.current);
    });
  }, []);

  return (
    <div ref={mapContainer} style={{ width: "100%", height: "100vh" }}>
      {mapInstance && (
        <>
          <EarthquakeLayer map={mapInstance} />
          <GeoJsonLayer map={mapInstance} />
          <FaultLineLayer map={mapInstance} />
          <LatestEarthquakeLayer map={mapInstance} />
        </>
      )}
    </div>
  );
};

export default MapComponent;
