import { useEffect } from 'react';

const FaultLineLayer = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    // Ambil data GeoJSON dari public/geojson
    fetch('/geojson/indo_faults_lines.geojson')
      .then((response) => response.json())
      .then((data) => {
        console.log('Data Fault Line:', data); // Cek apakah data berhasil diambil
        if (!map.getSource('fault-line')) {
          map.addSource('fault-line', {
            type: 'geojson',
            data: data
          });

          // Tambahkan layer garis patahan
          map.addLayer({
            id: 'fault-line-layer',
            type: 'line',
            source: 'fault-line',
            paint: {
              'line-color': '#FF0000', // Warna merah untuk garis patahan
              'line-width': 0.9, // Ketebalan garis
              'line-opacity': 0.6 // Transparansi
            }
          });
        }
      })
      .catch((error) => console.error('Error loading fault line GeoJSON:', error));
  }, [map]);

  return null;
};

export default FaultLineLayer;
