import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { fetchEarthquakeData } from "../../../utils/fetchEarthquakeData";
import mapboxgl from "mapbox-gl";
import EarthquakePopup from "../EarthquakePopup"; 
import AnimatedPopup from "mapbox-gl-animated-popup";

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
              "#ff0000",
              ["<=", ["to-number", ["get", "depth"]], 100],
              "#ff8c00",
              ["<=", ["to-number", ["get", "depth"]], 250],
              "#fff017",
              ["<=", ["to-number", ["get", "depth"]], 600],
              "#008000",
              "#0000ff",
            ],
            "circle-stroke-color": "white",
          },
        });
      }
      
    };

    map.on("mouseenter", "earthquakes-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "earthquakes-layer", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("click", "earthquakes-layer", (e) => {
      const coordinates = e.features[0].geometry.coordinates;
      const properties = e.features[0].properties;
      const popupContainer = document.createElement("div");
      const root = createRoot(popupContainer);

      root.render(
        <EarthquakePopup properties={properties} coordinates={coordinates} />
      );

      new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        className: "custom-popup",
      })
      
      const popup = new AnimatedPopup({
        closeButton: false,
        closeOnClick: true,
        className: "custom-popup",
        openingAnimation: { duration: 100, easing: "easeOutSine", transform: "scale" },
        closingAnimation: { duration: 100, easing: "easeInOutSine", transform: "scale" },
      })
        .setLngLat(coordinates)
        .setDOMContent(popupContainer)
        .addTo(map);
    });

    loadEarthquakeData();
  }, [map]);

  return null;
};

export default EarthquakeLayer;
