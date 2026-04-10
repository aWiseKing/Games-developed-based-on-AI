@echo off
chcp 65001 >nul
echo ==========================================
echo   游戏构建脚本
echo ==========================================
echo.

REM 检查是否管理员权限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] 需要管理员权限来创建符号链接
    echo 正在尝试以管理员身份重新运行...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo [1/3] 清理旧构建...
if exist "dist" rmdir /s /q "dist"
if exist "dist-electron" rmdir /s /q "dist-electron"
if exist "release" rmdir /s /q "release"

echo.
echo [2/3] 构建项目...
call npm run build

echo.
echo [3/3] 打包应用...
call npx electron-builder --win dir

echo.
echo ==========================================
if exist "release\win-unpacked" (
    echo   ✓ 构建成功！
    echo   可执行文件位置: release\win-unpacked\
    echo   运行游戏: release\win-unpacked\关于负债不得不在地下城打工这件事.exe
) else (
    echo   ✗ 构建失败，请检查错误信息
)
echo ==========================================
pause
