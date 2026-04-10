# 关于负债不得不在地下城打工这件事

一款 Electron + React + TypeScript 开发的文字冒险游戏。

## 游戏简介

你因为欠下巨额债务（10,000金币），必须在100天内通过探索地下城来还清债务。合理分配每日行动，在冒险与休息之间找到平衡，避免债务的利息滚雪球！

## 技术栈

- **桌面框架**: Electron 28
- **前端框架**: React 18
- **开发语言**: TypeScript 5
- **构建工具**: Vite 5
- **状态管理**: Zustand
- **样式**: TailwindCSS

## 开发环境

```bash
# 安装依赖
npm install

# 开发模式（需要单独安装 Electron）
npm run dev

# 构建应用
npm run build

# 打包（Windows）
npm run build:win
```

## 项目结构

```
src/
├── main/           # Electron 主进程
├── preload/        # 预加载脚本
├── renderer/       # 渲染进程（React 应用）
└── core/           # 游戏核心逻辑
    ├── models/     # 数据模型
    └── systems/    # 游戏系统
```

## 与原 Python 版本的区别

| 特性 | Python (Tkinter) | Electron (React) |
|------|-----------------|------------------|
| UI | 原生控件 | 现代化 Web UI |
| 动画 | 无 | CSS 动画支持 |
| 跨平台 | Python 依赖 | 独立可执行文件 |
| 视觉效果 | 简单 | 丰富 |

## 许可证

MIT
