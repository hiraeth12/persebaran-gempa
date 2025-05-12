import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const GeoJsonLayer = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    fetch('/geojson/all_kabkota_ind_reduce.geojson')
      .then((response) => response.json())
      .then((data) => {
        if (!map.getSource('kabkota')) {
          map.addSource('kabkota', {
            type: 'geojson',
            data: data
          });

          map.addLayer({
            id: 'kabkota-hover',
            type: 'fill',
            source: 'kabkota',
            paint: {
              'fill-color': '#000000',
              'fill-opacity': 0
            }
          });

          map.addLayer({
            id: 'kabkota-layer',
            type: 'line',
            source: 'kabkota',
            paint: {
              'line-color': '#C0C2C9',
              'line-width': 0.9,
              'line-opacity': 0.3
            }
          });

          map.addLayer({
            id: 'kabkota-fill',
            type: 'fill',
            source: 'kabkota',
            paint: {
              'fill-color': '#FF5252',
              'fill-opacity': 0.3
            },
            filter: ['in', 'mhid', '']
          });


          map.addLayer({
            id: 'kabkota-highlight',
            type: 'line',
            source: 'kabkota',
            paint: {
              'line-color': '#FF5252',
              'line-width': 1.5
            },
            filter: ['in', 'mhid', '']
          });
        }
      })
      .catch((error) => console.error('Error loading GeoJSON:', error));

  }, [map]);

  return null;
};

export default GeoJsonLayer;
