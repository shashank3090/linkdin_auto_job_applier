#!/bin/bash
# Author:     Shashank
#
# Copyright (C) 2024 Shashank
#
# License:    GNU Affero General Public License
#             https://www.gnu.org/licenses/agpl-3.0.en.html
#             
#

echo "=========================================="
echo "LinkedIn Auto Job Applier - Setup Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not accessible!"
    echo ""
    echo "Please install Node.js (v18 or higher) and make sure it is added to your system's PATH environment variable."
    echo "Visit: https://nodejs.org/"
    echo ""
    echo "For Linux, you can also install via package manager:"
    echo "  Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  Fedora: sudo dnf install nodejs npm"
    echo "  Arch: sudo pacman -S nodejs npm"
    echo ""
    echo "After installing Node.js, close and reopen this terminal, then run this script again."
    read -p "Press Enter to exit..."
    exit 1
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo "⚠️  Node.js version is too old. Please install Node.js v18 or higher."
        echo "Current version: $(node -v)"
        echo "Visit: https://nodejs.org/"
        read -p "Press Enter to exit..."
        exit 1
    else
        echo "✅ Node.js is installed: $(node -v)"
    fi
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo "npm should come with Node.js. Please reinstall Node.js."
    read -p "Press Enter to exit..."
    exit 1
else
    echo "✅ npm is installed: $(npm -v)"
fi

# Check if Google Chrome is installed
CHROME_PATHS=(
    "/usr/bin/google-chrome"
    "/usr/bin/chromium-browser"
    "/usr/bin/chromium"
    "/snap/bin/chromium"
    "$HOME/.local/bin/google-chrome"
)

CHROME_FOUND=false
for path in "${CHROME_PATHS[@]}"; do
    if command -v "$path" &> /dev/null || [ -f "$path" ]; then
        echo "✅ Google Chrome/Chromium is installed: $path"
        CHROME_FOUND=true
        break
    fi
done

if [ "$CHROME_FOUND" = false ]; then
    echo "⚠️  Google Chrome/Chromium not found in common locations."
    echo "Please install Google Chrome to continue..."
    echo "Visit: https://www.google.com/chrome/"
    echo ""
    echo "For Linux, you can also install via package manager:"
    echo "  Ubuntu/Debian: sudo apt install google-chrome-stable"
    echo "  Fedora: sudo dnf install google-chrome-stable"
    echo ""
    echo "Note: Puppeteer will download Chromium automatically if Chrome is not found,"
    echo "      but it's recommended to have Chrome installed for better compatibility."
    read -p "Press Enter to continue anyway..."
fi

echo ""
echo "=========================================="
echo "Installing Node.js dependencies..."
echo "=========================================="
echo ""

# Navigate to project directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR" || exit 1

# Install npm packages
if npm install; then
    echo ""
    echo "✅ Dependencies installed successfully!"
else
    echo ""
    echo "❌ Failed to install dependencies."
    echo "Please check your internet connection and try again."
    read -p "Press Enter to exit..."
    exit 1
fi

echo ""
echo "=========================================="
echo "Building TypeScript..."
echo "=========================================="
echo ""

if npm run build; then
    echo ""
    echo "✅ TypeScript compiled successfully!"
else
    echo ""
    echo "⚠️  TypeScript compilation had errors. Check the output above."
    echo "You can still try running the project, but some features may not work."
    read -p "Press Enter to continue..."
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Create a .env file in the project root with your configuration"
echo "2. See QUICK_START.md or CONVERSION_GUIDE.md for details"
echo "3. Run the bot with: npm start"
echo "4. Or run in development mode: npm run dev"
echo ""
read -p "Press Enter to exit..."
