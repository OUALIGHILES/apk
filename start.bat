@echo off
echo ========================================
echo   KAFEK WEB APPLICATION - STARTUP
echo ========================================
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo npm version:
npm --version
echo.

echo Installing dependencies (this may take a few minutes)...
echo.
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo Try running: npm cache clean --force
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Dependencies installed successfully!
echo ========================================
echo.
echo Starting development server...
echo.
echo Open your browser to: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev

pause
