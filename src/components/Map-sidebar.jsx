import React, { useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { CiWarning, CiFilter } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import logoBMKG from "@/assets/BMKG.svg";
import logoProduct from "@/assets/logoipsum-338.svg";
import { Link } from "react-router-dom";

const AppSidebar = ({
  toggleSidebar,
  handleShowLatestEarthquake,
  handleShowFeltEarthquake,
  onFilterChange,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [magnitude, setMagnitude] = useState(10); // Default: Tampilkan semua gempa

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleMagnitudeChange = (e) => {
    const newMagnitude = parseFloat(e.target.value);
    setMagnitude(newMagnitude);
    onFilterChange(newMagnitude); // Kirim ke parent
  };

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-900 shadow-md flex flex-col">
      {/* Header Sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center gap-5">
          <img src={logoProduct} alt="Logo Produk" className="h-8 w-8" />
          <h1 className="font-reenie text-xl font-bold">SeismoTrack</h1>
        </div>
        {/* Tombol Tutup Sidebar */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <FiChevronLeft size={24} />
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 p-4 space-y-2">
        <button
          onClick={handleShowLatestEarthquake}
          className="w-full flex justify-between items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <span>Gempa Terdeteksi</span>
          <HiOutlineLocationMarker size={20} />
        </button>
        <button
          onClick={handleShowFeltEarthquake}
          className="w-full flex justify-between items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <span>Gempa Dirasakan</span>
          <CiWarning size={20} />
        </button>

        {/* Tombol Filter */}
        <button
          onClick={toggleFilter}
          className="w-full flex justify-between items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <span>Filter</span>
          <CiFilter size={20} />
        </button>

        {/* Menu Filter Magnitudo */}
        {showFilter && (
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md mt-2">
            <label className="block text-sm font-medium mb-1">
              Magnitudo Maksimum:
            </label>
            <select
              value={magnitude}
              onChange={handleMagnitudeChange}
              className="w-full p-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-700"
            >
              <option value="10">Semua</option>
              <option value="2.5">{"< 2.5"}</option>
              <option value="4.5">{"< 4.5"}</option>
              <option value="6.5">{"< 6.5"}</option>
              <option value="8.5">{"< 8.5"}</option>
            </select>
          </div>
        )}
        <Link to="/">
          <button className="w-full flex justify-between items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-800">
            Home
          </button>
        </Link>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <a
          href="https://inatews.bmkg.go.id"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 hover:opacity-80 transition"
        >
          <span className="text-sm text-gray-500">© BMKG</span>
          <img src={logoBMKG} alt="BMKG Logo" className="h-9 w-9" />
        </a>
      </div>
    </div>
  );
};

export default AppSidebar;
