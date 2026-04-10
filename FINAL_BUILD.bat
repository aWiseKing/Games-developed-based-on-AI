@echo off
chcp 65001 >nul
echo ==========================================
echo   游戏最终打包脚本
echo ==========================================
echo.

REM 设置环境变量禁用代码签名
set WIN_CSC_ENABLE=0
set CSC_IDENTITY_AUTO_DISCOVERY=false

echo [1/3] 清理旧构建...
if exist "dist" rmdir /s /q "dist"
if exist "dist-electron" rmdir /s /q "dist-electron"
if exist "release\win-unpacked" rmdir /s /q "release\win-unpacked"

echo.
echo [2/3] 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo   ✗ 构建失败
    pause
    exit /b 1
)

echo.
echo [3/3] 打包应用（跳过代码签名）...
call npx electron-builder --win dir --config electron-builder-final.yml
if %errorlevel% neq 0 (
    echo   ✗ 打包失败
    pause
    exit /b 1
)

echo.
echo ==========================================
if exist "release\win-unpacked\关于负债不得不在地下城打工这件事.exe" (
    echo   ✅ 打包成功！
    echo.
    echo   运行游戏:
    echo     release\win-unpacked\关于负债不得不在地下城打工这件事.exe
    echo.
    echo   或者直接双击运行游戏: RUN.bat
) else (
    echo   ✗ 打包失败
)
echo ==========================================
pause
