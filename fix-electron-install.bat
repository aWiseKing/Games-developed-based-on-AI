@echo off
chcp 65001 >nul
echo ==========================================
echo   Electron 安装修复脚本
echo ==========================================
echo.

REM 设置环境变量
set ELECTRON_MIRROR=https://cdn.npmmirror.com/binaries/electron/
set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/

echo [1/3] 清理旧的 Electron 安装...
if exist "node_modules\electron" (
    rmdir /s /q "node_modules\electron"
    echo   ✓ 已清理
) else (
    echo   - 无需清理
)

echo.
echo [2/3] 使用淘宝镜像安装 Electron...
npm install electron@28.0.0 --save-dev --registry=https://registry.npmmirror.com

echo.
echo [3/3] 安装其他依赖...
npm install

echo.
echo ==========================================
if %errorlevel% == 0 (
    echo   ✓ 安装成功！
    echo   可以运行 npm run dev 启动游戏了
) else (
    echo   ✗ 安装失败，请检查网络连接
    echo   可以尝试手动下载 Electron 放到 node_modules
)
echo ==========================================
pause
