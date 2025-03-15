export const fetchEarthquakeData = async () => {
  const apiUrl = import.meta.env.VITE_BMKG_API;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Cek apakah data sesuai dengan format GeoJSON
    if (data.type === 'FeatureCollection' && data.features) {
      return data;
    } else {
      console.error('Invalid data structure:', data);
      return { features: [] };
    }
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return { features: [] };
  }
};
