export const fetchLatestEarthquake = async () => {
  const apiUrl = import.meta.env.VITE_BMKG_API_TERKINI;

  try {
    const response = await fetch(`${apiUrl}?t=${Date.now()}`);

    // Cek apakah response adalah JSON
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (data.type === "FeatureCollection" && data.features) {
        return data;
      } else {
        console.error("Invalid data structure:", data);
        return { features: [] };
      }
    } catch (jsonError) {
      console.error("Error parsing JSON:", text); // Menampilkan respon API yang bermasalah
      throw jsonError;
    }
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    return { features: [] };
  }
};
