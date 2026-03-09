# LinkedIn AI Auto Job Applier 🤖

An automated LinkedIn job application bot built with TypeScript and Node.js. It searches for relevant jobs, answers all application form questions, uploads your resume, and applies — capable of submitting 100+ applications in under an hour.

## ✨ Features

- **Automated Easy Apply** — Handles LinkedIn's Easy Apply flow end-to-end
- **External Job Links** — Collects application links for non-Easy Apply jobs
- **AI-Powered Answers** — Supports OpenAI, DeepSeek, and Google Gemini to answer application questions intelligently
- **Smart Filtering** — Skip jobs based on bad words, experience level, security clearance, and blacklisted companies
- **Resume Upload** — Automatically uploads your default resume
- **Application Tracking** — Logs all applied jobs to CSV with full details
- **Web Dashboard** — Express-based UI to view your application history
- **Stealth Mode** — Uses puppeteer-extra-plugin-stealth to avoid bot detection
- **Configurable Search** — Filter by location, experience, job type, salary, remote/on-site, and more

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Google Chrome](https://www.google.com/chrome) browser
- npm (comes with Node.js)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create `.env` File

Create a `.env` file in the project root with your configuration:

```env
# LinkedIn Credentials (optional — can login manually)
LINKEDIN_USERNAME="your_email@example.com"
LINKEDIN_PASSWORD="your_password"

# Personal Info
FIRST_NAME="Your"
MIDDLE_NAME=""
LAST_NAME="Name"
PHONE_NUMBER="1234567890"
CURRENT_CITY="Your City"
STREET="123 Main Street"
STATE="Your State"
ZIPCODE="12345"

# Search Preferences
SEARCH_TERMS=["Software Engineer", "Backend Developer"]
SEARCH_LOCATION="Indiu"

# Resume
DEFAULT_RESUME_PATH="all resumes/default/resume.pdf"

# AI Settings (optional)
USE_AI=false
AI_PROVIDER="openai"
LLM_API_URL="https://api.openai.com/v1/"
LLM_API_KEY="your-api-key"
LLM_MODEL="gpt-4o"
```

### 3. Add Your Resume

Place your resume at the path specified in `DEFAULT_RESUME_PATH`:

```bash
mkdir -p "all resumes/default"
cp /path/to/your/resume.pdf "all resumes/default/resume.pdf"
```

### 4. Build & Run

```bash
# Build TypeScript
npm run build

# Run the bot
npm start
```

Or run directly in development mode:

```bash
npm run dev
```

## 📦 Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the bot (production) |
| `npm run dev` | Run the bot (development) |
| `npm run app` | Run web dashboard (production) |
| `npm run app:dev` | Run web dashboard (development) |
| `npm run watch` | Auto-compile on file changes |

## 🌐 Web Dashboard

View your application history through the built-in web UI:

```bash
npm run app
```

Then open `http://localhost:5000` in your browser.

## 🔧 Configuration

All settings are managed through the `.env` file and config modules in `src/config/`:

| Config File | Purpose |
|-------------|---------|
| `personals.ts` | Name, phone, address, location |
| `questions.ts` | Application answers, resume path, salary, experience |
| `search.ts` | Search terms, filters, job preferences |
| `secrets.ts` | LinkedIn credentials, AI provider settings |
| `settings.ts` | Bot behavior, click gaps, stealth mode |

### AI Providers

The bot supports three AI providers for answering application questions:

- **OpenAI** — GPT models or any OpenAI-compatible API (Ollama, LM Studio, etc.)
- **DeepSeek** — DeepSeek models
- **Google Gemini** — Gemini models

Set `USE_AI=true` in your `.env` and configure the provider details.

### Job Filters

Configure these in your `.env` or directly in `src/config/search.ts`:

- **Experience Level** — Internship, Entry level, Associate, Mid-Senior, Director, Executive
- **Job Type** — Full-time, Part-time, Contract, Temporary, Internship
- **Work Style** — On-site, Remote, Hybrid
- **Salary Range** — $40,000+ to $200,000+
- **Bad Words** — Skip jobs containing specific words in description
- **Company Blacklist** — Skip specific companies

## 🏗️ Project Structure

```
├── src/
│   ├── app.ts                    # Express web server
│   ├── runAiBot.ts               # Main bot entry point
│   ├── config/
│   │   ├── personals.ts          # Personal information
│   │   ├── questions.ts          # Application answers
│   │   ├── search.ts             # Search preferences
│   │   ├── secrets.ts            # Credentials & AI settings
│   │   └── settings.ts           # Bot settings
│   └── modules/
│       ├── ai/
│       │   ├── openaiConnections.ts
│       │   ├── deepseekConnections.ts
│       │   ├── geminiConnections.ts
│       │   └── prompts.ts
│       ├── clickers_and_finders.ts
│       ├── helpers.ts
│       ├── open_chrome.ts
│       ├── validator.ts
│       └── resumes/
│           ├── extractor.ts
│           └── generator.ts
├── templates/
│   └── index.html                # Web dashboard UI
├── setup/
│   ├── setup.sh
│   ├── windows-setup.bat
│   └── windows-setup.ps1
├── package.json
└── tsconfig.json
```

## 🛠️ Tech Stack

- **Runtime** — Node.js with TypeScript
- **Browser Automation** — Puppeteer + puppeteer-extra-plugin-stealth
- **Web Server** — Express.js
- **AI Integration** — OpenAI SDK, Google Generative AI SDK
- **Data** — CSV read/write for application tracking

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot find module` | Run `npm install` |
| Chrome not found | Install Google Chrome; Puppeteer will fallback to Chromium |
| TypeScript errors | Run `npm run build` to see details |
| Login fails | Check `.env` credentials or login manually |
| Resume not found | Verify `DEFAULT_RESUME_PATH` points to an existing file |

## 📜 Disclaimer

**This program is for educational purposes only. By using this program, you acknowledge and agree to comply with LinkedIn's terms of service and policies. Usage is at your own risk. The creator bears no responsibility or liability for any misuse, damages, or legal consequences resulting from its usage.**

## ⚖️ License

Copyright (C) 2026 Shashank

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

## 👤 Author

- **Shashank** — shashankdewangan1100@gmail.com
