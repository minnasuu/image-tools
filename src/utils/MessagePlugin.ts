// @ts-nocheck
import { MessagePluginOptions, MessageInstance } from './props.ts';

class MessagePlugin {
  private static instance: MessagePlugin;
  private container: HTMLDivElement | null = null;
  private messageQueue: Map<string, HTMLDivElement> = new Map();
  private messageId = 0;
  private isDestroyed = false;

  private constructor() {
    this.initContainer();
  }

  public static getInstance(): MessagePlugin {
    if (!MessagePlugin.instance) {
      MessagePlugin.instance = new MessagePlugin();
    }
    return MessagePlugin.instance;
  }

  /**
   * 检查是否在浏览器环境中
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  /**
   * 安全地执行 DOM 操作
   */
  private safeDOMOperation<T>(operation: () => T, fallback?: T): T | undefined {
    try {
      if (!this.isBrowser()) {
        console.warn('MessagePlugin: 不在浏览器环境中，无法执行 DOM 操作');
        return fallback;
      }
      return operation();
    } catch (error) {
      console.error('MessagePlugin: DOM 操作失败', error);
      return fallback;
    }
  }

  /**
   * 验证消息选项
   */
  private validateOptions(options: MessagePluginOptions): boolean {
    if (!options || typeof options !== 'object') {
      console.error('MessagePlugin: 无效的选项参数');
      return false;
    }

    if (!options.content || typeof options.content !== 'string') {
      console.error('MessagePlugin: 消息内容不能为空且必须是字符串');
      return false;
    }

    if (options.duration !== undefined && (typeof options.duration !== 'number' || options.duration < 0)) {
      console.error('MessagePlugin: duration 必须是大于等于 0 的数字');
      return false;
    }

    if (options.type && !['success', 'error', 'warning', 'info', 'fail'].includes(options.type)) {
      console.error('MessagePlugin: 无效的消息类型');
      return false;
    }

    return true;
  }

  /**
   * 初始化消息容器
   */
  private initContainer(): void {
    if (this.container || this.isDestroyed) return;

    this.safeDOMOperation(() => {
      // 检查是否已存在容器
      const existingContainer = document.getElementById('message-plugin-container');
      if (existingContainer) {
        this.container = existingContainer as HTMLDivElement;
        return;
      }

      this.container = document.createElement('div');
      this.container.id = 'message-plugin-container';
      this.container.style.cssText = `
        position: fixed;
        top: 40px;
        right: 50%;
        z-index: 9999;
        pointer-events: none;
        transform: translateX(50%);
      `;
      document.body.appendChild(this.container);
    });
  }

