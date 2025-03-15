import { useEffect } from 'react';

const GeoJsonLayer = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    // Tambahkan sumber data dari file GeoJSON di public/geojson
    fetch('/geojson/all_kabkota_ind.geojson')
      .then((response) => response.json())
      .then((data) => {
        if (!map.getSource('kabkota')) {
          map.addSource('kabkota', {
            type: 'geojson',
            data: data
          });

          // Tambahkan layer batas kabupaten/kota
          map.addLayer({
            id: 'kabkota-layer',
            type: 'line',
            source: 'kabkota',
            paint: {
              'line-color': '#C0C2C9', // Warna garis
              'line-width': 1.0, // Ketebalan garis
              'line-opacity': 0.8 // Transparansi
            }
          });
        }
      })
      .catch((error) => console.error('Error loading GeoJSON:', error));
  }, [map]);

  return null;
};

export default GeoJsonLayer;
