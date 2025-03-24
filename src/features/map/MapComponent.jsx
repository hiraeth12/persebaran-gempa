import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import EarthquakeLayer from "./layers/EarthquakeLayer";
import GeoJsonLayer from "./layers/GeoJsonLayer";
import FaultLineLayer from "./layers/FaultLineLayer";
import LatestEarthquakeLayer from "./layers/LatestEarthquakeLayer";
import FeltEarthquakeLayer, { showFeltEarthquakePopup } from "./layers/FeltEarthquakeLayer";
import AppSidebar from "@/components/Map-sidebar";
import { FiChevronRight } from "react-icons/fi";
import { showLatestEarthquakePopup } from "./layers/LatestEarthquakeLayer";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const sidebarRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v9",
      projection: "globe",
      center: [113.9213, -0.7893],
      zoom: 4,
    });

    map.current.on("style.load", () => {
      map.current.setFog({});
      setMapInstance(map.current);
    });
  }, []);

  useEffect(() => {
    if (mapInstance) {
      setTimeout(() => {
        mapInstance.resize();
      }, 350);
    }
  }, [isSidebarOpen]);

  // Fungsi untuk mendeteksi klik di luar sidebar
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="relative flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-500 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "16rem" }}
      >
        <AppSidebar
          toggleSidebar={() => setIsSidebarOpen(false)}
          handleShowLatestEarthquake={() => {
            setIsSidebarOpen(false);
            showLatestEarthquakePopup();
          }}
          handleShowFeltEarthquake={() => {
            setIsSidebarOpen(false);
            showFeltEarthquakePopup();
          }}
        />
      </div>

      {/* Tombol Toggle Sidebar */}
      {!isSidebarOpen && (
        <button
          className="absolute top-4 left-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md transition-all duration-500 hover:scale-110"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FiChevronRight size={24} />
        </button>
      )}

      {/* Mapbox Container */}
      <div ref={mapContainer} className="flex-1" style={{ height: "100vh" }}>
        {mapInstance && (
          <>
            <EarthquakeLayer map={mapInstance} />
            <GeoJsonLayer map={mapInstance} />
            <FaultLineLayer map={mapInstance} />
            <LatestEarthquakeLayer map={mapInstance} />
            <FeltEarthquakeLayer map={mapInstance} />
          </>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
