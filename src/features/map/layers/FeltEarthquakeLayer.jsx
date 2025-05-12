import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import AnimatedPopup from "mapbox-gl-animated-popup";
import FeltEarthquakePopup from "./FeltEarthquakePopup";
import { fetchGempaDirasakan } from "../../../utils/fetchGempaDirasakan";

let latestFeltEarthquakeData = null;
let mapInstance = null;

export const showFeltEarthquakePopup = () => {
  if (!mapInstance) return;

  const features = mapInstance.querySourceFeatures("felt-earthquake");
  if (features.length > 0) {
    const feltEarthquake = features[0];
    const coordinates = feltEarthquake.geometry.coordinates;
    const properties = feltEarthquake.properties;

    mapInstance.flyTo({
      center: coordinates,
      essential: true,
    });

    const popupContainer = document.createElement("div");
    const root = createRoot(popupContainer);

    root.render(
      <FeltEarthquakePopup properties={properties} coordinates={coordinates} />
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

const FeltEarthquakeLayer = ({ map, magnitudeFilter }) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    mapInstance = map;

    const loadFeltEarthquake = async () => {
      try {
        const data = await fetchGempaDirasakan();
        if (!data || !data.info) {
          console.warn("No earthquake data available.");
          return;
        }

        const {
          eventid,
          magnitude,
          depth,
          time,
          date,
          area,
          felt,
          point,
          shakemap,
        } = data.info;

        if (
          magnitudeFilter &&
          parseFloat(magnitude) >= parseFloat(magnitudeFilter)
        ) {
          return;
        }

        const shakemapMmiUrl = shakemap
          ? `https://bmkg-content-inatews.storage.googleapis.com/${shakemap}`
          : null;

        const formattedDate = (() => {
          const dateParts = date.split("-");
          if (dateParts.length === 3) {
            const year = `20${dateParts[2]}`;
            return `${year}-${dateParts[1]}-${dateParts[0]}`;
          }
          return "Invalid Date";
        })();

        let formattedDateTime = `${formattedDate}T${time.replace(
          " WIB",
          ""
        )}+07:00`;

        const parsedDate = new Date(formattedDateTime);

        const formattedTime = new Intl.DateTimeFormat("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(parsedDate);

        const feltQuakeFeature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: point?.coordinates.split(",").map(parseFloat),
          },
          properties: {
            id: eventid || "Unknown",
            magnitude: parseFloat(magnitude) || 0,
            depth: depth ? depth.replace(" Km", "") : "Tidak diketahui",
            time: formattedTime,
            area: area || "Tidak diketahui",
            felt: felt || "Tidak ada laporan",
            shakemap_mmi: shakemapMmiUrl,
          },
        };

        if (
          latestFeltEarthquakeData &&
          latestFeltEarthquakeData.id === feltQuakeFeature.properties.id
        ) {
          console.log("No new earthquake data.");
          return;
        }
        latestFeltEarthquakeData = feltQuakeFeature.properties;

        const feltEarthquakeGeoJson = {
          type: "FeatureCollection",
          features: [feltQuakeFeature],
        };

        if (!map.getSource("felt-earthquake")) {
          map.addSource("felt-earthquake", {
            type: "geojson",
            data: feltEarthquakeGeoJson,
          });
        } else {
          map.getSource("felt-earthquake").setData(feltEarthquakeGeoJson);
        }

        if (!map.getLayer("felt-earthquake-layer")) {
          map.addLayer({
            id: "felt-earthquake-layer",
            type: "circle",
            source: "felt-earthquake",
            paint: {
              "circle-radius": ["*", ["to-number", ["get", "magnitude"]], 1.5],
              "circle-stroke-width": 2,
              "circle-color": "#FF4500",
              "circle-stroke-color": "white",
            },
          });

          map.on("mouseenter", "felt-earthquake-layer", () => {
            map.getCanvas().style.cursor = "pointer";
          });

          map.on("mouseleave", "felt-earthquake-layer", () => {
            map.getCanvas().style.cursor = "";
          });

          map.on("click", "felt-earthquake-layer", (e) => {
            showFeltEarthquakePopup();
          });
        }

      } catch (error) {
        console.error("Error fetching felt earthquake data:", error);
      }
    };

    loadFeltEarthquake();
    intervalRef.current = setInterval(loadFeltEarthquake, 30000);

    return () => {
      clearInterval(intervalRef.current);
      if (map.getLayer("felt-earthquake-layer")) {
        map.off("click", "felt-earthquake-layer");
        map.off("mouseenter", "felt-earthquake-layer");
        map.off("mouseleave", "felt-earthquake-layer");
      }
    };
  }, [map, magnitudeFilter]);

  return null;
};

export default FeltEarthquakeLayer;
