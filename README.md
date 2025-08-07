# Image Tools - 图片处理工具集

一个基于React + TypeScript + Vite构建的图片处理工具集合，提供多种图片处理功能。

## 🌟 功能特性

### 📊 提取图片主色
- 获取图片像素数据，统计出现频次最高的颜色
- 支持调整取色数量（1-20个）
- 支持过滤中性色，提高颜色区分度
- 实时预览提取结果

### 🎨 图片像素化
- 将图片转换为像素化效果
- 支持调整像素化程度
- 实时预览处理效果
- 支持两种像素化算法

### 🔄 图片换色
- 智能提取图片主要颜色
- 支持颜色替换和色相替换两种模式
- 实时预览换色效果
- 支持批量颜色处理

## 🚀 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **路由管理**: React Router DOM
- **样式处理**: Sass + CSS变量
- **动画库**: Motion
- **颜色处理**: TinyColor2
- **UI组件**: Land Design

## 📦 安装和运行

### 开发环境
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产构建
```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 部署到GitHub Pages
```bash
# 部署到GitHub Pages
npm run deploy
```

## 🌐 在线访问

项目已部署到GitHub Pages，可以通过以下地址访问：

**🌍 在线地址**: [https://minnasuu.github.io/image-tools](https://minnasuu.github.io/image-tools)

## 📁 项目结构

```
image-tools/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 通用组件
│   │   ├── Icon.tsx       # 图标组件
│   │   ├── Navigation.tsx # 导航组件
│   │   ├── Switch/        # 开关组件
│   │   └── Uploader/      # 上传组件
│   ├── pages/             # 页面组件
│   │   ├── Home.tsx       # 首页
│   │   ├── PickMainColors.tsx # 提取主色
│   │   ├── ImgPixel.tsx   # 图片像素化
│   │   ├── ImgColorChange.tsx # 图片换色
│   │   └── ImgWaterMark.tsx # 图片水印
│   ├── style/             # 样式文件
│   ├── utils/             # 工具函数
│   ├── App.tsx            # 主应用组件
│   └── main.tsx           # 应用入口
├── package.json
└── vite.config.ts
```

## 🎯 主要功能

### 路由系统
- 使用React Router实现单页应用路由
- 支持页面间导航和返回功能
- 统一的导航组件设计

### 组件化设计
- 模块化的组件架构
- 可复用的UI组件
- 统一的样式系统

### 图片处理
- 基于Canvas的图片处理
- 支持多种图片格式
- 实时预览和批量处理

## 🔧 开发说明

### 添加新功能
1. 在`src/pages/`目录下创建新的页面组件
2. 在`src/mock.tsx`中添加功能配置
3. 在`src/App.tsx`中添加路由配置
4. 在`src/components/Icon.tsx`中添加对应图标

### 样式系统
- 使用Sass预处理器
- CSS变量管理主题色彩
- 原子化CSS类名系统

## 📝 更新日志

### v1.0.0 (2025-03-09)
- ✨ 完善路由系统
- ✨ 添加导航组件
- ✨ 创建功能图标
- ✨ 配置GitHub Pages部署
- 🐛 修复TypeScript类型错误

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## �� 许可证

MIT License
