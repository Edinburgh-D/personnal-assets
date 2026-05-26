@echo off
chcp 65001 >nul
echo ====================================
echo 提示词优化助手 - 启动脚本
echo ====================================
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Python，请先安装Python 3.7+
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/3] 检测Python环境...
python --version

echo.
echo [2/3] 安装依赖包...
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

echo.
echo [3/3] 启动代理服务器...
echo.
echo ====================================
echo 服务启动后，请在浏览器中打开:
echo http://localhost:5000
echo 或直接打开 index.html 文件
echo ====================================
echo.
python server.py

pause