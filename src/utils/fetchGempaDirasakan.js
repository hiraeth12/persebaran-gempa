export const fetchGempaDirasakan = async () => {
    const apiUrl = import.meta.env.VITE_BMKG_API_GEMPA_TERKINI; // Pastikan variabel env ini sudah ada
  
    try {
      const response = await fetch(`${apiUrl}?t=${Date.now()}`); // Tambahkan timestamp untuk menghindari cache
  
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        
        if (data.info && data.info.point && data.info.point.coordinates) {
          return data;
        } else {
          console.error("Struktur data tidak valid:", data);
          return null;
        }
      } catch (jsonError) {
        console.error("Error parsing JSON:", text);
        throw jsonError;
      }
    } catch (error) {
      console.error("Error fetching felt earthquake data:", error);
      return null;
    }
  };
  