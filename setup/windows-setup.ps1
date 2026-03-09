# Author:     Shashank
#
# Copyright (C) 2024 Shashank
#
# License:    GNU Affero General Public License
#             https://www.gnu.org/licenses/agpl-3.0.en.html
#             
#

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "LinkedIn Auto Job Applier - Setup Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "[OK] Node.js is installed: $nodeVersion" -ForegroundColor Green
    
    # Check if version is 18 or higher
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 18) {
        Write-Host "[ERROR] Node.js version is too old. Please install Node.js v18 or higher." -ForegroundColor Red
        Write-Host "Current version: $nodeVersion" -ForegroundColor Yellow
        Write-Host "Visit: https://nodejs.org/" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
} catch {
    Write-Host "[ERROR] Node.js is not installed or not accessible!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js (v18 or higher) and make sure it is added to your system's PATH."
    Write-Host "Visit: https://nodejs.org/"
    Write-Host ""
    Write-Host "After installing Node.js, close and reopen PowerShell, then run this script again."
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm -v
    Write-Host "[OK] npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm is not installed!" -ForegroundColor Red
    Write-Host "npm should come with Node.js. Please reinstall Node.js."
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Google Chrome is installed
$chromePaths = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

$chromeFound = $false
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        Write-Host "[OK] Google Chrome is installed: $path" -ForegroundColor Green
        $chromeFound = $true
        break
    }
}

if (-not $chromeFound) {
    Write-Host "[WARNING] Google Chrome not found in default locations." -ForegroundColor Yellow
    Write-Host "Please install Google Chrome to continue..."
    Write-Host "Visit: https://www.google.com/chrome/"
    Write-Host ""
    Write-Host "Note: Puppeteer will download Chromium automatically if Chrome is not found,"
    Write-Host "      but it's recommended to have Chrome installed for better compatibility."
    Read-Host "Press Enter to continue anyway"
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Installing Node.js dependencies..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Split-Path -Parent $scriptDir
Set-Location $projectDir

# Install npm packages
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Host ""
    Write-Host "[OK] Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "[ERROR] Failed to install dependencies." -ForegroundColor Red
    Write-Host "Please check your internet connection and try again."
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Building TypeScript..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "TypeScript compilation failed"
    }
    Write-Host ""
    Write-Host "[OK] TypeScript compiled successfully!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "[WARNING] TypeScript compilation had errors. Check the output above." -ForegroundColor Yellow
    Write-Host "You can still try running the project, but some features may not work."
    Read-Host "Press Enter to continue"
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Create a .env file in the project root with your configuration"
Write-Host "2. See QUICK_START.md or CONVERSION_GUIDE.md for details"
Write-Host "3. Run the bot with: npm start"
Write-Host "4. Or run in development mode: npm run dev"
Write-Host ""
Read-Host "Press Enter to exit"
