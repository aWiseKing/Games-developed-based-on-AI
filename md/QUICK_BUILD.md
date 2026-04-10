# 快速构建指南

## 方法一：使用管理员权限运行（推荐）

### 1. 启用 Windows 开发者模式（一次性设置）

1. 打开 **设置** → **系统** → **开发者选项**
2. 开启 **开发者模式**
3. 这样可以无需管理员权限创建符号链接

### 2. 运行构建

```bash
npm run build:win
```

## 方法二：使用管理员命令行

1. 右键点击 **PowerShell** 或 **CMD**
2. 选择 **以管理员身份运行**
3. 进入项目目录：
```bash
cd G:\programe\_python\rpg-electron
npm run build:win
```

## 方法三：双击运行构建脚本

直接双击 `build.bat`，脚本会自动申请管理员权限。

## 方法四：仅生成未打包版本（最快，无需签名）

```bash
# 只构建，不打包
npm run build

# 然后手动复制文件
xcopy dist release\manual\
xcopy dist-electron release\manual\
xcopy data release\manual\
```

## 构建输出

构建成功后，会在 `release\` 目录下生成：

| 目标 | 输出路径 | 说明 |
|------|----------|------|
| dir | `release\win-unpacked\` | 免安装文件夹，可直接运行 |
| portable | `release\关于负债不得不在地下城打工这件事.exe` | 单文件便携版 |

## 常见问题

### Q: 提示 "cannot execute cause=exit status 2"
A: 需要管理员权限或启用 Windows 开发者模式

### Q: 提示 "winCodeSign" 相关错误
A: 这是代码签名工具解压失败，不影响功能，可以尝试方法一或二

### Q: 想跳过打包只测试构建
A: 运行 `npm run build`，然后检查 `dist/` 和 `dist-electron/` 目录
