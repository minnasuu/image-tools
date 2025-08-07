import React from "react";

const ImgWaterMark: React.FC = () => {
  return (
    <div className="width-100 height-100 overflow-auto">
      <div
        className="flex column gap-24 mx-auto width-100 border-box"
        style={{
          maxWidth: "1248px",
          padding: "88px 24px",
          boxSizing: "border-box",
        }}
      >
        <div className="flex column gap-16">
          <h1 className="fs-32 fw-600 color-gray-1">图片水印</h1>
          <p className="fs-16 color-gray-3">
            为图片添加文字或图片水印，支持自定义位置、透明度、旋转角度等
          </p>
        </div>
        
        <div className="flex column gap-24">
          <div className="flex column gap-16">
            <h2 className="fs-20 fw-500 color-gray-2">功能开发中...</h2>
            <p className="fs-14 color-gray-4">
              图片水印功能正在开发中，敬请期待！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImgWaterMark;