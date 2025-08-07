import React, { CSSProperties } from "react";

type IconProps = {
  size?: number;
  color?: string;
  gradient?: boolean;
  style?: CSSProperties;
  className?: string;
  onClick?: (e: any) => void;
  strokeWidth?: number;
};

export const IconLineArrow: React.FC<IconProps> = ({
    size = 16,
    color = 'currentColor',
    className = '',
  }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.18715 3.2276C8.28478 3.12996 8.28478 2.97167 8.18715 2.87404L7.83359 2.52049C7.73596 2.42286 7.57767 2.42286 7.48004 2.52049L2.53029 7.47024L2.17674 7.82379C2.07911 7.92142 2.07911 8.07971 2.17674 8.17734L2.53029 8.5309L7.48004 13.4806C7.57767 13.5783 7.73596 13.5783 7.83359 13.4806L8.18715 13.1271C8.28478 13.0295 8.28478 12.8712 8.18715 12.7735L3.91417 8.50057H13.7499C13.888 8.50057 13.9999 8.38864 13.9999 8.25057V7.75057C13.9999 7.61249 13.888 7.50057 13.7499 7.50057H3.91418L8.18715 3.2276Z" fill={color} />
    </svg>
  )

export const IconRight: React.FC<IconProps> = ({
                                                       size = 16,
                                                       color = 'currentColor',
                                                       className = '',
                                                   }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
<path fillRule="evenodd" clipRule="evenodd" d="M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z" fill={color} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
    
export const IconUpload: React.FC<IconProps> = ({
  size = 20,
  color = "#000",
  strokeWidth = 3,
  className = "",
  onClick,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={`upload ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M6 24.0083V42H42V24"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33 15L24 6L15 15"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.9917 32V6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};