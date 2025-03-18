import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import AnimatedPopup from "mapbox-gl-animated-popup";
import EarthquakePopup from "../EarthquakePopup";
import { fetchLatestEarthquake } from "../../../utils/fetchLatestEarthquake"; 

const LatestEarthquakeLayer = ({ map }) => {
  useEffect(() => {
    let latestEarthquakeData = null; // Simpan data gempa terbaru untuk perbandingan

    const loadLatestEarthquake = async () => {
      const latestData = await fetchLatestEarthquake();
      if (latestData.features.length === 0) return;
      const latestQuake = latestData.features[0];

      // Cek apakah data terbaru berbeda dengan yang terakhir disimpan
      if (latestEarthquakeData && latestEarthquakeData.id === latestQuake.properties.id) {
        return; // Tidak perlu update jika data sama
      }
      latestEarthquakeData = latestQuake.properties; // Simpan data terbaru

      const earthquakeGeoJson = {
        type: "FeatureCollection",
        features: [latestQuake],
      };

      if (!map.getSource("latest-earthquake")) {
        map.addSource("latest-earthquake", {
          type: "geojson",
          data: earthquakeGeoJson,
        });
      } else {
        map.getSource("latest-earthquake").setData(earthquakeGeoJson);
      }

      if (!map.getLayer("latest-earthquake-layer")) {
        map.addLayer({
          id: "latest-earthquake-layer",
          type: "circle",
          source: "latest-earthquake",
          paint: {
            "circle-radius": ["*", ["to-number", ["get", "mag"]], 3],
            "circle-stroke-width": 2,
            "circle-color": "#964B00", // Warna coklat untuk gempa terbaru
            "circle-stroke-color": "white",
          },
        });

        // Tambahkan event listener untuk interaksi pengguna
        map.on("mouseenter", "latest-earthquake-layer", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "latest-earthquake-layer", () => {
          map.getCanvas().style.cursor = "";
        });

        map.on("click", "latest-earthquake-layer", (e) => {
          const coordinates = e.features[0].geometry.coordinates;
          const properties = e.features[0].properties;
          const popupContainer = document.createElement("div");
          const root = createRoot(popupContainer);

          root.render(
            <EarthquakePopup properties={properties} coordinates={coordinates} />
          );

          new AnimatedPopup({
            closeButton: false,
            closeOnClick: true,
            className: "custom-popup",
            openingAnimation: {
              duration: 100,
              easing: "easeOutSine",
              transform: "scale",
            },
            closingAnimation: {
              duration: 100,
              easing: "easeInOutSine",
              transform: "scale",
            },
          })
            .setLngLat(coordinates)
            .setDOMContent(popupContainer)
            .addTo(map);
        });
      }
    };

    loadLatestEarthquake();

    // Auto-refresh setiap 5 menit
    const interval = setInterval(loadLatestEarthquake, 300000);

    return () => {
      clearInterval(interval);
      // Hapus event listener saat komponen di-unmount
      if (map.getLayer("latest-earthquake-layer")) {
        map.off("click", "latest-earthquake-layer");
        map.off("mouseenter", "latest-earthquake-layer");
        map.off("mouseleave", "latest-earthquake-layer");
      }
    };
  }, [map]);

  return null;
};

export default LatestEarthquakeLayer;
