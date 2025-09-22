import React from 'react';
import { RangeSliderProps } from './props';
import './index.scss';

const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  label,
  onChange,
  disabled = false,
  className = '',
  style,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={`range-slider ${className}`} style={style}>
      {label && (
        <div className="range-slider__label">
          {label}
        </div>
      )}
      <div className="range-slider__container">
        <div 
          className="range-slider__track"
          style={{
            background: `linear-gradient(to right, #999 ${percentage}%, #e5e7eb ${percentage}%)`
          }}
        >
          <input
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            disabled={disabled}
            className="range-slider__input"
          />
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
