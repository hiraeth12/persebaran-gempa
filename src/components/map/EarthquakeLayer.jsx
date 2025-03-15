import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { fetchEarthquakeData } from "../utils/fetchEarthquakeData";
import EarthquakePopup from "./EarthquakePopup";
import mapboxgl from "mapbox-gl";

const EarthquakeLayer = ({ map }) => {
  useEffect(() => {
    const loadEarthquakeData = async () => {
      const earthquakeData = await fetchEarthquakeData();

      if (!map.getSource("earthquakes")) {
        map.addSource("earthquakes", {
          type: "geojson",
          data: earthquakeData,
        });
      } else {
        map.getSource("earthquakes").setData(earthquakeData);
      }

      // Tambahkan layer untuk visualisasi gempa
      if (!map.getLayer("earthquakes-layer")) {
        map.addLayer({
          id: "earthquakes-layer",
          type: "circle",
          source: "earthquakes",
          paint: {
            "circle-radius": ["*", ["to-number", ["get", "mag"]], 1.5],
            "circle-stroke-width": 2,
            "circle-color": [
              "case",
              ["<=", ["to-number", ["get", "depth"]], 50],
              "#ff0000", // Merah
              ["<=", ["to-number", ["get", "depth"]], 100],
              "#ff8c00", // Orange
              ["<=", ["to-number", ["get", "depth"]], 250],
              "#fff017", // Kuning
              ["<=", ["to-number", ["get", "depth"]], 600],
              "#008000", // Hijau
              "#0000ff", // Biru untuk lebih dari 600
            ],
            "circle-stroke-color": "white",
          },
        });
      }
    };

    // Cursor pointer saat hover marker
    map.on("mouseenter", "earthquakes-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "earthquakes-layer", () => {
      map.getCanvas().style.cursor = "";
    });

    // Event klik untuk menampilkan popup gempa
    map.on("click", "earthquakes-layer", (e) => {
      const coordinates = e.features[0].geometry.coordinates;
      const properties = e.features[0].properties;

      const popupContainer = document.createElement("div");
      const root = createRoot(popupContainer);

      root.render(
        <EarthquakePopup properties={properties} coordinates={coordinates} />
      );

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setDOMContent(popupContainer)
        .addTo(map);
    });

    loadEarthquakeData();
  }, [map]);

  return null;
};

export default EarthquakeLayer;
