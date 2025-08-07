import React, { CSSProperties } from "react";

/**
 * Uploader组件属性类型定义
 */

export interface UploaderProps {
  /** 
   * 子元素
   * 可以传入React节点作为上传组件的内容
   */
  children?: React.ReactNode;

  /** 
   * 上传文件描述
   * 显示在上传区域的描述文本
   */
  desc?: string;

  /** 
   * 文件类型
   * 限制上传文件的类型，如"image/*"、"application/pdf"等
   */
  fileType?: string;

  /** 
   * 宽度
   * 设置上传组件的宽度
   */
  width?: string;

  /** 
   * 高度
   * 设置上传组件的高度
   */
  height?: string;

  /** 
   * 自定义样式
   * 可以传入CSS样式对象来自定义上传组件外观
   */
  style?: CSSProperties;

  /** 
   * 自定义类名
   * 可以传入额外的CSS类名
   */
  className?: string;

  /** 
   * 内部类名
   * 为上传组件的内部元素添加自定义类名
   */
  innerClassName?: string;

  /** 
   * 上传事件
   * 当文件上传完成时触发
   * @param url 上传后的文件URL
   * @param file 上传的文件信息
   */
  onUpload?: (url: any, file: any) => void;
}