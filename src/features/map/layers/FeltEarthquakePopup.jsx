const FeltEarthquakePopup = ({ properties, coordinates }) => {
  if (!properties) return null;

  return (
    <div className="relative">
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
              <td className="text-right">{properties.magnitude}</td>
            </tr>
            <tr>
              <td className="text-left">Kedalaman</td>
              <td className="text-right">{properties.depth} km</td>
            </tr>
            <tr>
              <td className="text-left">Waktu</td>
              <td className="text-right">
                {properties.date}
                {properties.time}
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
        {properties.shakemap_mmi && (
          <div className="mt-2">
            <p className="text-xs text-center text-gray-300">
              Peta Guncangan (Shakemap MMI)
            </p>
            <img
              src={properties.shakemap_mmi}
              alt="Shakemap MMI"
              className="w-full h-auto rounded border border-gray-500"
              onError={(e) => (e.target.style.display = "none")}
            />
            <div className="text-center mt-1">
              <a
                href={properties.shakemap_mmi}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-xs underline hover:text-blue-200"
              >
                Buka gambar di tab baru
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeltEarthquakePopup;
