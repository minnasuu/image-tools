import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import PickMainColors from "./pages/PickMainColors";
import ImgPixel from "./pages/ImgPixel";
import ImgColorChange from "./pages/ImgColorChange";
import ImgWaterMark from "./pages/ImgWaterMark";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pickMainColors" element={<PickMainColors />} />
      <Route path="/imgPixel" element={<ImgPixel />} />
      <Route path="/imgColorChange" element={<ImgColorChange />} />
      <Route path="/imgWaterMark" element={<ImgWaterMark />} />
      {/* 默认重定向到首页 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
