import React, { useEffect, useState } from "react";
import './index.scss';
import { motion } from "motion/react";
import { SwitchProps } from "./props";

const Switch: React.FC<SwitchProps> = ({
  checked,
  label,
  checkedLabel,
  onChange,
  dark,
  disabled,
  style,
  className = "",
}) => {
  const [newChecked, setNewChecked] = useState<boolean>(checked ?? false);
  useEffect(() => setNewChecked(checked ?? false), [checked]);

  return (
    <div
      className={`land-switch  ${disabled ? "disabled" : ""
        }`}
    >
      <div
        className={`land-switch-content ${dark ? "dark" : ""} ${newChecked ? "checked" : ""
          } ${className}`}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          if (disabled) return;
          setNewChecked(!newChecked);
          onChange?.(newChecked);
        }}
      >
        <div className="land-switch-bar">
          <motion.div animate={{ x: newChecked ? 16 : 0 }} transition={{ duration: 0.6, type: 'spring' }} className="land-switch-indicator">
          </motion.div>
        </div>
        {(label || checkedLabel) && (
          <div className="land-switch-label">
            {newChecked ? checkedLabel : label}
          </div>
        )}
      </div>
    </div>
  );
};

export default Switch;
