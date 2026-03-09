# Quick Start Guide - Node.js Version

## Installation

1. **Install Node.js** (v18 or higher required)
   ```bash
   node --version
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the project root:
   ```env
   # Copy from CONVERSION_GUIDE.md and fill in your values
   FIRST_NAME="YourName"
   LAST_NAME="YourLastName"
   PHONE_NUMBER="1234567890"
   # ... (see CONVERSION_GUIDE.md for full list)
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run the bot**
   ```bash
   npm start
   ```

## What's Been Converted

✅ All config files (personals, questions, search, secrets, settings)  
✅ Core modules (helpers, open_chrome, clickers_and_finders)  
✅ Express web server (app.ts)  
✅ Project structure (package.json, tsconfig.json)

## What Still Needs Work

⚠️ Main bot logic (`runAiBot.ts`) - needs full conversion  
⚠️ AI modules (OpenAI, DeepSeek, Gemini connections)  
⚠️ Validator module  
⚠️ Resume modules

## Next Steps

1. Run `npm install` to install all dependencies
2. Create your `.env` file with your configuration
3. The linting errors will disappear after `npm install`
4. Continue converting `runAiBot.ts` and other remaining modules

See `CONVERSION_GUIDE.md` for detailed information.