  /**
   * 创建消息元素
   */
  private createMessageElement(options: MessagePluginOptions): HTMLDivElement | null {
    if (!this.validateOptions(options)) {
      return null;
    }

    return this.safeDOMOperation<HTMLDivElement | null>(() => {
      const messageId = `message-${++this.messageId}`;
      const messageEl = document.createElement('div');
      messageEl.id = messageId;
      messageEl.className = `message-item ${options.className || ''}`.trim();

      // 基础样式
      const baseStyle = options.simple ? `
      background: #fff;
      color: #202020;
      border-radius: 8px;
      padding: 8px 12px;
      max-width: 400px;
      font-size: 14px;
      transition: all 0.3s ease;
      `: `
        background: #fff;
        border-radius: 4px;
        padding: 12px 16px;
        margin-bottom: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        pointer-events: auto;
        max-width: 400px;
        word-wrap: break-word;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #202020;
        font-size: 14px;
        user-select: none;
      `;

      messageEl.style.cssText = baseStyle;

      // 应用自定义样式
      if (options.style) {
        try {
          Object.assign(messageEl.style, options.style);
        } catch (error) {
          console.warn('MessagePlugin: 应用自定义样式失败', error);
        }
      }

      // 创建内容容器
      const contentEl = document.createElement('div');
      contentEl.textContent = options.content;
      contentEl.style.flex = '1';

      // 添加图标
      const messageIcon = document.createElement('div');
      const iconStyle = `
        width: 16px;
        height: 16px;
        background-color: white;
        border-radius: 50%;
        display: flex;
      `;

      // 根据类型设置样式
      const typeStyles: Record<string, string> = {
        success: "background-color: #52c41a;clipPath:path('M8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1ZM11.8174 5.14648C11.6221 4.95123 11.3056 4.95122 11.1104 5.14648L7.06445 9.19238L4.90332 7.03223C4.70806 6.83698 4.39155 6.83697 4.19629 7.03223L3.64648 7.58203C3.45123 7.77729 3.45123 8.0938 3.64648 8.28906L6.1582 10.8008L6.16016 10.8037L6.71094 11.3535C6.90622 11.5485 7.22281 11.5487 7.41797 11.3535L12.3672 6.40332C12.5624 6.20806 12.5624 5.89155 12.3672 5.69629L11.8174 5.14648Z')",
        fail: "background-color: #E63D2E;clipPath:path('M8 15C11.866 15 15 11.866 15 8C15 4.134 11.866 1 8 1C4.134 1 1 4.134 1 8C1 11.866 4.134 15 8 15ZM4.58165 5.85883C4.40958 5.68921 4.4076 5.41223 4.57723 5.24015L5.1915 4.61702C5.36113 4.44495 5.63816 4.44297 5.81023 4.6126L7.99116 6.76258L10.1411 4.58162C10.3107 4.40955 10.5878 4.40757 10.7598 4.5772L11.383 5.19148C11.555 5.3611 11.557 5.63811 11.3874 5.81018L9.23742 7.99112L11.4184 10.1411C11.5904 10.3107 11.5924 10.5877 11.4228 10.7598L10.8085 11.3829C10.6389 11.555 10.3619 11.557 10.1898 11.3873L8.00884 9.23738L5.85887 11.4183C5.68926 11.5904 5.41223 11.5924 5.24018 11.4227L4.61705 10.8085C4.44498 10.6388 4.44299 10.3618 4.61263 10.1898L6.76258 8.00884L4.58165 5.85883Z')",
        warning: "background-color: #FA8E00;clipPath: path('M8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15ZM7.5625 3.625C7.32087 3.625 7.125 3.82088 7.125 4.0625V8.875C7.125 9.11663 7.32087 9.3125 7.5625 9.3125H8.4375C8.67913 9.3125 8.875 9.11663 8.875 8.875V4.0625C8.875 3.82088 8.67913 3.625 8.4375 3.625H7.5625ZM7.5625 10.625C7.32087 10.625 7.125 10.8209 7.125 11.0625V11.9375C7.125 12.1791 7.32087 12.375 7.5625 12.375H8.4375C8.67913 12.375 8.875 12.1791 8.875 11.9375V11.0625C8.875 10.8209 8.67913 10.625 8.4375 10.625H7.5625Z')",
        error: "background-color: #E63D2E;clipPath: path('M8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15ZM7.5625 3.625C7.32087 3.625 7.125 3.82088 7.125 4.0625V8.875C7.125 9.11663 7.32087 9.3125 7.5625 9.3125H8.4375C8.67913 9.3125 8.875 9.11663 8.875 8.875V4.0625C8.875 3.82088 8.67913 3.625 8.4375 3.625H7.5625ZM7.5625 10.625C7.32087 10.625 7.125 10.8209 7.125 11.0625V11.9375C7.125 12.1791 7.32087 12.375 7.5625 12.375H8.4375C8.67913 12.375 8.875 12.1791 8.875 11.9375V11.0625C8.875 10.8209 8.67913 10.625 8.4375 10.625H7.5625Z')",
        info: "background-color: #1890ff;clipPath:path('M8 15C11.866 15 15 11.866 15 8C15 4.134 11.866 1 8 1C4.134 1 1 4.134 1 8C1 11.866 4.134 15 8 15ZM7.5625 12.375C7.32087 12.375 7.125 12.1791 7.125 11.9375V7.125C7.125 6.88337 7.32087 6.6875 7.5625 6.6875H8.4375C8.67913 6.6875 8.875 6.88337 8.875 7.125V11.9375C8.875 12.1791 8.67913 12.375 8.4375 12.375H7.5625ZM7.5625 5.375C7.32087 5.375 7.125 5.17913 7.125 4.9375V4.0625C7.125 3.82088 7.32087 3.625 7.5625 3.625H8.4375C8.67913 3.625 8.875 3.82088 8.875 4.0625V4.9375C8.875 5.17913 8.67913 5.375 8.4375 5.375H7.5625Z')"
      };

      const type = options.type || 'info';
      const typeStyle = typeStyles[type] || typeStyles.info;
      messageIcon.style.cssText = iconStyle + typeStyle;
      if (!options.simple) messageEl.appendChild(messageIcon);
      messageEl.appendChild(contentEl);

      // 添加关闭按钮
      if (options.showClose) {
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
          margin-left: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          opacity: 0.6;
          transition: opacity 0.2s;
        `;
        closeBtn.onmouseenter = () => closeBtn.style.opacity = '1';
        closeBtn.onmouseleave = () => closeBtn.style.opacity = '0.6';
        closeBtn.onclick = () => this.close(messageId);
        messageEl.appendChild(closeBtn);
      }

      this.messageQueue.set(messageId, messageEl);
      return messageEl;
    }, null);
  }

  /**
   * 显示消息
   */
  public show(options: MessagePluginOptions): MessageInstance {
    if (this.isDestroyed) {
      console.warn('MessagePlugin: 插件已销毁，无法显示消息');
      return this.createDummyInstance();
    }

    if (!this.validateOptions(options)) {
      return this.createDummyInstance();
    }

    if (!this.container) {
      this.initContainer();
    }

    const messageEl = this.createMessageElement(options);
    if (!messageEl) {
      return this.createDummyInstance();
    }

    this.safeDOMOperation(() => {
      if (this.container) {
        this.container.appendChild(messageEl);
      }
    });

    // 添加进入动画
    this.safeDOMOperation(() => {
      messageEl.style.transform = 'translateY(-100%)';
      messageEl.style.opacity = '0';

      requestAnimationFrame(() => {
        this.safeDOMOperation(() => {
          messageEl.style.transform = 'translateX(0)';
          messageEl.style.opacity = '1';
        });
      });
    });

    const messageId = messageEl.id;
    const instance: MessageInstance = {
      close: () => this.close(messageId),
      update: (newOptions) => this.update(messageId, newOptions)
    };

    // 自动关闭
    if (options.duration !== 0) {
      const duration = options.duration || 2000;
      setTimeout(() => {
        this.close(messageId);
        try {
          options.onClose?.();
        } catch (error) {
          console.error('MessagePlugin: onClose 回调执行失败', error);
        }
      }, duration);
    }

    return instance;
  }

  /**
   * 创建虚拟实例（用于错误情况）
   */
  private createDummyInstance(): MessageInstance {
    return {
      close: () => { },
      update: () => { }
    };
  }

  /**
   * 关闭指定消息
   */
  private close(messageId: string): void {
    if (!messageId || typeof messageId !== 'string') {
      console.warn('MessagePlugin: 无效的消息ID');
      return;
    }

    const messageEl = this.messageQueue.get(messageId);
    if (!messageEl) return;

    // 添加退出动画
    this.safeDOMOperation(() => {
      messageEl.style.transform = 'translateY(-100%)';
      messageEl.style.opacity = '0';
    });

    setTimeout(() => {
      this.safeDOMOperation(() => {
        if (messageEl.parentNode) {
          messageEl.parentNode.removeChild(messageEl);
        }
        this.messageQueue.delete(messageId);
      });
    }, 300);
  }

  /**
   * 更新消息内容
   */
  private update(messageId: string, options: Partial<MessagePluginOptions>): void {
    if (!messageId || typeof messageId !== 'string') {
      console.warn('MessagePlugin: 无效的消息ID');
      return;
    }

    if (!options || typeof options !== 'object') {
      console.warn('MessagePlugin: 无效的更新选项');
      return;
    }

    const messageEl = this.messageQueue.get(messageId);
    if (!messageEl) return;

    this.safeDOMOperation(() => {
      if (options.content) {
        const contentEl = messageEl.querySelector('div');
        if (contentEl) {
          contentEl.textContent = options.content;
        }
      }

      if (options.style) {
        try {
          Object.assign(messageEl.style, options.style);
        } catch (error) {
          console.warn('MessagePlugin: 更新样式失败', error);
        }
      }
    });
  }

  /**
   * 关闭所有消息
   */
  public closeAll(): void {
    if (this.isDestroyed) return;

    const messageIds = Array.from(this.messageQueue.keys());
    messageIds.forEach(messageId => {
      this.close(messageId);
    });
  }

  /**
   * 成功消息
   */
  public success(content: string, options?: Partial<MessagePluginOptions>): MessageInstance {
    if (!content || typeof content !== 'string') {
      console.error('MessagePlugin: 消息内容不能为空');
      return this.createDummyInstance();
    }
    return this.show({ content, type: 'success', ...options });
  }

  /**
   * 错误消息
   */
  public error(content: string, options?: Partial<MessagePluginOptions>): MessageInstance {
    if (!content || typeof content !== 'string') {
      console.error('MessagePlugin: 消息内容不能为空');
      return this.createDummyInstance();
    }
    return this.show({ content, type: 'error', ...options });
  }

  /**
   * 失败消息
   */
  public fail(content: string, options?: Partial<MessagePluginOptions>): MessageInstance {
    if (!content || typeof content !== 'string') {
      console.error('MessagePlugin: 消息内容不能为空');
      return this.createDummyInstance();
    }
    return this.show({ content, type: 'fail', ...options });
  }

  /**
   * 警告消息
   */
  public warning(content: string, options?: Partial<MessagePluginOptions>): MessageInstance {
    if (!content || typeof content !== 'string') {
      console.error('MessagePlugin: 消息内容不能为空');
      return this.createDummyInstance();
    }
    return this.show({ content, type: 'warning', ...options });
  }

  /**
   * 信息消息
   */
  public info(content: string, options?: Partial<MessagePluginOptions>): MessageInstance {
    if (!content || typeof content !== 'string') {
      console.error('MessagePlugin: 消息内容不能为空');
      return this.createDummyInstance();
    }
    return this.show({ content, type: 'info', ...options });
  }

  /**
   * 销毁插件
   */
  public destroy(): void {
    if (this.isDestroyed) return;

    this.isDestroyed = true;
    this.closeAll();

    this.safeDOMOperation(() => {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    });

    this.container = null;
    this.messageQueue.clear();
    // 重置单例实例
    MessagePlugin.instance = undefined as unknown as MessagePlugin;
  }
}

// 导出单例实例
export const messagePlugin = MessagePlugin.getInstance();

// 导出便捷方法
export const message = {
  show: (options: MessagePluginOptions) => {
    try {
      return messagePlugin.show(options);
    } catch (error) {
      console.error('MessagePlugin: show 方法执行失败', error);
      return { close: () => { }, update: () => { } };
    }
  },
  success: (content: string, options?: Partial<MessagePluginOptions>) => {
    try {
      return messagePlugin.success(content, options);
    } catch (error) {
      console.error('MessagePlugin: success 方法执行失败', error);
      return { close: () => { }, update: () => { } };
    }
  },
  error: (content: string, options?: Partial<MessagePluginOptions>) => {
    try {
      return messagePlugin.error(content, options);
    } catch (error) {
      console.error('MessagePlugin: error 方法执行失败', error);
      return { close: () => { }, update: () => { } };
    }
  },
  fail: (content: string, options?: Partial<MessagePluginOptions>) => {
    try {
      return messagePlugin.fail(content, options);
    } catch (error) {
      console.error('MessagePlugin: fail 方法执行失败', error);
      return { close: () => { }, update: () => { } };
    }
  },
  warning: (content: string, options?: Partial<MessagePluginOptions>) => {
    try {
      return messagePlugin.warning(content, options);
    } catch (error) {
      console.error('MessagePlugin: warning 方法执行失败', error);
      return { close: () => { }, update: () => { } };
    }
  },
  info: (content: string, options?: Partial<MessagePluginOptions>) => {
    try {
      return messagePlugin.info(content, options);
    } catch (error) {
      console.error('MessagePlugin: info 方法执行失败', error);
      return { close: () => { }, update: () => { } };
    }
  },
  closeAll: () => {
    try {
      messagePlugin.closeAll();
    } catch (error) {
      console.error('MessagePlugin: closeAll 方法执行失败', error);
    }
  },
  destroy: () => {
    try {
      messagePlugin.destroy();
    } catch (error) {
      console.error('MessagePlugin: destroy 方法执行失败', error);
    }
  }
};

export default messagePlugin;

/**
 * 使用示例：
 * 
 * // 基础使用
 * import { message } from '@/comp/hooks/MessagePlugin';
 * 
 * // 显示不同类型的消息
 * message.success('操作成功！');
 * message.error('操作失败！');
 * message.warning('警告信息');
 * message.info('提示信息');
 * 
 * // 自定义配置
 * const msg = message.show({
 *   content: '自定义消息',
 *   type: 'success',
 *   duration: 5000, // 5秒后自动关闭
 *   showClose: true,
 *   onClose: () => console.log('消息已关闭')
 * });
 * 
 * // 手动关闭消息
 * msg.close();
 * 
 * // 更新消息内容
 * msg.update({ content: '更新后的内容' });
 * 
 * // 关闭所有消息
 * message.closeAll();
 * 
 * // 销毁插件（通常在组件卸载时调用）
 * message.destroy();
 */
