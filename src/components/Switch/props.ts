import { CSSProperties } from "react";

/**
 * Switch组件属性类型定义
 */

export interface SwitchProps {
  /** 
   * 是否开启
   * 控制开关的开启状态
   */
  checked?: boolean;

  /** 
   * 描述文字
   * 开关的描述文本
   */
  label?: string;

  /** 
   * 开启后的描述文字
   * 开关开启状态下的描述文本
   */
  checkedLabel?: string;

  /** 
   * 暗黑模式
   * 设置为true时使用暗黑主题
   */
  dark?: boolean;

  /** 
   * 禁用
   * 设置为true时开关不可用
   */
  disabled?: boolean;

  /** 
   * 自定义样式
   * 可以传入CSS样式对象来自定义开关外观
   */
  style?: CSSProperties;

  /** 
   * 自定义类名
   * 可以传入额外的CSS类名
   */
  className?: string;

  /** 
   * 状态变化事件
   * 当开关状态发生变化时触发
   * @param checked 新的开关状态
   */
  onChange?: (checked: boolean) => void;
} 