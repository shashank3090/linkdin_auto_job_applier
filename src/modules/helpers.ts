
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { subDays, subHours, subMinutes, subSeconds, subWeeks, subMonths, subYears } from 'date-fns';
import { logs_folder_path } from '../config/settings';

// Directories related
export function make_directories(paths: string[]): void {
  /**
   * Function to create missing directories
   */
  for (let dirPath of paths) {
    dirPath = dirPath.replace(/^~/, os.homedir()); // Expands ~ to user's home directory
    dirPath = dirPath.replace(/\/\//g, "/");
    
    // If path looks like a file path, get the directory part
    if (path.basename(dirPath).includes('.')) {
      dirPath = path.dirname(dirPath);
    }

    if (!dirPath) { // Handle cases where path is empty after dirname
      continue;
    }

    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // recursive: true avoids race condition
      }
    } catch (e: any) {
      console.log(`Error while creating directory "${dirPath}": `, e);
    }
  }
}

export function get_default_temp_profile(): string {
  // Thanks to a community contributor for suggestion!
  const home = os.homedir();
  if (process.platform.startsWith('win')) {
    return path.join("C:", "temp", "auto-job-apply-profile");
  } else if (process.platform.startsWith('linux')) {
    return path.join(home, ".auto-job-apply-profile");
  }
  return path.join(home, "Library", "Application Support", "Google", "Chrome", "auto-job-apply-profile");
}

export function find_default_profile_directory(): string | null {
  /**
   * Dynamically finds the default Google Chrome 'User Data' directory path
   * across Windows, macOS, and Linux, regardless of OS version.
   * 
   * Returns the absolute path as a string, or null if the path is not found.
   */
  
  const home = os.homedir();
  let paths: string[] = [];
  
  // Windows
  if (process.platform.startsWith('win')) {
    paths = [
      path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "User Data"),
      path.join(process.env.USERPROFILE || "", "AppData", "Local", "Google", "Chrome", "User Data"),
      path.join(process.env.USERPROFILE || "", "Local Settings", "Application Data", "Google", "Chrome", "User Data")
    ];
  }
  // Linux
  else if (process.platform.startsWith('linux')) {
    paths = [
      path.join(home, ".config", "google-chrome"),
      path.join(home, ".var", "app", "com.google.Chrome", "data", ".config", "google-chrome"),
    ];
  }
  // MacOS - For some reason, opening with profile in MacOS is not creating a session for undetected-chromedriver!
  // else if (process.platform === 'darwin') {
  //   paths = [
  //     path.join(home, "Library", "Application Support", "Google", "Chrome")
  //   ];
  // }
  else {
    return null;
  }

  // Check each potential path and return the first one that exists
  for (const pathStr of paths) {
    if (fs.existsSync(pathStr)) {
      return pathStr;
    }
  }
    
  return null;
}

// Logging related
export function critical_error_log(possible_reason: string, stack_trace: Error): void {
  /**
   * Function to log and print critical errors along with datetime stamp
   */
  print_lg(possible_reason, true);
  print_lg(stack_trace, true);
  print_lg(new Date(), true);
}

