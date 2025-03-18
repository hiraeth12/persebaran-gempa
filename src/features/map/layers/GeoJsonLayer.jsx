import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const GeoJsonLayer = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    // Fetch GeoJSON data
    fetch('/geojson/all_kabkota_ind_reduce.geojson')
      .then((response) => response.json())
      .then((data) => {
        if (!map.getSource('kabkota')) {
          map.addSource('kabkota', {
            type: 'geojson',
            data: data
          });

          // Layer hover (untuk menangkap hover di area)
          map.addLayer({
            id: 'kabkota-hover',
            type: 'fill',
            source: 'kabkota',
            paint: {
              'fill-color': '#000000', // Warna hitam untuk hover detection
              'fill-opacity': 0
            }
          });

          // Layer garis batas kabupaten/kota
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

          // Layer fill untuk highlight
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

          // Layer border highlight
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

    // Event hover
  //   map.on('mousemove', 'kabkota-hover', (e) => {
  //     const features = e.features[0];
  //     const mhid = features.properties.mhid;

  //     // Set filter untuk highlight area
  //     map.setFilter('kabkota-fill', ['in', 'mhid', mhid]);
  //     map.setFilter('kabkota-highlight', ['in', 'mhid', mhid]);

  //     // Ubah cursor menjadi pointer
  //     map.getCanvas().style.cursor = 'pointer';
  //   });

  //   // Event saat keluar dari area hover
  //   map.on('mouseleave', 'kabkota-hover', () => {
  //     map.setFilter('kabkota-fill', ['in', 'mhid', '']);
  //     map.setFilter('kabkota-highlight', ['in', 'mhid', '']);
  //     map.getCanvas().style.cursor = '';
  //   }
  // );

    // Event klik untuk menampilkan nama daerah
    // map.on('click', 'kabkota-hover', (e) => {
    //   const features = e.features[0];
    //   const { name, prov_name } = features.properties;

    //   new mapboxgl.Popup()
    //     .setLngLat(e.lngLat)
    //     .setHTML(`
    //       <div class="text-sm">
    //         <p>${name}</p>
    //       </div>
    //     `)
    //     .addTo(map);
    // });

  }, [map]);

  return null;
};

export default GeoJsonLayer;
