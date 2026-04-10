# Electron 手动安装指南

如果 npm 安装 Electron 一直失败，可以手动安装：

## 方法一：使用修复脚本（推荐先尝试）

```bash
fix-electron-install.bat
```

## 方法二：手动下载安装

### 1. 下载 Electron 二进制文件

访问以下地址下载对应版本的 Electron：

**淘宝镜像（推荐）:**
- https://registry.npmmirror.com/binary.html?path=electron/

**华为镜像:**
- https://mirrors.huaweicloud.com/electron/

**选择版本:** v28.0.0
**Windows 64位:** electron-v28.0.0-win32-x64.zip

### 2. 解压到正确位置

```
rpg-electron/
├── node_modules/
│   └── electron/
│       ├── dist/           <-- 解压到这里
│       ├── path.txt        <-- 创建此文件，内容为：dist\electron.exe
│       └── package.json    <-- 创建此文件，内容见下方
```

### 3. package.json 内容

```json
{
  "name": "electron",
  "version": "28.0.0",
  "main": "index.js",
  "types": "electron.d.ts"
}
```

### 4. 验证安装

```bash
npx electron --version
```

应该输出: v28.0.0

## 方法三：使用代理

```bash
# 设置代理（如果有 VPN）
set HTTP_PROXY=http://127.0.0.1:7890
set HTTPS_PROXY=http://127.0.0.1:7890

# 然后安装
npm install electron@28.0.0 --save-dev
```

## 方法四：离线安装

### 1. 在其他有网络的机器上下载

```bash
# 下载 Electron 包
npm pack electron@28.0.0
```

会生成 `electron-28.0.0.tgz`

### 2. 复制到项目目录，然后安装

```bash
npm install electron-28.0.0.tgz --save-dev
```

## 常见问题

### Q: 提示 "certificate has expired"
A: 使用 `.npmrc` 中配置 `strict-ssl=false`

### Q: 提示 "connect ETIMEDOUT"
A: 网络超时，更换镜像源或使用方法二手动安装

### Q: 提示 "Electron failed to install correctly"
A: 手动删除 node_modules/electron 后重新安装

## 验证 Electron 是否安装成功

```bash
# 进入项目目录
cd G:\programe\_python\rpg-electron

# 检查 Electron 版本
node -e "console.log(require('electron/package.json').version)"

# 或者直接运行
npx electron --version
```

如果显示 v28.0.0，说明安装成功，可以运行 `npm run dev` 了！