function get_log_path(): string {
  /**
   * Function to replace '//' with '/' for logs path
   */
  try {
    const logPath = path.join(logs_folder_path, "log.txt");
    return logPath.replace(/\/\//g, "/");
  } catch (e: any) {
    critical_error_log("Failed getting log path! So assigning default logs path: './logs/log.txt'", e);
    return "logs/log.txt";
  }
}

const __logs_file_path = get_log_path();

export function print_lg(...msgs: (string | object | Error | Date)[]): void;
export function print_lg(msg: string | object | Error | Date, from_critical?: boolean): void;
export function print_lg(...args: any[]): void {
  /**
   * Function to log and print.
   */
  const from_critical = args[args.length - 1] === true;
  const messages = from_critical ? args.slice(0, -1) : args;
  
  try {
    for (const message of messages) {
      console.log(message);
      const logEntry = String(message) + "\n";
      fs.appendFileSync(__logs_file_path, logEntry, { encoding: "utf-8" });
    }
  } catch (e: any) {
    const message = args[0];
    const trail = from_critical 
      ? `Skipped saving this message: "${message}" to log.txt!` 
      : "We'll try one more time to log...";
    console.error(`log.txt in ${logs_folder_path} is open or is occupied by another program! Please close it! ${trail}`);
    if (!from_critical) {
      critical_error_log("Log.txt is open or is occupied by another program!", e);
    }
  }
}

export function buffer(speed: number = 0): Promise<void> {
  /**
   * Function to wait within a period of selected random range.
   * * Will not wait if input `speed <= 0`
   * * Will wait within a random range of 
   *   - `0.6 to 1.0 secs` if `1 <= speed < 2`
   *   - `1.0 to 1.8 secs` if `2 <= speed < 3`
   *   - `1.8 to speed secs` if `3 <= speed`
   */
  return new Promise((resolve) => {
    if (speed <= 0) {
      resolve();
      return;
    }
    
    let waitTime: number;
    if (speed >= 1 && speed < 2) {
      waitTime = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
    } else if (speed >= 2 && speed < 3) {
      waitTime = Math.random() * 0.8 + 1.0; // 1.0 to 1.8
    } else {
      waitTime = Math.random() * (speed - 1.8) + 1.8; // 1.8 to speed
    }
    
    setTimeout(resolve, waitTime * 1000);
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function manual_login_retry(is_logged_in: () => boolean, limit: number = 2): Promise<void> {
  /**
   * Function to ask and validate manual login
   */
  return new Promise((resolve) => {
    let count = 0;
    const checkLogin = () => {
      if (is_logged_in()) {
        resolve();
        return;
      }
      
      print_lg("Seems like you're not logged in!");
      let button = "Confirm Login";
      let message = `After you successfully Log In, please click "${button}" button below.`;
      if (count > limit) {
        button = "Skip Confirmation";
        message = `If you're seeing this message even after you logged in, Click "${button}". Seems like auto login confirmation failed!`;
      }
      count++;
      
      // In Node.js, we'll use a simple prompt or console log
      // For GUI alerts, you'd need a library like node-notifier or electron
      console.log(message);
      console.log(`Press Enter after logging in...`);
      
      // For now, we'll just resolve after a delay
      // In a real implementation, you'd want user interaction
      setTimeout(() => {
        if (count > limit) {
          resolve();
        } else {
          checkLogin();
        }
      }, 5000);
    };
    checkLogin();
  });
}

export function calculate_date_posted(time_string: string): Date | null {
  /**
   * Function to calculate date posted from string.
   * Returns Date object | null if unable to calculate
   * Valid time string examples:
   * * 10 seconds ago
   * * 15 minutes ago
   * * 2 hours ago
   * * 1 hour ago
   * * 1 day ago
   * * 10 days ago
   * * 1 week ago
   * * 1 month ago
   * * 1 year ago
   */
  time_string = time_string.trim();
  const now = new Date();

  const match = time_string.match(/(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i);

  if (match) {
    try {
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();

      if (unit.includes('second')) {
        return subSeconds(now, value);
      } else if (unit.includes('minute')) {
        return subMinutes(now, value);
      } else if (unit.includes('hour')) {
        return subHours(now, value);
      } else if (unit.includes('day')) {
        return subDays(now, value);
      } else if (unit.includes('week')) {
        return subWeeks(now, value);
      } else if (unit.includes('month')) {
        return subMonths(now, value);  // Approximation
      } else if (unit.includes('year')) {
        return subYears(now, value);  // Approximation
      }
    } catch (e) {
      // Fallback for cases where parsing fails
    }
  }
  
  // If regex doesn't match, or parsing fails, return null.
  // This will skip jobs where the date can't be determined, preventing crashes.
  return null;
}

export function convert_to_lakhs(value: string): string {
  /**
   * Converts str value to lakhs, no validations are done except for length and stripping.
   * Examples:
   * * "100000" -> "1.00"
   * * "101,000" -> "10.1," Notice ',' is not removed 
   * * "50" -> "0.00"
   * * "5000" -> "0.05" 
   */
  value = value.trim();
  const l = value.length;
  if (l > 0) {
    if (l > 5) {
      value = value.substring(0, l - 5) + "." + value.substring(l - 5, l - 3);
    } else {
      value = "0." + "0".repeat(5 - l) + value.substring(0, 2);
    }
  }
  return value;
}

export function convert_to_json(data: string): any {
  /**
   * Function to convert data to JSON, if unsuccessful, returns `{"error": "Unable to parse the response as JSON", "data": data}`
   */
  try {
    return JSON.parse(data);
  } catch (e) {
    return { "error": "Unable to parse the response as JSON", "data": data };
  }
}

export function truncate_for_csv(data: any, max_length: number = 131000, suffix: string = "...[TRUNCATED]"): string {
  /**
   * Function to truncate data for CSV writing to avoid field size limit errors.
   * * Takes in `data` of any type and converts to string
   * * Takes in `max_length` of type `number` - maximum allowed length (default: 131000, leaving room for suffix)
   * * Takes in `suffix` of type `string` - text to append when truncated
   * * Returns truncated string if data exceeds max_length
   */
  try {
    // Convert data to string
    const str_data = data !== null && data !== undefined ? String(data) : "";
    
    // If within limit, return as-is
    if (str_data.length <= max_length) {
      return str_data;
    }
    
    // Truncate and add suffix
    const truncated = str_data.substring(0, max_length - suffix.length) + suffix;
    return truncated;
  } catch (e: any) {
    return `[ERROR CONVERTING DATA: ${e}]`;
  }
}
