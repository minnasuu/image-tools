import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigationProps {
  title?: string;
}

const Navigation: React.FC<NavigationProps> = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 如果当前在首页，不显示导航
  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="flex items-center gap-16 px-24 py-16 bg-white border-b border-gray-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-8 fs-14 color-gray-3 hover:color-primary transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        返回
          </button>
          <div style={{width: '1px', height: '16px', background: 'var(--color-gray-4)'}}></div>
      {title && (
        <div className="flex items-center gap-8">
          <h1 className="fs-16 fw-500 color-gray-1">{title}</h1>
        </div>
      )}
    </div>
  );
};

export default Navigation;
