import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import EarthquakeLayer from './EarthquakeLayer';
import GeoJsonLayer from './GeoJsonLayer';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard-satellite',
      projection: 'globe',
      center: [113.9213, -0.7893],
      zoom: 4
    });

    map.current.on('style.load', () => {
      map.current.setFog({});
      setMapInstance(map.current);
    });
  }, []);

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '100vh' }}>
      {mapInstance && <EarthquakeLayer map={mapInstance} />}
      {map.current && <GeoJsonLayer map={map.current} />}

    </div>
  );
};

export default MapComponent;
