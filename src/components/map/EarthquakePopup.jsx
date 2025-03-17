const EarthquakePopup = ({ properties, coordinates }) => {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-full h-12 w-0.5 bg-red-500 transform -translate-x-1/2"></div>

      <div className="bg-black text-white p-4 rounded-lg shadow-lg border border-red-500 relative">
        <div className="text-center">
          <p className="p-1 bg-red-700 font-bold text-xs text-white">
            GEMPA BUMI
          </p>
        </div>
        <table className="w-full text-xs mt-2">
          <tbody>
            <tr>
              <td className="text-left">Magnitudo</td>
              <td className="text-right">
                {Number(properties.mag).toFixed(1)}
              </td>
            </tr>
            <tr>
              <td className="text-left">Kedalaman</td>
              <td className="text-right">
                {Number(properties.depth).toFixed(2)} km
              </td>
            </tr>
            <tr>
              <td className="text-left">Waktu</td>
              <td className="text-right">
                {new Date(properties.time).toLocaleString("id-ID", {
                  hour12: false,
                  timeZone: "Asia/Jakarta",
                })}
              </td>
            </tr>
            <tr>
              <td className="text-left">Lokasi (Lat,Lng)</td>
              <td className="text-right">
                {coordinates[1]}, {coordinates[0]}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarthquakePopup;
