import React from 'react';

/**
 * RangeSlider组件属性类型定义
 */

export interface RangeSliderProps {
  /** 
   * 当前值
   * 滑块当前选中的数值
   */
  value: number;

  /** 
   * 最小值
   * 滑块的最小值
   */
  min: number;

  /** 
   * 最大值
   * 滑块的最大值
   */
  max: number;

  /** 
   * 步长
   * 滑块每次移动的步长，默认为1
   */
  step?: number;

  /** 
   * 标签文本
   * 显示在滑块上方的标签文本
   */
  label?: string;

  /** 
   * 值变化回调
   * 当滑块值发生变化时触发的回调函数
   * @param value 新的值
   */
  onChange: (value: number) => void;

  /** 
   * 是否禁用
   * 是否禁用滑块交互
   */
  disabled?: boolean;

  /** 
   * 自定义类名
   * 可以传入额外的CSS类名
   */
  className?: string;

  /** 
   * 自定义样式
   * 可以传入CSS样式对象来自定义滑块外观
   */
  style?: React.CSSProperties;
}
