@echo off
REM Author:     Shashank
REM
REM Copyright (C) 2024 Shashank
REM
REM License:    GNU Affero General Public License
REM             https://www.gnu.org/licenses/agpl-3.0.en.html
REM             
REM

echo ==========================================
echo LinkedIn Auto Job Applier - Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not accessible!
    echo.
    echo Please install Node.js (v18 or higher) and make sure it is added to your system's PATH.
    echo Visit: https://nodejs.org/
    echo.
    echo After installing Node.js, close and reopen this terminal, then run this script again.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js is installed: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed!
    echo npm should come with Node.js. Please reinstall Node.js.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm is installed: %NPM_VERSION%

REM Check if Google Chrome is installed
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo [OK] Google Chrome is installed
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo [OK] Google Chrome is installed
) else (
    echo [WARNING] Google Chrome not found in default locations.
    echo Please install Google Chrome to continue...
    echo Visit: https://www.google.com/chrome/
    echo.
    echo Note: Puppeteer will download Chromium automatically if Chrome is not found,
    echo       but it's recommended to have Chrome installed for better compatibility.
    pause
)

echo.
echo ==========================================
echo Installing Node.js dependencies...
echo ==========================================
echo.

REM Navigate to project directory
cd /d "%~dp0\.."

REM Install npm packages
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies.
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo [OK] Dependencies installed successfully!

echo.
echo ==========================================
echo Building TypeScript...
echo ==========================================
echo.

call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [WARNING] TypeScript compilation had errors. Check the output above.
    echo You can still try running the project, but some features may not work.
    pause
) else (
    echo.
    echo [OK] TypeScript compiled successfully!
)

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Create a .env file in the project root with your configuration
echo 2. See QUICK_START.md or CONVERSION_GUIDE.md for details
echo 3. Run the bot with: npm start
echo 4. Or run in development mode: npm run dev
echo.
pause
