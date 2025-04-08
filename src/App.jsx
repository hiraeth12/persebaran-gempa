import React from "react";
import { Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
    </Routes>
  );
}

export default App;
