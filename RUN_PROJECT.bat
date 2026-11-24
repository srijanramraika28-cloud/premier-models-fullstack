@echo off
title Premier Model Management - Full Stack Server
color 0f
echo ========================================================
echo   PREMIER MODEL MANAGEMENT - FULL STACK SERVER
echo ========================================================
echo.
cd /d "%~dp0"
echo Checking dependencies...
if not exist "node_modules\" (
    echo Installing packages...
    npm install
)

echo Starting Server on http://localhost:5000 ...
echo Press Ctrl + C to stop the server anytime.
echo.

:: Automatically open browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5000"

npm start
pause
