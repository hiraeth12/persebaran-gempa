import { useState, useEffect } from 'react';

const EarthquakePopup = ({ properties, coordinates }) => {
  const [locationName, setLocationName] = useState('');

  // Fetch lokasi dari Mapbox Reverse Geocoding
  const fetchLocationName = async (lng, lat) => {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&language=id`);
    const data = await response.json();
    const placeName = data.features[0]?.place_name || 'Tidak Diketahui';
    setLocationName(placeName);
  };

  useEffect(() => {
    fetchLocationName(coordinates[0], coordinates[1]);
  }, [coordinates]);

  // Format Tanggal dan Waktu
  const formatDateTime = (time) => {
    const date = new Date(time);
    const formattedDate = date.toLocaleDateString('id-ID');
    const formattedTime = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace('.', ':').replace('.', ':');

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = formatDateTime(properties.time);

  return (
    <div className="popup-content">
      <h3 className="text-red-500 font-bold">Gempa Bumi</h3>
      <p>Magnitudo  : {properties.mag}</p>
      <p>Kedalaman  : {properties.depth} KM</p>
      <p>Tanggal    : {formattedDate}</p>
      <p>Waktu      : {formattedTime}</p>
      <p>Lat,Long   : {coordinates[1]}, {coordinates[0]}</p>
      <p>Daerah     : {locationName}</p>
      <p>Wilayah    : {properties.place}</p>
    </div>
  );
};

export default EarthquakePopup;
