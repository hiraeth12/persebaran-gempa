import React from "react";
import { Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPages";
import Home from "./pages/Home";


function App() {
  return (
    <Routes>
      <Route path="/map" element={<MapPage />} />
      <Route path="/"element={<Home/>}/>

    </Routes>
  );
}

export default App;
