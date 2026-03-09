

import puppeteer, { Browser, Page } from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { make_directories, get_default_temp_profile, find_default_profile_directory, critical_error_log, print_lg } from './helpers';
import { 
  run_in_background, 
  stealth_mode, 
  disable_extensions, 
  safe_mode, 
  file_name, 
  failed_file_name, 
  logs_folder_path, 
  generated_resume_path 
} from '../config/settings';
import { default_resume_path } from '../config/questions';

let browser: Browser | null = null;
let page: Page | null = null;

export function getBrowser(): Browser {
  if (!browser) {
    throw new Error("Browser not initialized. Call createChromeSession() first.");
  }
  return browser;
}

export function getPage(): Page {
  if (!page) {
    throw new Error("Page not initialized. Call createChromeSession() first.");
  }
  return page;
}

export async function createChromeSession(isRetry: boolean = false): Promise<void> {
  make_directories([file_name, failed_file_name, path.join(logs_folder_path, "screenshots"), default_resume_path, path.join(generated_resume_path, "temp")]);
  
  print_lg("IF YOU HAVE MORE THAN 10 TABS OPENED, PLEASE CLOSE OR BOOKMARK THEM! Or it's highly likely that application will just open browser and not do anything!");
  
  const profile_dir = find_default_profile_directory();
  let userDataDir: string | undefined;
  
  if (isRetry) {
    print_lg("Will login with a guest profile, browsing history will not be saved in the browser!");
    userDataDir = get_default_temp_profile();
  } else if (profile_dir && !safe_mode) {
    userDataDir = profile_dir;
  } else {
    print_lg("Logging in with a guest profile, Web history will not be saved!");
    userDataDir = get_default_temp_profile();
  }
  
  const launchOptions: any = {
    headless: run_in_background,
    defaultViewport: null,
    args: [
      '--start-maximized',
      ...(disable_extensions ? ['--disable-extensions'] : []),

      ...(safe_mode ? ['--no-sandbox', '--disable-setuid-sandbox'] : [])
    ]
  };
  
  if (userDataDir) {
    launchOptions.userDataDir = userDataDir;
  }
  
  try {
    if (stealth_mode) {
      print_lg("Downloading Chrome Driver... This may take some time. Undetected mode requires download every run!");
      puppeteerExtra.use(StealthPlugin());
      browser = await puppeteerExtra.launch(launchOptions);
    } else {
      browser = await puppeteer.launch(launchOptions);
    }
    
    const pages = await browser.pages();
    page = pages[0] || await browser.newPage();
    
    // Set viewport to full screen
    await page.setViewport({ width: 1920, height: 1080 });
    
    print_lg("Chrome session created successfully!");
  } catch (e: any) {
    if (e.message && e.message.includes('SessionNotCreatedException')) {
      critical_error_log("Failed to create Chrome Session, retrying with guest profile", e);
      await createChromeSession(true);
    } else {
      const msg = 'Seems like Google Chrome is out dated. Update browser and try again! \n\n\nIf issue persists, try Safe Mode. Set, safe_mode = True in config.ts.\nReach out in the project support channel if the issue continues.';
      if (e.message && e.message.includes('TimeoutError')) {
        print_lg("Couldn't download Chrome-driver. Set stealth_mode = False in config!");
      } else {
        print_lg(msg);
      }
      critical_error_log("In Opening Chrome", e);
      console.error(msg);
      if (browser) {
        await browser.close();
      }
      process.exit(1);
    }
  }
}

import * as path from 'path';
