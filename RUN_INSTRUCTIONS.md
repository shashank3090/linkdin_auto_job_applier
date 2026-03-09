# How to Run the LinkedIn Auto Job Applier

## Prerequisites

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should show v18.x.x or higher
   ```

2. **Google Chrome** installed on your system

3. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd /home/shashank/Desktop/projects/Auto_job_applier_linkedIn
npm install
```

This will install all required packages including:
- Puppeteer (for browser automation)
- Express (for web UI)
- TypeScript and related tools
- AI libraries (OpenAI, Gemini, etc.)

### 2. Create Your `.env` File

Copy the example file and fill in your details:

```bash
cp .env.example .env
```

Then edit `.env` with your information:
- **Personal Info**: Your name, phone, address
- **LinkedIn Credentials**: Your username and password
- **Search Preferences**: Job titles, location, filters
- **AI Settings** (optional): If you want to use AI features

**Important**: Make sure to:
- Set `LINKEDIN_USERNAME` and `LINKEDIN_PASSWORD` if you want auto-login
- Configure `SEARCH_TERMS` as a JSON array: `["Software Engineer", "Developer"]`
- Set `DEFAULT_RESUME_PATH` to point to your resume file

### 3. Build the TypeScript Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 4. Run the Bot

**Option A: Production Mode** (uses compiled JavaScript)
```bash
npm start
```

**Option B: Development Mode** (runs TypeScript directly, no build needed)
```bash
npm run dev
```

The bot will:
1. Open a Chrome browser window
2. Log in to LinkedIn (or ask you to log in manually)
3. Start searching and applying to jobs based on your configuration

### 5. (Optional) Run the Web UI

In a **separate terminal**, run the web server to view applied jobs history:

```bash
# Production mode
npm run app

# Or development mode
npm run app:dev
```

Then open your browser to: `http://localhost:5000`

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the bot (production) |
| `npm run dev` | Run the bot (development, no build needed) |
| `npm run app` | Run web UI server (production) |
| `npm run app:dev` | Run web UI server (development) |
| `npm run watch` | Watch for TypeScript changes and auto-compile |

## Troubleshooting

### Error: "Cannot find module"
- Run `npm install` again
- Make sure you're in the project root directory

### Error: "Chrome not found"
- Install Google Chrome browser
- Puppeteer will download Chromium automatically if Chrome isn't found

### Error: "TypeScript compilation errors"
- Check that all files in `src/` are valid TypeScript
- Run `npm run build` to see detailed error messages

### Bot not logging in
- Check your `.env` file has correct `LINKEDIN_USERNAME` and `LINKEDIN_PASSWORD`
- Or leave them empty and log in manually when the browser opens

### Resume not found
- Make sure `DEFAULT_RESUME_PATH` in `.env` points to an existing file
- Create the directory structure if needed: `all resumes/default/`

## Configuration Files

All configuration is done via `.env` file. The main settings are:

- **Personal Info**: `src/config/personals.ts` (reads from `.env`)
- **Questions**: `src/config/questions.ts` (reads from `.env`)
- **Search**: `src/config/search.ts` (reads from `.env`)
- **Secrets**: `src/config/secrets.ts` (reads from `.env`)
- **Settings**: `src/config/settings.ts` (reads from `.env`)

## Important Notes

1. **First Run**: The bot may take a few minutes to download Chromium (if Chrome isn't found)
2. **Manual Login**: If auto-login fails, you can log in manually in the browser window
3. **Pause Dialogs**: The bot may pause to ask for confirmation - follow the on-screen prompts
4. **Rate Limits**: LinkedIn has daily application limits - the bot will stop when reached
5. **Resume**: Make sure your resume file exists at the path specified in `.env`

## Stopping the Bot

Press `Ctrl+C` in the terminal to stop the bot. The browser will close automatically.
