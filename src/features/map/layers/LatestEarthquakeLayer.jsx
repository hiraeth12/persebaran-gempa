import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import AnimatedPopup from "mapbox-gl-animated-popup";
import EarthquakePopup from "../EarthquakePopup";
import { fetchLatestEarthquake } from "../../../utils/fetchLatestEarthquake";

let latestEarthquakeData = null; // Simpan data gempa terbaru
let mapInstance = null; // Simpan referensi map

export const showLatestEarthquakePopup = () => {
  if (!mapInstance) return;

  const features = mapInstance.querySourceFeatures("latest-earthquake");

  if (features.length > 0) {
    const latestEarthquake = features[0];
    const coordinates = latestEarthquake.geometry.coordinates;
    const properties = latestEarthquake.properties;

    // Pusatkan peta ke lokasi gempa
    mapInstance.flyTo({
      center: coordinates,
      essential: true,
    });

    // Tampilkan popup
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
      .addTo(mapInstance);
  }
};

const LatestEarthquakeLayer = ({ map }) => {
  useEffect(() => {
    mapInstance = map; // Simpan referensi map

    const loadLatestEarthquake = async () => {
      const latestData = await fetchLatestEarthquake();
      if (latestData.features.length === 0) return;
      const latestQuake = latestData.features[0];

      if (latestEarthquakeData && latestEarthquakeData.id === latestQuake.properties.id) {
        return;
      }
      latestEarthquakeData = latestQuake.properties;

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
            "circle-radius": ["*", ["to-number", ["get", "mag"]], 1.5],
            "circle-stroke-width": 2,
            "circle-color": "#964B00",
            "circle-stroke-color": "white",
          },
        });

        map.on("mouseenter", "latest-earthquake-layer", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "latest-earthquake-layer", () => {
          map.getCanvas().style.cursor = "";
        });

        map.on("click", "latest-earthquake-layer", (e) => {
          showLatestEarthquakePopup(); // Panggil fungsi popup saat diklik
        });
      }
    };

    loadLatestEarthquake();
    const interval = setInterval(loadLatestEarthquake, 300000);

    return () => {
      clearInterval(interval);
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
