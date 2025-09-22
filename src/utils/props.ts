import React, { CSSProperties } from 'react';

/**
 * Message组件属性类型定义
 * 包含所有Message组件及插件支持的属性及其详细说明
 */

// ==================== 基础类型定义 ====================

/** 消息类型 */
export type MessageType = "success" | "fail" | "warn" | "info" | "error" | "warning";

/** 消息位置 */
export type MessagePlacement =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right";

// ==================== 属性接口定义 ====================

/**
 * Message基础属性
 * 包含消息组件的基本配置和内容属性
 */
export interface MessageBaseProps {
  /** 
   * 是否显示
   * 控制消息组件的显示与隐藏
   */
  show?: boolean;

  /** 
   * 消息类型
   * - success: 成功
   * - fail: 失败
   * - warn: 警告
   * - info: 信息
   * - error: 错误
   * - warning: 警告（别名）
   */
  type?: MessageType;

  /** 
   * 消息内容
   * 可以传入字符串或React节点作为消息内容
   */
  text?: string | React.ReactNode;

  /** 
   * 是否简洁版
   * 设置为true时显示为简洁样式
   */
  simple?: boolean;
}

/**
 * Message样式属性
 * 用于配置消息组件的视觉样式
 */
export interface MessageStyleProps {
  /** 
   * 自定义样式
   * 可以传入CSS样式对象来自定义消息组件外观
   */
  style?: CSSProperties;

  /** 
   * 自定义类名
   * 可以传入额外的CSS类名
   */
  className?: string;
}

/**
 * Message组件完整属性类型
 * 合并了所有属性接口
 */
export type MessageProps = MessageBaseProps & MessageStyleProps;

/**
 * MessagePlugin选项
 * 用于插件式调用消息组件时的配置
 */
export interface MessagePluginOptions {
  /** 
   * 消息内容
   * 插件调用时的消息文本内容
   */
  content: string;

  /** 
   * 消息类型
   * 参考MessageType
   */
  type?: MessageType;

  /** 
   * 显示时长（毫秒），0表示不自动关闭
   */
  duration?: number;

  /** 
   * 自定义样式类名
   */
  className?: string;

  /** 
   * 自定义样式
   */
  style?: React.CSSProperties;

  /** 
   * 关闭回调
   * 当消息关闭时触发
   */
  onClose?: () => void;

  /** 
   * 是否显示关闭按钮
   */
  showClose?: boolean;

  /** 
   * 消息位置
   * 参考MessagePlacement
   */
  placement?: MessagePlacement;

  /** 
   * 是否简洁版
   */
  simple?: boolean;
}

/**
 * Message实例接口
 * 用于操作消息实例的方法
 */
export interface MessageInstance {
  /** 
   * 关闭消息
   */
  close: () => void;

  /** 
   * 更新消息内容
   * @param options 部分MessagePluginOptions
   */
  update: (options: Partial<MessagePluginOptions>) => void;
}

/**
 * 属性优先级说明：
 * 1. text和content分别用于组件和插件调用的消息内容
 * 2. type控制消息的主题色和图标
 * 3. show控制消息的显示与隐藏（组件模式）
 * 4. simple为true时显示为简洁样式
 * 5. style和className会覆盖默认样式
 * 6. duration仅在插件调用时生效，控制自动关闭时间
 * 7. showClose、placement等仅在插件调用时生效
 * 8. onClose用于处理消息关闭后的回调
 * 9. update方法可动态更新消息内容
 * 10. 组件和插件调用的属性有部分重叠，注意区分
 */ 