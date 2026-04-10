@echo off
chcp 65001 >nul
echo ==========================================
echo   关于负债不得不在地下城打工这件事
echo   项目设置脚本
echo ==========================================
echo.

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 18+
    exit /b 1
)

echo [1/3] 检测到 Node.js 版本:
node --version
echo.

REM 安装依赖
echo [2/3] 正在安装依赖...
echo 这可能需要几分钟时间，请耐心等待...
call npm install
echo.

REM 检查 Electron 是否安装成功
if not exist "node_modules\electron" (
    echo [警告] Electron 可能未正确安装
    echo 尝试使用淘宝镜像重新安装 Electron...
    set ELECTRON_MIRROR=https://cdn.npm.taobao.org/dist/electron/
    call npm install electron@28 --save-dev
)

echo.
echo [3/3] 设置完成！
echo.
echo 可用命令:
echo   npm run dev      - 启动开发服务器
echo   npm run build    - 构建生产版本
echo   npm run build:win - 打包 Windows 应用
echo.
pause
